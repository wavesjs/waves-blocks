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
// import AbstractModule from './AbstractModule';

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
   * const block = new blocks.core.Block({
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

    this.$container = $container;

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
     * Set or change the track of the player. A track is a JSON object that must
     * follow the convention defined ??
     *
     * @param {Object} trackMetadata - Metadata object
     * @param {Object} trackData - Data buffer (aka. AudioBuffer)
     * // @param {Boolean} createSnapshot - for internal use only (cf undo and redo)
     *
     * @see {???}
     */

  }, {
    key: 'setTrack',
    value: function setTrack(trackData, trackMetadata) {
      var createSnapshot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      this.trackMetadata = trackMetadata;
      this.trackData = trackData;
      this.player.setBuffer(trackData); // internally stops the play control

      // @todo - should reset history when false
      if (createSnapshot === true) this.createSnapshot();

      // propagate events
      this.stop();

      this.ui.timeline.pixelsPerSecond = this.width / this.duration;
      this.ui.timeContext.duration = this.duration;

      this._executeCommandForward('setTrack', trackData, trackMetadata);
      // re-render block
      this.render();
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
      // eliminate previous future, create a dystopia...
      this._history = this._history.slice(0, this._historyPointer + 1);

      var maxIndex = this._historyLength - 1;
      this._historyPointer = Math.min(maxIndex, this._historyPointer + 1);

      var json = this._copy(this.trackMetadata);

      if (this._history.length === this._historyLength) this._history.shift();

      this._history[this._historyPointer] = json;
    }
  }, {
    key: 'getSnapshot',
    value: function getSnapshot() {
      if (this.trackMetadata) return this._copy(this.trackMetadata);else return null;
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
        this.setTrack(this._copy(json), this.trackData, false);
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
        this.setTrack(this._copy(json), this.trackData, false);
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
      this._width = value;
      this.$container.style.width = value + 'px';

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
      this.$container.style.height = value + 'px';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJsb2NrLmpzIl0sIm5hbWVzIjpbInVpIiwiRVZFTlRTIiwiU1RBUlQiLCJQQVVTRSIsIlNUT1AiLCJTRUVLIiwiRU5ERUQiLCJDVVJSRU5UX1BPU0lUSU9OIiwiVUkiLCIkY29udGFpbmVyIiwid2lkdGgiLCJoZWlnaHQiLCJ0aW1lbGluZSIsImNvcmUiLCJUaW1lbGluZSIsInRyYWNrIiwiVHJhY2siLCJhZGQiLCJ1cGRhdGVDb250YWluZXIiLCJ0aW1lQ29udGV4dCIsIkxheWVyVGltZUNvbnRleHQiLCJkZWZpbml0aW9ucyIsImNvbnRhaW5lciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJwbGF5ZXIiLCJudWxsYWJsZSIsInNpemUiLCJsaXN0IiwibWluIiwibWF4IiwiSW5maW5pdHkiLCJCbG9jayIsIm9wdGlvbnMiLCJwYXJhbXMiLCJnZXQiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYm91bmRpbmdDbGllbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiX3dpZHRoIiwiX2hlaWdodCIsInN0eWxlIiwicGxheWVyQ3RvciIsIl9oaXN0b3J5IiwiX2hpc3RvcnlMZW5ndGgiLCJfaGlzdG9yeVBvaW50ZXIiLCJfbGlzdGVuZXJzIiwiX21vZHVsZXMiLCJfaXNQbGF5aW5nIiwiX21vbml0b3JQb3NpdGlvbiIsImJpbmQiLCJfb25FdmVudCIsImFkZExpc3RlbmVyIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0IiwibGlzdGVuZXJzIiwiZGVsZXRlIiwiY2xlYXIiLCJhcmdzIiwidW5kZWZpbmVkIiwiZm9yRWFjaCIsImxpc3RlbmVyIiwiZSIsImhpdExheWVycyIsIl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkIiwibW9kdWxlIiwiekluZGV4IiwiaW5kZXgiLCJpbmRleE9mIiwiYmxvY2siLCJpbnN0YWxsIiwidHJhY2tNZXRhZGF0YSIsInNldFRyYWNrIiwidHJhY2tEYXRhIiwicHVzaCIsInJlbmRlciIsInVuaW5zdGFsbCIsInNwbGljZSIsImNyZWF0ZVNuYXBzaG90Iiwic2V0QnVmZmVyIiwic3RvcCIsInBpeGVsc1BlclNlY29uZCIsImR1cmF0aW9uIiwiX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCIsImNvbW1hbmQiLCJpIiwibCIsImxlbmd0aCIsIm5leHQiLCJvYmoiLCJjb3B5IiwiSlNPTiIsInBhcnNlIiwic2xpY2UiLCJtYXhJbmRleCIsIk1hdGgiLCJqc29uIiwiX2NvcHkiLCJzaGlmdCIsInBvaW50ZXIiLCJ0cmFja3MiLCJ1cGRhdGUiLCJkYiIsInZvbHVtZSIsInN0YXJ0IiwiZW1pdCIsImVtaXRQb3NpdGlvbiIsInBvc2l0aW9uIiwiX21vbml0b3JQb3NpdGlvblJhZklkIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicGF1c2UiLCJzZWVrIiwicnVubmluZyIsImVuZGVkIiwibW9uaXRvclBvc2l0aW9uIiwidmFsdWUiLCJtYWludGFpblZpc2libGVEdXJhdGlvbiIsInZpc2libGVXaWR0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFFWjs7Ozs7Ozs7QUFFQSxJQUFNQyxTQUFTO0FBQ2I7QUFDQTtBQUNBQyxTQUFPLE9BSE07QUFJYjtBQUNBO0FBQ0FDLFNBQU8sT0FOTTtBQU9iO0FBQ0E7QUFDQUMsUUFBTSxNQVRPO0FBVWI7QUFDQTtBQUNBQyxRQUFNLE1BWk87QUFhYjtBQUNBO0FBQ0FDLFNBQU8sT0FmTTtBQWdCYjtBQUNBO0FBQ0E7QUFDQUMsb0JBQWtCO0FBbkJMLENBQWY7QUFIQTs7SUF5Qk1DLEUsR0FDSixZQUFZQyxVQUFaLEVBQXdCQyxLQUF4QixFQUErQkMsTUFBL0IsRUFBdUM7QUFBQTs7QUFDckM7QUFDQSxPQUFLQyxRQUFMLEdBQWdCLElBQUlaLEdBQUdhLElBQUgsQ0FBUUMsUUFBWixDQUFxQixDQUFyQixFQUF3QkosS0FBeEIsQ0FBaEI7QUFDQSxPQUFLSyxLQUFMLEdB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RCxLIiwiZmlsZSI6IkJsb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuLy8gaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAnQGlyY2FtL3BhcmFtZXRlcnMnO1xuXG5jb25zdCBFVkVOVFMgPSB7XG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gcG9zaXRpb24gP1xuICBTVEFSVDogJ3N0YXJ0JyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvbiA/XG4gIFBBVVNFOiAncGF1c2UnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHBvc2l0aW9uID9cbiAgU1RPUDogJ3N0b3AnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIHRhcmdldCBwb3NpdGlvblxuICBTRUVLOiAnc2VlaycsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gYnVmZmVyLmR1cmF0aW9uIGlmIHJlYWwtZW5kLCBsYXN0IHNlZ21lbnQuZW5kVGltZSBpbiBQcmVMaXN0ZW5pbmcgbW9kZVxuICBFTkRFRDogJ2VuZGVkJyxcbiAgLy8gdHJpZ2VyZWQgb24gc3RhcnQsIHN0b3AsIHBhdXNlIGFuZCBhdCBlYWNoIHJhZiBpZiBwbGF5aW5nXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gY3VycmVudCBwb3NpdGlvblxuICBDVVJSRU5UX1BPU0lUSU9OOiAncG9zaXRpb24nLFxufTtcblxuY2xhc3MgVUkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gYXJiaXRyYXJ5IGBwaXhlbHNQZXJTZWNvbmRgIHZhbHVlIHRvIHVwZGF0ZSB3aGVuIGEgdHJhY2sgaXMgc2V0XG4gICAgdGhpcy50aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHdpZHRoKTtcbiAgICB0aGlzLnRyYWNrID0gbmV3IHVpLmNvcmUuVHJhY2soJGNvbnRhaW5lciwgaGVpZ2h0KTtcblxuICAgIHRoaXMudGltZWxpbmUuYWRkKHRoaXMudHJhY2ssICdkZWZhdWx0Jyk7XG4gICAgdGhpcy50cmFjay51cGRhdGVDb250YWluZXIoKTsgLy8gaW5pdCB0cmFjayBET00gdHJlZVxuXG4gICAgLy8gdGltZSBjb250ZXh0IHRoYXQgc2hvdWxkIGJlIHNoYXJlZCBieSBhbGwgKG1vc3QpIG1peGlucyAvIHVpIGxheWVyc1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHRoaXMudGltZWxpbmUudGltZUNvbnRleHQpO1xuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb250YWluZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ3NzIFNlbGVjdG9yIG9yIERPTSBFbGVtZW50IGhvc3RpbmcgdGhlIGJsb2NrJ1xuICAgIH1cbiAgfSxcbiAgcGxheWVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ0NvbnN0cnVjdG9yIG9mIHRoZSBwbGF5ZXIgdG8gYmUgdXNlZCBpbiB0aGUgYmxvY2snLFxuICAgIH0sXG4gIH0sXG4gIHNpemU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWydhdXRvJywgJ21hbnVhbCddLFxuICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgd2lkdGg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGhlaWdodDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgYXVkaW8tdmlzdWFsIHBsYXllciB0byBiZSBkZWNvcmF0ZWQgd2l0aCBhZGRpdGlvbm5hbCBtb2R1bGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIChubyBvcHRpb25zIGZvciBub3cpXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBbb3B0aW9ucy5jb250YWluZXJdIC0gQ3NzIFNlbGVjdG9yIG9yIERPTSBFbGVtZW50IHRoYXQgd2lsbFxuICogIGhvc3QgdGhlIHBsYXllciBhbmQgYWRkaXRpb25uYWwgbW9kdWxlc1xuICogQHBhcmFtIHtBYnN0cmFjdFBsYXllcn0gLSBUaGUgcGxheWVyIHRvIGJlIHVzZWQgYnkgdGhlIGJsb2NrLlxuICogQHBhcmFtIHsnYXV0byd8J21hbnVhbCd9IFtvcHRpb25zLnNpemU9J2F1dG8nXSAtIEhvdyB0aGUgc2l6ZSBvZiB0aGUgYmxvY2tcbiAqICBzaG91bGQgYmUgZGVmaW5lZC4gSWYgJ2F1dG8nLCB0aGUgYmxvY2sgYWRqdXN0IHRvIHRoZSBzaXplIG9mIHRoZSBjb250YWluZXIuXG4gKiAgSWYgJ21hbnVhbCcsIHVzZSBgd2lkdGhgIGFuZCBgaGVpZ2h0YCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPW51bGxdIC0gV2lkdGggb2YgdGhlIGJsb2NrIGlmIHNpemUgaXMgJ21hbnVhbCcuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PW51bGxdIC0gSGVpZ2h0IG9mIHRoZSBibG9jayBpZiBzaXplIGlzICdtYW51YWwnLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIGNvbnN0ICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGFpbmVyJyk7XG4gKiBjb25zdCBkZWZhdWx0V2lkdGggPSAxMDAwO1xuICogY29uc3QgZGVmYXVsdEhlaWdodCA9IDEwMDA7XG4gKiBjb25zdCBibG9jayA9IG5ldyBibG9ja3MuY29yZS5CbG9jayh7XG4gKiAgIHBsYXllcjogYWJjLnBsYXllci5TZWVrUGxheWVyLFxuICogICBjb250YWluZXI6ICRjb250YWluZXIsXG4gKiAgIHNpemU6ICdtYW51YWwnLCAvLyBpZiAnYXV0bycsIGFkanVzdCB0byBmaWxsICRjb250YWluZXIgc2l6ZVxuICogICB3aWR0aDogZGVmYXVsdFdpZHRoLFxuICogICBoZWlnaHQ6IGRlZmF1bHRIZWlnaHQsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB3YXZlZm9ybU1vZHVsZSA9IG5ldyBibG9ja3MubW9kdWxlLldhdmVmb3JtTW9kdWxlKCk7XG4gKiBjb25zdCBjdXJzb3JNb2R1bGUgPSBuZXcgYmxvY2tzLm1vZHVsZS5DdXJzb3JNb2R1bGUoKTtcbiAqXG4gKiBibG9jay5hZGQoc2ltcGxlV2F2ZWZvcm1Nb2R1bGUpO1xuICogYmxvY2suYWRkKGN1cnNvck1vZHVsZSk7XG4gKiBgYGBcbiAqL1xuY2xhc3MgQmxvY2sge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIGxldCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdjb250YWluZXInKTtcblxuICAgICRjb250YWluZXIgPSAoJGNvbnRhaW5lciBpbnN0YW5jZW9mIEVsZW1lbnQpID9cbiAgICAgICRjb250YWluZXIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuXG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnc2l6ZScpO1xuXG4gICAgaWYgKHNpemUgPT09ICdhdXRvJykge1xuICAgICAgY29uc3QgYm91bmRpbmdDbGllbnRSZWN0ID0gJGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgdGhpcy5fd2lkdGggPSBib3VuZGluZ0NsaWVudFJlY3Qud2lkdGg7XG4gICAgICB0aGlzLl9oZWlnaHQgPSBib3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0O1xuXG4gICAgfSBlbHNlIGlmIChzaXplID09PSAnbWFudWFsJykge1xuICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5nZXQoJ3dpZHRoJyk7XG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2hlaWdodCcpO1xuXG4gICAgICAkY29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgICAgJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuXG4gICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xuICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG5cbiAgICBjb25zdCBwbGF5ZXJDdG9yID0gdGhpcy5wYXJhbXMuZ2V0KCdwbGF5ZXInKTtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBwbGF5ZXJDdG9yKHRoaXMpO1xuICAgIHRoaXMudWkgPSBuZXcgVUkoY29udGFpbmVyLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICB0aGlzLkVWRU5UUyA9IEVWRU5UUztcbiAgICAvLyBzbmFwc2hvdHMgb2YgdGhlIGRhdGFcbiAgICB0aGlzLl9oaXN0b3J5ID0gW107XG4gICAgdGhpcy5faGlzdG9yeUxlbmd0aCA9IDEwO1xuICAgIHRoaXMuX2hpc3RvcnlQb2ludGVyID0gLTE7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fbW9kdWxlcyA9IFtdO1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uID0gdGhpcy5fbW9uaXRvclBvc2l0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcblxuICAgIC8vIGxpc3RlbiBldmVudHMgZnJvbSB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXNcbiAgICB0aGlzLnVpLnRpbWVsaW5lLmFkZExpc3RlbmVyKCdldmVudCcsIHRoaXMuX29uRXZlbnQpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGV2ZW50IHN5c3RlbVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gYSBzcGVjaWZpYyBjaGFubmVsIG9mIHRoZSBwbGF5ZXIuXG4gICAqIEF2YWlsYWJsZSBldmVudHMgYXJlOlxuICAgKiAtIGAnc3RhcnQnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzdGFydHNcbiAgICogLSBgJ3BhdXNlJ2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgaXMgcGF1c2VkXG4gICAqIC0gYCdzdG9wJ2AgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIGlzIHN0b3BwZWQgKHBhdXNlKCkgKyBzZWVrKDApKVxuICAgKiAtIGAnc2VlaydgIDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBzZWVrIHRvIGEgbmV3IHBvc2l0aW9uXG4gICAqIC0gYCdlbmRlZCdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHN0b3BzIGF0IHRoZSBlbmQgb2YgdGhlIGZpbGUgKG9yIGF0XG4gICAqICAgICAgICAgICAgICB0aGUgZW5kIG9mIHRoZSBsYXN0IHNlZ21lbnQpLiBUaGUgY2FsbGJhY2sgaXMgZXhlY3V0ZWQgd2l0aCB0aGVcbiAgICogICAgICAgICAgICAgIHN0b3AgcG9zaXRpb24uXG4gICAqIC0gYCdwb3NpdGlvbidgOiB0cmlnZ2VyZWQgYXQgZWFjaCByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSB3aXRoIHRoZSBjdXJyZW50XG4gICAqICAgICAgICAgICAgICBwb3NpdGlvbiBhbmQgZHVyYXRpb24gb2YgdGhlIGF1ZGlvIGZpbGUuIFRyaWdnZXIgb25seSB3aGVuXG4gICAqICAgICAgICAgICAgICB0aGUgcGxheWVyIGlzIHBsYXlpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICovXG4gIGFkZExpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChjaGFubmVsLCBuZXcgU2V0KCkpO1xuXG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICBsaXN0ZW5lcnMuYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGEgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgc3Vic2NpYmVycyBmcm9tIGEgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsLlxuICAgKi9cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKGNoYW5uZWwpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzLmhhcyhjaGFubmVsKSkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcbiAgICAgIGxpc3RlbmVycy5jbGVhcigpO1xuXG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGNoYW5uZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBzdWJzY3JpYmVycyBvZiBhIGV2ZW50IHdpdGggZ2l2ZW4gYXJndW1lbnRzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChjaGFubmVsKTtcblxuICAgIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZClcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWluIGV2ZW50IGxpc3RlbmVyIG9mIHRoZSB3YXZlcy11aSB0aW1lbGluZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoJ29uRXZlbnQnLCBlLCBoaXRMYXllcnMpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIG1vZHVsZSBjaGFpblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQWRkIGEgbW9kdWxlIHRvIHRoZSBwbGF5ZXIuIEEgbW9kdWxlIGlzIGRlZmluZWQgYXMgYSBzcGVjaWZpYyBzZXRcbiAgICogb2YgZnVuY3Rpb25uYWxpdHkgYW5kIHZpc3VhbGl6YXRpb25zIG9uIHRvcCBvZiB0aGUgcGxheWVyLlxuICAgKiBNb2R1bGUgY2FuIGltcGxlbWVudCBmZWF0dXJlcyBzdWNoIGFzIHdhdmVmb3JtLCBtb3ZpbmcgY3Vyc29yLCBldGMuXG4gICAqXG4gICAqIEBwYXJhbSB7QWJzdHJhY3RNb2R1bGV9IG1vZHVsZSAtIE1vZHVsZSB0byBhZGRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHpJbmRleCAtIHpJbmRleCBvZiB0aGUgYWRkZWQgbW9kdWxlXG4gICAqL1xuICBhZGQobW9kdWxlLCB6SW5kZXggPSAwKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kdWxlKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIG1vZHVsZS5ibG9jayA9IHRoaXM7XG4gICAgICBtb2R1bGUuekluZGV4ID0gekluZGV4O1xuICAgICAgbW9kdWxlLmluc3RhbGwodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLnRyYWNrTWV0YWRhdGEgJiYgbW9kdWxlLnNldFRyYWNrKVxuICAgICAgICBtb2R1bGUuc2V0VHJhY2sodGhpcy50cmFja0RhdGEsIHRoaXMudHJhY2tNZXRhZGF0YSk7XG5cbiAgICAgIHRoaXMuX21vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbW9kdWxlIGZyb20gdGhlIHBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtBYnN0cmFjdE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlKG1vZHVsZSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbW9kdWxlcy5pbmRleE9mKG1vZHVsZSk7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBtb2R1bGUudW5pbnN0YWxsKHRoaXMpO1xuICAgICAgbW9kdWxlLmJsb2NrID0gbnVsbDtcbiAgICAgIG1vZHVsZS56SW5kZXggPSBudWxsO1xuXG4gICAgICB0aGlzLl9tb2R1bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgY2hhbmdlIHRoZSB0cmFjayBvZiB0aGUgcGxheWVyLiBBIHRyYWNrIGlzIGEgSlNPTiBvYmplY3QgdGhhdCBtdXN0XG4gICAqIGZvbGxvdyB0aGUgY29udmVudGlvbiBkZWZpbmVkID8/XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFja01ldGFkYXRhIC0gTWV0YWRhdGEgb2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFja0RhdGEgLSBEYXRhIGJ1ZmZlciAoYWthLiBBdWRpb0J1ZmZlcilcbiAgICogLy8gQHBhcmFtIHtCb29sZWFufSBjcmVhdGVTbmFwc2hvdCAtIGZvciBpbnRlcm5hbCB1c2Ugb25seSAoY2YgdW5kbyBhbmQgcmVkbylcbiAgICpcbiAgICogQHNlZSB7Pz8/fVxuICAgKi9cbiAgc2V0VHJhY2sodHJhY2tEYXRhLCB0cmFja01ldGFkYXRhLCBjcmVhdGVTbmFwc2hvdCA9IHRydWUpIHtcbiAgICB0aGlzLnRyYWNrTWV0YWRhdGEgPSB0cmFja01ldGFkYXRhO1xuICAgIHRoaXMudHJhY2tEYXRhID0gdHJhY2tEYXRhO1xuICAgIHRoaXMucGxheWVyLnNldEJ1ZmZlcih0cmFja0RhdGEpOyAvLyBpbnRlcm5hbGx5IHN0b3BzIHRoZSBwbGF5IGNvbnRyb2xcblxuICAgIC8vIEB0b2RvIC0gc2hvdWxkIHJlc2V0IGhpc3Rvcnkgd2hlbiBmYWxzZVxuICAgIGlmIChjcmVhdGVTbmFwc2hvdCA9PT0gdHJ1ZSlcbiAgICAgIHRoaXMuY3JlYXRlU25hcHNob3QoKTtcblxuICAgIC8vIHByb3BhZ2F0ZSBldmVudHNcbiAgICB0aGlzLnN0b3AoKTtcblxuICAgIHRoaXMudWkudGltZWxpbmUucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy53aWR0aCAvIHRoaXMuZHVyYXRpb247XG4gICAgdGhpcy51aS50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldFRyYWNrJywgdHJhY2tEYXRhLCB0cmFja01ldGFkYXRhKTtcbiAgICAvLyByZS1yZW5kZXIgYmxvY2tcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNvbW1hbmQgb24gZWFjaCBtb2R1bGUgdGhhdCBpbXBsZW1lbnRzIHRoZSBtZXRob2QuIFRoZSBjb21tYW5kXG4gICAqIGFyZSBleGVjdXRlZCBpbiB0aGUgb3JkZXIgaW4gd2hpY2ggbW9kdWxlcyB3ZXJlIGFkZGVkIHRvIHRoZSBwbGF5ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKGNvbW1hbmQsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuX21vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBtb2R1bGUgPSB0aGlzLl9tb2R1bGVzW2ldO1xuXG4gICAgICBpZiAobW9kdWxlW2NvbW1hbmRdKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBtb2R1bGVbY29tbWFuZF0oLi4uYXJncyk7XG5cbiAgICAgICAgaWYgKG5leHQgPT09IGZhbHNlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGNvbW1hbmQgb24gZWFjaCBtb2R1bGUgdGhhdCBpbXBsZW1lbnRzIHRoZSBtZXRob2QuIFRoZSBjb21tYW5kXG4gICAqIGFyZSBleGVjdXRlZCBpbiB0aGUgcmV2ZXJzZSBvcmRlciBpbiB3aGljaCBtb2R1bGVzIHdlcmUgYWRkZWQgdG8gdGhlIHBsYXllci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKGNvbW1hbmQsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5fbW9kdWxlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5fbW9kdWxlc1tpXTtcblxuICAgICAgaWYgKG1vZHVsZVtjb21tYW5kXSkge1xuICAgICAgICBjb25zdCBuZXh0ID0gbW9kdWxlW2NvbW1hbmRdKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gdW5kbyAvIHJlZG9cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIENvcHkgY3VycmVudCBjb25maWcgdG8gY3JlYXRlIHNuYXBzaG90c1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyAtIGRlZmluZSBob3cgdG8gaGFuZGxlIHRoYXQuLi5cbiAgICovXG4gIF9jb3B5KG9iaikge1xuICAgIGNvbnN0IGNvcHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgIHJldHVybiBjb3B5O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHNuYXBzaG90IG9mIHRoZSBkYXRhIGFmdGVyIG1vZGlmaWNhdGlvbnMuIFNob3VsZCBiZSB1c2VkIGluIG1vZHVsZXNcbiAgICogYWZ0ZXIgZWFjaCBzaWduaWZpY2FudCBvcGVyYXRpb24sIGluIG9yZGVyIHRvIGFsbG93IGB1bmRvYCBhbmQgYHJlZG9gXG4gICAqIG9wZXJhdGlvbnMuXG4gICAqL1xuICBjcmVhdGVTbmFwc2hvdCgpIHtcbiAgICAvLyBlbGltaW5hdGUgcHJldmlvdXMgZnV0dXJlLCBjcmVhdGUgYSBkeXN0b3BpYS4uLlxuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLl9oaXN0b3J5LnNsaWNlKDAsIHRoaXMuX2hpc3RvcnlQb2ludGVyICsgMSk7XG5cbiAgICBjb25zdCBtYXhJbmRleCA9IHRoaXMuX2hpc3RvcnlMZW5ndGggLSAxO1xuICAgIHRoaXMuX2hpc3RvcnlQb2ludGVyID0gTWF0aC5taW4obWF4SW5kZXgsIHRoaXMuX2hpc3RvcnlQb2ludGVyICsgMSk7XG5cbiAgICBjb25zdCBqc29uID0gdGhpcy5fY29weSh0aGlzLnRyYWNrTWV0YWRhdGEpO1xuXG4gICAgaWYgKHRoaXMuX2hpc3RvcnkubGVuZ3RoID09PSB0aGlzLl9oaXN0b3J5TGVuZ3RoKVxuICAgICAgdGhpcy5faGlzdG9yeS5zaGlmdCgpO1xuXG4gICAgdGhpcy5faGlzdG9yeVt0aGlzLl9oaXN0b3J5UG9pbnRlcl0gPSBqc29uO1xuICB9XG5cbiAgZ2V0U25hcHNob3QoKSB7XG4gICAgaWYgKHRoaXMudHJhY2tNZXRhZGF0YSlcbiAgICAgIHJldHVybiB0aGlzLl9jb3B5KHRoaXMudHJhY2tNZXRhZGF0YSk7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gbGFzdCBzbmFwc2hvdC5cbiAgICovXG4gIHVuZG8oKSB7XG4gICAgY29uc3QgcG9pbnRlciA9IHRoaXMuX2hpc3RvcnlQb2ludGVyIC0gMTtcblxuICAgIGlmIChwb2ludGVyID49IDApIHtcbiAgICAgIGNvbnN0IGpzb24gPSB0aGlzLl9oaXN0b3J5W3BvaW50ZXJdO1xuICAgICAgdGhpcy5faGlzdG9yeVBvaW50ZXIgPSBwb2ludGVyO1xuICAgICAgLy8gY3JlYXRlIGEgY29weSBmb3IgdXNlIGFzIGEgd29ya2luZyBvYmplY3RcbiAgICAgIHRoaXMuc2V0VHJhY2sodGhpcy5fY29weShqc29uKSwgdGhpcy50cmFja0RhdGEsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gbmV4dCBzbmFwc2hvdC5cbiAgICovXG4gIHJlZG8oKSB7XG4gICAgY29uc3QgcG9pbnRlciA9IHRoaXMuX2hpc3RvcnlQb2ludGVyICsgMTtcbiAgICBjb25zdCBqc29uID0gdGhpcy5faGlzdG9yeVtwb2ludGVyXTtcblxuICAgIGlmIChqc29uKSB7XG4gICAgICB0aGlzLl9oaXN0b3J5UG9pbnRlciA9IHBvaW50ZXI7XG4gICAgICAvLyBjcmVhdGUgYSBjb3B5IGZvciB1c2UgYXMgYSB3b3JraW5nIG9iamVjdFxuICAgICAgdGhpcy5zZXRUcmFjayh0aGlzLl9jb3B5KGpzb24pLCB0aGlzLnRyYWNrRGF0YSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB2aXN1YWwgaW50ZXJmYWNlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgcGxheWVyLiBEZWZhdWx0cyB0byB0aGUgd2lkdGggb2YgdGhlIGdpdmVuIGNvbnRhaW5lci5cbiAgICpcbiAgICogQG5hbWUgd2lkdGhcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xuICAgIHRoaXMuJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3ZhbHVlfXB4YDtcblxuICAgIHRoaXMudWkudGltZWxpbmUubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudWkudGltZWxpbmUudmlzaWJsZVdpZHRoID0gdmFsdWU7XG5cbiAgICB0aGlzLnVpLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLnJlbmRlcigpO1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldFdpZHRoJywgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHBsYXllci4gRGVmYXVsdHMgdG8gdGhlIGhlaWdodCBvZiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICAgKlxuICAgKiBAbmFtZSBoZWlnaHRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG4gICAgdGhpcy4kY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke3ZhbHVlfXB4YDtcblxuICAgIHRoaXMudWkudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2suaGVpZ2h0ID0gdmFsdWU7XG4gICAgICB0cmFjay5yZW5kZXIoKTtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZXRIZWlnaHQnLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogRG9lcyB0aGlzIG1ha2Ugc2VucyA/XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgLy8gZm9yY2UgcmVuZGVyaW5nIGZyb20gb3V0c2lkZSB0aGUgbW9kdWxlIChpLmUuIGlmIHZhbHVlcyBoYXZlIGNoYW5nZWQpXG4gICAgdGhpcy51aS50aW1lbGluZS50cmFja3MuZm9yRWFjaCh0cmFjayA9PiB7XG4gICAgICB0cmFjay5yZW5kZXIoKTtcbiAgICAgIHRyYWNrLnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCgncmVuZGVyJyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gYXVkaW8gaW50ZXJmYWNlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgaGVhZCBpbiB0aGUgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQG5hbWUgcG9zaXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXllci5wb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEdXJhdGlvbiBvZiB0aGUgY3VycmVudCBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAbmFtZSBkdXJhdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyLmR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFZvbHVtZSBvZiB0aGUgYXVkaW8gKGluIGRiKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRiIC0gdm9sdW1lIG9mIHRoZSBwbGF5ZXIgaW4gZGVjaWJlbHNcbiAgICovXG4gIHZvbHVtZShkYikge1xuICAgIHRoaXMucGxheWVyLnZvbHVtZShkYik7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHBsYXllci5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IHRydWUsXG4gICAgdGhpcy5wbGF5ZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc3RhcnQnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuU1RBUlQpO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuXG4gICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uUmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbW9uaXRvclBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBwbGF5ZXIgKHNob3J0Y3V0IGZvciBgcGF1c2VgIGFuZCBgc2Vla2AgdG8gMCkuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlLFxuICAgIHRoaXMucGxheWVyLnN0b3AoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc3RvcCcpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TVE9QKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZSB0aGUgcGxheWVyLlxuICAgKi9cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2UsXG4gICAgdGhpcy5wbGF5ZXIucGF1c2UoKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgncGF1c2UnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuUEFVU0UpO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZWsgdG8gYSBuZXcgcG9zaXRpb24gaW4gdGhlIGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIE5ldyBwb3NpdGlvbi5cbiAgICovXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICBwb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKHBvc2l0aW9uLCB0aGlzLnBsYXllci5kdXJhdGlvbikpO1xuICAgIHRoaXMucGxheWVyLnNlZWsocG9zaXRpb24pO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZWVrJywgcG9zaXRpb24sIHRoaXMuX2lzUGxheWluZyk7XG4gICAgLy8gYXMgdGhlIHBvc2l0aW9uIGNhbiBiZSBtb2RpZmllZCBieSB0aGUgU2Vla0NvbnRyb2xcbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNFRUssIHRoaXMucGxheWVyLnBvc2l0aW9uKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBsYXllci5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogRW1pdCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICogU2hvcnRjdXQgZm9yIGB0aGlzLmVtaXQoJ3Bvc2l0aW9uJywgcG9zaXRpb24sIGR1cmF0aW9uKWBcbiAgICovXG4gIGVtaXRQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIHRoaXMuZW1pdChFVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgcG9zaXRpb24sIHRoaXMucGxheWVyLmR1cmF0aW9uKTtcbiAgfVxuXG4gICAgLyoqXG4gICAqIEVtaXQgdGhlIGBlbmRlZGAgZXZlbnQuXG4gICAqL1xuICBlbmRlZChwb3NpdGlvbikge1xuICAgIHRoaXMuZW1pdChFVkVOVFMuRU5ERUQsIHBvc2l0aW9uKTtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYXRjaCB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcGxheWVyIGluIGEgcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgbG9vcC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9tb25pdG9yUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMucGxheWVyLnJ1bm5pbmcpXG4gICAgICB0aGlzLl9tb25pdG9yUG9zaXRpb25SYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9tb25pdG9yUG9zaXRpb24pO1xuXG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBsYXllci5wb3NpdGlvbjtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGxheWVyLmR1cmF0aW9uO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHBvc2l0aW9uKTtcblxuICAgIGlmIChwb3NpdGlvbiA+IGR1cmF0aW9uKVxuICAgICAgcmV0dXJuIHRoaXMuZW5kZWQocG9zaXRpb24pOyAvLyBwbGF5ZXIgc3RvcHMgdGhlIHBsYXlDb250cm9sXG5cbiAgICB0aGlzLnBsYXllci5tb25pdG9yUG9zaXRpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCbG9jaztcbiJdfQ==