'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

var _AbstractModule = require('./AbstractModule');

var _AbstractModule2 = _interopRequireDefault(_AbstractModule);

var _parameters = require('@ircam/parameters');

var _parameters2 = _interopRequireDefault(_parameters);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EVENTS = {
  // @arguments
  // position ?
  START: 'start',
  // @arguments
  // position ?
  PAUSE: 'pause',
  // @arguments
  // position ?
  STOP: 'stop',
  // @arguments
  // target position
  SEEK: 'seek',
  // @arguments
  // buffer.duration if real-end, last segment.endTime in PreListening mode
  ENDED: 'ended',
  // trigered on start, stop, pause and at each raf if playing
  // @arguments
  // current position
  CURRENT_POSITION: 'position'
};

var UI = function UI($container, width, height) {
  (0, _classCallCheck3.default)(this, UI);

  // arbitrary `pixelsPerSecond` value to update when a track is set
  this.timeline = new ui.core.Timeline(1, width);
  this.track = new ui.core.Track($container, height);

  this.timeline.add(this.track, 'default');
  this.track.updateContainer(); // init track DOM tree

  // time context that should be shared by all (most) mixins / ui layers
  this.timeContext = new ui.core.LayerTimeContext(this.timeline.timeContext);
};

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
  size: {
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
   * @param {'auto'|'manual'} [options.size='auto'] - How the size of the block
   *  should be defined. If 'auto', the block adjust to the size of the container.
   *  If 'manual', use `width` and `height` parameters.
   * @param {Number} [options.width=null] - Width of the block if size is 'manual'.
   * @param {Number} [options.height=null] - Height of the block if size is 'manual'.
   *
   * @example
   * ```
   * const $container = document.querySelector('#container');
   * const defaultWidth = 1000;
   * const defaultHeight = 1000;
   * * const block = new blocks.core.Block({
   *   player: abc.player.SeekPlayer,
   *   container: $container,
   *   size: 'manual', // if 'auto', adjust to fill $container size
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

    var $container = this.params.get('container');

    $container = $container instanceof Element ? $container : document.querySelector($container);

    var size = this.params.get('size');

    if (size === 'auto') {
      var boundingClientRect = $container.getBoundingClientRect();

      this._width = boundingClientRect.width;
      this._height = boundingClientRect.height;
    } else if (size === 'manual') {
      var width = this.params.get('width');
      var height = this.params.get('height');

      $container.style.width = width + 'px';
      $container.style.height = height + 'px';

      this._width = width;
      this._height = height;
    }

    var playerCtor = this.params.get('player');
    this.player = new playerCtor(this);
    this.ui = new UI(container, this.width, this.height);

    this.EVENTS = EVENTS;
    // snapshots of the data
    this._history = [];
    this._historyLength = 10;
    this._historyPointer = -1;

    this._listeners = new _map2.default();
    this._modules = [];
    this._isPlaying = false;

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
     */

  }, {
    key: 'add',
    value: function add(module) {
      if (!(module instanceof _AbstractModule2.default)) throw new Error('module is not an instance of AbstractModule');

      var index = this._modules.indexOf(module);

      if (index === -1) {
        module.install(this);

        if (this.trackConfig && module.setTrack) module.setTrack(this.trackConfig, this.trackBuffer);

        this._modules.push(module);
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
      if (!(module instanceof _AbstractModule2.default)) throw new Error('module is not an instance of AbstractModule');

      var index = this._modules.indexOf(module);

      if (index !== -1) {
        module.uninstall(this);
        this._modules.splice(index, 1);
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

    // ---------------------------------------------------------
    // undo / redo
    // ---------------------------------------------------------

    /**
     * Copy current config to create snapshots
     * @private
     * @todo - define how to handle that...
     */

  }, {
    key: '_copy',
    value: function _copy(obj) {
      var copy = JSON.parse((0, _stringify2.default)(obj));
      return copy;
    }

    /**
     * Create a snapshot of the data after modifications. Should be used in modules
     * after each significant operation, in order to allow `undo` and `redo`
     * operations.
     */

  }, {
    key: 'createSnapshot',
    value: function createSnapshot() {
      // eliminate previous future, create a dystopia
      this._history = this._history.slice(0, this._historyPointer + 1);

      var maxIndex = this._historyLength - 1;
      this._historyPointer = Math.min(maxIndex, this._historyPointer + 1);

      var json = this._copy(this.trackConfig);

      if (this._history.length === this._historyLength) this._history.shift();

      this._history[this._historyPointer] = json;
    }
  }, {
    key: 'getSnapshot',
    value: function getSnapshot() {
      if (this.trackConfig) return this._copy(this.trackConfig);else return null;
    }

    /**
     * Go to last snapshot.
     */

  }, {
    key: 'undo',
    value: function undo() {
      var pointer = this._historyPointer - 1;

      if (pointer >= 0) {
        var json = this._history[pointer];
        this._historyPointer = pointer;
        // create a copy for use as a working object
        this.setTrack(this._copy(json), this.trackBuffer, false);
      }
    }

    /**
     * Go to next snapshot.
     */

  }, {
    key: 'redo',
    value: function redo() {
      var pointer = this._historyPointer + 1;
      var json = this._history[pointer];

      if (json) {
        this._historyPointer = pointer;
        // create a copy for use as a working object
        this.setTrack(this._copy(json), this.trackBuffer, false);
      }
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
    // tracks
    // ---------------------------------------------------------

    /**
     * Set or change the track of the player. A track is a JSON object that must
     * follow the convention defined ??
     *
     * @param {Object} trackConfig - Metadata object
     * @param {Object} trackBuffer - Data buffer (aka. AudioBuffer)
     * // @param {Boolean} createSnapshot - for internal use only (cf undo and redo)
     *
     * @see {???}
     */

  }, {
    key: 'setTrack',
    value: function setTrack(trackConfig, trackBuffer) {
      var createSnapshot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      this.trackConfig = trackConfig;
      this.trackBuffer = trackBuffer;
      this.player.setTrack(trackBuffer); // internally stops the play control

      // @todo - should reset history when false
      if (createSnapshot === true) this.createSnapshot();

      // propagate events
      this.stop();

      this.ui.timeline.pixelsPerSecond = this.width / this.duration;
      this.ui.timeContext.duration = this.duration;

      this._executeCommandForward('setTrack', trackConfig, trackBuffer);
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
     * Volume of the audio.
     *
     * @todo - move to dB values ?
     * @param {Number} gain - Linear gain (between 0 and 1)
     */
    value: function volume(gain) {
      if (this.player.volume) this.player.volume(gain);
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
      this._width = value;

      this.ui.timeline.maintainVisibleDuration = true;
      this.ui.timeline.visibleWidth = value;

      this.ui.timeline.tracks.forEach(function (track) {
        track.render();
        track.update();
      });

      this._executeCommandForward('setWidth', value);
    },
    get: function get() {
      return this._width;
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
      this._height = value;

      this.ui.timeline.tracks.forEach(function (track) {
        track.height = value;
        track.render();
        track.update();
      });

      this._executeCommandForward('setHeight', value);
    },
    get: function get() {
      return this._height;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwiRVZFTlRTIiwiU1RBUlQiLCJQQVVTRSIsIlNUT1AiLCJTRUVLIiwiRU5ERUQiLCJDVVJSRU5UX1BPU0lUSU9OIiwiVUkiLCIkY29udGFpbmVyIiwid2lkdGgiLCJoZWlnaHQiLCJ0aW1lbGluZSIsImNvcmUiLCJUaW1lbGluZSIsInRyYWNrIiwiVHJhY2siLCJhZGQiLCJ1cGRhdGVDb250YWluZXIiLCJ0aW1lQ29udGV4dCIsIkxheWVyVGltZUNvbnRleHQiLCJkZWZpbml0aW9ucyIsImNvbnRhaW5lciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJwbGF5ZXIiLCJudWxsYWJsZSIsInNpemUiLCJsaXN0IiwibWluIiwibWF4IiwiSW5maW5pdHkiLCJCbG9jayIsIm9wdGlvbnMiLCJwYXJhbXMiLCJnZXQiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYm91bmRpbmdDbGllbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiX3dpZHRoIiwiX2hlaWdodCIsInN0eWxlIiwicGxheWVyQ3RvciIsIl9oaXN0b3J5IiwiX2hpc3RvcnlMZW5ndGgiLCJfaGlzdG9yeVBvaW50ZXIiLCJfbGlzdGVuZXJzIiwiX21vZHVsZXMiLCJfaXNQbGF5aW5nIiwiX21vbml0b3JQb3NpdGlvbiIsImJpbmQiLCJfb25FdmVudCIsImFkZExpc3RlbmVyIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0IiwibGlzdGVuZXJzIiwiZGVsZXRlIiwiY2xlYXIiLCJhcmdzIiwidW5kZWZpbmVkIiwiZm9yRWFjaCIsImxpc3RlbmVyIiwiZSIsImhpdExheWVycyIsIl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkIiwibW9kdWxlIiwiRXJyb3IiLCJpbmRleCIsImluZGV4T2YiLCJpbnN0YWxsIiwidHJhY2tDb25maWciLCJzZXRUcmFjayIsInRyYWNrQnVmZmVyIiwicHVzaCIsInVuaW5zdGFsbCIsInNwbGljZSIsImNvbW1hbmQiLCJpIiwibCIsImxlbmd0aCIsIm5leHQiLCJvYmoiLCJjb3B5IiwiSlNPTiIsInBhcnNlIiwic2xpY2UiLCJtYXhJbmRleCIsIk1hdGgiLCJqc29uIiwiX2NvcHkiLCJzaGlmdCIsInBvaW50ZXIiLCJ0cmFja3MiLCJyZW5kZXIiLCJ1cGRhdGUiLCJjcmVhdGVTbmFwc2hvdCIsInN0b3AiLCJwaXhlbHNQZXJTZWNvbmQiLCJkdXJhdGlvbiIsIl9leGVjdXRlQ29tbWFuZEZvcndhcmQiLCJnYWluIiwidm9sdW1lIiwic3RhcnQiLCJlbWl0IiwiZW1pdFBvc2l0aW9uIiwicG9zaXRpb24iLCJfbW9uaXRvclBvc2l0aW9uUmFmSWQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJwYXVzZSIsInNlZWsiLCJydW5uaW5nIiwiZW5kZWQiLCJtb25pdG9yUG9zaXRpb24iLCJ2YWx1ZSIsIm1haW50YWluVmlzaWJsZUR1cmF0aW9uIiwidmlzaWJsZVdpZHRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxFOztBQUNaOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUMsU0FBUztBQUNiO0FBQ0E7QUFDQUMsU0FBTyxPQUhNO0FBSWI7QUFDQTtBQUNBQyxTQUFPLE9BTk07QUFPYjtBQUNBO0FBQ0FDLFFBQU0sTUFUTztBQVViO0FBQ0E7QUFDQUMsUUFBTSxNQVpPO0FBYWI7QUFDQTtBQUNBQyxTQUFPLE9BZk07QUFnQmI7QUFDQTtBQUNBO0FBQ0FDLG9CQUFrQjtBQW5CTCxDQUFmOztJQXNCTUMsRSxHQUNKLFlBQVlDLFVBQVosRUFBd0JDLEtBQXhCLEVBQStCQyxNQUEvQixFQUF1QztBQUFBOztBQUNyQztBQUNBLE9BQUtDLFFBQUwsR0FBZ0IsSUFBSVosR0FBR2EsSUFBSCxDQUFRQyxRQUFaLENBQXFCLENBQXJCLEVBQXdCSixLQUF4QixDQUFoQjtBQUNBLE9BQUtLLEtBQUwsR0FBYSxJQUFJZixHQUFHYSxJ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MkMsSUFBM0M7QUFDQSxXQUFLekgsRUFBTCxDQUFRWSxRQUFSLENBQWlCOEcsWUFBakIsR0FBZ0NGLEtBQWhDOztBQUVBLFdBQUt4SCxFQUFMLENBQVFZLFFBQVIsQ0FBaUJ1RixNQUFqQixDQUF3QmhDLE9BQXhCLENBQWdDLGlCQUFTO0FBQ3ZDcEQsY0FBTXFGLE1BQU47QUFDQXJGLGNBQU1zRixNQUFOO0FBQ0QsT0FIRDs7QUFLQSxXQUFLSyxzQkFBTCxDQUE0QixVQUE1QixFQUF3Q2MsS0FBeEM7QUFDRCxLO3dCQUVXO0FBQ1YsYUFBTyxLQUFLNUUsTUFBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7O3NCQU9XNEUsSyxFQUFPO0FBQ2hCLFdBQUszRSxPQUFMLEdBQWUyRSxLQUFmOztBQUVBLFdBQUt4SCxFQUFMLENBQVFZLFFBQVIsQ0FBaUJ1RixNQUFqQixDQUF3QmhDLE9BQXhCLENBQWdDLGlCQUFTO0FBQ3ZDcEQsY0FBTUosTUFBTixHQUFlNkcsS0FBZjtBQUNBekcsY0FBTXFGLE1BQU47QUFDQXJGLGNBQU1zRixNQUFOO0FBQ0QsT0FKRDs7QUFNQSxXQUFLSyxzQkFBTCxDQUE0QixXQUE1QixFQUF5Q2MsS0FBekM7QUFDRCxLO3dCQUVZO0FBQ1gsYUFBTyxLQUFLM0UsT0FBWjtBQUNEOzs7d0JBNERjO0FBQ2IsYUFBTyxLQUFLakIsTUFBTCxDQUFZb0YsUUFBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7d0JBUWU7QUFDYixhQUFPLEtBQUtwRixNQUFMLENBQVk2RSxRQUFuQjtBQUNEOzs7OztrQkF3R1l0RSxLIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAnQGlyY2FtL3BhcmFtZXRlcnMnO1xuXG5jb25zdCBFVkVOVFMgPSB7XG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb24gP1xuICBTVEFSVDogJ3N0YXJ0JyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvbiA/XG4gIFBBVVNFOiAncGF1c2UnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHBvc2l0aW9uID9cbiAgU1RPUDogJ3N0b3AnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHRhcmdldCBwb3NpdGlvblxuICBTRUVLOiAnc2VlaycsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gYnVmZmVyLmR1cmF0aW9uIGlmIHJlYWwtZW5kLCBsYXN0IHNlZ21lbnQuZW5kVGltZSBpbiBQcmVMaXN0ZW5pbmcgbW9kZVxuICBFTkRFRDogJ2VuZGVkJyxcbiAgLy8gdHJpZ2VyZWQgb24gc3RhcnQsIHN0b3AsIHBhdXNlIGFuZCBhdCBlYWNoIHJhZiBpZiBwbGF5aW5nXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gY3VycmVudCBwb3NpdGlvblxuICBDVVJSRU5UX1BPU0lUSU9OOiAncG9zaXRpb24nLFxufTtcblxuY2xhc3MgVUkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gYXJiaXRyYXJ5IGBwaXhlbHNQZXJTZWNvbmRgIHZhbHVlIHRvIHVwZGF0ZSB3aGVuIGEgdHJhY2sgaXMgc2V0XG4gICAgdGhpcy50aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHdpZHRoKTtcbiAgICB0aGlzLnRyYWNrID0gbmV3IHVpLmNvcmUuVHJhY2soJGNvbnRhaW5lciwgaGVpZ2h0KTtcblxuICAgIHRoaXMudGltZWxpbmUuYWRkKHRoaXMudHJhY2ssICdkZWZhdWx0Jyk7XG4gICAgdGhpcy50cmFjay51cGRhdGVDb250YWluZXIoKTsgLy8gaW5pdCB0cmFjayBET00gdHJlZVxuXG4gICAgLy8gdGltZSBjb250ZXh0IHRoYXQgc2hvdWxkIGJlIHNoYXJlZCBieSBhbGwgKG1vc3QpIG1peGlucyAvIHVpIGxheWVyc1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHRoaXMudGltZWxpbmUudGltZUNvbnRleHQpO1xuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb250YWluZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ3NzIFNlbGVjdG9yIG9yIERPTSBFbGVtZW50IGhvc3RpbmcgdGhlIGJsb2NrJ1xuICAgIH1cbiAgfSxcbiAgcGxheWVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ0NvbnN0cnVjdG9yIG9mIHRoZSBwbGF5ZXIgdG8gYmUgdXNlZCBpbiB0aGUgYmxvY2snLFxuICAgIH0sXG4gIH0sXG4gIHNpemU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWydhdXRvJywgJ21hbnVhbCddLFxuICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgd2lkdGg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGhlaWdodDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgYXVkaW8tdmlzdWFsIHBsYXllciB0byBiZSBkZWNvcmF0ZWQgd2l0aCBhZGRpdGlvbm5hbCBtb2R1bGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIChubyBvcHRpb25zIGZvciBub3cpXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBbb3B0aW9ucy5jb250YWluZXJdIC0gQ3NzIFNlbGVjdG9yIG9yIERPTSBFbGVtZW50IHRoYXQgd2lsbFxuICogIGhvc3QgdGhlIHBsYXllciBhbmQgYWRkaXRpb25uYWwgbW9kdWxlc1xuICogQHBhcmFtIHtBYnN0cmFjdFBsYXllcn0gLSBUaGUgcGxheWVyIHRvIGJlIHVzZWQgYnkgdGhlIGJsb2NrLlxuICogQHBhcmFtIHsnYXV0byd8J21hbnVhbCd9IFtvcHRpb25zLnNpemU9J2F1dG8nXSAtIEhvdyB0aGUgc2l6ZSBvZiB0aGUgYmxvY2tcbiAqICBzaG91bGQgYmUgZGVmaW5lZC4gSWYgJ2F1dG8nLCB0aGUgYmxvY2sgYWRqdXN0IHRvIHRoZSBzaXplIG9mIHRoZSBjb250YWluZXIuXG4gKiAgSWYgJ21hbnVhbCcsIHVzZSBgd2lkdGhgIGFuZCBgaGVpZ2h0YCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPW51bGxdIC0gV2lkdGggb2YgdGhlIGJsb2NrIGlmIHNpemUgaXMgJ21hbnVhbCcuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PW51bGxdIC0gSGVpZ2h0IG9mIHRoZSBibG9jayBpZiBzaXplIGlzICdtYW51YWwnLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIGNvbnN0ICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGFpbmVyJyk7XG4gKiBjb25zdCBkZWZhdWx0V2lkdGggPSAxMDAwO1xuICogY29uc3QgZGVmYXVsdEhlaWdodCA9IDEwMDA7XG4gKiAqIGNvbnN0IGJsb2NrID0gbmV3IGJsb2Nrcy5jb3JlLkJsb2NrKHtcbiAqICAgcGxheWVyOiBhYmMucGxheWVyLlNlZWtQbGF5ZXIsXG4gKiAgIGNvbnRhaW5lcjogJGNvbnRhaW5lcixcbiAqICAgc2l6ZTogJ21hbnVhbCcsIC8vIGlmICdhdXRvJywgYWRqdXN0IHRvIGZpbGwgJGNvbnRhaW5lciBzaXplXG4gKiAgIHdpZHRoOiBkZWZhdWx0V2lkdGgsXG4gKiAgIGhlaWdodDogZGVmYXVsdEhlaWdodCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHdhdmVmb3JtTW9kdWxlID0gbmV3IGJsb2Nrcy5tb2R1bGUuV2F2ZWZvcm1Nb2R1bGUoKTtcbiAqIGNvbnN0IGN1cnNvck1vZHVsZSA9IG5ldyBibG9ja3MubW9kdWxlLkN1cnNvck1vZHVsZSgpO1xuICpcbiAqIGJsb2NrLmFkZChzaW1wbGVXYXZlZm9ybU1vZHVsZSk7XG4gKiBibG9jay5hZGQoY3Vyc29yTW9kdWxlKTtcbiAqIGBgYFxuICovXG5jbGFzcyBCbG9jayB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtZXRlcnMoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgbGV0ICRjb250YWluZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbnRhaW5lcicpO1xuXG4gICAgJGNvbnRhaW5lciA9ICgkY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCkgP1xuICAgICAgJGNvbnRhaW5lciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJGNvbnRhaW5lcik7XG5cbiAgICBjb25zdCBzaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdzaXplJyk7XG5cbiAgICBpZiAoc2l6ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICBjb25zdCBib3VuZGluZ0NsaWVudFJlY3QgPSAkY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICB0aGlzLl93aWR0aCA9IGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aDtcbiAgICAgIHRoaXMuX2hlaWdodCA9IGJvdW5kaW5nQ2xpZW50UmVjdC5oZWlnaHQ7XG5cbiAgICB9IGVsc2UgaWYgKHNpemUgPT09ICdtYW51YWwnKSB7XG4gICAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmdldCgnd2lkdGgnKTtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmdldCgnaGVpZ2h0Jyk7XG5cbiAgICAgICRjb250YWluZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAkY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG5cbiAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfVxuXG4gICAgY29uc3QgcGxheWVyQ3RvciA9IHRoaXMucGFyYW1zLmdldCgncGxheWVyJyk7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgcGxheWVyQ3Rvcih0aGlzKTtcbiAgICB0aGlzLnVpID0gbmV3IFVJKGNvbnRhaW5lciwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgdGhpcy5FVkVOVFMgPSBFVkVOVFM7XG4gICAgLy8gc25hcHNob3RzIG9mIHRoZSBkYXRhXG4gICAgdGhpcy5faGlzdG9yeSA9IFtdO1xuICAgIHRoaXMuX2hpc3RvcnlMZW5ndGggPSAxMDtcbiAgICB0aGlzLl9oaXN0b3J5UG9pbnRlciA9IC0xO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX21vZHVsZXMgPSBbXTtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcblxuICAgIHRoaXMuX21vbml0b3JQb3NpdGlvbiA9IHRoaXMuX21vbml0b3JQb3NpdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRXZlbnQgPSB0aGlzLl9vbkV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICAvLyBsaXN0ZW4gZXZlbnRzIGZyb20gdGhlIHRpbWVsaW5lIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzXG4gICAgdGhpcy51aS50aW1lbGluZS5hZGRMaXN0ZW5lcignZXZlbnQnLCB0aGlzLl9vbkV2ZW50KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBldmVudCBzeXN0ZW1cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgY2hhbm5lbCBvZiB0aGUgcGxheWVyLlxuICAgKiBBdmFpbGFibGUgZXZlbnRzIGFyZTpcbiAgICogLSBgJ3N0YXJ0J2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgc3RhcnRzXG4gICAqIC0gYCdwYXVzZSdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIGlzIHBhdXNlZFxuICAgKiAtIGAnc3RvcCdgIDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBpcyBzdG9wcGVkIChwYXVzZSgpICsgc2VlaygwKSlcbiAgICogLSBgJ3NlZWsnYCA6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgc2VlayB0byBhIG5ldyBwb3NpdGlvblxuICAgKiAtIGAnZW5kZWQnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzdG9wcyBhdCB0aGUgZW5kIG9mIHRoZSBmaWxlIChvciBhdFxuICAgKiAgICAgICAgICAgICAgdGhlIGVuZCBvZiB0aGUgbGFzdCBzZWdtZW50KS4gVGhlIGNhbGxiYWNrIGlzIGV4ZWN1dGVkIHdpdGggdGhlXG4gICAqICAgICAgICAgICAgICBzdG9wIHBvc2l0aW9uLlxuICAgKiAtIGAncG9zaXRpb24nYDogdHJpZ2dlcmVkIGF0IGVhY2ggcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgd2l0aCB0aGUgY3VycmVudFxuICAgKiAgICAgICAgICAgICAgcG9zaXRpb24gYW5kIGR1cmF0aW9uIG9mIHRoZSBhdWRpbyBmaWxlLiBUcmlnZ2VyIG9ubHkgd2hlblxuICAgKiAgICAgICAgICAgICAgdGhlIHBsYXllciBpcyBwbGF5aW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBleGVjdXRlXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzLmhhcyhjaGFubmVsKSlcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5zZXQoY2hhbm5lbCwgbmV3IFNldCgpKTtcblxuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG4gICAgbGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBhIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzLmhhcyhjaGFubmVsKSkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICAgIGxpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHN1YnNjaWJlcnMgZnJvbSBhIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgY2hhbm5lbC5cbiAgICovXG4gIHJlbW92ZUFsbExpc3RlbmVycyhjaGFubmVsKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG4gICAgICBsaXN0ZW5lcnMuY2xlYXIoKTtcblxuICAgICAgdGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShjaGFubmVsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhbGwgc3Vic2NyaWJlcnMgb2YgYSBldmVudCB3aXRoIGdpdmVuIGFyZ3VtZW50cy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG5cbiAgICBpZiAobGlzdGVuZXJzICE9PSB1bmRlZmluZWQpXG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lciguLi5hcmdzKSk7XG4gIH1cblxuICAvKipcbiAgICogTWFpbiBldmVudCBsaXN0ZW5lciBvZiB0aGUgd2F2ZXMtdWkgdGltZWxpbmUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25FdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKCdvbkV2ZW50JywgZSwgaGl0TGF5ZXJzKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBtb2R1bGUgY2hhaW5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEFkZCBhIG1vZHVsZSB0byB0aGUgcGxheWVyLiBBIG1vZHVsZSBpcyBkZWZpbmVkIGFzIGEgc3BlY2lmaWMgc2V0XG4gICAqIG9mIGZ1bmN0aW9ubmFsaXR5IGFuZCB2aXN1YWxpemF0aW9ucyBvbiB0b3Agb2YgdGhlIHBsYXllci5cbiAgICogTW9kdWxlIGNhbiBpbXBsZW1lbnQgZmVhdHVyZXMgc3VjaCBhcyB3YXZlZm9ybSwgbW92aW5nIGN1cnNvciwgZXRjLlxuICAgKlxuICAgKiBAcGFyYW0ge0Fic3RyYWN0TW9kdWxlfSBtb2R1bGUgLSBNb2R1bGUgdG8gYWRkXG4gICAqL1xuICBhZGQobW9kdWxlKSB7XG4gICAgaWYgKCEobW9kdWxlIGluc3RhbmNlb2YgQWJzdHJhY3RNb2R1bGUpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBtb2R1bGUgaXMgbm90IGFuIGluc3RhbmNlIG9mIEFic3RyYWN0TW9kdWxlYCk7XG5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX21vZHVsZXMuaW5kZXhPZihtb2R1bGUpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgbW9kdWxlLmluc3RhbGwodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLnRyYWNrQ29uZmlnICYmIG1vZHVsZS5zZXRUcmFjaylcbiAgICAgICAgbW9kdWxlLnNldFRyYWNrKHRoaXMudHJhY2tDb25maWcsIHRoaXMudHJhY2tCdWZmZXIpO1xuXG4gICAgICB0aGlzLl9tb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbW9kdWxlIGZyb20gdGhlIHBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtBYnN0cmFjdE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlKG1vZHVsZSkge1xuICAgIGlmICghKG1vZHVsZSBpbnN0YW5jZW9mIEFic3RyYWN0TW9kdWxlKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbW9kdWxlIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBBYnN0cmFjdE1vZHVsZWApO1xuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kdWxlKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vZHVsZS51bmluc3RhbGwodGhpcyk7XG4gICAgICB0aGlzLl9tb2R1bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIG9yZGVyIGluIHdoaWNoIG1vZHVsZXMgd2VyZSBhZGRlZCB0byB0aGUgcGxheWVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V4ZWN1dGVDb21tYW5kRm9yd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9tb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5fbW9kdWxlc1tpXTtcblxuICAgICAgaWYgKG1vZHVsZVtjb21tYW5kXSkge1xuICAgICAgICBjb25zdCBuZXh0ID0gbW9kdWxlW2NvbW1hbmRdKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIHJldmVyc2Ugb3JkZXIgaW4gd2hpY2ggbW9kdWxlcyB3ZXJlIGFkZGVkIHRvIHRoZSBwbGF5ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX21vZHVsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuX21vZHVsZXNbaV07XG5cbiAgICAgIGlmIChtb2R1bGVbY29tbWFuZF0pIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG1vZHVsZVtjb21tYW5kXSguLi5hcmdzKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHVuZG8gLyByZWRvXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBDb3B5IGN1cnJlbnQgY29uZmlnIHRvIGNyZWF0ZSBzbmFwc2hvdHNcbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gLSBkZWZpbmUgaG93IHRvIGhhbmRsZSB0aGF0Li4uXG4gICAqL1xuICBfY29weShvYmopIHtcbiAgICBjb25zdCBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICByZXR1cm4gY29weTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzbmFwc2hvdCBvZiB0aGUgZGF0YSBhZnRlciBtb2RpZmljYXRpb25zLiBTaG91bGQgYmUgdXNlZCBpbiBtb2R1bGVzXG4gICAqIGFmdGVyIGVhY2ggc2lnbmlmaWNhbnQgb3BlcmF0aW9uLCBpbiBvcmRlciB0byBhbGxvdyBgdW5kb2AgYW5kIGByZWRvYFxuICAgKiBvcGVyYXRpb25zLlxuICAgKi9cbiAgY3JlYXRlU25hcHNob3QoKSB7XG4gICAgLy8gZWxpbWluYXRlIHByZXZpb3VzIGZ1dHVyZSwgY3JlYXRlIGEgZHlzdG9waWFcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5faGlzdG9yeS5zbGljZSgwLCB0aGlzLl9oaXN0b3J5UG9pbnRlciArIDEpO1xuXG4gICAgY29uc3QgbWF4SW5kZXggPSB0aGlzLl9oaXN0b3J5TGVuZ3RoIC0gMTtcbiAgICB0aGlzLl9oaXN0b3J5UG9pbnRlciA9IE1hdGgubWluKG1heEluZGV4LCB0aGlzLl9oaXN0b3J5UG9pbnRlciArIDEpO1xuXG4gICAgY29uc3QganNvbiA9IHRoaXMuX2NvcHkodGhpcy50cmFja0NvbmZpZyk7XG5cbiAgICBpZiAodGhpcy5faGlzdG9yeS5sZW5ndGggPT09IHRoaXMuX2hpc3RvcnlMZW5ndGgpXG4gICAgICB0aGlzLl9oaXN0b3J5LnNoaWZ0KCk7XG5cbiAgICB0aGlzLl9oaXN0b3J5W3RoaXMuX2hpc3RvcnlQb2ludGVyXSA9IGpzb247XG4gIH1cblxuICBnZXRTbmFwc2hvdCgpIHtcbiAgICBpZiAodGhpcy50cmFja0NvbmZpZylcbiAgICAgIHJldHVybiB0aGlzLl9jb3B5KHRoaXMudHJhY2tDb25maWcpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvIHRvIGxhc3Qgc25hcHNob3QuXG4gICAqL1xuICB1bmRvKCkge1xuICAgIGNvbnN0IHBvaW50ZXIgPSB0aGlzLl9oaXN0b3J5UG9pbnRlciAtIDE7XG5cbiAgICBpZiAocG9pbnRlciA+PSAwKSB7XG4gICAgICBjb25zdCBqc29uID0gdGhpcy5faGlzdG9yeVtwb2ludGVyXTtcbiAgICAgIHRoaXMuX2hpc3RvcnlQb2ludGVyID0gcG9pbnRlcjtcbiAgICAgIC8vIGNyZWF0ZSBhIGNvcHkgZm9yIHVzZSBhcyBhIHdvcmtpbmcgb2JqZWN0XG4gICAgICB0aGlzLnNldFRyYWNrKHRoaXMuX2NvcHkoanNvbiksIHRoaXMudHJhY2tCdWZmZXIsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gbmV4dCBzbmFwc2hvdC5cbiAgICovXG4gIHJlZG8oKSB7XG4gICAgY29uc3QgcG9pbnRlciA9IHRoaXMuX2hpc3RvcnlQb2ludGVyICsgMTtcbiAgICBjb25zdCBqc29uID0gdGhpcy5faGlzdG9yeVtwb2ludGVyXTtcblxuICAgIGlmIChqc29uKSB7XG4gICAgICB0aGlzLl9oaXN0b3J5UG9pbnRlciA9IHBvaW50ZXI7XG4gICAgICAvLyBjcmVhdGUgYSBjb3B5IGZvciB1c2UgYXMgYSB3b3JraW5nIG9iamVjdFxuICAgICAgdGhpcy5zZXRUcmFjayh0aGlzLl9jb3B5KGpzb24pLCB0aGlzLnRyYWNrQnVmZmVyLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHZpc3VhbCBpbnRlcmZhY2VcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSBwbGF5ZXIuIERlZmF1bHRzIHRvIHRoZSB3aWR0aCBvZiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICAgKlxuICAgKiBAbmFtZSB3aWR0aFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG5cbiAgICB0aGlzLnVpLnRpbWVsaW5lLm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVpLnRpbWVsaW5lLnZpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgdGhpcy51aS50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5yZW5kZXIoKTtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZXRXaWR0aCcsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSBwbGF5ZXIuIERlZmF1bHRzIHRvIHRoZSBoZWlnaHQgb2YgdGhlIGdpdmVuIGNvbnRhaW5lci5cbiAgICpcbiAgICogQG5hbWUgaGVpZ2h0XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuXG4gICAgdGhpcy51aS50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldEhlaWdodCcsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb2VzIHRoaXMgbWFrZSBzZW5zID9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICAvLyBmb3JjZSByZW5kZXJpbmcgZnJvbSBvdXRzaWRlIHRoZSBtb2R1bGUgKGkuZS4gaWYgdmFsdWVzIGhhdmUgY2hhbmdlZClcbiAgICB0aGlzLnVpLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKCdyZW5kZXInKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB0cmFja3NcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFNldCBvciBjaGFuZ2UgdGhlIHRyYWNrIG9mIHRoZSBwbGF5ZXIuIEEgdHJhY2sgaXMgYSBKU09OIG9iamVjdCB0aGF0IG11c3RcbiAgICogZm9sbG93IHRoZSBjb252ZW50aW9uIGRlZmluZWQgPz9cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRyYWNrQ29uZmlnIC0gTWV0YWRhdGEgb2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFja0J1ZmZlciAtIERhdGEgYnVmZmVyIChha2EuIEF1ZGlvQnVmZmVyKVxuICAgKiAvLyBAcGFyYW0ge0Jvb2xlYW59IGNyZWF0ZVNuYXBzaG90IC0gZm9yIGludGVybmFsIHVzZSBvbmx5IChjZiB1bmRvIGFuZCByZWRvKVxuICAgKlxuICAgKiBAc2VlIHs/Pz99XG4gICAqL1xuICBzZXRUcmFjayh0cmFja0NvbmZpZywgdHJhY2tCdWZmZXIsIGNyZWF0ZVNuYXBzaG90ID0gdHJ1ZSkge1xuICAgIHRoaXMudHJhY2tDb25maWcgPSB0cmFja0NvbmZpZztcbiAgICB0aGlzLnRyYWNrQnVmZmVyID0gdHJhY2tCdWZmZXI7XG4gICAgdGhpcy5wbGF5ZXIuc2V0VHJhY2sodHJhY2tCdWZmZXIpOyAvLyBpbnRlcm5hbGx5IHN0b3BzIHRoZSBwbGF5IGNvbnRyb2xcblxuICAgIC8vIEB0b2RvIC0gc2hvdWxkIHJlc2V0IGhpc3Rvcnkgd2hlbiBmYWxzZVxuICAgIGlmIChjcmVhdGVTbmFwc2hvdCA9PT0gdHJ1ZSlcbiAgICAgIHRoaXMuY3JlYXRlU25hcHNob3QoKTtcblxuICAgIC8vIHByb3BhZ2F0ZSBldmVudHNcbiAgICB0aGlzLnN0b3AoKTtcblxuICAgIHRoaXMudWkudGltZWxpbmUucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy53aWR0aCAvIHRoaXMuZHVyYXRpb247XG4gICAgdGhpcy51aS50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldFRyYWNrJywgdHJhY2tDb25maWcsIHRyYWNrQnVmZmVyKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBhdWRpbyBpbnRlcmZhY2VcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBoZWFkIGluIHRoZSBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAbmFtZSBwb3NpdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgcG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyLnBvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIER1cmF0aW9uIG9mIHRoZSBjdXJyZW50IGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBuYW1lIGR1cmF0aW9uXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXIuZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogVm9sdW1lIG9mIHRoZSBhdWRpby5cbiAgICpcbiAgICogQHRvZG8gLSBtb3ZlIHRvIGRCIHZhbHVlcyA/XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBnYWluIC0gTGluZWFyIGdhaW4gKGJldHdlZW4gMCBhbmQgMSlcbiAgICovXG4gIHZvbHVtZShnYWluKSB7XG4gICAgaWYgKHRoaXMucGxheWVyLnZvbHVtZSlcbiAgICAgIHRoaXMucGxheWVyLnZvbHVtZShnYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgcGxheWVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gdHJ1ZSxcbiAgICB0aGlzLnBsYXllci5zdGFydCgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzdGFydCcpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TVEFSVCk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG5cbiAgICB0aGlzLl9tb25pdG9yUG9zaXRpb25SYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9tb25pdG9yUG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIHBsYXllciAoc2hvcnRjdXQgZm9yIGBwYXVzZWAgYW5kIGBzZWVrYCB0byAwKS5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2UsXG4gICAgdGhpcy5wbGF5ZXIuc3RvcCgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzdG9wJyk7XG5cbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNUT1ApO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdXNlIHRoZSBwbGF5ZXIuXG4gICAqL1xuICBwYXVzZSgpIHtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZSxcbiAgICB0aGlzLnBsYXllci5wYXVzZSgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdwYXVzZScpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5QQVVTRSk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU2VlayB0byBhIG5ldyBwb3NpdGlvbiBpbiB0aGUgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gTmV3IHBvc2l0aW9uLlxuICAgKi9cbiAgc2Vlayhwb3NpdGlvbikge1xuICAgIHBvc2l0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ocG9zaXRpb24sIHRoaXMucGxheWVyLmR1cmF0aW9uKSk7XG4gICAgdGhpcy5wbGF5ZXIuc2Vlayhwb3NpdGlvbik7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NlZWsnLCBwb3NpdGlvbiwgdGhpcy5faXNQbGF5aW5nKTtcbiAgICAvLyBhcyB0aGUgcG9zaXRpb24gY2FuIGJlIG1vZGlmaWVkIGJ5IHRoZSBTZWVrQ29udHJvbFxuICAgIHRoaXMuZW1pdChFVkVOVFMuU0VFSywgdGhpcy5wbGF5ZXIucG9zaXRpb24pO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucGxheWVyLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKiBTaG9ydGN1dCBmb3IgYHRoaXMuZW1pdCgncG9zaXRpb24nLCBwb3NpdGlvbiwgZHVyYXRpb24pYFxuICAgKi9cbiAgZW1pdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5lbWl0KEVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCBwb3NpdGlvbiwgdGhpcy5wbGF5ZXIuZHVyYXRpb24pO1xuICB9XG5cbiAgICAvKipcbiAgICogRW1pdCB0aGUgYGVuZGVkYCBldmVudC5cbiAgICovXG4gIGVuZGVkKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5lbWl0KEVWRU5UUy5FTkRFRCwgcG9zaXRpb24pO1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwbGF5ZXIgaW4gYSByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBsb29wLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21vbml0b3JQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5wbGF5ZXIucnVubmluZylcbiAgICAgIHRoaXMuX21vbml0b3JQb3NpdGlvblJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX21vbml0b3JQb3NpdGlvbik7XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucGxheWVyLnBvc2l0aW9uO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wbGF5ZXIuZHVyYXRpb247XG4gICAgdGhpcy5lbWl0UG9zaXRpb24ocG9zaXRpb24pO1xuXG4gICAgaWYgKHBvc2l0aW9uID4gZHVyYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5lbmRlZChwb3NpdGlvbik7IC8vIHBsYXllciBzdG9wcyB0aGUgcGxheUNvbnRyb2xcblxuICAgIHRoaXMucGxheWVyLm1vbml0b3JQb3NpdGlvbigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsb2NrO1xuIl19