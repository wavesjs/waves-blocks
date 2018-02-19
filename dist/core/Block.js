'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

var _parameters = require('@ircam/parameters');

var _parameters2 = _interopRequireDefault(_parameters);

var _AbstractPlayer = require('./AbstractPlayer');

var _AbstractPlayer2 = _interopRequireDefault(_AbstractPlayer);

var _History = require('../utils/History');

var _History2 = _interopRequireDefault(_History);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function decibelToLinear(val) {
  return Math.exp(0.11512925464970229 * val); // pow(10, val / 20)
};

var EVENTS = {
  // @arguments
  // position
  START: 'start',
  // @arguments
  // position
  PAUSE: 'pause',
  // @arguments
  // position
  STOP: 'stop',
  // @arguments
  // targetPosition
  SEEK: 'seek',
  // @arguments
  // endTime
  ENDED: 'ended',
  // @arguments
  // currentPosition
  CURRENT_POSITION: 'position',

  UPDATE: 'update'
};

var UI = function () {
  function UI($container, sizing, width, height) {
    (0, _classCallCheck3.default)(this, UI);

    $container = $container instanceof Element ? $container : document.querySelector($container);

    switch (sizing) {
      case 'auto':
        var boundingClientRect = $container.getBoundingClientRect();
        width = boundingClientRect.width;
        height = boundingClientRect.height;
        break;

      case 'manual':
        $container.style.width = width + 'px';
        $container.style.height = height + 'px';
        break;
    }

    this.$container = $container;
    this._width = width;
    this._height = height;

    // arbitrary `pixelsPerSecond` value to update when a track is set
    this.timeline = new ui.core.Timeline(1, width);
    this.track = new ui.core.Track($container, height);

    this.timeline.add(this.track, 'default');
    this.track.updateContainer(); // init track DOM tree

    // time context that should be shared by all (most) mixins / ui layers
    this.timeContext = new ui.core.LayerTimeContext(this.timeline.timeContext);
  }

  (0, _createClass3.default)(UI, [{
    key: 'height',
    set: function set(value) {
      this._height = value;
      this.$container.style.height = value + 'px';

      this.timeline.tracks.forEach(function (track) {
        track.height = value;
        track.render();
        track.update();
      });
    },
    get: function get() {
      return this._height;
    }
  }, {
    key: 'width',
    set: function set(value) {
      this._width = value;
      this.$container.style.width = value + 'px';

      this.timeline.maintainVisibleDuration = true;
      this.timeline.visibleWidth = value;

      this.timeline.tracks.forEach(function (track) {
        track.render();
        track.update();
      });
    },
    get: function get() {
      return this._width;
    }
  }]);
  return UI;
}();

var definitions = {
  container: {
    type: 'any',
    default: null,
    constant: true,
    metas: {
      desc: 'Css Selector or DOM Element hosting the block'
    }
  },
  player: {
    type: 'any',
    default: _AbstractPlayer2.default, // if we only need the ui part, default to dummy player
    nullable: true,
    constant: true, // sure? why not being able to change dynamically?
    metas: {
      desc: 'Constructor of the player to be used in the block'
    }
  },
  sizing: {
    type: 'enum',
    list: ['auto', 'manual'],
    default: 'auto',
    constant: true
  },
  width: {
    type: 'integer',
    min: 0,
    max: +Infinity,
    default: null,
    nullable: true,
    constant: true
  },
  height: {
    type: 'integer',
    min: 0,
    max: +Infinity,
    default: null,
    nullable: true,
    constant: true
  }

  /**
   * Base audio-visual player to be decorated with additionnal modules.
   *
   * @param {Object} options - Override default configuration (no options for now)
   * @param {String|Element} [options.container] - Css Selector or DOM Element that will
   *  host the player and additionnal modules
   * @param {AbstractPlayer} - The player to be used by the block.
   * @param {'auto'|'manual'} [options.sizing='auto'] - How the size of the block
   *  should be defined. If 'auto', the block adjusts to the size of the container.
   *  If 'manual', use `width` and `height` parameters.
   * @param {Number} [options.width=null] - Width of the block if size is 'manual'.
   * @param {Number} [options.height=null] - Height of the block if size is 'manual'.
   *
   * @example
   * ```
   * const $container = document.querySelector('#container');
   * const defaultWidth = 1000;
   * const defaultHeight = 1000;
   * const block = new blocks.core.Block({
   *   player: abc.player.SeekPlayer,
   *   container: $container,
   *   sizing: 'manual', // if 'auto', adjust to fill $container size
   *   width: defaultWidth,
   *   height: defaultHeight,
   * });
   *
   * const waveformModule = new blocks.module.WaveformModule();
   * const cursorModule = new blocks.module.CursorModule();
   *
   * block.add(simpleWaveformModule);
   * block.add(cursorModule);
   * ```
   */
};
var Block = function () {
  function Block(options) {
    (0, _classCallCheck3.default)(this, Block);

    this.params = (0, _parameters2.default)(definitions, options);

    this.EVENTS = EVENTS;

    this.trackData = null;
    this.trackMetadata = null;

    this._listeners = new _map2.default();
    this._modules = [];
    this._isPlaying = false;

    var $container = this.params.get('container');
    var sizing = this.params.get('sizing');
    var width = this.params.get('width');
    var height = this.params.get('height');
    this.ui = new UI($container, sizing, width, height);

    var playerCtor = this.params.get('player');
    this.player = new playerCtor(this);

    this._history = new _History2.default(this, 'trackMetadata', 20);

    this._monitorPosition = this._monitorPosition.bind(this);
    this._onEvent = this._onEvent.bind(this);

    // listen events from the timeline to propagate to modules
    this.ui.timeline.addListener('event', this._onEvent);
  }

  // ---------------------------------------------------------
  // event system
  // ---------------------------------------------------------

  /**
   * Add a listener to a specific channel of the player.
   * Available events are:
   * - `'start'`: triggered when the player starts
   * - `'pause'`: triggered when the player is paused
   * - `'stop'` : triggered when the player is stopped (pause() + seek(0))
   * - `'seek'` : triggered when the player seek to a new position
   * - `'ended'`: triggered when the player stops at the end of the file (or at
   *              the end of the last segment). The callback is executed with the
   *              stop position.
   * - `'position'`: triggered at each request animation frame with the current
   *              position and duration of the audio file. Trigger only when
   *              the player is playing.
   *
   * @param {String} channel - Name of the channel
   * @param {Function} callback - Function to execute
   */


  (0, _createClass3.default)(Block, [{
    key: 'addListener',
    value: function addListener(channel, callback) {
      if (!this._listeners.has(channel)) this._listeners.set(channel, new _set2.default());

      var listeners = this._listeners.get(channel);
      listeners.add(callback);
    }

    /**
     * Remove a listener from a channel.
     *
     * @param {String} channel - Name of the channel
     * @param {Function} callback - Function to remove
     */

  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      if (this._listeners.has(channel)) {
        var listeners = this._listeners.get(channel);
        listeners.delete(callback);
      }
    }

    /**
     * Remove all subscibers from a channel.
     *
     * @param {String} channel - Name of the channel.
     */

  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners(channel) {
      if (this._listeners.has(channel)) {
        var listeners = this._listeners.get(channel);
        listeners.clear();

        this._listeners.delete(channel);
      }
    }

    /**
     * Execute all subscribers of a event with given arguments.
     * @private
     */

  }, {
    key: 'emit',
    value: function emit(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var listeners = this._listeners.get(channel);

      if (listeners !== undefined) listeners.forEach(function (listener) {
        return listener.apply(undefined, args);
      });
    }

    /**
     * Main event listener of the waves-ui timeline.
     * @private
     */

  }, {
    key: '_onEvent',
    value: function _onEvent(e, hitLayers) {
      this._executeCommandBackward('onEvent', e, hitLayers);
    }

    // ---------------------------------------------------------
    // module chain
    // ---------------------------------------------------------

    /**
     * Add a module to the player. A module is defined as a specific set
     * of functionnality and visualizations on top of the player.
     * Module can implement features such as waveform, moving cursor, etc.
     *
     * @param {AbstractModule} module - Module to add
     * @param {Number} zIndex - zIndex of the added module
     */

  }, {
    key: 'add',
    value: function add(module) {
      var zIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var index = this._modules.indexOf(module);

      if (index === -1) {
        module.block = this;
        module.zIndex = zIndex;
        module.install(this);

        if (this.trackMetadata && module.setTrack) module.setTrack(this.trackData, this.trackMetadata);

        this._modules.push(module);
        this.render();
      }
    }

    /**
     * Remove a module from the player.
     *
     * @param {AbstractModule} module - Module to remove
     */

  }, {
    key: 'remove',
    value: function remove(module) {
      var index = this._modules.indexOf(module);

      if (index !== -1) {
        module.uninstall(this);
        module.block = null;
        module.zIndex = null;

        this._modules.splice(index, 1);
        this.render();
      }
    }

    /**
     * Execute a command on each module that implements the method. The command
     * are executed in the order in which modules were added to the player.
     * @private
     */

  }, {
    key: '_executeCommandForward',
    value: function _executeCommandForward(command) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      for (var i = 0, l = this._modules.length; i < l; i++) {
        var module = this._modules[i];

        if (module[command]) {
          var next = module[command].apply(module, args);

          if (next === false) return;
        }
      }
    }

    /**
     * Execute a command on each module that implements the method. The command
     * are executed in the reverse order in which modules were added to the player.
     * @private
     */

  }, {
    key: '_executeCommandBackward',
    value: function _executeCommandBackward(command) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      for (var i = this._modules.length - 1; i >= 0; i--) {
        var module = this._modules[i];

        if (module[command]) {
          var next = module[command].apply(module, args);

          if (next === false) return;
        }
      }
    }

    /**
     * Set or change the track of the player. A track is a JSON object that must
     * follow the convention defined ??
     *
     * @param {Object} data - data buffer (i.e. AudioBuffer)
     * @param {Object} metadata - metadata object
     */

  }, {
    key: 'setTrack',
    value: function setTrack(data, metadata) {
      this._setTrack(data, metadata, true);
    }

    /**
     * Set or change the track of the player. A track is a JSON object that must
     * follow the convention defined ??
     * @private
     *
     * @param {Object} data - data buffer (i.e. AudioBuffer)
     * @param {Object} metadata - metadata object
     * @param {Boolean} resetHistory - reset history
     */

  }, {
    key: '_setTrack',
    value: function _setTrack(data, metadata) {
      var resetHistory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.trackMetadata = metadata;
      this.trackData = data;
      this.player.setBuffer(data); // internally stops the play control

      if (resetHistory) {
        this._history.reset();
        this.snap();
      } else {
        // snap already emits the event...
        this.emit(this.EVENTS.UPDATE, this.trackData, this.trackMetadata);
      }

      this.stop();

      this.ui.timeline.pixelsPerSecond = this.width / this.duration;
      this.ui.timeContext.duration = this.duration;

      this._executeCommandForward('setTrack', data, metadata);

      this.render();
    }

    // ---------------------------------------------------------
    // undo / redo
    // ---------------------------------------------------------

    /**
     * @todo - review all history algorithm
     */

    /**
     * Create a snapshot of the data after modifications. Should be used in
     * modules after each significant operation, in order to allow `undo` and
     * `redo` operations.
     */

  }, {
    key: 'snap',
    value: function snap() {
      this._history.snap();
      this.emit(this.EVENTS.UPDATE, this.trackData, this.trackMetadata);
    }

    /**
     * Go to previous snapshot.
     */

  }, {
    key: 'undo',
    value: function undo() {
      if (this._history.undo()) this._setTrack(this.trackData, this._history.head(), false);
    }

    /**
     * Go to next snapshot.
     */

  }, {
    key: 'redo',
    value: function redo() {
      if (this._history.redo()) this._setTrack(this.trackData, this._history.head(), false);
    }

    /**
     * @todo - define if it's really the proper way to go...
     */

  }, {
    key: 'head',
    value: function head() {
      return this._history.head();
    }

    // ---------------------------------------------------------
    // visual interface
    // ---------------------------------------------------------

    /**
     * Width of the player. Defaults to the width of the given container.
     *
     * @name width
     * @type {Number}
     * @instance
     */

  }, {
    key: 'render',


    /**
     * Does this make sens ?
     * @private
     */
    value: function render() {
      // force rendering from outside the module (i.e. if values have changed)
      this.ui.timeline.tracks.forEach(function (track) {
        track.render();
        track.update();
      });

      this._executeCommandBackward('render');
    }

    // ---------------------------------------------------------
    // audio interface
    // ---------------------------------------------------------

    /**
     * Position of the head in the audio file.
     *
     * @name position
     * @type {Number}
     * @instance
     * @readonly
     */

  }, {
    key: 'volume',


    /**
     * Volume of the audio (in dB).
     *
     * @param {Number} db - volume of the player in decibels
     */
    value: function volume(db) {
      var gain = decibelToLinear(db);
      this.player.gain = gain;
    }

    /**
     * Start the player.
     */

  }, {
    key: 'start',
    value: function start() {
      this._isPlaying = true, this.player.start();

      this._executeCommandForward('start');

      this.emit(EVENTS.START);
      this.emitPosition(this.position);

      this._monitorPositionRafId = requestAnimationFrame(this._monitorPosition);
    }

    /**
     * Stop the player (shortcut for `pause` and `seek` to 0).
     */

  }, {
    key: 'stop',
    value: function stop() {
      this._isPlaying = false, this.player.stop();

      this._executeCommandForward('stop');

      this.emit(EVENTS.STOP);
      this.emitPosition(this.position);
    }

    /**
     * Pause the player.
     */

  }, {
    key: 'pause',
    value: function pause() {
      this._isPlaying = false, this.player.pause();

      this._executeCommandForward('pause');

      this.emit(EVENTS.PAUSE);
      this.emitPosition(this.position);
    }

    /**
     * Seek to a new position in the audio file.
     *
     * @param {Number} position - New position.
     */

  }, {
    key: 'seek',
    value: function seek(position) {
      position = Math.max(0, Math.min(position, this.player.duration));
      this.player.seek(position);

      this._executeCommandForward('seek', position, this._isPlaying);
      // as the position can be modified by the SeekControl
      this.emit(EVENTS.SEEK, this.player.position);
      this.emitPosition(this.player.position);
    }

    /**
     * Emit the current position.
     * Shortcut for `this.emit('position', position, duration)`
     */

  }, {
    key: 'emitPosition',
    value: function emitPosition(position) {
      this.emit(EVENTS.CURRENT_POSITION, position, this.player.duration);
    }

    /**
    * Emit the `ended` event.
    */

  }, {
    key: 'ended',
    value: function ended(position) {
      this.emit(EVENTS.ENDED, position);
      this.stop();
    }

    /**
     * Watch the current position of the player in a request animation frame loop.
     * @private
     */

  }, {
    key: '_monitorPosition',
    value: function _monitorPosition() {
      if (this.player.running) this._monitorPositionRafId = requestAnimationFrame(this._monitorPosition);

      var position = this.player.position;
      var duration = this.player.duration;
      this.emitPosition(position);

      if (position > duration) return this.ended(position); // player stops the playControl

      this.player.monitorPosition();
    }
  }, {
    key: 'width',
    set: function set(value) {
      this.ui.width = value;
      this._executeCommandForward('setWidth', value);
    },
    get: function get() {
      return this.ui.width;
    }

    /**
     * Height of the player. Defaults to the height of the given container.
     *
     * @name height
     * @type {Number}
     * @instance
     */

  }, {
    key: 'height',
    set: function set(value) {
      this.ui.height = value;
      this._executeCommandForward('setHeight', value);
    },
    get: function get() {
      return this.ui.height;
    }
  }, {
    key: 'position',
    get: function get() {
      return this.player.position;
    }

    /**
     * Duration of the current audio file.
     *
     * @name duration
     * @type {Number}
     * @instance
     * @readonly
     */

  }, {
    key: 'duration',
    get: function get() {
      return this.player.duration;
    }
  }]);
  return Block;
}();

exports.default = Block;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJsb2NrLmpzIl0sIm5hbWVzIjpbInVpIiwiZGVjaWJlbFRvTGluZWFyIiwidmFsIiwiTWF0aCIsImV4cCIsIkVWRU5UUyIsIlNUQVJUIiwiUEFVU0UiLCJTVE9QIiwiU0VFSyIsIkVOREVEIiwiQ1VSUkVOVF9QT1NJVElPTiIsIlVQREFURSIsIlVJIiwiJGNvbnRhaW5lciIsInNpemluZyIsIndpZHRoIiwiaGVpZ2h0IiwiRWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImJvdW5kaW5nQ2xpZW50UmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInN0eWxlIiwiX3dpZHRoIiwiX2hlaWdodCIsInRpbWVsaW5lIiwiY29yZSIsIlRpbWVsaW5lIiwidHJhY2siLCJUcmFjayIsImFkZCIsInVwZGF0ZUNvbnRhaW5lciIsInRpbWVDb250ZXh0IiwiTGF5ZXJUaW1lQ29udGV4dCIsInZhbHVlIiwidHJhY2tzIiwiZm9yRWFjaCIsInJlbmRlciIsInVwZGF0ZSIsIm1haW50YWluVmlzaWJsZUR1cmF0aW9uIiwidmlzaWJsZVdpZHRoIiwiZGVmaW5pdGlvbnMiLCJjb250YWluZXIiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwicGxheWVyIiwibnVsbGFibGUiLCJsaXN0IiwibWluIiwibWF4IiwiSW5maW5pdHkiLCJCbG9jayIsIm9wdGlvbnMiLCJwYXJhbXMiLCJ0cmFja0RhdGEiLCJ0cmFja01ldGFkYXRhIiwiX2xpc3RlbmVycyIsIl9tb2R1bGVzIiwiX2lzUGxheWluZyIsImdldCIsInBsYXllckN0b3IiLCJfaGlzdG9yeSIsIl9tb25pdG9yUG9zaXRpb24iLCJiaW5kIiwiX29uRXZlbnQiLCJhZGRMaXN0ZW5lciIsImNoYW5uZWwiLCJjYWxsYmFjayIsImhhcyIsInNldCIsImxpc3RlbmVycyIsImRlbGV0ZSIsImNsZWFyIiwiYXJncyIsInVuZGVmaW5lZCIsImxpc3RlbmVyIiwiZSIsImhpdExheWVycyIsIl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkIiwibW9kdWxlIiwiekluZGV4IiwiaW5kZXgiLCJpbmRleE9mIiwiYmxvY2siLCJpbnN0YWxsIiwic2V0VHJhY2siLCJwdXNoIiwidW5pbnN0YWxsIiwic3BsaWNlIiwiY29tbWFuZCIsImkiLCJsIiwibGVuZ3RoIiwibmV4dCIsImRhdGEiLCJtZXRhZGF0YSIsIl9zZXRUcmFjayIsInJlc2V0SGlzdG9yeSIsInNldEJ1ZmZlciIsInJlc2V0Iiwic25hcCIsImVtaXQiLCJzdG9wIiwicGl4ZWxzUGVyU2Vjb25kIiwiZHVyYXRpb24iLCJfZXhlY3V0ZUNvbW1hbmRGb3J3YXJkIiwidW5kbyIsImhlYWQiLCJyZWRvIiwiZGIiLCJnYWluIiwic3RhcnQiLCJlbWl0UG9zaXRpb24iLCJwb3NpdGlvbiIsIl9tb25pdG9yUG9zaXRpb25SYWZJZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInBhdXNlIiwic2VlayIsInJ1bm5pbmciLCJlbmRlZCIsIm1vbml0b3JQb3NpdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxFOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxTQUFTQyxlQUFULENBQXlCQyxHQUF6QixFQUE4QjtBQUM1QixTQUFPQyxLQUFLQyxHQUFMLENBQVMsc0JBQXNCRixHQUEvQixDQUFQLENBRDRCLENBQ2dCO0FBQzdDOztBQUVELElBQU1HLFNBQVM7QUFDYjtBQUNBO0FBQ0FDLFNBQU8sT0FITTtBQUliO0FBQ0E7QUFDQUMsU0FBTyxPQU5NO0FBT2I7QUFDQTtBQUNBQyxRQUFNLE1BVE87QUFVYjtBQUNBO0FBQ0FDLFFBQU0sTUFaTztBQWFiO0FBQ0E7QUFDQUMsU0FBTyxPQWZNO0FBZ0JiO0FBQ0E7QUFDQUMsb0JBQWtCLFVBbEJMOztBQW9CYkMsVUFBUTtBQXBCSyxDQUFmOztJQXVCTUMsRTtBQUNKLGNBQVlDLFVBQVosRUFBd0JDLE1BQXhCLEVBQWdDQyxLQUFoQyxFQUF1Q0Ms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QUFLekQsTUFBTCxDQUFZeUUsT0FBaEIsRUFDRSxLQUFLSixxQkFBTCxHQUE2QkMsc0JBQXNCLEtBQUtyRCxnQkFBM0IsQ0FBN0I7O0FBRUYsVUFBTW1ELFdBQVcsS0FBS3BFLE1BQUwsQ0FBWW9FLFFBQTdCO0FBQ0EsVUFBTVQsV0FBVyxLQUFLM0QsTUFBTCxDQUFZMkQsUUFBN0I7QUFDQSxXQUFLUSxZQUFMLENBQWtCQyxRQUFsQjs7QUFFQSxVQUFJQSxXQUFXVCxRQUFmLEVBQ0UsT0FBTyxLQUFLZSxLQUFMLENBQVdOLFFBQVgsQ0FBUCxDQVRlLENBU2M7O0FBRS9CLFdBQUtwRSxNQUFMLENBQVkyRSxlQUFaO0FBQ0Q7OztzQkFyS1N6RixLLEVBQU87QUFDZixXQUFLbkMsRUFBTCxDQUFRZ0IsS0FBUixHQUFnQm1CLEtBQWhCO0FBQ0EsV0FBSzBFLHNCQUFMLENBQTRCLFVBQTVCLEVBQXdDMUUsS0FBeEM7QUFDRCxLO3dCQUVXO0FBQ1YsYUFBTyxLQUFLbkMsRUFBTCxDQUFRZ0IsS0FBZjtBQUNEOztBQUVEOzs7Ozs7Ozs7O3NCQU9XbUIsSyxFQUFPO0FBQ2hCLFdBQUtuQyxFQUFMLENBQVFpQixNQUFSLEdBQWlCa0IsS0FBakI7QUFDQSxXQUFLMEUsc0JBQUwsQ0FBNEIsV0FBNUIsRUFBeUMxRSxLQUF6QztBQUNELEs7d0JBRVk7QUFDWCxhQUFPLEtBQUtuQyxFQUFMLENBQVFpQixNQUFmO0FBQ0Q7Ozt3QkE0QmM7QUFDYixhQUFPLEtBQUtnQyxNQUFMLENBQVlvRSxRQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozt3QkFRZTtBQUNiLGFBQU8sS0FBS3BFLE1BQUwsQ0FBWTJELFFBQW5CO0FBQ0Q7Ozs7O2tCQXVHWXJELEsiLCJmaWxlIjoiQmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgcGFyYW1ldGVycyBmcm9tICdAaXJjYW0vcGFyYW1ldGVycyc7XG5pbXBvcnQgQWJzdHJhY3RQbGF5ZXIgZnJvbSAnLi9BYnN0cmFjdFBsYXllcic7XG5pbXBvcnQgSGlzdG9yeSBmcm9tICcuLi91dGlscy9IaXN0b3J5JztcblxuZnVuY3Rpb24gZGVjaWJlbFRvTGluZWFyKHZhbCkge1xuICByZXR1cm4gTWF0aC5leHAoMC4xMTUxMjkyNTQ2NDk3MDIyOSAqIHZhbCk7IC8vIHBvdygxMCwgdmFsIC8gMjApXG59O1xuXG5jb25zdCBFVkVOVFMgPSB7XG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb25cbiAgU1RBUlQ6ICdzdGFydCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb25cbiAgUEFVU0U6ICdwYXVzZScsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb25cbiAgU1RPUDogJ3N0b3AnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHRhcmdldFBvc2l0aW9uXG4gIFNFRUs6ICdzZWVrJyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBlbmRUaW1lXG4gIEVOREVEOiAnZW5kZWQnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIGN1cnJlbnRQb3NpdGlvblxuICBDVVJSRU5UX1BPU0lUSU9OOiAncG9zaXRpb24nLFxuXG4gIFVQREFURTogJ3VwZGF0ZScsXG59O1xuXG5jbGFzcyBVSSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHNpemluZywgd2lkdGgsIGhlaWdodCkge1xuICAgICRjb250YWluZXIgPSAoJGNvbnRhaW5lciBpbnN0YW5jZW9mIEVsZW1lbnQpID9cbiAgICAgICRjb250YWluZXIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuXG4gICAgc3dpdGNoIChzaXppbmcpIHtcbiAgICAgIGNhc2UgJ2F1dG8nOlxuICAgICAgICBjb25zdCBib3VuZGluZ0NsaWVudFJlY3QgPSAkY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB3aWR0aCA9IGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aDtcbiAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdDbGllbnRSZWN0LmhlaWdodDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21hbnVhbCc6XG4gICAgICAgICRjb250YWluZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICRjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy4kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcbiAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgIC8vIGFyYml0cmFyeSBgcGl4ZWxzUGVyU2Vjb25kYCB2YWx1ZSB0byB1cGRhdGUgd2hlbiBhIHRyYWNrIGlzIHNldFxuICAgIHRoaXMudGltZWxpbmUgPSBuZXcgdWkuY29yZS5UaW1lbGluZSgxLCB3aWR0aCk7XG4gICAgdGhpcy50cmFjayA9IG5ldyB1aS5jb3JlLlRyYWNrKCRjb250YWluZXIsIGhlaWdodCk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLmFkZCh0aGlzLnRyYWNrLCAnZGVmYXVsdCcpO1xuICAgIHRoaXMudHJhY2sudXBkYXRlQ29udGFpbmVyKCk7IC8vIGluaXQgdHJhY2sgRE9NIHRyZWVcblxuICAgIC8vIHRpbWUgY29udGV4dCB0aGF0IHNob3VsZCBiZSBzaGFyZWQgYnkgYWxsIChtb3N0KSBtaXhpbnMgLyB1aSBsYXllcnNcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IHVpLmNvcmUuTGF5ZXJUaW1lQ29udGV4dCh0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0KTtcbiAgfVxuXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgICB0aGlzLiRjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gYCR7dmFsdWV9cHhgO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xuICAgIHRoaXMuJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3ZhbHVlfXB4YDtcblxuICAgIHRoaXMudGltZWxpbmUubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudGltZWxpbmUudmlzaWJsZVdpZHRoID0gdmFsdWU7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb250YWluZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ3NzIFNlbGVjdG9yIG9yIERPTSBFbGVtZW50IGhvc3RpbmcgdGhlIGJsb2NrJ1xuICAgIH1cbiAgfSxcbiAgcGxheWVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogQWJzdHJhY3RQbGF5ZXIsIC8vIGlmIHdlIG9ubHkgbmVlZCB0aGUgdWkgcGFydCwgZGVmYXVsdCB0byBkdW1teSBwbGF5ZXJcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSwgLy8gc3VyZT8gd2h5IG5vdCBiZWluZyBhYmxlIHRvIGNoYW5nZSBkeW5hbWljYWxseT9cbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ0NvbnN0cnVjdG9yIG9mIHRoZSBwbGF5ZXIgdG8gYmUgdXNlZCBpbiB0aGUgYmxvY2snLFxuICAgIH0sXG4gIH0sXG4gIHNpemluZzoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ2F1dG8nLCAnbWFudWFsJ10sXG4gICAgZGVmYXVsdDogJ2F1dG8nLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICB3aWR0aDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9XG59XG5cbi8qKlxuICogQmFzZSBhdWRpby12aXN1YWwgcGxheWVyIHRvIGJlIGRlY29yYXRlZCB3aXRoIGFkZGl0aW9ubmFsIG1vZHVsZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gKG5vIG9wdGlvbnMgZm9yIG5vdylcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IFtvcHRpb25zLmNvbnRhaW5lcl0gLSBDc3MgU2VsZWN0b3Igb3IgRE9NIEVsZW1lbnQgdGhhdCB3aWxsXG4gKiAgaG9zdCB0aGUgcGxheWVyIGFuZCBhZGRpdGlvbm5hbCBtb2R1bGVzXG4gKiBAcGFyYW0ge0Fic3RyYWN0UGxheWVyfSAtIFRoZSBwbGF5ZXIgdG8gYmUgdXNlZCBieSB0aGUgYmxvY2suXG4gKiBAcGFyYW0geydhdXRvJ3wnbWFudWFsJ30gW29wdGlvbnMuc2l6aW5nPSdhdXRvJ10gLSBIb3cgdGhlIHNpemUgb2YgdGhlIGJsb2NrXG4gKiAgc2hvdWxkIGJlIGRlZmluZWQuIElmICdhdXRvJywgdGhlIGJsb2NrIGFkanVzdHMgdG8gdGhlIHNpemUgb2YgdGhlIGNvbnRhaW5lci5cbiAqICBJZiAnbWFudWFsJywgdXNlIGB3aWR0aGAgYW5kIGBoZWlnaHRgIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9bnVsbF0gLSBXaWR0aCBvZiB0aGUgYmxvY2sgaWYgc2l6ZSBpcyAnbWFudWFsJy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9bnVsbF0gLSBIZWlnaHQgb2YgdGhlIGJsb2NrIGlmIHNpemUgaXMgJ21hbnVhbCcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogY29uc3QgJGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250YWluZXInKTtcbiAqIGNvbnN0IGRlZmF1bHRXaWR0aCA9IDEwMDA7XG4gKiBjb25zdCBkZWZhdWx0SGVpZ2h0ID0gMTAwMDtcbiAqIGNvbnN0IGJsb2NrID0gbmV3IGJsb2Nrcy5jb3JlLkJsb2NrKHtcbiAqICAgcGxheWVyOiBhYmMucGxheWVyLlNlZWtQbGF5ZXIsXG4gKiAgIGNvbnRhaW5lcjogJGNvbnRhaW5lcixcbiAqICAgc2l6aW5nOiAnbWFudWFsJywgLy8gaWYgJ2F1dG8nLCBhZGp1c3QgdG8gZmlsbCAkY29udGFpbmVyIHNpemVcbiAqICAgd2lkdGg6IGRlZmF1bHRXaWR0aCxcbiAqICAgaGVpZ2h0OiBkZWZhdWx0SGVpZ2h0LFxuICogfSk7XG4gKlxuICogY29uc3Qgd2F2ZWZvcm1Nb2R1bGUgPSBuZXcgYmxvY2tzLm1vZHVsZS5XYXZlZm9ybU1vZHVsZSgpO1xuICogY29uc3QgY3Vyc29yTW9kdWxlID0gbmV3IGJsb2Nrcy5tb2R1bGUuQ3Vyc29yTW9kdWxlKCk7XG4gKlxuICogYmxvY2suYWRkKHNpbXBsZVdhdmVmb3JtTW9kdWxlKTtcbiAqIGJsb2NrLmFkZChjdXJzb3JNb2R1bGUpO1xuICogYGBgXG4gKi9cbmNsYXNzIEJsb2NrIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLkVWRU5UUyA9IEVWRU5UUztcblxuICAgIHRoaXMudHJhY2tEYXRhID0gbnVsbDtcbiAgICB0aGlzLnRyYWNrTWV0YWRhdGEgPSBudWxsO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX21vZHVsZXMgPSBbXTtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbnRhaW5lcicpO1xuICAgIGNvbnN0IHNpemluZyA9IHRoaXMucGFyYW1zLmdldCgnc2l6aW5nJyk7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5nZXQoJ3dpZHRoJyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuZ2V0KCdoZWlnaHQnKTtcbiAgICB0aGlzLnVpID0gbmV3IFVJKCRjb250YWluZXIsIHNpemluZywgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCBwbGF5ZXJDdG9yID0gdGhpcy5wYXJhbXMuZ2V0KCdwbGF5ZXInKTtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBwbGF5ZXJDdG9yKHRoaXMpO1xuXG4gICAgdGhpcy5faGlzdG9yeSA9IG5ldyBIaXN0b3J5KHRoaXMsICd0cmFja01ldGFkYXRhJywgMjApO1xuXG4gICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uID0gdGhpcy5fbW9uaXRvclBvc2l0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcblxuICAgIC8vIGxpc3RlbiBldmVudHMgZnJvbSB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXNcbiAgICB0aGlzLnVpLnRpbWVsaW5lLmFkZExpc3RlbmVyKCdldmVudCcsIHRoaXMuX29uRXZlbnQpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGV2ZW50IHN5c3RlbVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gYSBzcGVjaWZpYyBjaGFubmVsIG9mIHRoZSBwbGF5ZXIuXG4gICAqIEF2YWlsYWJsZSBldmVudHMgYXJlOlxuICAgKiAtIGAnc3RhcnQnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzdGFydHNcbiAgICogLSBgJ3BhdXNlJ2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgaXMgcGF1c2VkXG4gICAqIC0gYCdzdG9wJ2AgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIGlzIHN0b3BwZWQgKHBhdXNlKCkgKyBzZWVrKDApKVxuICAgKiAtIGAnc2VlaydgIDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzZWVrIHRvIGEgbmV3IHBvc2l0aW9uXG4gICAqIC0gYCdlbmRlZCdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHN0b3BzIGF0IHRoZSBlbmQgb2YgdGhlIGZpbGUgKG9yIGF0XG4gICAqICAgICAgICAgICAgICB0aGUgZW5kIG9mIHRoZSBsYXN0IHNlZ21lbnQpLiBUaGUgY2FsbGJhY2sgaXMgZXhlY3V0ZWQgd2l0aCB0aGVcbiAgICogICAgICAgICAgICAgIHN0b3AgcG9zaXRpb24uXG4gICAqIC0gYCdwb3NpdGlvbidgOiB0cmlnZ2VyZWQgYXQgZWFjaCByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSB3aXRoIHRoZSBjdXJyZW50XG4gICAqICAgICAgICAgICAgICBwb3NpdGlvbiBhbmQgZHVyYXRpb24gb2YgdGhlIGF1ZGlvIGZpbGUuIFRyaWdnZXIgb25seSB3aGVuXG4gICAqICAgICAgICAgICAgICB0aGUgcGxheWVyIGlzIHBsYXlpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICovXG4gIGFkZExpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChjaGFubmVsLCBuZXcgU2V0KCkpO1xuXG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICBsaXN0ZW5lcnMuYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGEgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgc3Vic2NpYmVycyBmcm9tIGEgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsLlxuICAgKi9cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKGNoYW5uZWwpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzLmhhcyhjaGFubmVsKSkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICAgIGxpc3RlbmVycy5jbGVhcigpO1xuXG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGNoYW5uZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBzdWJzY3JpYmVycyBvZiBhIGV2ZW50IHdpdGggZ2l2ZW4gYXJndW1lbnRzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcblxuICAgIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZClcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWluIGV2ZW50IGxpc3RlbmVyIG9mIHRoZSB3YXZlcy11aSB0aW1lbGluZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoJ29uRXZlbnQnLCBlLCBoaXRMYXllcnMpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIG1vZHVsZSBjaGFpblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQWRkIGEgbW9kdWxlIHRvIHRoZSBwbGF5ZXIuIEEgbW9kdWxlIGlzIGRlZmluZWQgYXMgYSBzcGVjaWZpYyBzZXRcbiAgICogb2YgZnVuY3Rpb25uYWxpdHkgYW5kIHZpc3VhbGl6YXRpb25zIG9uIHRvcCBvZiB0aGUgcGxheWVyLlxuICAgKiBNb2R1bGUgY2FuIGltcGxlbWVudCBmZWF0dXJlcyBzdWNoIGFzIHdhdmVmb3JtLCBtb3ZpbmcgY3Vyc29yLCBldGMuXG4gICAqXG4gICAqIEBwYXJhbSB7QWJzdHJhY3RNb2R1bGV9IG1vZHVsZSAtIE1vZHVsZSB0byBhZGRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHpJbmRleCAtIHpJbmRleCBvZiB0aGUgYWRkZWQgbW9kdWxlXG4gICAqL1xuICBhZGQobW9kdWxlLCB6SW5kZXggPSAwKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kdWxlKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIG1vZHVsZS5ibG9jayA9IHRoaXM7XG4gICAgICBtb2R1bGUuekluZGV4ID0gekluZGV4O1xuICAgICAgbW9kdWxlLmluc3RhbGwodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLnRyYWNrTWV0YWRhdGEgJiYgbW9kdWxlLnNldFRyYWNrKVxuICAgICAgICBtb2R1bGUuc2V0VHJhY2sodGhpcy50cmFja0RhdGEsIHRoaXMudHJhY2tNZXRhZGF0YSk7XG5cbiAgICAgIHRoaXMuX21vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbW9kdWxlIGZyb20gdGhlIHBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtBYnN0cmFjdE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlKG1vZHVsZSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbW9kdWxlcy5pbmRleE9mKG1vZHVsZSk7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBtb2R1bGUudW5pbnN0YWxsKHRoaXMpO1xuICAgICAgbW9kdWxlLmJsb2NrID0gbnVsbDtcbiAgICAgIG1vZHVsZS56SW5kZXggPSBudWxsO1xuXG4gICAgICB0aGlzLl9tb2R1bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY29tbWFuZCBvbiBlYWNoIG1vZHVsZSB0aGF0IGltcGxlbWVudHMgdGhlIG1ldGhvZC4gVGhlIGNvbW1hbmRcbiAgICogYXJlIGV4ZWN1dGVkIGluIHRoZSBvcmRlciBpbiB3aGljaCBtb2R1bGVzIHdlcmUgYWRkZWQgdG8gdGhlIHBsYXllci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9leGVjdXRlQ29tbWFuZEZvcndhcmQoY29tbWFuZCwgLi4uYXJncykge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5fbW9kdWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuX21vZHVsZXNbaV07XG5cbiAgICAgIGlmIChtb2R1bGVbY29tbWFuZF0pIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG1vZHVsZVtjb21tYW5kXSguLi5hcmdzKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY29tbWFuZCBvbiBlYWNoIG1vZHVsZSB0aGF0IGltcGxlbWVudHMgdGhlIG1ldGhvZC4gVGhlIGNvbW1hbmRcbiAgICogYXJlIGV4ZWN1dGVkIGluIHRoZSByZXZlcnNlIG9yZGVyIGluIHdoaWNoIG1vZHVsZXMgd2VyZSBhZGRlZCB0byB0aGUgcGxheWVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoY29tbWFuZCwgLi4uYXJncykge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9tb2R1bGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtb2R1bGUgPSB0aGlzLl9tb2R1bGVzW2ldO1xuXG4gICAgICBpZiAobW9kdWxlW2NvbW1hbmRdKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBtb2R1bGVbY29tbWFuZF0oLi4uYXJncyk7XG5cbiAgICAgICAgaWYgKG5leHQgPT09IGZhbHNlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIGNoYW5nZSB0aGUgdHJhY2sgb2YgdGhlIHBsYXllci4gQSB0cmFjayBpcyBhIEpTT04gb2JqZWN0IHRoYXQgbXVzdFxuICAgKiBmb2xsb3cgdGhlIGNvbnZlbnRpb24gZGVmaW5lZCA/P1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVmZmVyIChpLmUuIEF1ZGlvQnVmZmVyKVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YWRhdGEgLSBtZXRhZGF0YSBvYmplY3RcbiAgICovXG4gIHNldFRyYWNrKGRhdGEsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy5fc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBvciBjaGFuZ2UgdGhlIHRyYWNrIG9mIHRoZSBwbGF5ZXIuIEEgdHJhY2sgaXMgYSBKU09OIG9iamVjdCB0aGF0IG11c3RcbiAgICogZm9sbG93IHRoZSBjb252ZW50aW9uIGRlZmluZWQgPz9cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1ZmZlciAoaS5lLiBBdWRpb0J1ZmZlcilcbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gbWV0YWRhdGEgb2JqZWN0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVzZXRIaXN0b3J5IC0gcmVzZXQgaGlzdG9yeVxuICAgKi9cbiAgX3NldFRyYWNrKGRhdGEsIG1ldGFkYXRhLCByZXNldEhpc3RvcnkgPSBmYWxzZSkge1xuICAgIHRoaXMudHJhY2tNZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgIHRoaXMudHJhY2tEYXRhID0gZGF0YTtcbiAgICB0aGlzLnBsYXllci5zZXRCdWZmZXIoZGF0YSk7IC8vIGludGVybmFsbHkgc3RvcHMgdGhlIHBsYXkgY29udHJvbFxuXG4gICAgaWYgKHJlc2V0SGlzdG9yeSkge1xuICAgICAgdGhpcy5faGlzdG9yeS5yZXNldCgpO1xuICAgICAgdGhpcy5zbmFwKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNuYXAgYWxyZWFkeSBlbWl0cyB0aGUgZXZlbnQuLi5cbiAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UUy5VUERBVEUsIHRoaXMudHJhY2tEYXRhLCB0aGlzLnRyYWNrTWV0YWRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgdGhpcy51aS50aW1lbGluZS5waXhlbHNQZXJTZWNvbmQgPSB0aGlzLndpZHRoIC8gdGhpcy5kdXJhdGlvbjtcbiAgICB0aGlzLnVpLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2V0VHJhY2snLCBkYXRhLCBtZXRhZGF0YSk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHVuZG8gLyByZWRvXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIHJldmlldyBhbGwgaGlzdG9yeSBhbGdvcml0aG1cbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHNuYXBzaG90IG9mIHRoZSBkYXRhIGFmdGVyIG1vZGlmaWNhdGlvbnMuIFNob3VsZCBiZSB1c2VkIGluXG4gICAqIG1vZHVsZXMgYWZ0ZXIgZWFjaCBzaWduaWZpY2FudCBvcGVyYXRpb24sIGluIG9yZGVyIHRvIGFsbG93IGB1bmRvYCBhbmRcbiAgICogYHJlZG9gIG9wZXJhdGlvbnMuXG4gICAqL1xuICBzbmFwKCkge1xuICAgIHRoaXMuX2hpc3Rvcnkuc25hcCgpO1xuICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UUy5VUERBVEUsIHRoaXMudHJhY2tEYXRhLCB0aGlzLnRyYWNrTWV0YWRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvIHRvIHByZXZpb3VzIHNuYXBzaG90LlxuICAgKi9cbiAgdW5kbygpIHtcbiAgICBpZiAodGhpcy5faGlzdG9yeS51bmRvKCkpXG4gICAgICB0aGlzLl9zZXRUcmFjayh0aGlzLnRyYWNrRGF0YSwgdGhpcy5faGlzdG9yeS5oZWFkKCksIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHbyB0byBuZXh0IHNuYXBzaG90LlxuICAgKi9cbiAgcmVkbygpIHtcbiAgICBpZiAodGhpcy5faGlzdG9yeS5yZWRvKCkpXG4gICAgICB0aGlzLl9zZXRUcmFjayh0aGlzLnRyYWNrRGF0YSwgdGhpcy5faGlzdG9yeS5oZWFkKCksIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIGRlZmluZSBpZiBpdCdzIHJlYWxseSB0aGUgcHJvcGVyIHdheSB0byBnby4uLlxuICAgKi9cbiAgaGVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5oZWFkKCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gdmlzdWFsIGludGVyZmFjZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHBsYXllci4gRGVmYXVsdHMgdG8gdGhlIHdpZHRoIG9mIHRoZSBnaXZlbiBjb250YWluZXIuXG4gICAqXG4gICAqIEBuYW1lIHdpZHRoXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy51aS53aWR0aCA9IHZhbHVlO1xuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2V0V2lkdGgnLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudWkud2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSBwbGF5ZXIuIERlZmF1bHRzIHRvIHRoZSBoZWlnaHQgb2YgdGhlIGdpdmVuIGNvbnRhaW5lci5cbiAgICpcbiAgICogQG5hbWUgaGVpZ2h0XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMudWkuaGVpZ2h0ID0gdmFsdWU7XG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZXRIZWlnaHQnLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLnVpLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb2VzIHRoaXMgbWFrZSBzZW5zID9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICAvLyBmb3JjZSByZW5kZXJpbmcgZnJvbSBvdXRzaWRlIHRoZSBtb2R1bGUgKGkuZS4gaWYgdmFsdWVzIGhhdmUgY2hhbmdlZClcbiAgICB0aGlzLnVpLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKCdyZW5kZXInKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBhdWRpbyBpbnRlcmZhY2VcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBoZWFkIGluIHRoZSBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAbmFtZSBwb3NpdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgcG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyLnBvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIER1cmF0aW9uIG9mIHRoZSBjdXJyZW50IGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBuYW1lIGR1cmF0aW9uXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXIuZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogVm9sdW1lIG9mIHRoZSBhdWRpbyAoaW4gZEIpLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZGIgLSB2b2x1bWUgb2YgdGhlIHBsYXllciBpbiBkZWNpYmVsc1xuICAgKi9cbiAgdm9sdW1lKGRiKSB7XG4gICAgY29uc3QgZ2FpbiA9IGRlY2liZWxUb0xpbmVhcihkYilcbiAgICB0aGlzLnBsYXllci5nYWluID0gZ2FpbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgcGxheWVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gdHJ1ZSxcbiAgICB0aGlzLnBsYXllci5zdGFydCgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzdGFydCcpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TVEFSVCk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG5cbiAgICB0aGlzLl9tb25pdG9yUG9zaXRpb25SYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9tb25pdG9yUG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIHBsYXllciAoc2hvcnRjdXQgZm9yIGBwYXVzZWAgYW5kIGBzZWVrYCB0byAwKS5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2UsXG4gICAgdGhpcy5wbGF5ZXIuc3RvcCgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzdG9wJyk7XG5cbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNUT1ApO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdXNlIHRoZSBwbGF5ZXIuXG4gICAqL1xuICBwYXVzZSgpIHtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZSxcbiAgICB0aGlzLnBsYXllci5wYXVzZSgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdwYXVzZScpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5QQVVTRSk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU2VlayB0byBhIG5ldyBwb3NpdGlvbiBpbiB0aGUgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gTmV3IHBvc2l0aW9uLlxuICAgKi9cbiAgc2Vlayhwb3NpdGlvbikge1xuICAgIHBvc2l0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ocG9zaXRpb24sIHRoaXMucGxheWVyLmR1cmF0aW9uKSk7XG4gICAgdGhpcy5wbGF5ZXIuc2Vlayhwb3NpdGlvbik7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NlZWsnLCBwb3NpdGlvbiwgdGhpcy5faXNQbGF5aW5nKTtcbiAgICAvLyBhcyB0aGUgcG9zaXRpb24gY2FuIGJlIG1vZGlmaWVkIGJ5IHRoZSBTZWVrQ29udHJvbFxuICAgIHRoaXMuZW1pdChFVkVOVFMuU0VFSywgdGhpcy5wbGF5ZXIucG9zaXRpb24pO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucGxheWVyLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKiBTaG9ydGN1dCBmb3IgYHRoaXMuZW1pdCgncG9zaXRpb24nLCBwb3NpdGlvbiwgZHVyYXRpb24pYFxuICAgKi9cbiAgZW1pdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5lbWl0KEVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCBwb3NpdGlvbiwgdGhpcy5wbGF5ZXIuZHVyYXRpb24pO1xuICB9XG5cbiAgICAvKipcbiAgICogRW1pdCB0aGUgYGVuZGVkYCBldmVudC5cbiAgICovXG4gIGVuZGVkKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5lbWl0KEVWRU5UUy5FTkRFRCwgcG9zaXRpb24pO1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwbGF5ZXIgaW4gYSByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBsb29wLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21vbml0b3JQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5wbGF5ZXIucnVubmluZylcbiAgICAgIHRoaXMuX21vbml0b3JQb3NpdGlvblJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX21vbml0b3JQb3NpdGlvbik7XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucGxheWVyLnBvc2l0aW9uO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wbGF5ZXIuZHVyYXRpb247XG4gICAgdGhpcy5lbWl0UG9zaXRpb24ocG9zaXRpb24pO1xuXG4gICAgaWYgKHBvc2l0aW9uID4gZHVyYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5lbmRlZChwb3NpdGlvbik7IC8vIHBsYXllciBzdG9wcyB0aGUgcGxheUNvbnRyb2xcblxuICAgIHRoaXMucGxheWVyLm1vbml0b3JQb3NpdGlvbigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsb2NrO1xuIl19