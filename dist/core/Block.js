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

var _objectAssignDeep = require('object-assign-deep');

var _objectAssignDeep2 = _interopRequireDefault(_objectAssignDeep);

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

    this._trackData = null;
    this._trackMetadata = null;

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

    this._history = new _History2.default(this, '_trackMetadata', 20);

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

        if (this._trackMetadata && module.setTrack) module.setTrack(this._trackData, this._trackMetadata);

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

      this._trackMetadata = metadata;
      this._trackData = data;
      this.player.setBuffer(data); // internally stops the play control

      if (resetHistory) {
        this._history.reset();
        this.snap();
      } else {
        // snap already emits the event...
        this.emit(this.EVENTS.UPDATE, this._trackData, this._trackMetadata);
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
      this.emit(this.EVENTS.UPDATE, this._trackData, this._trackMetadata);
    }

    /**
     * Go to previous snapshot.
     */

  }, {
    key: 'undo',
    value: function undo() {
      if (this._history.undo()) {
        (0, _objectAssignDeep2.default)(this._trackMetadata, this._history.head());
        this._setTrack(this._trackData, this._trackMetadata, false);
      }
    }

    /**
     * Go to next snapshot.
     */

  }, {
    key: 'redo',
    value: function redo() {
      if (this._history.redo()) {
        (0, _objectAssignDeep2.default)(this._trackMetadata, this._history.head());
        this._setTrack(this._trackData, this._trackMetadata, false);
      }
    }

    /**
     * @todo - define if it's really the proper way to go...
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
  }, {
    key: 'update',
    value: function update() {
      this.ui.timeline.tracks.forEach(function (track) {
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
    key: 'metadata',
    get: function get() {
      return this._trackMetadata;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJsb2NrLmpzIl0sIm5hbWVzIjpbInVpIiwiZGVjaWJlbFRvTGluZWFyIiwidmFsIiwiTWF0aCIsImV4cCIsIkVWRU5UUyIsIlNUQVJUIiwiUEFVU0UiLCJTVE9QIiwiU0VFSyIsIkVOREVEIiwiQ1VSUkVOVF9QT1NJVElPTiIsIlVQREFURSIsIlVJIiwiJGNvbnRhaW5lciIsInNpemluZyIsIndpZHRoIiwiaGVpZ2h0IiwiRWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImJvdW5kaW5nQ2xpZW50UmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInN0eWxlIiwiX3dpZHRoIiwiX2hlaWdodCIsInRpbWVsaW5lIiwiY29yZSIsIlRpbWVsaW5lIiwidHJhY2siLCJUcmFjayIsImFkZCIsInVwZGF0ZUNvbnRhaW5lciIsInRpbWVDb250ZXh0IiwiTGF5ZXJUaW1lQ29udGV4dCIsInZhbHVlIiwidHJhY2tzIiwiZm9yRWFjaCIsInJlbmRlciIsInVwZGF0ZSIsIm1haW50YWluVmlzaWJsZUR1cmF0aW9uIiwidmlzaWJsZVdpZHRoIiwiZGVmaW5pdGlvbnMiLCJjb250YWluZXIiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwicGxheWVyIiwiQWJzdHJhY3RQbGF5ZXIiLCJudWxsYWJsZSIsImxpc3QiLCJtaW4iLCJtYXgiLCJJbmZpbml0eSIsIkJsb2NrIiwib3B0aW9ucyIsInBhcmFtcyIsIl90cmFja0RhdGEiLCJfdHJhY2tNZXRhZGF0YSIsIl9saXN0ZW5lcnMiLCJfbW9kdWxlcyIsIl9pc1BsYXlpbmciLCJnZXQiLCJwbGF5ZXJDdG9yIiwiX2hpc3RvcnkiLCJIaXN0b3J5IiwiX21vbml0b3JQb3NpdGlvbiIsImJpbmQiLCJfb25FdmVudCIsImFkZExpc3RlbmVyIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0IiwibGlzdGVuZXJzIiwiZGVsZXRlIiwiY2xlYXIiLCJhcmdzIiwidW5kZWZpbmVkIiwibGlzdGVuZXIiLCJlIiwiaGl0TGF5ZXJzIiwiX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQiLCJtb2R1bGUiLCJ6SW5kZXgiLCJpbmRleCIsImluZGV4T2YiLCJibG9jayIsImluc3RhbGwiLCJzZXRUcmFjayIsInB1c2giLCJ1bmluc3RhbGwiLCJzcGxpY2UiLCJjb21tYW5kIiwiaSIsImwiLCJsZW5ndGgiLCJuZXh0IiwiZGF0YSIsIm1ldGFkYXRhIiwiX3NldFRyYWNrIiwicmVzZXRIaXN0b3J5Iiwic2V0QnVmZmVyIiwicmVzZXQiLCJzbmFwIiwiZW1pdCIsInN0b3AiLCJwaXhlbHNQZXJTZWNvbmQiLCJkdXJhdGlvbiIsIl9leGVjdXRlQ29tbWFuZEZvcndhcmQiLCJ1bmRvIiwiaGVhZCIsInJlZG8iLCJkYiIsImdhaW4iLCJzdGFydCIsImVtaXRQb3NpdGlvbiIsInBvc2l0aW9uIiwiX21vbml0b3JQb3NpdGlvblJhZklkIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicGF1c2UiLCJzZWVrIiwicnVubmluZyIsImVuZGVkIiwibW9uaXRvclBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0MsZUFBVCxDQUF5QkMsR0FBekIsRUFBOEI7QUFDNUIsU0FBT0MsS0FBS0MsR0FBTCxDQUFTLHNCQUFzQkYsR0FBL0IsQ0FBUCxDQUQ0QixDQUNnQjtBQUM3Qzs7QUFFRCxJQUFNRyxTQUFTO0FBQ2I7QUFDQTtBQUNBQyxTQUFPLE9BSE07QUFJYjtBQUNBO0FBQ0FDLFNBQU8sT0FOTTtBQU9iO0FBQ0E7QUFDQUMsUUFBTSxNQVRPO0FBVWI7QUFDQTtBQUNBQyxRQUFNLE1BWk87QUFhYjtBQUNBO0FBQ0FDLFNBQU8sT0FmTTtBQWdCYjtBQUNBO0FBQ0FDLG9CQUFrQixVQWxCTDs7QUFvQmJDLFVBQVE7QUFwQkssQ0FBZjs7SUF1Qk1DLEU7QUFDSixjQUFZQyxV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TUFBZjtBQUNEOzs7d0JBb0NjO0FBQ2IsYUFBTyxLQUFLZ0MsTUFBTCxDQUFZc0UsUUFBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7d0JBUWU7QUFDYixhQUFPLEtBQUt0RSxNQUFMLENBQVk2RCxRQUFuQjtBQUNEOzs7OztrQkF1R1l0RCxLIiwiZmlsZSI6IkJsb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAnQGlyY2FtL3BhcmFtZXRlcnMnO1xuaW1wb3J0IEFic3RyYWN0UGxheWVyIGZyb20gJy4vQWJzdHJhY3RQbGF5ZXInO1xuaW1wb3J0IEhpc3RvcnkgZnJvbSAnLi4vdXRpbHMvSGlzdG9yeSc7XG5pbXBvcnQgb2JqZWN0QXNzaWduRGVlcCBmcm9tICdvYmplY3QtYXNzaWduLWRlZXAnO1xuXG5mdW5jdGlvbiBkZWNpYmVsVG9MaW5lYXIodmFsKSB7XG4gIHJldHVybiBNYXRoLmV4cCgwLjExNTEyOTI1NDY0OTcwMjI5ICogdmFsKTsgLy8gcG93KDEwLCB2YWwgLyAyMClcbn07XG5cbmNvbnN0IEVWRU5UUyA9IHtcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBTVEFSVDogJ3N0YXJ0JyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBQQVVTRTogJ3BhdXNlJyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBTVE9QOiAnc3RvcCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gdGFyZ2V0UG9zaXRpb25cbiAgU0VFSzogJ3NlZWsnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIGVuZFRpbWVcbiAgRU5ERUQ6ICdlbmRlZCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gY3VycmVudFBvc2l0aW9uXG4gIENVUlJFTlRfUE9TSVRJT046ICdwb3NpdGlvbicsXG5cbiAgVVBEQVRFOiAndXBkYXRlJyxcbn07XG5cbmNsYXNzIFVJIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgc2l6aW5nLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgJGNvbnRhaW5lciA9ICgkY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCkgP1xuICAgICAgJGNvbnRhaW5lciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJGNvbnRhaW5lcik7XG5cbiAgICBzd2l0Y2ggKHNpemluZykge1xuICAgICAgY2FzZSAnYXV0byc6XG4gICAgICAgIGNvbnN0IGJvdW5kaW5nQ2xpZW50UmVjdCA9ICRjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHdpZHRoID0gYm91bmRpbmdDbGllbnRSZWN0LndpZHRoO1xuICAgICAgICBoZWlnaHQgPSBib3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0O1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbWFudWFsJzpcbiAgICAgICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgLy8gYXJiaXRyYXJ5IGBwaXhlbHNQZXJTZWNvbmRgIHZhbHVlIHRvIHVwZGF0ZSB3aGVuIGEgdHJhY2sgaXMgc2V0XG4gICAgdGhpcy50aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHdpZHRoKTtcbiAgICB0aGlzLnRyYWNrID0gbmV3IHVpLmNvcmUuVHJhY2soJGNvbnRhaW5lciwgaGVpZ2h0KTtcblxuICAgIHRoaXMudGltZWxpbmUuYWRkKHRoaXMudHJhY2ssICdkZWZhdWx0Jyk7XG4gICAgdGhpcy50cmFjay51cGRhdGVDb250YWluZXIoKTsgLy8gaW5pdCB0cmFjayBET00gdHJlZVxuXG4gICAgLy8gdGltZSBjb250ZXh0IHRoYXQgc2hvdWxkIGJlIHNoYXJlZCBieSBhbGwgKG1vc3QpIG1peGlucyAvIHVpIGxheWVyc1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHRoaXMudGltZWxpbmUudGltZUNvbnRleHQpO1xuICB9XG5cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICAgIHRoaXMuJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZX1weGA7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLmhlaWdodCA9IHZhbHVlO1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gICAgdGhpcy4kY29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7dmFsdWV9cHhgO1xuXG4gICAgdGhpcy50aW1lbGluZS5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IHRydWU7XG4gICAgdGhpcy50aW1lbGluZS52aXNpYmxlV2lkdGggPSB2YWx1ZTtcblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gIH1cbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDc3MgU2VsZWN0b3Igb3IgRE9NIEVsZW1lbnQgaG9zdGluZyB0aGUgYmxvY2snXG4gICAgfVxuICB9LFxuICBwbGF5ZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBBYnN0cmFjdFBsYXllciwgLy8gaWYgd2Ugb25seSBuZWVkIHRoZSB1aSBwYXJ0LCBkZWZhdWx0IHRvIGR1bW15IHBsYXllclxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLCAvLyBzdXJlPyB3aHkgbm90IGJlaW5nIGFibGUgdG8gY2hhbmdlIGR5bmFtaWNhbGx5P1xuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ29uc3RydWN0b3Igb2YgdGhlIHBsYXllciB0byBiZSB1c2VkIGluIHRoZSBibG9jaycsXG4gICAgfSxcbiAgfSxcbiAgc2l6aW5nOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnYXV0bycsICdtYW51YWwnXSxcbiAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHdpZHRoOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBoZWlnaHQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGF1ZGlvLXZpc3VhbCBwbGF5ZXIgdG8gYmUgZGVjb3JhdGVkIHdpdGggYWRkaXRpb25uYWwgbW9kdWxlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvbiAobm8gb3B0aW9ucyBmb3Igbm93KVxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gW29wdGlvbnMuY29udGFpbmVyXSAtIENzcyBTZWxlY3RvciBvciBET00gRWxlbWVudCB0aGF0IHdpbGxcbiAqICBob3N0IHRoZSBwbGF5ZXIgYW5kIGFkZGl0aW9ubmFsIG1vZHVsZXNcbiAqIEBwYXJhbSB7QWJzdHJhY3RQbGF5ZXJ9IC0gVGhlIHBsYXllciB0byBiZSB1c2VkIGJ5IHRoZSBibG9jay5cbiAqIEBwYXJhbSB7J2F1dG8nfCdtYW51YWwnfSBbb3B0aW9ucy5zaXppbmc9J2F1dG8nXSAtIEhvdyB0aGUgc2l6ZSBvZiB0aGUgYmxvY2tcbiAqICBzaG91bGQgYmUgZGVmaW5lZC4gSWYgJ2F1dG8nLCB0aGUgYmxvY2sgYWRqdXN0cyB0byB0aGUgc2l6ZSBvZiB0aGUgY29udGFpbmVyLlxuICogIElmICdtYW51YWwnLCB1c2UgYHdpZHRoYCBhbmQgYGhlaWdodGAgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD1udWxsXSAtIFdpZHRoIG9mIHRoZSBibG9jayBpZiBzaXplIGlzICdtYW51YWwnLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD1udWxsXSAtIEhlaWdodCBvZiB0aGUgYmxvY2sgaWYgc2l6ZSBpcyAnbWFudWFsJy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiBjb25zdCAkY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRhaW5lcicpO1xuICogY29uc3QgZGVmYXVsdFdpZHRoID0gMTAwMDtcbiAqIGNvbnN0IGRlZmF1bHRIZWlnaHQgPSAxMDAwO1xuICogY29uc3QgYmxvY2sgPSBuZXcgYmxvY2tzLmNvcmUuQmxvY2soe1xuICogICBwbGF5ZXI6IGFiYy5wbGF5ZXIuU2Vla1BsYXllcixcbiAqICAgY29udGFpbmVyOiAkY29udGFpbmVyLFxuICogICBzaXppbmc6ICdtYW51YWwnLCAvLyBpZiAnYXV0bycsIGFkanVzdCB0byBmaWxsICRjb250YWluZXIgc2l6ZVxuICogICB3aWR0aDogZGVmYXVsdFdpZHRoLFxuICogICBoZWlnaHQ6IGRlZmF1bHRIZWlnaHQsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB3YXZlZm9ybU1vZHVsZSA9IG5ldyBibG9ja3MubW9kdWxlLldhdmVmb3JtTW9kdWxlKCk7XG4gKiBjb25zdCBjdXJzb3JNb2R1bGUgPSBuZXcgYmxvY2tzLm1vZHVsZS5DdXJzb3JNb2R1bGUoKTtcbiAqXG4gKiBibG9jay5hZGQoc2ltcGxlV2F2ZWZvcm1Nb2R1bGUpO1xuICogYmxvY2suYWRkKGN1cnNvck1vZHVsZSk7XG4gKiBgYGBcbiAqL1xuY2xhc3MgQmxvY2sge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuRVZFTlRTID0gRVZFTlRTO1xuXG4gICAgdGhpcy5fdHJhY2tEYXRhID0gbnVsbDtcbiAgICB0aGlzLl90cmFja01ldGFkYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9tb2R1bGVzID0gW107XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdjb250YWluZXInKTtcbiAgICBjb25zdCBzaXppbmcgPSB0aGlzLnBhcmFtcy5nZXQoJ3NpemluZycpO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuZ2V0KCd3aWR0aCcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmdldCgnaGVpZ2h0Jyk7XG4gICAgdGhpcy51aSA9IG5ldyBVSSgkY29udGFpbmVyLCBzaXppbmcsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgcGxheWVyQ3RvciA9IHRoaXMucGFyYW1zLmdldCgncGxheWVyJyk7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgcGxheWVyQ3Rvcih0aGlzKTtcblxuICAgIHRoaXMuX2hpc3RvcnkgPSBuZXcgSGlzdG9yeSh0aGlzLCAnX3RyYWNrTWV0YWRhdGEnLCAyMCk7XG5cbiAgICB0aGlzLl9tb25pdG9yUG9zaXRpb24gPSB0aGlzLl9tb25pdG9yUG9zaXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkV2ZW50ID0gdGhpcy5fb25FdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgLy8gbGlzdGVuIGV2ZW50cyBmcm9tIHRoZSB0aW1lbGluZSB0byBwcm9wYWdhdGUgdG8gbW9kdWxlc1xuICAgIHRoaXMudWkudGltZWxpbmUuYWRkTGlzdGVuZXIoJ2V2ZW50JywgdGhpcy5fb25FdmVudCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZXZlbnQgc3lzdGVtXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIHNwZWNpZmljIGNoYW5uZWwgb2YgdGhlIHBsYXllci5cbiAgICogQXZhaWxhYmxlIGV2ZW50cyBhcmU6XG4gICAqIC0gYCdzdGFydCdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHN0YXJ0c1xuICAgKiAtIGAncGF1c2UnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBpcyBwYXVzZWRcbiAgICogLSBgJ3N0b3AnYCA6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgaXMgc3RvcHBlZCAocGF1c2UoKSArIHNlZWsoMCkpXG4gICAqIC0gYCdzZWVrJ2AgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHNlZWsgdG8gYSBuZXcgcG9zaXRpb25cbiAgICogLSBgJ2VuZGVkJ2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgc3RvcHMgYXQgdGhlIGVuZCBvZiB0aGUgZmlsZSAob3IgYXRcbiAgICogICAgICAgICAgICAgIHRoZSBlbmQgb2YgdGhlIGxhc3Qgc2VnbWVudCkuIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZCB3aXRoIHRoZVxuICAgKiAgICAgICAgICAgICAgc3RvcCBwb3NpdGlvbi5cbiAgICogLSBgJ3Bvc2l0aW9uJ2A6IHRyaWdnZXJlZCBhdCBlYWNoIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIHdpdGggdGhlIGN1cnJlbnRcbiAgICogICAgICAgICAgICAgIHBvc2l0aW9uIGFuZCBkdXJhdGlvbiBvZiB0aGUgYXVkaW8gZmlsZS4gVHJpZ2dlciBvbmx5IHdoZW5cbiAgICogICAgICAgICAgICAgIHRoZSBwbGF5ZXIgaXMgcGxheWluZy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gZXhlY3V0ZVxuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpXG4gICAgICB0aGlzLl9saXN0ZW5lcnMuc2V0KGNoYW5uZWwsIG5ldyBTZXQoKSk7XG5cbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgIGxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gYSBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG4gICAgICBsaXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBzdWJzY2liZXJzIGZyb20gYSBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWwuXG4gICAqL1xuICByZW1vdmVBbGxMaXN0ZW5lcnMoY2hhbm5lbCkge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgICAgbGlzdGVuZXJzLmNsZWFyKCk7XG5cbiAgICAgIHRoaXMuX2xpc3RlbmVycy5kZWxldGUoY2hhbm5lbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYWxsIHN1YnNjcmliZXJzIG9mIGEgZXZlbnQgd2l0aCBnaXZlbiBhcmd1bWVudHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuXG4gICAgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKVxuICAgICAgbGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoLi4uYXJncykpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1haW4gZXZlbnQgbGlzdGVuZXIgb2YgdGhlIHdhdmVzLXVpIHRpbWVsaW5lLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCgnb25FdmVudCcsIGUsIGhpdExheWVycyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbW9kdWxlIGNoYWluXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBZGQgYSBtb2R1bGUgdG8gdGhlIHBsYXllci4gQSBtb2R1bGUgaXMgZGVmaW5lZCBhcyBhIHNwZWNpZmljIHNldFxuICAgKiBvZiBmdW5jdGlvbm5hbGl0eSBhbmQgdmlzdWFsaXphdGlvbnMgb24gdG9wIG9mIHRoZSBwbGF5ZXIuXG4gICAqIE1vZHVsZSBjYW4gaW1wbGVtZW50IGZlYXR1cmVzIHN1Y2ggYXMgd2F2ZWZvcm0sIG1vdmluZyBjdXJzb3IsIGV0Yy5cbiAgICpcbiAgICogQHBhcmFtIHtBYnN0cmFjdE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIGFkZFxuICAgKiBAcGFyYW0ge051bWJlcn0gekluZGV4IC0gekluZGV4IG9mIHRoZSBhZGRlZCBtb2R1bGVcbiAgICovXG4gIGFkZChtb2R1bGUsIHpJbmRleCA9IDApIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX21vZHVsZXMuaW5kZXhPZihtb2R1bGUpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgbW9kdWxlLmJsb2NrID0gdGhpcztcbiAgICAgIG1vZHVsZS56SW5kZXggPSB6SW5kZXg7XG4gICAgICBtb2R1bGUuaW5zdGFsbCh0aGlzKTtcblxuICAgICAgaWYgKHRoaXMuX3RyYWNrTWV0YWRhdGEgJiYgbW9kdWxlLnNldFRyYWNrKVxuICAgICAgICBtb2R1bGUuc2V0VHJhY2sodGhpcy5fdHJhY2tEYXRhLCB0aGlzLl90cmFja01ldGFkYXRhKTtcblxuICAgICAgdGhpcy5fbW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBtb2R1bGUgZnJvbSB0aGUgcGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0Fic3RyYWN0TW9kdWxlfSBtb2R1bGUgLSBNb2R1bGUgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmUobW9kdWxlKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kdWxlKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vZHVsZS51bmluc3RhbGwodGhpcyk7XG4gICAgICBtb2R1bGUuYmxvY2sgPSBudWxsO1xuICAgICAgbW9kdWxlLnpJbmRleCA9IG51bGw7XG5cbiAgICAgIHRoaXMuX21vZHVsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIG9yZGVyIGluIHdoaWNoIG1vZHVsZXMgd2VyZSBhZGRlZCB0byB0aGUgcGxheWVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V4ZWN1dGVDb21tYW5kRm9yd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9tb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5fbW9kdWxlc1tpXTtcblxuICAgICAgaWYgKG1vZHVsZVtjb21tYW5kXSkge1xuICAgICAgICBjb25zdCBuZXh0ID0gbW9kdWxlW2NvbW1hbmRdKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIHJldmVyc2Ugb3JkZXIgaW4gd2hpY2ggbW9kdWxlcyB3ZXJlIGFkZGVkIHRvIHRoZSBwbGF5ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX21vZHVsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuX21vZHVsZXNbaV07XG5cbiAgICAgIGlmIChtb2R1bGVbY29tbWFuZF0pIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG1vZHVsZVtjb21tYW5kXSguLi5hcmdzKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgY2hhbmdlIHRoZSB0cmFjayBvZiB0aGUgcGxheWVyLiBBIHRyYWNrIGlzIGEgSlNPTiBvYmplY3QgdGhhdCBtdXN0XG4gICAqIGZvbGxvdyB0aGUgY29udmVudGlvbiBkZWZpbmVkID8/XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidWZmZXIgKGkuZS4gQXVkaW9CdWZmZXIpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhZGF0YSAtIG1ldGFkYXRhIG9iamVjdFxuICAgKi9cbiAgc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl9zZXRUcmFjayhkYXRhLCBtZXRhZGF0YSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIGNoYW5nZSB0aGUgdHJhY2sgb2YgdGhlIHBsYXllci4gQSB0cmFjayBpcyBhIEpTT04gb2JqZWN0IHRoYXQgbXVzdFxuICAgKiBmb2xsb3cgdGhlIGNvbnZlbnRpb24gZGVmaW5lZCA/P1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVmZmVyIChpLmUuIEF1ZGlvQnVmZmVyKVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YWRhdGEgLSBtZXRhZGF0YSBvYmplY3RcbiAgICogQHBhcmFtIHtCb29sZWFufSByZXNldEhpc3RvcnkgLSByZXNldCBoaXN0b3J5XG4gICAqL1xuICBfc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEsIHJlc2V0SGlzdG9yeSA9IGZhbHNlKSB7XG4gICAgdGhpcy5fdHJhY2tNZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgIHRoaXMuX3RyYWNrRGF0YSA9IGRhdGE7XG4gICAgdGhpcy5wbGF5ZXIuc2V0QnVmZmVyKGRhdGEpOyAvLyBpbnRlcm5hbGx5IHN0b3BzIHRoZSBwbGF5IGNvbnRyb2xcblxuICAgIGlmIChyZXNldEhpc3RvcnkpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkucmVzZXQoKTtcbiAgICAgIHRoaXMuc25hcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzbmFwIGFscmVhZHkgZW1pdHMgdGhlIGV2ZW50Li4uXG4gICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVFMuVVBEQVRFLCB0aGlzLl90cmFja0RhdGEsIHRoaXMuX3RyYWNrTWV0YWRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgdGhpcy51aS50aW1lbGluZS5waXhlbHNQZXJTZWNvbmQgPSB0aGlzLndpZHRoIC8gdGhpcy5kdXJhdGlvbjtcbiAgICB0aGlzLnVpLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2V0VHJhY2snLCBkYXRhLCBtZXRhZGF0YSk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHVuZG8gLyByZWRvXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIHJldmlldyBhbGwgaGlzdG9yeSBhbGdvcml0aG1cbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHNuYXBzaG90IG9mIHRoZSBkYXRhIGFmdGVyIG1vZGlmaWNhdGlvbnMuIFNob3VsZCBiZSB1c2VkIGluXG4gICAqIG1vZHVsZXMgYWZ0ZXIgZWFjaCBzaWduaWZpY2FudCBvcGVyYXRpb24sIGluIG9yZGVyIHRvIGFsbG93IGB1bmRvYCBhbmRcbiAgICogYHJlZG9gIG9wZXJhdGlvbnMuXG4gICAqL1xuICBzbmFwKCkge1xuICAgIHRoaXMuX2hpc3Rvcnkuc25hcCgpO1xuICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UUy5VUERBVEUsIHRoaXMuX3RyYWNrRGF0YSwgdGhpcy5fdHJhY2tNZXRhZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gcHJldmlvdXMgc25hcHNob3QuXG4gICAqL1xuICB1bmRvKCkge1xuICAgIGlmICh0aGlzLl9oaXN0b3J5LnVuZG8oKSkge1xuICAgICAgb2JqZWN0QXNzaWduRGVlcCh0aGlzLl90cmFja01ldGFkYXRhLCB0aGlzLl9oaXN0b3J5LmhlYWQoKSk7XG4gICAgICB0aGlzLl9zZXRUcmFjayh0aGlzLl90cmFja0RhdGEsIHRoaXMuX3RyYWNrTWV0YWRhdGEsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gbmV4dCBzbmFwc2hvdC5cbiAgICovXG4gIHJlZG8oKSB7XG4gICAgaWYgKHRoaXMuX2hpc3RvcnkucmVkbygpKSB7XG4gICAgICBvYmplY3RBc3NpZ25EZWVwKHRoaXMuX3RyYWNrTWV0YWRhdGEsIHRoaXMuX2hpc3RvcnkuaGVhZCgpKTtcbiAgICAgIHRoaXMuX3NldFRyYWNrKHRoaXMuX3RyYWNrRGF0YSwgdGhpcy5fdHJhY2tNZXRhZGF0YSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIGRlZmluZSBpZiBpdCdzIHJlYWxseSB0aGUgcHJvcGVyIHdheSB0byBnby4uLlxuICAgKi9cbiAgZ2V0IG1ldGFkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja01ldGFkYXRhO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHZpc3VhbCBpbnRlcmZhY2VcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSBwbGF5ZXIuIERlZmF1bHRzIHRvIHRoZSB3aWR0aCBvZiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICAgKlxuICAgKiBAbmFtZSB3aWR0aFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMudWkud2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldFdpZHRoJywgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnVpLndpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgcGxheWVyLiBEZWZhdWx0cyB0byB0aGUgaGVpZ2h0IG9mIHRoZSBnaXZlbiBjb250YWluZXIuXG4gICAqXG4gICAqIEBuYW1lIGhlaWdodFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLnVpLmhlaWdodCA9IHZhbHVlO1xuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2V0SGVpZ2h0JywgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy51aS5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogRG9lcyB0aGlzIG1ha2Ugc2VucyA/XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgLy8gZm9yY2UgcmVuZGVyaW5nIGZyb20gb3V0c2lkZSB0aGUgbW9kdWxlIChpLmUuIGlmIHZhbHVlcyBoYXZlIGNoYW5nZWQpXG4gICAgdGhpcy51aS50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5yZW5kZXIoKTtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCgncmVuZGVyJyk7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51aS50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoJ3JlbmRlcicpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGF1ZGlvIGludGVyZmFjZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUG9zaXRpb24gb2YgdGhlIGhlYWQgaW4gdGhlIGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBuYW1lIHBvc2l0aW9uXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBwb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXIucG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogRHVyYXRpb24gb2YgdGhlIGN1cnJlbnQgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQG5hbWUgZHVyYXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXllci5kdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBWb2x1bWUgb2YgdGhlIGF1ZGlvIChpbiBkQikuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkYiAtIHZvbHVtZSBvZiB0aGUgcGxheWVyIGluIGRlY2liZWxzXG4gICAqL1xuICB2b2x1bWUoZGIpIHtcbiAgICBjb25zdCBnYWluID0gZGVjaWJlbFRvTGluZWFyKGRiKVxuICAgIHRoaXMucGxheWVyLmdhaW4gPSBnYWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBwbGF5ZXIuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSB0cnVlLFxuICAgIHRoaXMucGxheWVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3N0YXJ0Jyk7XG5cbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNUQVJUKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcblxuICAgIHRoaXMuX21vbml0b3JQb3NpdGlvblJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX21vbml0b3JQb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgcGxheWVyIChzaG9ydGN1dCBmb3IgYHBhdXNlYCBhbmQgYHNlZWtgIHRvIDApLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZSxcbiAgICB0aGlzLnBsYXllci5zdG9wKCk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3N0b3AnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuU1RPUCk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUGF1c2UgdGhlIHBsYXllci5cbiAgICovXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlLFxuICAgIHRoaXMucGxheWVyLnBhdXNlKCk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3BhdXNlJyk7XG5cbiAgICB0aGlzLmVtaXQoRVZFTlRTLlBBVVNFKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVrIHRvIGEgbmV3IHBvc2l0aW9uIGluIHRoZSBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBOZXcgcG9zaXRpb24uXG4gICAqL1xuICBzZWVrKHBvc2l0aW9uKSB7XG4gICAgcG9zaXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihwb3NpdGlvbiwgdGhpcy5wbGF5ZXIuZHVyYXRpb24pKTtcbiAgICB0aGlzLnBsYXllci5zZWVrKHBvc2l0aW9uKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2VlaycsIHBvc2l0aW9uLCB0aGlzLl9pc1BsYXlpbmcpO1xuICAgIC8vIGFzIHRoZSBwb3NpdGlvbiBjYW4gYmUgbW9kaWZpZWQgYnkgdGhlIFNlZWtDb250cm9sXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TRUVLLCB0aGlzLnBsYXllci5wb3NpdGlvbik7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wbGF5ZXIucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqIFNob3J0Y3V0IGZvciBgdGhpcy5lbWl0KCdwb3NpdGlvbicsIHBvc2l0aW9uLCBkdXJhdGlvbilgXG4gICAqL1xuICBlbWl0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICB0aGlzLmVtaXQoRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHBvc2l0aW9uLCB0aGlzLnBsYXllci5kdXJhdGlvbik7XG4gIH1cblxuICAgIC8qKlxuICAgKiBFbWl0IHRoZSBgZW5kZWRgIGV2ZW50LlxuICAgKi9cbiAgZW5kZWQocG9zaXRpb24pIHtcbiAgICB0aGlzLmVtaXQoRVZFTlRTLkVOREVELCBwb3NpdGlvbik7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogV2F0Y2ggdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBsYXllciBpbiBhIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIGxvb3AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbW9uaXRvclBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLnBsYXllci5ydW5uaW5nKVxuICAgICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uUmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbW9uaXRvclBvc2l0aW9uKTtcblxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wbGF5ZXIucG9zaXRpb247XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnBsYXllci5kdXJhdGlvbjtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbihwb3NpdGlvbik7XG5cbiAgICBpZiAocG9zaXRpb24gPiBkdXJhdGlvbilcbiAgICAgIHJldHVybiB0aGlzLmVuZGVkKHBvc2l0aW9uKTsgLy8gcGxheWVyIHN0b3BzIHRoZSBwbGF5Q29udHJvbFxuXG4gICAgdGhpcy5wbGF5ZXIubW9uaXRvclBvc2l0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxvY2s7XG4iXX0=