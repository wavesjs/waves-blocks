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

var _History = require('../utils/History');

var _History2 = _interopRequireDefault(_History);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import AbstractModule from './AbstractModule';
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
    default: null,
    nullable: true,
    constant: true,
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
     * Volume of the audio (in db).
     *
     * @param {Number} db - volume of the player in decibels
     */
    value: function volume(db) {
      this.player.volume(db);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJsb2NrLmpzIl0sIm5hbWVzIjpbInVpIiwiRVZFTlRTIiwiU1RBUlQiLCJQQVVTRSIsIlNUT1AiLCJTRUVLIiwiRU5ERUQiLCJDVVJSRU5UX1BPU0lUSU9OIiwiVVBEQVRFIiwiVUkiLCIkY29udGFpbmVyIiwic2l6aW5nIiwid2lkdGgiLCJoZWlnaHQiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYm91bmRpbmdDbGllbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic3R5bGUiLCJfd2lkdGgiLCJfaGVpZ2h0IiwidGltZWxpbmUiLCJjb3JlIiwiVGltZWxpbmUiLCJ0cmFjayIsIlRyYWNrIiwiYWRkIiwidXBkYXRlQ29udGFpbmVyIiwidGltZUNvbnRleHQiLCJMYXllclRpbWVDb250ZXh0IiwidmFsdWUiLCJ0cmFja3MiLCJmb3JFYWNoIiwicmVuZGVyIiwidXBkYXRlIiwibWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJ2aXNpYmxlV2lkdGgiLCJkZWZpbml0aW9ucyIsImNvbnRhaW5lciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJwbGF5ZXIiLCJudWxsYWJsZSIsImxpc3QiLCJtaW4iLCJtYXgiLCJJbmZpbml0eSIsIkJsb2NrIiwib3B0aW9ucyIsInBhcmFtcyIsInRyYWNrRGF0YSIsInRyYWNrTWV0YWRhdGEiLCJfbGlzdGVuZXJzIiwiX21vZHVsZXMiLCJfaXNQbGF5aW5nIiwiZ2V0IiwicGxheWVyQ3RvciIsIl9oaXN0b3J5IiwiX21vbml0b3JQb3NpdGlvbiIsImJpbmQiLCJfb25FdmVudCIsImFkZExpc3RlbmVyIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0IiwibGlzdGVuZXJzIiwiZGVsZXRlIiwiY2xlYXIiLCJhcmdzIiwidW5kZWZpbmVkIiwibGlzdGVuZXIiLCJlIiwiaGl0TGF5ZXJzIiwiX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQiLCJtb2R1bGUiLCJ6SW5kZXgiLCJpbmRleCIsImluZGV4T2YiLCJibG9jayIsImluc3RhbGwiLCJzZXRUcmFjayIsInB1c2giLCJ1bmluc3RhbGwiLCJzcGxpY2UiLCJjb21tYW5kIiwiaSIsImwiLCJsZW5ndGgiLCJuZXh0IiwiZGF0YSIsIm1ldGFkYXRhIiwiX3NldFRyYWNrIiwicmVzZXRIaXN0b3J5Iiwic2V0QnVmZmVyIiwicmVzZXQiLCJzbmFwIiwiZW1pdCIsInN0b3AiLCJwaXhlbHNQZXJTZWNvbmQiLCJkdXJhdGlvbiIsIl9leGVjdXRlQ29tbWFuZEZvcndhcmQiLCJ1bmRvIiwiaGVhZCIsInJlZG8iLCJkYiIsInZvbHVtZSIsInN0YXJ0IiwiZW1pdFBvc2l0aW9uIiwicG9zaXRpb24iLCJfbW9uaXRvclBvc2l0aW9uUmFmSWQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJwYXVzZSIsIk1hdGgiLCJzZWVrIiwicnVubmluZyIsImVuZGVkIiwibW9uaXRvclBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBRVo7Ozs7QUFDQTs7Ozs7Ozs7QUFGQTtBQUlBLElBQU1DLFNBQVM7QUFDYjtBQUNBO0FBQ0FDLFNBQU8sT0FITTtBQUliO0FBQ0E7QUFDQUMsU0FBTyxPQU5NO0FBT2I7QUFDQTtBQUNBQyxRQUFNLE1BVE87QUFVYjtBQUNBO0FBQ0FDLFFBQU0sTUFaTztBQWFiO0FBQ0E7QUFDQUMsU0FBTyxPQWZNO0FBZ0JiO0FBQ0E7QUFDQUMsb0JBQWtCLFVBbEJMOztBQW9CYkMsVUFBUTtBQXBCSyxDQUFmOztJQXVCTUMsRTtBQUNKLGNBQVlDLFVBQVosRUFBd0JDLE1BQXhCLEVBQWdDQyxLQUFoQyxFQUF1Q0MsTUFBdkMsRUFBK0M7QUFBQTs7QUFDN0NILGlCQUFjQSxzQkFBc0JJLE9BQXZCLEdBQ1hKLFVBRFcsR0FDRUssU0FBU0MsYUFBVCxDQUF1Qk4sVUFBdkIsQ0FEZjs7QUFHQSxZQUFRQyxNQUFSO0FBQ0UsV0FBSyxNQUFMO0FBQ0UsWUFB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QyxRQUFsQjs7QUFFQSxVQUFJQSxXQUFXVCxRQUFmLEVBQ0UsT0FBTyxLQUFLZ0IsS0FBTCxDQUFXUCxRQUFYLENBQVAsQ0FUZSxDQVNjOztBQUUvQixXQUFLcEUsTUFBTCxDQUFZNEUsZUFBWjtBQUNEOzs7c0JBcEtTMUYsSyxFQUFPO0FBQ2YsV0FBSy9CLEVBQUwsQ0FBUVksS0FBUixHQUFnQm1CLEtBQWhCO0FBQ0EsV0FBSzBFLHNCQUFMLENBQTRCLFVBQTVCLEVBQXdDMUUsS0FBeEM7QUFDRCxLO3dCQUVXO0FBQ1YsYUFBTyxLQUFLL0IsRUFBTCxDQUFRWSxLQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7c0JBT1dtQixLLEVBQU87QUFDaEIsV0FBSy9CLEVBQUwsQ0FBUWEsTUFBUixHQUFpQmtCLEtBQWpCO0FBQ0EsV0FBSzBFLHNCQUFMLENBQTRCLFdBQTVCLEVBQXlDMUUsS0FBekM7QUFDRCxLO3dCQUVZO0FBQ1gsYUFBTyxLQUFLL0IsRUFBTCxDQUFRYSxNQUFmO0FBQ0Q7Ozt3QkE0QmM7QUFDYixhQUFPLEtBQUtnQyxNQUFMLENBQVlvRSxRQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozt3QkFRZTtBQUNiLGFBQU8sS0FBS3BFLE1BQUwsQ0FBWTJELFFBQW5CO0FBQ0Q7Ozs7O2tCQXNHWXJELEsiLCJmaWxlIjoiQmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG4vLyBpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgcGFyYW1ldGVycyBmcm9tICdAaXJjYW0vcGFyYW1ldGVycyc7XG5pbXBvcnQgSGlzdG9yeSBmcm9tICcuLi91dGlscy9IaXN0b3J5JztcblxuY29uc3QgRVZFTlRTID0ge1xuICAvLyBAYXJndW1lbnRzXG4gIC8vIHBvc2l0aW9uXG4gIFNUQVJUOiAnc3RhcnQnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHBvc2l0aW9uXG4gIFBBVVNFOiAncGF1c2UnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHBvc2l0aW9uXG4gIFNUT1A6ICdzdG9wJyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyB0YXJnZXRQb3NpdGlvblxuICBTRUVLOiAnc2VlaycsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gZW5kVGltZVxuICBFTkRFRDogJ2VuZGVkJyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBjdXJyZW50UG9zaXRpb25cbiAgQ1VSUkVOVF9QT1NJVElPTjogJ3Bvc2l0aW9uJyxcblxuICBVUERBVEU6ICd1cGRhdGUnLFxufTtcblxuY2xhc3MgVUkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBzaXppbmcsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAkY29udGFpbmVyID0gKCRjb250YWluZXIgaW5zdGFuY2VvZiBFbGVtZW50KSA/XG4gICAgICAkY29udGFpbmVyIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigkY29udGFpbmVyKTtcblxuICAgIHN3aXRjaCAoc2l6aW5nKSB7XG4gICAgICBjYXNlICdhdXRvJzpcbiAgICAgICAgY29uc3QgYm91bmRpbmdDbGllbnRSZWN0ID0gJGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgd2lkdGggPSBib3VuZGluZ0NsaWVudFJlY3Qud2lkdGg7XG4gICAgICAgIGhlaWdodCA9IGJvdW5kaW5nQ2xpZW50UmVjdC5oZWlnaHQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtYW51YWwnOlxuICAgICAgICAkY29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgICAgICAkY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG4gICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvLyBhcmJpdHJhcnkgYHBpeGVsc1BlclNlY29uZGAgdmFsdWUgdG8gdXBkYXRlIHdoZW4gYSB0cmFjayBpcyBzZXRcbiAgICB0aGlzLnRpbWVsaW5lID0gbmV3IHVpLmNvcmUuVGltZWxpbmUoMSwgd2lkdGgpO1xuICAgIHRoaXMudHJhY2sgPSBuZXcgdWkuY29yZS5UcmFjaygkY29udGFpbmVyLCBoZWlnaHQpO1xuXG4gICAgdGhpcy50aW1lbGluZS5hZGQodGhpcy50cmFjaywgJ2RlZmF1bHQnKTtcbiAgICB0aGlzLnRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpOyAvLyBpbml0IHRyYWNrIERPTSB0cmVlXG5cbiAgICAvLyB0aW1lIGNvbnRleHQgdGhhdCBzaG91bGQgYmUgc2hhcmVkIGJ5IGFsbCAobW9zdCkgbWl4aW5zIC8gdWkgbGF5ZXJzXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG5ldyB1aS5jb3JlLkxheWVyVGltZUNvbnRleHQodGhpcy50aW1lbGluZS50aW1lQ29udGV4dCk7XG4gIH1cblxuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG4gICAgdGhpcy4kY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke3ZhbHVlfXB4YDtcblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2suaGVpZ2h0ID0gdmFsdWU7XG4gICAgICB0cmFjay5yZW5kZXIoKTtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICB9XG5cbiAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLiRjb250YWluZXIuc3R5bGUud2lkdGggPSBgJHt2YWx1ZX1weGA7XG5cbiAgICB0aGlzLnRpbWVsaW5lLm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnRpbWVsaW5lLnZpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5yZW5kZXIoKTtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgfVxufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ0NzcyBTZWxlY3RvciBvciBET00gRWxlbWVudCBob3N0aW5nIHRoZSBibG9jaydcbiAgICB9XG4gIH0sXG4gIHBsYXllcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDb25zdHJ1Y3RvciBvZiB0aGUgcGxheWVyIHRvIGJlIHVzZWQgaW4gdGhlIGJsb2NrJyxcbiAgICB9LFxuICB9LFxuICBzaXppbmc6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWydhdXRvJywgJ21hbnVhbCddLFxuICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgd2lkdGg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGhlaWdodDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgYXVkaW8tdmlzdWFsIHBsYXllciB0byBiZSBkZWNvcmF0ZWQgd2l0aCBhZGRpdGlvbm5hbCBtb2R1bGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIChubyBvcHRpb25zIGZvciBub3cpXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBbb3B0aW9ucy5jb250YWluZXJdIC0gQ3NzIFNlbGVjdG9yIG9yIERPTSBFbGVtZW50IHRoYXQgd2lsbFxuICogIGhvc3QgdGhlIHBsYXllciBhbmQgYWRkaXRpb25uYWwgbW9kdWxlc1xuICogQHBhcmFtIHtBYnN0cmFjdFBsYXllcn0gLSBUaGUgcGxheWVyIHRvIGJlIHVzZWQgYnkgdGhlIGJsb2NrLlxuICogQHBhcmFtIHsnYXV0byd8J21hbnVhbCd9IFtvcHRpb25zLnNpemluZz0nYXV0byddIC0gSG93IHRoZSBzaXplIG9mIHRoZSBibG9ja1xuICogIHNob3VsZCBiZSBkZWZpbmVkLiBJZiAnYXV0bycsIHRoZSBibG9jayBhZGp1c3RzIHRvIHRoZSBzaXplIG9mIHRoZSBjb250YWluZXIuXG4gKiAgSWYgJ21hbnVhbCcsIHVzZSBgd2lkdGhgIGFuZCBgaGVpZ2h0YCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPW51bGxdIC0gV2lkdGggb2YgdGhlIGJsb2NrIGlmIHNpemUgaXMgJ21hbnVhbCcuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PW51bGxdIC0gSGVpZ2h0IG9mIHRoZSBibG9jayBpZiBzaXplIGlzICdtYW51YWwnLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIGNvbnN0ICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGFpbmVyJyk7XG4gKiBjb25zdCBkZWZhdWx0V2lkdGggPSAxMDAwO1xuICogY29uc3QgZGVmYXVsdEhlaWdodCA9IDEwMDA7XG4gKiBjb25zdCBibG9jayA9IG5ldyBibG9ja3MuY29yZS5CbG9jayh7XG4gKiAgIHBsYXllcjogYWJjLnBsYXllci5TZWVrUGxheWVyLFxuICogICBjb250YWluZXI6ICRjb250YWluZXIsXG4gKiAgIHNpemluZzogJ21hbnVhbCcsIC8vIGlmICdhdXRvJywgYWRqdXN0IHRvIGZpbGwgJGNvbnRhaW5lciBzaXplXG4gKiAgIHdpZHRoOiBkZWZhdWx0V2lkdGgsXG4gKiAgIGhlaWdodDogZGVmYXVsdEhlaWdodCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHdhdmVmb3JtTW9kdWxlID0gbmV3IGJsb2Nrcy5tb2R1bGUuV2F2ZWZvcm1Nb2R1bGUoKTtcbiAqIGNvbnN0IGN1cnNvck1vZHVsZSA9IG5ldyBibG9ja3MubW9kdWxlLkN1cnNvck1vZHVsZSgpO1xuICpcbiAqIGJsb2NrLmFkZChzaW1wbGVXYXZlZm9ybU1vZHVsZSk7XG4gKiBibG9jay5hZGQoY3Vyc29yTW9kdWxlKTtcbiAqIGBgYFxuICovXG5jbGFzcyBCbG9jayB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtZXRlcnMoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5FVkVOVFMgPSBFVkVOVFM7XG5cbiAgICB0aGlzLnRyYWNrRGF0YSA9IG51bGw7XG4gICAgdGhpcy50cmFja01ldGFkYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9tb2R1bGVzID0gW107XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdjb250YWluZXInKTtcbiAgICBjb25zdCBzaXppbmcgPSB0aGlzLnBhcmFtcy5nZXQoJ3NpemluZycpO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuZ2V0KCd3aWR0aCcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmdldCgnaGVpZ2h0Jyk7XG4gICAgdGhpcy51aSA9IG5ldyBVSSgkY29udGFpbmVyLCBzaXppbmcsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgcGxheWVyQ3RvciA9IHRoaXMucGFyYW1zLmdldCgncGxheWVyJyk7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgcGxheWVyQ3Rvcih0aGlzKTtcblxuICAgIHRoaXMuX2hpc3RvcnkgPSBuZXcgSGlzdG9yeSh0aGlzLCAndHJhY2tNZXRhZGF0YScsIDIwKTtcblxuICAgIHRoaXMuX21vbml0b3JQb3NpdGlvbiA9IHRoaXMuX21vbml0b3JQb3NpdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRXZlbnQgPSB0aGlzLl9vbkV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICAvLyBsaXN0ZW4gZXZlbnRzIGZyb20gdGhlIHRpbWVsaW5lIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzXG4gICAgdGhpcy51aS50aW1lbGluZS5hZGRMaXN0ZW5lcignZXZlbnQnLCB0aGlzLl9vbkV2ZW50KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBldmVudCBzeXN0ZW1cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgY2hhbm5lbCBvZiB0aGUgcGxheWVyLlxuICAgKiBBdmFpbGFibGUgZXZlbnRzIGFyZTpcbiAgICogLSBgJ3N0YXJ0J2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgc3RhcnRzXG4gICAqIC0gYCdwYXVzZSdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIGlzIHBhdXNlZFxuICAgKiAtIGAnc3RvcCdgIDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBpcyBzdG9wcGVkIChwYXVzZSgpICsgc2VlaygwKSlcbiAgICogLSBgJ3NlZWsnYCA6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgc2VlayB0byBhIG5ldyBwb3NpdGlvblxuICAgKiAtIGAnZW5kZWQnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzdG9wcyBhdCB0aGUgZW5kIG9mIHRoZSBmaWxlIChvciBhdFxuICAgKiAgICAgICAgICAgICAgdGhlIGVuZCBvZiB0aGUgbGFzdCBzZWdtZW50KS4gVGhlIGNhbGxiYWNrIGlzIGV4ZWN1dGVkIHdpdGggdGhlXG4gICAqICAgICAgICAgICAgICBzdG9wIHBvc2l0aW9uLlxuICAgKiAtIGAncG9zaXRpb24nYDogdHJpZ2dlcmVkIGF0IGVhY2ggcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgd2l0aCB0aGUgY3VycmVudFxuICAgKiAgICAgICAgICAgICAgcG9zaXRpb24gYW5kIGR1cmF0aW9uIG9mIHRoZSBhdWRpbyBmaWxlLiBUcmlnZ2VyIG9ubHkgd2hlblxuICAgKiAgICAgICAgICAgICAgdGhlIHBsYXllciBpcyBwbGF5aW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBleGVjdXRlXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzLmhhcyhjaGFubmVsKSlcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5zZXQoY2hhbm5lbCwgbmV3IFNldCgpKTtcblxuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG4gICAgbGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBhIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzLmhhcyhjaGFubmVsKSkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICAgIGxpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHN1YnNjaWJlcnMgZnJvbSBhIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgY2hhbm5lbC5cbiAgICovXG4gIHJlbW92ZUFsbExpc3RlbmVycyhjaGFubmVsKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG4gICAgICBsaXN0ZW5lcnMuY2xlYXIoKTtcblxuICAgICAgdGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShjaGFubmVsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhbGwgc3Vic2NyaWJlcnMgb2YgYSBldmVudCB3aXRoIGdpdmVuIGFyZ3VtZW50cy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG5cbiAgICBpZiAobGlzdGVuZXJzICE9PSB1bmRlZmluZWQpXG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lciguLi5hcmdzKSk7XG4gIH1cblxuICAvKipcbiAgICogTWFpbiBldmVudCBsaXN0ZW5lciBvZiB0aGUgd2F2ZXMtdWkgdGltZWxpbmUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25FdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKCdvbkV2ZW50JywgZSwgaGl0TGF5ZXJzKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBtb2R1bGUgY2hhaW5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEFkZCBhIG1vZHVsZSB0byB0aGUgcGxheWVyLiBBIG1vZHVsZSBpcyBkZWZpbmVkIGFzIGEgc3BlY2lmaWMgc2V0XG4gICAqIG9mIGZ1bmN0aW9ubmFsaXR5IGFuZCB2aXN1YWxpemF0aW9ucyBvbiB0b3Agb2YgdGhlIHBsYXllci5cbiAgICogTW9kdWxlIGNhbiBpbXBsZW1lbnQgZmVhdHVyZXMgc3VjaCBhcyB3YXZlZm9ybSwgbW92aW5nIGN1cnNvciwgZXRjLlxuICAgKlxuICAgKiBAcGFyYW0ge0Fic3RyYWN0TW9kdWxlfSBtb2R1bGUgLSBNb2R1bGUgdG8gYWRkXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB6SW5kZXggLSB6SW5kZXggb2YgdGhlIGFkZGVkIG1vZHVsZVxuICAgKi9cbiAgYWRkKG1vZHVsZSwgekluZGV4ID0gMCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbW9kdWxlcy5pbmRleE9mKG1vZHVsZSk7XG5cbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICBtb2R1bGUuYmxvY2sgPSB0aGlzO1xuICAgICAgbW9kdWxlLnpJbmRleCA9IHpJbmRleDtcbiAgICAgIG1vZHVsZS5pbnN0YWxsKHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy50cmFja01ldGFkYXRhICYmIG1vZHVsZS5zZXRUcmFjaylcbiAgICAgICAgbW9kdWxlLnNldFRyYWNrKHRoaXMudHJhY2tEYXRhLCB0aGlzLnRyYWNrTWV0YWRhdGEpO1xuXG4gICAgICB0aGlzLl9tb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIG1vZHVsZSBmcm9tIHRoZSBwbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7QWJzdHJhY3RNb2R1bGV9IG1vZHVsZSAtIE1vZHVsZSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZShtb2R1bGUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX21vZHVsZXMuaW5kZXhPZihtb2R1bGUpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgbW9kdWxlLnVuaW5zdGFsbCh0aGlzKTtcbiAgICAgIG1vZHVsZS5ibG9jayA9IG51bGw7XG4gICAgICBtb2R1bGUuekluZGV4ID0gbnVsbDtcblxuICAgICAgdGhpcy5fbW9kdWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNvbW1hbmQgb24gZWFjaCBtb2R1bGUgdGhhdCBpbXBsZW1lbnRzIHRoZSBtZXRob2QuIFRoZSBjb21tYW5kXG4gICAqIGFyZSBleGVjdXRlZCBpbiB0aGUgb3JkZXIgaW4gd2hpY2ggbW9kdWxlcyB3ZXJlIGFkZGVkIHRvIHRoZSBwbGF5ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKGNvbW1hbmQsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuX21vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBtb2R1bGUgPSB0aGlzLl9tb2R1bGVzW2ldO1xuXG4gICAgICBpZiAobW9kdWxlW2NvbW1hbmRdKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBtb2R1bGVbY29tbWFuZF0oLi4uYXJncyk7XG5cbiAgICAgICAgaWYgKG5leHQgPT09IGZhbHNlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNvbW1hbmQgb24gZWFjaCBtb2R1bGUgdGhhdCBpbXBsZW1lbnRzIHRoZSBtZXRob2QuIFRoZSBjb21tYW5kXG4gICAqIGFyZSBleGVjdXRlZCBpbiB0aGUgcmV2ZXJzZSBvcmRlciBpbiB3aGljaCBtb2R1bGVzIHdlcmUgYWRkZWQgdG8gdGhlIHBsYXllci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKGNvbW1hbmQsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5fbW9kdWxlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5fbW9kdWxlc1tpXTtcblxuICAgICAgaWYgKG1vZHVsZVtjb21tYW5kXSkge1xuICAgICAgICBjb25zdCBuZXh0ID0gbW9kdWxlW2NvbW1hbmRdKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBvciBjaGFuZ2UgdGhlIHRyYWNrIG9mIHRoZSBwbGF5ZXIuIEEgdHJhY2sgaXMgYSBKU09OIG9iamVjdCB0aGF0IG11c3RcbiAgICogZm9sbG93IHRoZSBjb252ZW50aW9uIGRlZmluZWQgPz9cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1ZmZlciAoaS5lLiBBdWRpb0J1ZmZlcilcbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gbWV0YWRhdGEgb2JqZWN0XG4gICAqL1xuICBzZXRUcmFjayhkYXRhLCBtZXRhZGF0YSkge1xuICAgIHRoaXMuX3NldFRyYWNrKGRhdGEsIG1ldGFkYXRhLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgY2hhbmdlIHRoZSB0cmFjayBvZiB0aGUgcGxheWVyLiBBIHRyYWNrIGlzIGEgSlNPTiBvYmplY3QgdGhhdCBtdXN0XG4gICAqIGZvbGxvdyB0aGUgY29udmVudGlvbiBkZWZpbmVkID8/XG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidWZmZXIgKGkuZS4gQXVkaW9CdWZmZXIpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhZGF0YSAtIG1ldGFkYXRhIG9iamVjdFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlc2V0SGlzdG9yeSAtIHJlc2V0IGhpc3RvcnlcbiAgICovXG4gIF9zZXRUcmFjayhkYXRhLCBtZXRhZGF0YSwgcmVzZXRIaXN0b3J5ID0gZmFsc2UpIHtcbiAgICB0aGlzLnRyYWNrTWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICB0aGlzLnRyYWNrRGF0YSA9IGRhdGE7XG4gICAgdGhpcy5wbGF5ZXIuc2V0QnVmZmVyKGRhdGEpOyAvLyBpbnRlcm5hbGx5IHN0b3BzIHRoZSBwbGF5IGNvbnRyb2xcblxuICAgIGlmIChyZXNldEhpc3RvcnkpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkucmVzZXQoKTtcbiAgICAgIHRoaXMuc25hcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzbmFwIGFscmVhZHkgZW1pdHMgdGhlIGV2ZW50Li4uXG4gICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVFMuVVBEQVRFLCB0aGlzLnRyYWNrRGF0YSwgdGhpcy50cmFja01ldGFkYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3AoKTtcblxuICAgIHRoaXMudWkudGltZWxpbmUucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy53aWR0aCAvIHRoaXMuZHVyYXRpb247XG4gICAgdGhpcy51aS50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldFRyYWNrJywgZGF0YSwgbWV0YWRhdGEpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB1bmRvIC8gcmVkb1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHRvZG8gLSByZXZpZXcgYWxsIGhpc3RvcnkgYWxnb3JpdGhtXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzbmFwc2hvdCBvZiB0aGUgZGF0YSBhZnRlciBtb2RpZmljYXRpb25zLiBTaG91bGQgYmUgdXNlZCBpblxuICAgKiBtb2R1bGVzIGFmdGVyIGVhY2ggc2lnbmlmaWNhbnQgb3BlcmF0aW9uLCBpbiBvcmRlciB0byBhbGxvdyBgdW5kb2AgYW5kXG4gICAqIGByZWRvYCBvcGVyYXRpb25zLlxuICAgKi9cbiAgc25hcCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5LnNuYXAoKTtcbiAgICB0aGlzLmVtaXQodGhpcy5FVkVOVFMuVVBEQVRFLCB0aGlzLnRyYWNrRGF0YSwgdGhpcy50cmFja01ldGFkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHbyB0byBwcmV2aW91cyBzbmFwc2hvdC5cbiAgICovXG4gIHVuZG8oKSB7XG4gICAgaWYgKHRoaXMuX2hpc3RvcnkudW5kbygpKVxuICAgICAgdGhpcy5fc2V0VHJhY2sodGhpcy50cmFja0RhdGEsIHRoaXMuX2hpc3RvcnkuaGVhZCgpLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gbmV4dCBzbmFwc2hvdC5cbiAgICovXG4gIHJlZG8oKSB7XG4gICAgaWYgKHRoaXMuX2hpc3RvcnkucmVkbygpKVxuICAgICAgdGhpcy5fc2V0VHJhY2sodGhpcy50cmFja0RhdGEsIHRoaXMuX2hpc3RvcnkuaGVhZCgpLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQHRvZG8gLSBkZWZpbmUgaWYgaXQncyByZWFsbHkgdGhlIHByb3BlciB3YXkgdG8gZ28uLi5cbiAgICovXG4gIGhlYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaGVhZCgpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHZpc3VhbCBpbnRlcmZhY2VcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSBwbGF5ZXIuIERlZmF1bHRzIHRvIHRoZSB3aWR0aCBvZiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICAgKlxuICAgKiBAbmFtZSB3aWR0aFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMudWkud2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldFdpZHRoJywgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnVpLndpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgcGxheWVyLiBEZWZhdWx0cyB0byB0aGUgaGVpZ2h0IG9mIHRoZSBnaXZlbiBjb250YWluZXIuXG4gICAqXG4gICAqIEBuYW1lIGhlaWdodFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLnVpLmhlaWdodCA9IHZhbHVlO1xuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2V0SGVpZ2h0JywgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy51aS5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogRG9lcyB0aGlzIG1ha2Ugc2VucyA/XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgLy8gZm9yY2UgcmVuZGVyaW5nIGZyb20gb3V0c2lkZSB0aGUgbW9kdWxlIChpLmUuIGlmIHZhbHVlcyBoYXZlIGNoYW5nZWQpXG4gICAgdGhpcy51aS50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5yZW5kZXIoKTtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCgncmVuZGVyJyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gYXVkaW8gaW50ZXJmYWNlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgaGVhZCBpbiB0aGUgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQG5hbWUgcG9zaXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXllci5wb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEdXJhdGlvbiBvZiB0aGUgY3VycmVudCBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAbmFtZSBkdXJhdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyLmR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFZvbHVtZSBvZiB0aGUgYXVkaW8gKGluIGRiKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRiIC0gdm9sdW1lIG9mIHRoZSBwbGF5ZXIgaW4gZGVjaWJlbHNcbiAgICovXG4gIHZvbHVtZShkYikge1xuICAgIHRoaXMucGxheWVyLnZvbHVtZShkYik7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHBsYXllci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IHRydWUsXG4gICAgdGhpcy5wbGF5ZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc3RhcnQnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuU1RBUlQpO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuXG4gICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uUmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbW9uaXRvclBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBwbGF5ZXIgKHNob3J0Y3V0IGZvciBgcGF1c2VgIGFuZCBgc2Vla2AgdG8gMCkuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlLFxuICAgIHRoaXMucGxheWVyLnN0b3AoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc3RvcCcpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TVE9QKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZSB0aGUgcGxheWVyLlxuICAgKi9cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2UsXG4gICAgdGhpcy5wbGF5ZXIucGF1c2UoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgncGF1c2UnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuUEFVU0UpO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZWsgdG8gYSBuZXcgcG9zaXRpb24gaW4gdGhlIGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIE5ldyBwb3NpdGlvbi5cbiAgICovXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICBwb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKHBvc2l0aW9uLCB0aGlzLnBsYXllci5kdXJhdGlvbikpO1xuICAgIHRoaXMucGxheWVyLnNlZWsocG9zaXRpb24pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZWVrJywgcG9zaXRpb24sIHRoaXMuX2lzUGxheWluZyk7XG4gICAgLy8gYXMgdGhlIHBvc2l0aW9uIGNhbiBiZSBtb2RpZmllZCBieSB0aGUgU2Vla0NvbnRyb2xcbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNFRUssIHRoaXMucGxheWVyLnBvc2l0aW9uKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBsYXllci5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogRW1pdCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICogU2hvcnRjdXQgZm9yIGB0aGlzLmVtaXQoJ3Bvc2l0aW9uJywgcG9zaXRpb24sIGR1cmF0aW9uKWBcbiAgICovXG4gIGVtaXRQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIHRoaXMuZW1pdChFVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgcG9zaXRpb24sIHRoaXMucGxheWVyLmR1cmF0aW9uKTtcbiAgfVxuXG4gICAgLyoqXG4gICAqIEVtaXQgdGhlIGBlbmRlZGAgZXZlbnQuXG4gICAqL1xuICBlbmRlZChwb3NpdGlvbikge1xuICAgIHRoaXMuZW1pdChFVkVOVFMuRU5ERUQsIHBvc2l0aW9uKTtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYXRjaCB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcGxheWVyIGluIGEgcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgbG9vcC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9tb25pdG9yUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMucGxheWVyLnJ1bm5pbmcpXG4gICAgICB0aGlzLl9tb25pdG9yUG9zaXRpb25SYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9tb25pdG9yUG9zaXRpb24pO1xuXG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBsYXllci5wb3NpdGlvbjtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGxheWVyLmR1cmF0aW9uO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHBvc2l0aW9uKTtcblxuICAgIGlmIChwb3NpdGlvbiA+IGR1cmF0aW9uKVxuICAgICAgcmV0dXJuIHRoaXMuZW5kZWQocG9zaXRpb24pOyAvLyBwbGF5ZXIgc3RvcHMgdGhlIHBsYXlDb250cm9sXG5cbiAgICB0aGlzLnBsYXllci5tb25pdG9yUG9zaXRpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCbG9jaztcbiJdfQ==