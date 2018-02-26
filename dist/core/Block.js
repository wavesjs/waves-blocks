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
      // this._history.snap();
      this.emit(this.EVENTS.UPDATE, this._trackData, this._trackMetadata);
    }

    /**
     * Go to previous snapshot.
     */

  }, {
    key: 'undo',
    value: function undo() {}
    // if (this._history.undo())
    //   this._setTrack(this._trackData, this._history.head(), false);


    /**
     * Go to next snapshot.
     */

  }, {
    key: 'redo',
    value: function redo() {}
    // if (this._history.redo())
    //   this._setTrack(this._trackData, this._history.head(), false);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJkZWNpYmVsVG9MaW5lYXIiLCJ2YWwiLCJNYXRoIiwiZXhwIiwiRVZFTlRTIiwiU1RBUlQiLCJQQVVTRSIsIlNUT1AiLCJTRUVLIiwiRU5ERUQiLCJDVVJSRU5UX1BPU0lUSU9OIiwiVVBEQVRFIiwiVUkiLCIkY29udGFpbmVyIiwic2l6aW5nIiwid2lkdGgiLCJoZWlnaHQiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYm91bmRpbmdDbGllbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic3R5bGUiLCJfd2lkdGgiLCJfaGVpZ2h0IiwidGltZWxpbmUiLCJjb3JlIiwiVGltZWxpbmUiLCJ0cmFjayIsIlRyYWNrIiwiYWRkIiwidXBkYXRlQ29udGFpbmVyIiwidGltZUNvbnRleHQiLCJMYXllclRpbWVDb250ZXh0IiwidmFsdWUiLCJ0cmFja3MiLCJmb3JFYWNoIiwicmVuZGVyIiwidXBkYXRlIiwibWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJ2aXNpYmxlV2lkdGgiLCJkZWZpbml0aW9ucyIsImNvbnRhaW5lciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJwbGF5ZXIiLCJudWxsYWJsZSIsImxpc3QiLCJtaW4iLCJtYXgiLCJJbmZpbml0eSIsIkJsb2NrIiwib3B0aW9ucyIsInBhcmFtcyIsIl90cmFja0RhdGEiLCJfdHJhY2tNZXRhZGF0YSIsIl9saXN0ZW5lcnMiLCJfbW9kdWxlcyIsIl9pc1BsYXlpbmciLCJnZXQiLCJwbGF5ZXJDdG9yIiwiX2hpc3RvcnkiLCJfbW9uaXRvclBvc2l0aW9uIiwiYmluZCIsIl9vbkV2ZW50IiwiYWRkTGlzdGVuZXIiLCJjaGFubmVsIiwiY2FsbGJhY2siLCJoYXMiLCJzZXQiLCJsaXN0ZW5lcnMiLCJkZWxldGUiLCJjbGVhciIsImFyZ3MiLCJ1bmRlZmluZWQiLCJsaXN0ZW5lciIsImUiLCJoaXRMYXllcnMiLCJfZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCIsIm1vZHVsZSIsInpJbmRleCIsImluZGV4IiwiaW5kZXhPZiIsImJsb2NrIiwiaW5zdGFsbCIsInNldFRyYWNrIiwicHVzaCIsInVuaW5zdGFsbCIsInNwbGljZSIsImNvbW1hbmQiLCJpIiwibCIsImxlbmd0aCIsIm5leHQiLCJkYXRhIiwibWV0YWRhdGEiLCJfc2V0VHJhY2siLCJyZXNldEhpc3RvcnkiLCJzZXRCdWZmZXIiLCJyZXNldCIsInNuYXAiLCJlbWl0Iiwic3RvcCIsInBpeGVsc1BlclNlY29uZCIsImR1cmF0aW9uIiwiX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCIsImRiIiwiZ2FpbiIsInN0YXJ0IiwiZW1pdFBvc2l0aW9uIiwicG9zaXRpb24iLCJfbW9uaXRvclBvc2l0aW9uUmFmSWQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJwYXVzZSIsInNlZWsiLCJydW5uaW5nIiwiZW5kZWQiLCJtb25pdG9yUG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0MsZUFBVCxDQUF5QkMsR0FBekIsRUFBOEI7QUFDNUIsU0FBT0MsS0FBS0MsR0FBTCxDQUFTLHNCQUFzQkYsR0FBL0IsQ0FBUCxDQUQ0QixDQUNnQjtBQUM3Qzs7QUFFRCxJQUFNRyxTQUFTO0FBQ2I7QUFDQTtBQUNBQyxTQUFPLE9BSE07QUFJYjtBQUNBO0FBQ0FDLFNBQU8sT0FOTTtBQU9iO0FBQ0E7QUFDQUMsUUFBTSxNQVRPO0FBVWI7QUFDQTtBQUNBQyxRQUFNLE1BWk87QUFhYjtBQUNBO0FBQ0FDLFNBQU8sT0FmTTtBQWdCYjtBQUNBO0FBQ0FDLG9CQUFrQixVQWxCTDs7QUFvQmJDLFVBQVE7QUFwQkssQ0FBZjs7SUF1Qk1DLEU7QUFDSixjQUFZQyxVQUFaLEVBQXdCQyxNQUF4QixFQUFnQ0MsS0FBaEMsRUFBdUNDLE1BQXZDLEVBQStDO0FBQUE7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QSxXQUFXTixRQUFmLEVBQ0UsT0FBTyxLQUFLWSxLQUFMLENBQVdOLFFBQVgsQ0FBUCxDQVRlLENBU2M7O0FBRS9CLFdBQUtqRSxNQUFMLENBQVl3RSxlQUFaO0FBQ0Q7Ozt3QkE1TGM7QUFDYixhQUFPLEtBQUs5RCxjQUFaO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O3NCQU9VeEIsSyxFQUFPO0FBQ2YsV0FBS25DLEVBQUwsQ0FBUWdCLEtBQVIsR0FBZ0JtQixLQUFoQjtBQUNBLFdBQUswRSxzQkFBTCxDQUE0QixVQUE1QixFQUF3QzFFLEtBQXhDO0FBQ0QsSzt3QkFFVztBQUNWLGFBQU8sS0FBS25DLEVBQUwsQ0FBUWdCLEtBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7OztzQkFPV21CLEssRUFBTztBQUNoQixXQUFLbkMsRUFBTCxDQUFRaUIsTUFBUixHQUFpQmtCLEtBQWpCO0FBQ0EsV0FBSzBFLHNCQUFMLENBQTRCLFdBQTVCLEVBQXlDMUUsS0FBekM7QUFDRCxLO3dCQUVZO0FBQ1gsYUFBTyxLQUFLbkMsRUFBTCxDQUFRaUIsTUFBZjtBQUNEOzs7d0JBb0NjO0FBQ2IsYUFBTyxLQUFLZ0MsTUFBTCxDQUFZaUUsUUFBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7d0JBUWU7QUFDYixhQUFPLEtBQUtqRSxNQUFMLENBQVkyRCxRQUFuQjtBQUNEOzs7OztrQkF1R1lyRCxLIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgcGFyYW1ldGVycyBmcm9tICdAaXJjYW0vcGFyYW1ldGVycyc7XG5pbXBvcnQgQWJzdHJhY3RQbGF5ZXIgZnJvbSAnLi9BYnN0cmFjdFBsYXllcic7XG5pbXBvcnQgSGlzdG9yeSBmcm9tICcuLi91dGlscy9IaXN0b3J5JztcblxuZnVuY3Rpb24gZGVjaWJlbFRvTGluZWFyKHZhbCkge1xuICByZXR1cm4gTWF0aC5leHAoMC4xMTUxMjkyNTQ2NDk3MDIyOSAqIHZhbCk7IC8vIHBvdygxMCwgdmFsIC8gMjApXG59O1xuXG5jb25zdCBFVkVOVFMgPSB7XG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb25cbiAgU1RBUlQ6ICdzdGFydCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb25cbiAgUEFVU0U6ICdwYXVzZScsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb25cbiAgU1RPUDogJ3N0b3AnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHRhcmdldFBvc2l0aW9uXG4gIFNFRUs6ICdzZWVrJyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBlbmRUaW1lXG4gIEVOREVEOiAnZW5kZWQnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIGN1cnJlbnRQb3NpdGlvblxuICBDVVJSRU5UX1BPU0lUSU9OOiAncG9zaXRpb24nLFxuXG4gIFVQREFURTogJ3VwZGF0ZScsXG59O1xuXG5jbGFzcyBVSSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHNpemluZywgd2lkdGgsIGhlaWdodCkge1xuICAgICRjb250YWluZXIgPSAoJGNvbnRhaW5lciBpbnN0YW5jZW9mIEVsZW1lbnQpID9cbiAgICAgICRjb250YWluZXIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuXG4gICAgc3dpdGNoIChzaXppbmcpIHtcbiAgICAgIGNhc2UgJ2F1dG8nOlxuICAgICAgICBjb25zdCBib3VuZGluZ0NsaWVudFJlY3QgPSAkY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB3aWR0aCA9IGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aDtcbiAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdDbGllbnRSZWN0LmhlaWdodDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21hbnVhbCc6XG4gICAgICAgICRjb250YWluZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICRjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy4kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcbiAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgIC8vIGFyYml0cmFyeSBgcGl4ZWxzUGVyU2Vjb25kYCB2YWx1ZSB0byB1cGRhdGUgd2hlbiBhIHRyYWNrIGlzIHNldFxuICAgIHRoaXMudGltZWxpbmUgPSBuZXcgdWkuY29yZS5UaW1lbGluZSgxLCB3aWR0aCk7XG4gICAgdGhpcy50cmFjayA9IG5ldyB1aS5jb3JlLlRyYWNrKCRjb250YWluZXIsIGhlaWdodCk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLmFkZCh0aGlzLnRyYWNrLCAnZGVmYXVsdCcpO1xuICAgIHRoaXMudHJhY2sudXBkYXRlQ29udGFpbmVyKCk7IC8vIGluaXQgdHJhY2sgRE9NIHRyZWVcblxuICAgIC8vIHRpbWUgY29udGV4dCB0aGF0IHNob3VsZCBiZSBzaGFyZWQgYnkgYWxsIChtb3N0KSBtaXhpbnMgLyB1aSBsYXllcnNcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IHVpLmNvcmUuTGF5ZXJUaW1lQ29udGV4dCh0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0KTtcbiAgfVxuXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgICB0aGlzLiRjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gYCR7dmFsdWV9cHhgO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xuICAgIHRoaXMuJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3ZhbHVlfXB4YDtcblxuICAgIHRoaXMudGltZWxpbmUubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudGltZWxpbmUudmlzaWJsZVdpZHRoID0gdmFsdWU7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb250YWluZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ3NzIFNlbGVjdG9yIG9yIERPTSBFbGVtZW50IGhvc3RpbmcgdGhlIGJsb2NrJ1xuICAgIH1cbiAgfSxcbiAgcGxheWVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogQWJzdHJhY3RQbGF5ZXIsIC8vIGlmIHdlIG9ubHkgbmVlZCB0aGUgdWkgcGFydCwgZGVmYXVsdCB0byBkdW1teSBwbGF5ZXJcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSwgLy8gc3VyZT8gd2h5IG5vdCBiZWluZyBhYmxlIHRvIGNoYW5nZSBkeW5hbWljYWxseT9cbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ0NvbnN0cnVjdG9yIG9mIHRoZSBwbGF5ZXIgdG8gYmUgdXNlZCBpbiB0aGUgYmxvY2snLFxuICAgIH0sXG4gIH0sXG4gIHNpemluZzoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ2F1dG8nLCAnbWFudWFsJ10sXG4gICAgZGVmYXVsdDogJ2F1dG8nLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICB3aWR0aDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9XG59XG5cbi8qKlxuICogQmFzZSBhdWRpby12aXN1YWwgcGxheWVyIHRvIGJlIGRlY29yYXRlZCB3aXRoIGFkZGl0aW9ubmFsIG1vZHVsZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gKG5vIG9wdGlvbnMgZm9yIG5vdylcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IFtvcHRpb25zLmNvbnRhaW5lcl0gLSBDc3MgU2VsZWN0b3Igb3IgRE9NIEVsZW1lbnQgdGhhdCB3aWxsXG4gKiAgaG9zdCB0aGUgcGxheWVyIGFuZCBhZGRpdGlvbm5hbCBtb2R1bGVzXG4gKiBAcGFyYW0ge0Fic3RyYWN0UGxheWVyfSAtIFRoZSBwbGF5ZXIgdG8gYmUgdXNlZCBieSB0aGUgYmxvY2suXG4gKiBAcGFyYW0geydhdXRvJ3wnbWFudWFsJ30gW29wdGlvbnMuc2l6aW5nPSdhdXRvJ10gLSBIb3cgdGhlIHNpemUgb2YgdGhlIGJsb2NrXG4gKiAgc2hvdWxkIGJlIGRlZmluZWQuIElmICdhdXRvJywgdGhlIGJsb2NrIGFkanVzdHMgdG8gdGhlIHNpemUgb2YgdGhlIGNvbnRhaW5lci5cbiAqICBJZiAnbWFudWFsJywgdXNlIGB3aWR0aGAgYW5kIGBoZWlnaHRgIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9bnVsbF0gLSBXaWR0aCBvZiB0aGUgYmxvY2sgaWYgc2l6ZSBpcyAnbWFudWFsJy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9bnVsbF0gLSBIZWlnaHQgb2YgdGhlIGJsb2NrIGlmIHNpemUgaXMgJ21hbnVhbCcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogY29uc3QgJGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250YWluZXInKTtcbiAqIGNvbnN0IGRlZmF1bHRXaWR0aCA9IDEwMDA7XG4gKiBjb25zdCBkZWZhdWx0SGVpZ2h0ID0gMTAwMDtcbiAqIGNvbnN0IGJsb2NrID0gbmV3IGJsb2Nrcy5jb3JlLkJsb2NrKHtcbiAqICAgcGxheWVyOiBhYmMucGxheWVyLlNlZWtQbGF5ZXIsXG4gKiAgIGNvbnRhaW5lcjogJGNvbnRhaW5lcixcbiAqICAgc2l6aW5nOiAnbWFudWFsJywgLy8gaWYgJ2F1dG8nLCBhZGp1c3QgdG8gZmlsbCAkY29udGFpbmVyIHNpemVcbiAqICAgd2lkdGg6IGRlZmF1bHRXaWR0aCxcbiAqICAgaGVpZ2h0OiBkZWZhdWx0SGVpZ2h0LFxuICogfSk7XG4gKlxuICogY29uc3Qgd2F2ZWZvcm1Nb2R1bGUgPSBuZXcgYmxvY2tzLm1vZHVsZS5XYXZlZm9ybU1vZHVsZSgpO1xuICogY29uc3QgY3Vyc29yTW9kdWxlID0gbmV3IGJsb2Nrcy5tb2R1bGUuQ3Vyc29yTW9kdWxlKCk7XG4gKlxuICogYmxvY2suYWRkKHNpbXBsZVdhdmVmb3JtTW9kdWxlKTtcbiAqIGJsb2NrLmFkZChjdXJzb3JNb2R1bGUpO1xuICogYGBgXG4gKi9cbmNsYXNzIEJsb2NrIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLkVWRU5UUyA9IEVWRU5UUztcblxuICAgIHRoaXMuX3RyYWNrRGF0YSA9IG51bGw7XG4gICAgdGhpcy5fdHJhY2tNZXRhZGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fbW9kdWxlcyA9IFtdO1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHRoaXMucGFyYW1zLmdldCgnY29udGFpbmVyJyk7XG4gICAgY29uc3Qgc2l6aW5nID0gdGhpcy5wYXJhbXMuZ2V0KCdzaXppbmcnKTtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmdldCgnd2lkdGgnKTtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2hlaWdodCcpO1xuICAgIHRoaXMudWkgPSBuZXcgVUkoJGNvbnRhaW5lciwgc2l6aW5nLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHBsYXllckN0b3IgPSB0aGlzLnBhcmFtcy5nZXQoJ3BsYXllcicpO1xuICAgIHRoaXMucGxheWVyID0gbmV3IHBsYXllckN0b3IodGhpcyk7XG5cbiAgICB0aGlzLl9oaXN0b3J5ID0gbmV3IEhpc3RvcnkodGhpcywgJ190cmFja01ldGFkYXRhJywgMjApO1xuXG4gICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uID0gdGhpcy5fbW9uaXRvclBvc2l0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcblxuICAgIC8vIGxpc3RlbiBldmVudHMgZnJvbSB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXNcbiAgICB0aGlzLnVpLnRpbWVsaW5lLmFkZExpc3RlbmVyKCdldmVudCcsIHRoaXMuX29uRXZlbnQpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGV2ZW50IHN5c3RlbVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gYSBzcGVjaWZpYyBjaGFubmVsIG9mIHRoZSBwbGF5ZXIuXG4gICAqIEF2YWlsYWJsZSBldmVudHMgYXJlOlxuICAgKiAtIGAnc3RhcnQnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzdGFydHNcbiAgICogLSBgJ3BhdXNlJ2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgaXMgcGF1c2VkXG4gICAqIC0gYCdzdG9wJ2AgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIGlzIHN0b3BwZWQgKHBhdXNlKCkgKyBzZWVrKDApKVxuICAgKiAtIGAnc2VlaydgIDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzZWVrIHRvIGEgbmV3IHBvc2l0aW9uXG4gICAqIC0gYCdlbmRlZCdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHN0b3BzIGF0IHRoZSBlbmQgb2YgdGhlIGZpbGUgKG9yIGF0XG4gICAqICAgICAgICAgICAgICB0aGUgZW5kIG9mIHRoZSBsYXN0IHNlZ21lbnQpLiBUaGUgY2FsbGJhY2sgaXMgZXhlY3V0ZWQgd2l0aCB0aGVcbiAgICogICAgICAgICAgICAgIHN0b3AgcG9zaXRpb24uXG4gICAqIC0gYCdwb3NpdGlvbidgOiB0cmlnZ2VyZWQgYXQgZWFjaCByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSB3aXRoIHRoZSBjdXJyZW50XG4gICAqICAgICAgICAgICAgICBwb3NpdGlvbiBhbmQgZHVyYXRpb24gb2YgdGhlIGF1ZGlvIGZpbGUuIFRyaWdnZXIgb25seSB3aGVuXG4gICAqICAgICAgICAgICAgICB0aGUgcGxheWVyIGlzIHBsYXlpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICovXG4gIGFkZExpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChjaGFubmVsLCBuZXcgU2V0KCkpO1xuXG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICBsaXN0ZW5lcnMuYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGEgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgc3Vic2NpYmVycyBmcm9tIGEgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsLlxuICAgKi9cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKGNoYW5uZWwpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzLmhhcyhjaGFubmVsKSkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICAgIGxpc3RlbmVycy5jbGVhcigpO1xuXG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGNoYW5uZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBzdWJzY3JpYmVycyBvZiBhIGV2ZW50IHdpdGggZ2l2ZW4gYXJndW1lbnRzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcblxuICAgIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZClcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWluIGV2ZW50IGxpc3RlbmVyIG9mIHRoZSB3YXZlcy11aSB0aW1lbGluZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoJ29uRXZlbnQnLCBlLCBoaXRMYXllcnMpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIG1vZHVsZSBjaGFpblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQWRkIGEgbW9kdWxlIHRvIHRoZSBwbGF5ZXIuIEEgbW9kdWxlIGlzIGRlZmluZWQgYXMgYSBzcGVjaWZpYyBzZXRcbiAgICogb2YgZnVuY3Rpb25uYWxpdHkgYW5kIHZpc3VhbGl6YXRpb25zIG9uIHRvcCBvZiB0aGUgcGxheWVyLlxuICAgKiBNb2R1bGUgY2FuIGltcGxlbWVudCBmZWF0dXJlcyBzdWNoIGFzIHdhdmVmb3JtLCBtb3ZpbmcgY3Vyc29yLCBldGMuXG4gICAqXG4gICAqIEBwYXJhbSB7QWJzdHJhY3RNb2R1bGV9IG1vZHVsZSAtIE1vZHVsZSB0byBhZGRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHpJbmRleCAtIHpJbmRleCBvZiB0aGUgYWRkZWQgbW9kdWxlXG4gICAqL1xuICBhZGQobW9kdWxlLCB6SW5kZXggPSAwKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kdWxlKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIG1vZHVsZS5ibG9jayA9IHRoaXM7XG4gICAgICBtb2R1bGUuekluZGV4ID0gekluZGV4O1xuICAgICAgbW9kdWxlLmluc3RhbGwodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLl90cmFja01ldGFkYXRhICYmIG1vZHVsZS5zZXRUcmFjaylcbiAgICAgICAgbW9kdWxlLnNldFRyYWNrKHRoaXMuX3RyYWNrRGF0YSwgdGhpcy5fdHJhY2tNZXRhZGF0YSk7XG5cbiAgICAgIHRoaXMuX21vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbW9kdWxlIGZyb20gdGhlIHBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtBYnN0cmFjdE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlKG1vZHVsZSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbW9kdWxlcy5pbmRleE9mKG1vZHVsZSk7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBtb2R1bGUudW5pbnN0YWxsKHRoaXMpO1xuICAgICAgbW9kdWxlLmJsb2NrID0gbnVsbDtcbiAgICAgIG1vZHVsZS56SW5kZXggPSBudWxsO1xuXG4gICAgICB0aGlzLl9tb2R1bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY29tbWFuZCBvbiBlYWNoIG1vZHVsZSB0aGF0IGltcGxlbWVudHMgdGhlIG1ldGhvZC4gVGhlIGNvbW1hbmRcbiAgICogYXJlIGV4ZWN1dGVkIGluIHRoZSBvcmRlciBpbiB3aGljaCBtb2R1bGVzIHdlcmUgYWRkZWQgdG8gdGhlIHBsYXllci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9leGVjdXRlQ29tbWFuZEZvcndhcmQoY29tbWFuZCwgLi4uYXJncykge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5fbW9kdWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuX21vZHVsZXNbaV07XG5cbiAgICAgIGlmIChtb2R1bGVbY29tbWFuZF0pIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG1vZHVsZVtjb21tYW5kXSguLi5hcmdzKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY29tbWFuZCBvbiBlYWNoIG1vZHVsZSB0aGF0IGltcGxlbWVudHMgdGhlIG1ldGhvZC4gVGhlIGNvbW1hbmRcbiAgICogYXJlIGV4ZWN1dGVkIGluIHRoZSByZXZlcnNlIG9yZGVyIGluIHdoaWNoIG1vZHVsZXMgd2VyZSBhZGRlZCB0byB0aGUgcGxheWVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoY29tbWFuZCwgLi4uYXJncykge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9tb2R1bGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtb2R1bGUgPSB0aGlzLl9tb2R1bGVzW2ldO1xuXG4gICAgICBpZiAobW9kdWxlW2NvbW1hbmRdKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBtb2R1bGVbY29tbWFuZF0oLi4uYXJncyk7XG5cbiAgICAgICAgaWYgKG5leHQgPT09IGZhbHNlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIGNoYW5nZSB0aGUgdHJhY2sgb2YgdGhlIHBsYXllci4gQSB0cmFjayBpcyBhIEpTT04gb2JqZWN0IHRoYXQgbXVzdFxuICAgKiBmb2xsb3cgdGhlIGNvbnZlbnRpb24gZGVmaW5lZCA/P1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVmZmVyIChpLmUuIEF1ZGlvQnVmZmVyKVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YWRhdGEgLSBtZXRhZGF0YSBvYmplY3RcbiAgICovXG4gIHNldFRyYWNrKGRhdGEsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy5fc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBvciBjaGFuZ2UgdGhlIHRyYWNrIG9mIHRoZSBwbGF5ZXIuIEEgdHJhY2sgaXMgYSBKU09OIG9iamVjdCB0aGF0IG11c3RcbiAgICogZm9sbG93IHRoZSBjb252ZW50aW9uIGRlZmluZWQgPz9cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1ZmZlciAoaS5lLiBBdWRpb0J1ZmZlcilcbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gbWV0YWRhdGEgb2JqZWN0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVzZXRIaXN0b3J5IC0gcmVzZXQgaGlzdG9yeVxuICAgKi9cbiAgX3NldFRyYWNrKGRhdGEsIG1ldGFkYXRhLCByZXNldEhpc3RvcnkgPSBmYWxzZSkge1xuICAgIHRoaXMuX3RyYWNrTWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICB0aGlzLl90cmFja0RhdGEgPSBkYXRhO1xuICAgIHRoaXMucGxheWVyLnNldEJ1ZmZlcihkYXRhKTsgLy8gaW50ZXJuYWxseSBzdG9wcyB0aGUgcGxheSBjb250cm9sXG5cbiAgICBpZiAocmVzZXRIaXN0b3J5KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LnJlc2V0KCk7XG4gICAgICB0aGlzLnNuYXAoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc25hcCBhbHJlYWR5IGVtaXRzIHRoZSBldmVudC4uLlxuICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRTLlVQREFURSwgdGhpcy5fdHJhY2tEYXRhLCB0aGlzLl90cmFja01ldGFkYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3AoKTtcblxuICAgIHRoaXMudWkudGltZWxpbmUucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy53aWR0aCAvIHRoaXMuZHVyYXRpb247XG4gICAgdGhpcy51aS50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldFRyYWNrJywgZGF0YSwgbWV0YWRhdGEpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB1bmRvIC8gcmVkb1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHRvZG8gLSByZXZpZXcgYWxsIGhpc3RvcnkgYWxnb3JpdGhtXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzbmFwc2hvdCBvZiB0aGUgZGF0YSBhZnRlciBtb2RpZmljYXRpb25zLiBTaG91bGQgYmUgdXNlZCBpblxuICAgKiBtb2R1bGVzIGFmdGVyIGVhY2ggc2lnbmlmaWNhbnQgb3BlcmF0aW9uLCBpbiBvcmRlciB0byBhbGxvdyBgdW5kb2AgYW5kXG4gICAqIGByZWRvYCBvcGVyYXRpb25zLlxuICAgKi9cbiAgc25hcCgpIHtcbiAgICAvLyB0aGlzLl9oaXN0b3J5LnNuYXAoKTtcbiAgICB0aGlzLmVtaXQodGhpcy5FVkVOVFMuVVBEQVRFLCB0aGlzLl90cmFja0RhdGEsIHRoaXMuX3RyYWNrTWV0YWRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvIHRvIHByZXZpb3VzIHNuYXBzaG90LlxuICAgKi9cbiAgdW5kbygpIHtcbiAgICAvLyBpZiAodGhpcy5faGlzdG9yeS51bmRvKCkpXG4gICAgLy8gICB0aGlzLl9zZXRUcmFjayh0aGlzLl90cmFja0RhdGEsIHRoaXMuX2hpc3RvcnkuaGVhZCgpLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gbmV4dCBzbmFwc2hvdC5cbiAgICovXG4gIHJlZG8oKSB7XG4gICAgLy8gaWYgKHRoaXMuX2hpc3RvcnkucmVkbygpKVxuICAgIC8vICAgdGhpcy5fc2V0VHJhY2sodGhpcy5fdHJhY2tEYXRhLCB0aGlzLl9oaXN0b3J5LmhlYWQoKSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gZGVmaW5lIGlmIGl0J3MgcmVhbGx5IHRoZSBwcm9wZXIgd2F5IHRvIGdvLi4uXG4gICAqL1xuICBnZXQgbWV0YWRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrTWV0YWRhdGE7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gdmlzdWFsIGludGVyZmFjZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHBsYXllci4gRGVmYXVsdHMgdG8gdGhlIHdpZHRoIG9mIHRoZSBnaXZlbiBjb250YWluZXIuXG4gICAqXG4gICAqIEBuYW1lIHdpZHRoXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy51aS53aWR0aCA9IHZhbHVlO1xuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2V0V2lkdGgnLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudWkud2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSBwbGF5ZXIuIERlZmF1bHRzIHRvIHRoZSBoZWlnaHQgb2YgdGhlIGdpdmVuIGNvbnRhaW5lci5cbiAgICpcbiAgICogQG5hbWUgaGVpZ2h0XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMudWkuaGVpZ2h0ID0gdmFsdWU7XG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZXRIZWlnaHQnLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLnVpLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb2VzIHRoaXMgbWFrZSBzZW5zID9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICAvLyBmb3JjZSByZW5kZXJpbmcgZnJvbSBvdXRzaWRlIHRoZSBtb2R1bGUgKGkuZS4gaWYgdmFsdWVzIGhhdmUgY2hhbmdlZClcbiAgICB0aGlzLnVpLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKCdyZW5kZXInKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVpLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCgncmVuZGVyJyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gYXVkaW8gaW50ZXJmYWNlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgaGVhZCBpbiB0aGUgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQG5hbWUgcG9zaXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXllci5wb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEdXJhdGlvbiBvZiB0aGUgY3VycmVudCBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAbmFtZSBkdXJhdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyLmR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFZvbHVtZSBvZiB0aGUgYXVkaW8gKGluIGRCKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRiIC0gdm9sdW1lIG9mIHRoZSBwbGF5ZXIgaW4gZGVjaWJlbHNcbiAgICovXG4gIHZvbHVtZShkYikge1xuICAgIGNvbnN0IGdhaW4gPSBkZWNpYmVsVG9MaW5lYXIoZGIpXG4gICAgdGhpcy5wbGF5ZXIuZ2FpbiA9IGdhaW47XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHBsYXllci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IHRydWUsXG4gICAgdGhpcy5wbGF5ZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc3RhcnQnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuU1RBUlQpO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuXG4gICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uUmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbW9uaXRvclBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBwbGF5ZXIgKHNob3J0Y3V0IGZvciBgcGF1c2VgIGFuZCBgc2Vla2AgdG8gMCkuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlLFxuICAgIHRoaXMucGxheWVyLnN0b3AoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc3RvcCcpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TVE9QKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZSB0aGUgcGxheWVyLlxuICAgKi9cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2UsXG4gICAgdGhpcy5wbGF5ZXIucGF1c2UoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgncGF1c2UnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuUEFVU0UpO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZWsgdG8gYSBuZXcgcG9zaXRpb24gaW4gdGhlIGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIE5ldyBwb3NpdGlvbi5cbiAgICovXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICBwb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKHBvc2l0aW9uLCB0aGlzLnBsYXllci5kdXJhdGlvbikpO1xuICAgIHRoaXMucGxheWVyLnNlZWsocG9zaXRpb24pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZWVrJywgcG9zaXRpb24sIHRoaXMuX2lzUGxheWluZyk7XG4gICAgLy8gYXMgdGhlIHBvc2l0aW9uIGNhbiBiZSBtb2RpZmllZCBieSB0aGUgU2Vla0NvbnRyb2xcbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNFRUssIHRoaXMucGxheWVyLnBvc2l0aW9uKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBsYXllci5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogRW1pdCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICogU2hvcnRjdXQgZm9yIGB0aGlzLmVtaXQoJ3Bvc2l0aW9uJywgcG9zaXRpb24sIGR1cmF0aW9uKWBcbiAgICovXG4gIGVtaXRQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIHRoaXMuZW1pdChFVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgcG9zaXRpb24sIHRoaXMucGxheWVyLmR1cmF0aW9uKTtcbiAgfVxuXG4gICAgLyoqXG4gICAqIEVtaXQgdGhlIGBlbmRlZGAgZXZlbnQuXG4gICAqL1xuICBlbmRlZChwb3NpdGlvbikge1xuICAgIHRoaXMuZW1pdChFVkVOVFMuRU5ERUQsIHBvc2l0aW9uKTtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYXRjaCB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcGxheWVyIGluIGEgcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgbG9vcC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9tb25pdG9yUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMucGxheWVyLnJ1bm5pbmcpXG4gICAgICB0aGlzLl9tb25pdG9yUG9zaXRpb25SYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9tb25pdG9yUG9zaXRpb24pO1xuXG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBsYXllci5wb3NpdGlvbjtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGxheWVyLmR1cmF0aW9uO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHBvc2l0aW9uKTtcblxuICAgIGlmIChwb3NpdGlvbiA+IGR1cmF0aW9uKVxuICAgICAgcmV0dXJuIHRoaXMuZW5kZWQocG9zaXRpb24pOyAvLyBwbGF5ZXIgc3RvcHMgdGhlIHBsYXlDb250cm9sXG5cbiAgICB0aGlzLnBsYXllci5tb25pdG9yUG9zaXRpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCbG9jaztcbiJdfQ==