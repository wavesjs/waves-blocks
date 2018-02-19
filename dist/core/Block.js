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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJFVkVOVFMiLCJTVEFSVCIsIlBBVVNFIiwiU1RPUCIsIlNFRUsiLCJFTkRFRCIsIkNVUlJFTlRfUE9TSVRJT04iLCJVUERBVEUiLCJVSSIsIiRjb250YWluZXIiLCJzaXppbmciLCJ3aWR0aCIsImhlaWdodCIsIkVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJib3VuZGluZ0NsaWVudFJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJzdHlsZSIsIl93aWR0aCIsIl9oZWlnaHQiLCJ0aW1lbGluZSIsImNvcmUiLCJUaW1lbGluZSIsInRyYWNrIiwiVHJhY2siLCJhZGQiLCJ1cGRhdGVDb250YWluZXIiLCJ0aW1lQ29udGV4dCIsIkxheWVyVGltZUNvbnRleHQiLCJ2YWx1ZSIsInRyYWNrcyIsImZvckVhY2giLCJyZW5kZXIiLCJ1cGRhdGUiLCJtYWludGFpblZpc2libGVEdXJhdGlvbiIsInZpc2libGVXaWR0aCIsImRlZmluaXRpb25zIiwiY29udGFpbmVyIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsInBsYXllciIsIm51bGxhYmxlIiwibGlzdCIsIm1pbiIsIm1heCIsIkluZmluaXR5IiwiQmxvY2siLCJvcHRpb25zIiwicGFyYW1zIiwidHJhY2tEYXRhIiwidHJhY2tNZXRhZGF0YSIsIl9saXN0ZW5lcnMiLCJfbW9kdWxlcyIsIl9pc1BsYXlpbmciLCJnZXQiLCJwbGF5ZXJDdG9yIiwiX2hpc3RvcnkiLCJfbW9uaXRvclBvc2l0aW9uIiwiYmluZCIsIl9vbkV2ZW50IiwiYWRkTGlzdGVuZXIiLCJjaGFubmVsIiwiY2FsbGJhY2siLCJoYXMiLCJzZXQiLCJsaXN0ZW5lcnMiLCJkZWxldGUiLCJjbGVhciIsImFyZ3MiLCJ1bmRlZmluZWQiLCJsaXN0ZW5lciIsImUiLCJoaXRMYXllcnMiLCJfZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCIsIm1vZHVsZSIsInpJbmRleCIsImluZGV4IiwiaW5kZXhPZiIsImJsb2NrIiwiaW5zdGFsbCIsInNldFRyYWNrIiwicHVzaCIsInVuaW5zdGFsbCIsInNwbGljZSIsImNvbW1hbmQiLCJpIiwibCIsImxlbmd0aCIsIm5leHQiLCJkYXRhIiwibWV0YWRhdGEiLCJfc2V0VHJhY2siLCJyZXNldEhpc3RvcnkiLCJzZXRCdWZmZXIiLCJyZXNldCIsInNuYXAiLCJlbWl0Iiwic3RvcCIsInBpeGVsc1BlclNlY29uZCIsImR1cmF0aW9uIiwiX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCIsInVuZG8iLCJoZWFkIiwicmVkbyIsImRiIiwidm9sdW1lIiwic3RhcnQiLCJlbWl0UG9zaXRpb24iLCJwb3NpdGlvbiIsIl9tb25pdG9yUG9zaXRpb25SYWZJZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInBhdXNlIiwiTWF0aCIsInNlZWsiLCJydW5uaW5nIiwiZW5kZWQiLCJtb25pdG9yUG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUMsU0FBUztBQUNiO0FBQ0E7QUFDQUMsU0FBTyxPQUhNO0FBSWI7QUFDQTtBQUNBQyxTQUFPLE9BTk07QUFPYjtBQUNBO0FBQ0FDLFFBQU0sTUFUTztBQVViO0FBQ0E7QUFDQUMsUUFBTSxNQVpPO0FBYWI7QUFDQTtBQUNBQyxTQUFPLE9BZk07QUFnQmI7QUFDQTtBQUNBQyxvQkFBa0IsVUFsQkw7O0FBb0JiQyxVQUFRO0FBcEJLLENBQWY7O0lBdUJNQyxFO0FBQ0osY0FBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0NDLEtBQWhDLEVBQXVDQyxNQUF2QyxFQUErQztBQUFBOztBQUM3Q0gsaUJBQWNBLHNCQUFzQkksT0FBdkIsR0FDWEosVUFEVyxHQUNFSyxTQUFTQyxhQUFULENBQXVCTixVQUF2QixDQURmOztBQUdBLFlBQVFDLE1BQVI7QUFDRSxXQUFLLE1BQUw7QUFD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QUtRLFlBQUwsQ0FBa0JDLFFBQWxCOztBQUVBLFVBQUlBLFdBQVdULFFBQWYsRUFDRSxPQUFPLEtBQUtnQixLQUFMLENBQVdQLFFBQVgsQ0FBUCxDQVRlLENBU2M7O0FBRS9CLFdBQUtwRSxNQUFMLENBQVk0RSxlQUFaO0FBQ0Q7OztzQkFwS1MxRixLLEVBQU87QUFDZixXQUFLL0IsRUFBTCxDQUFRWSxLQUFSLEdBQWdCbUIsS0FBaEI7QUFDQSxXQUFLMEUsc0JBQUwsQ0FBNEIsVUFBNUIsRUFBd0MxRSxLQUF4QztBQUNELEs7d0JBRVc7QUFDVixhQUFPLEtBQUsvQixFQUFMLENBQVFZLEtBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7OztzQkFPV21CLEssRUFBTztBQUNoQixXQUFLL0IsRUFBTCxDQUFRYSxNQUFSLEdBQWlCa0IsS0FBakI7QUFDQSxXQUFLMEUsc0JBQUwsQ0FBNEIsV0FBNUIsRUFBeUMxRSxLQUF6QztBQUNELEs7d0JBRVk7QUFDWCxhQUFPLEtBQUsvQixFQUFMLENBQVFhLE1BQWY7QUFDRDs7O3dCQTRCYztBQUNiLGFBQU8sS0FBS2dDLE1BQUwsQ0FBWW9FLFFBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3dCQVFlO0FBQ2IsYUFBTyxLQUFLcEUsTUFBTCxDQUFZMkQsUUFBbkI7QUFDRDs7Ozs7a0JBc0dZckQsSyIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAnQGlyY2FtL3BhcmFtZXRlcnMnO1xuaW1wb3J0IEFic3RyYWN0UGxheWVyIGZyb20gJy4vQWJzdHJhY3RQbGF5ZXInO1xuaW1wb3J0IEhpc3RvcnkgZnJvbSAnLi4vdXRpbHMvSGlzdG9yeSc7XG5cbmNvbnN0IEVWRU5UUyA9IHtcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBTVEFSVDogJ3N0YXJ0JyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBQQVVTRTogJ3BhdXNlJyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBTVE9QOiAnc3RvcCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gdGFyZ2V0UG9zaXRpb25cbiAgU0VFSzogJ3NlZWsnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIGVuZFRpbWVcbiAgRU5ERUQ6ICdlbmRlZCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gY3VycmVudFBvc2l0aW9uXG4gIENVUlJFTlRfUE9TSVRJT046ICdwb3NpdGlvbicsXG5cbiAgVVBEQVRFOiAndXBkYXRlJyxcbn07XG5cbmNsYXNzIFVJIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgc2l6aW5nLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgJGNvbnRhaW5lciA9ICgkY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCkgP1xuICAgICAgJGNvbnRhaW5lciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJGNvbnRhaW5lcik7XG5cbiAgICBzd2l0Y2ggKHNpemluZykge1xuICAgICAgY2FzZSAnYXV0byc6XG4gICAgICAgIGNvbnN0IGJvdW5kaW5nQ2xpZW50UmVjdCA9ICRjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHdpZHRoID0gYm91bmRpbmdDbGllbnRSZWN0LndpZHRoO1xuICAgICAgICBoZWlnaHQgPSBib3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0O1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbWFudWFsJzpcbiAgICAgICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgLy8gYXJiaXRyYXJ5IGBwaXhlbHNQZXJTZWNvbmRgIHZhbHVlIHRvIHVwZGF0ZSB3aGVuIGEgdHJhY2sgaXMgc2V0XG4gICAgdGhpcy50aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHdpZHRoKTtcbiAgICB0aGlzLnRyYWNrID0gbmV3IHVpLmNvcmUuVHJhY2soJGNvbnRhaW5lciwgaGVpZ2h0KTtcblxuICAgIHRoaXMudGltZWxpbmUuYWRkKHRoaXMudHJhY2ssICdkZWZhdWx0Jyk7XG4gICAgdGhpcy50cmFjay51cGRhdGVDb250YWluZXIoKTsgLy8gaW5pdCB0cmFjayBET00gdHJlZVxuXG4gICAgLy8gdGltZSBjb250ZXh0IHRoYXQgc2hvdWxkIGJlIHNoYXJlZCBieSBhbGwgKG1vc3QpIG1peGlucyAvIHVpIGxheWVyc1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHRoaXMudGltZWxpbmUudGltZUNvbnRleHQpO1xuICB9XG5cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICAgIHRoaXMuJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZX1weGA7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLmhlaWdodCA9IHZhbHVlO1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gICAgdGhpcy4kY29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7dmFsdWV9cHhgO1xuXG4gICAgdGhpcy50aW1lbGluZS5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IHRydWU7XG4gICAgdGhpcy50aW1lbGluZS52aXNpYmxlV2lkdGggPSB2YWx1ZTtcblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gIH1cbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDc3MgU2VsZWN0b3Igb3IgRE9NIEVsZW1lbnQgaG9zdGluZyB0aGUgYmxvY2snXG4gICAgfVxuICB9LFxuICBwbGF5ZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBBYnN0cmFjdFBsYXllciwgLy8gaWYgd2Ugb25seSBuZWVkIHRoZSB1aSBwYXJ0LCBkZWZhdWx0IHRvIGR1bW15IHBsYXllclxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLCAvLyBzdXJlPyB3aHkgbm90IGJlaW5nIGFibGUgdG8gY2hhbmdlIGR5bmFtaWNhbGx5P1xuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ29uc3RydWN0b3Igb2YgdGhlIHBsYXllciB0byBiZSB1c2VkIGluIHRoZSBibG9jaycsXG4gICAgfSxcbiAgfSxcbiAgc2l6aW5nOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnYXV0bycsICdtYW51YWwnXSxcbiAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHdpZHRoOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBoZWlnaHQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGF1ZGlvLXZpc3VhbCBwbGF5ZXIgdG8gYmUgZGVjb3JhdGVkIHdpdGggYWRkaXRpb25uYWwgbW9kdWxlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvbiAobm8gb3B0aW9ucyBmb3Igbm93KVxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gW29wdGlvbnMuY29udGFpbmVyXSAtIENzcyBTZWxlY3RvciBvciBET00gRWxlbWVudCB0aGF0IHdpbGxcbiAqICBob3N0IHRoZSBwbGF5ZXIgYW5kIGFkZGl0aW9ubmFsIG1vZHVsZXNcbiAqIEBwYXJhbSB7QWJzdHJhY3RQbGF5ZXJ9IC0gVGhlIHBsYXllciB0byBiZSB1c2VkIGJ5IHRoZSBibG9jay5cbiAqIEBwYXJhbSB7J2F1dG8nfCdtYW51YWwnfSBbb3B0aW9ucy5zaXppbmc9J2F1dG8nXSAtIEhvdyB0aGUgc2l6ZSBvZiB0aGUgYmxvY2tcbiAqICBzaG91bGQgYmUgZGVmaW5lZC4gSWYgJ2F1dG8nLCB0aGUgYmxvY2sgYWRqdXN0cyB0byB0aGUgc2l6ZSBvZiB0aGUgY29udGFpbmVyLlxuICogIElmICdtYW51YWwnLCB1c2UgYHdpZHRoYCBhbmQgYGhlaWdodGAgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD1udWxsXSAtIFdpZHRoIG9mIHRoZSBibG9jayBpZiBzaXplIGlzICdtYW51YWwnLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD1udWxsXSAtIEhlaWdodCBvZiB0aGUgYmxvY2sgaWYgc2l6ZSBpcyAnbWFudWFsJy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiBjb25zdCAkY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRhaW5lcicpO1xuICogY29uc3QgZGVmYXVsdFdpZHRoID0gMTAwMDtcbiAqIGNvbnN0IGRlZmF1bHRIZWlnaHQgPSAxMDAwO1xuICogY29uc3QgYmxvY2sgPSBuZXcgYmxvY2tzLmNvcmUuQmxvY2soe1xuICogICBwbGF5ZXI6IGFiYy5wbGF5ZXIuU2Vla1BsYXllcixcbiAqICAgY29udGFpbmVyOiAkY29udGFpbmVyLFxuICogICBzaXppbmc6ICdtYW51YWwnLCAvLyBpZiAnYXV0bycsIGFkanVzdCB0byBmaWxsICRjb250YWluZXIgc2l6ZVxuICogICB3aWR0aDogZGVmYXVsdFdpZHRoLFxuICogICBoZWlnaHQ6IGRlZmF1bHRIZWlnaHQsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB3YXZlZm9ybU1vZHVsZSA9IG5ldyBibG9ja3MubW9kdWxlLldhdmVmb3JtTW9kdWxlKCk7XG4gKiBjb25zdCBjdXJzb3JNb2R1bGUgPSBuZXcgYmxvY2tzLm1vZHVsZS5DdXJzb3JNb2R1bGUoKTtcbiAqXG4gKiBibG9jay5hZGQoc2ltcGxlV2F2ZWZvcm1Nb2R1bGUpO1xuICogYmxvY2suYWRkKGN1cnNvck1vZHVsZSk7XG4gKiBgYGBcbiAqL1xuY2xhc3MgQmxvY2sge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuRVZFTlRTID0gRVZFTlRTO1xuXG4gICAgdGhpcy50cmFja0RhdGEgPSBudWxsO1xuICAgIHRoaXMudHJhY2tNZXRhZGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fbW9kdWxlcyA9IFtdO1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHRoaXMucGFyYW1zLmdldCgnY29udGFpbmVyJyk7XG4gICAgY29uc3Qgc2l6aW5nID0gdGhpcy5wYXJhbXMuZ2V0KCdzaXppbmcnKTtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmdldCgnd2lkdGgnKTtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2hlaWdodCcpO1xuICAgIHRoaXMudWkgPSBuZXcgVUkoJGNvbnRhaW5lciwgc2l6aW5nLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHBsYXllckN0b3IgPSB0aGlzLnBhcmFtcy5nZXQoJ3BsYXllcicpO1xuICAgIHRoaXMucGxheWVyID0gbmV3IHBsYXllckN0b3IodGhpcyk7XG5cbiAgICB0aGlzLl9oaXN0b3J5ID0gbmV3IEhpc3RvcnkodGhpcywgJ3RyYWNrTWV0YWRhdGEnLCAyMCk7XG5cbiAgICB0aGlzLl9tb25pdG9yUG9zaXRpb24gPSB0aGlzLl9tb25pdG9yUG9zaXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkV2ZW50ID0gdGhpcy5fb25FdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgLy8gbGlzdGVuIGV2ZW50cyBmcm9tIHRoZSB0aW1lbGluZSB0byBwcm9wYWdhdGUgdG8gbW9kdWxlc1xuICAgIHRoaXMudWkudGltZWxpbmUuYWRkTGlzdGVuZXIoJ2V2ZW50JywgdGhpcy5fb25FdmVudCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZXZlbnQgc3lzdGVtXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIHNwZWNpZmljIGNoYW5uZWwgb2YgdGhlIHBsYXllci5cbiAgICogQXZhaWxhYmxlIGV2ZW50cyBhcmU6XG4gICAqIC0gYCdzdGFydCdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHN0YXJ0c1xuICAgKiAtIGAncGF1c2UnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBpcyBwYXVzZWRcbiAgICogLSBgJ3N0b3AnYCA6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgaXMgc3RvcHBlZCAocGF1c2UoKSArIHNlZWsoMCkpXG4gICAqIC0gYCdzZWVrJ2AgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHNlZWsgdG8gYSBuZXcgcG9zaXRpb25cbiAgICogLSBgJ2VuZGVkJ2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgc3RvcHMgYXQgdGhlIGVuZCBvZiB0aGUgZmlsZSAob3IgYXRcbiAgICogICAgICAgICAgICAgIHRoZSBlbmQgb2YgdGhlIGxhc3Qgc2VnbWVudCkuIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZCB3aXRoIHRoZVxuICAgKiAgICAgICAgICAgICAgc3RvcCBwb3NpdGlvbi5cbiAgICogLSBgJ3Bvc2l0aW9uJ2A6IHRyaWdnZXJlZCBhdCBlYWNoIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIHdpdGggdGhlIGN1cnJlbnRcbiAgICogICAgICAgICAgICAgIHBvc2l0aW9uIGFuZCBkdXJhdGlvbiBvZiB0aGUgYXVkaW8gZmlsZS4gVHJpZ2dlciBvbmx5IHdoZW5cbiAgICogICAgICAgICAgICAgIHRoZSBwbGF5ZXIgaXMgcGxheWluZy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gZXhlY3V0ZVxuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpXG4gICAgICB0aGlzLl9saXN0ZW5lcnMuc2V0KGNoYW5uZWwsIG5ldyBTZXQoKSk7XG5cbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgIGxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gYSBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG4gICAgICBsaXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBzdWJzY2liZXJzIGZyb20gYSBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWwuXG4gICAqL1xuICByZW1vdmVBbGxMaXN0ZW5lcnMoY2hhbm5lbCkge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgICAgbGlzdGVuZXJzLmNsZWFyKCk7XG5cbiAgICAgIHRoaXMuX2xpc3RlbmVycy5kZWxldGUoY2hhbm5lbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYWxsIHN1YnNjcmliZXJzIG9mIGEgZXZlbnQgd2l0aCBnaXZlbiBhcmd1bWVudHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuXG4gICAgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKVxuICAgICAgbGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoLi4uYXJncykpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1haW4gZXZlbnQgbGlzdGVuZXIgb2YgdGhlIHdhdmVzLXVpIHRpbWVsaW5lLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCgnb25FdmVudCcsIGUsIGhpdExheWVycyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbW9kdWxlIGNoYWluXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBZGQgYSBtb2R1bGUgdG8gdGhlIHBsYXllci4gQSBtb2R1bGUgaXMgZGVmaW5lZCBhcyBhIHNwZWNpZmljIHNldFxuICAgKiBvZiBmdW5jdGlvbm5hbGl0eSBhbmQgdmlzdWFsaXphdGlvbnMgb24gdG9wIG9mIHRoZSBwbGF5ZXIuXG4gICAqIE1vZHVsZSBjYW4gaW1wbGVtZW50IGZlYXR1cmVzIHN1Y2ggYXMgd2F2ZWZvcm0sIG1vdmluZyBjdXJzb3IsIGV0Yy5cbiAgICpcbiAgICogQHBhcmFtIHtBYnN0cmFjdE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIGFkZFxuICAgKiBAcGFyYW0ge051bWJlcn0gekluZGV4IC0gekluZGV4IG9mIHRoZSBhZGRlZCBtb2R1bGVcbiAgICovXG4gIGFkZChtb2R1bGUsIHpJbmRleCA9IDApIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX21vZHVsZXMuaW5kZXhPZihtb2R1bGUpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgbW9kdWxlLmJsb2NrID0gdGhpcztcbiAgICAgIG1vZHVsZS56SW5kZXggPSB6SW5kZXg7XG4gICAgICBtb2R1bGUuaW5zdGFsbCh0aGlzKTtcblxuICAgICAgaWYgKHRoaXMudHJhY2tNZXRhZGF0YSAmJiBtb2R1bGUuc2V0VHJhY2spXG4gICAgICAgIG1vZHVsZS5zZXRUcmFjayh0aGlzLnRyYWNrRGF0YSwgdGhpcy50cmFja01ldGFkYXRhKTtcblxuICAgICAgdGhpcy5fbW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBtb2R1bGUgZnJvbSB0aGUgcGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0Fic3RyYWN0TW9kdWxlfSBtb2R1bGUgLSBNb2R1bGUgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmUobW9kdWxlKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kdWxlKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vZHVsZS51bmluc3RhbGwodGhpcyk7XG4gICAgICBtb2R1bGUuYmxvY2sgPSBudWxsO1xuICAgICAgbW9kdWxlLnpJbmRleCA9IG51bGw7XG5cbiAgICAgIHRoaXMuX21vZHVsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIG9yZGVyIGluIHdoaWNoIG1vZHVsZXMgd2VyZSBhZGRlZCB0byB0aGUgcGxheWVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V4ZWN1dGVDb21tYW5kRm9yd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9tb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5fbW9kdWxlc1tpXTtcblxuICAgICAgaWYgKG1vZHVsZVtjb21tYW5kXSkge1xuICAgICAgICBjb25zdCBuZXh0ID0gbW9kdWxlW2NvbW1hbmRdKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIHJldmVyc2Ugb3JkZXIgaW4gd2hpY2ggbW9kdWxlcyB3ZXJlIGFkZGVkIHRvIHRoZSBwbGF5ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX21vZHVsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuX21vZHVsZXNbaV07XG5cbiAgICAgIGlmIChtb2R1bGVbY29tbWFuZF0pIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG1vZHVsZVtjb21tYW5kXSguLi5hcmdzKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgY2hhbmdlIHRoZSB0cmFjayBvZiB0aGUgcGxheWVyLiBBIHRyYWNrIGlzIGEgSlNPTiBvYmplY3QgdGhhdCBtdXN0XG4gICAqIGZvbGxvdyB0aGUgY29udmVudGlvbiBkZWZpbmVkID8/XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidWZmZXIgKGkuZS4gQXVkaW9CdWZmZXIpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhZGF0YSAtIG1ldGFkYXRhIG9iamVjdFxuICAgKi9cbiAgc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl9zZXRUcmFjayhkYXRhLCBtZXRhZGF0YSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIGNoYW5nZSB0aGUgdHJhY2sgb2YgdGhlIHBsYXllci4gQSB0cmFjayBpcyBhIEpTT04gb2JqZWN0IHRoYXQgbXVzdFxuICAgKiBmb2xsb3cgdGhlIGNvbnZlbnRpb24gZGVmaW5lZCA/P1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVmZmVyIChpLmUuIEF1ZGlvQnVmZmVyKVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YWRhdGEgLSBtZXRhZGF0YSBvYmplY3RcbiAgICogQHBhcmFtIHtCb29sZWFufSByZXNldEhpc3RvcnkgLSByZXNldCBoaXN0b3J5XG4gICAqL1xuICBfc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEsIHJlc2V0SGlzdG9yeSA9IGZhbHNlKSB7XG4gICAgdGhpcy50cmFja01ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgdGhpcy50cmFja0RhdGEgPSBkYXRhO1xuICAgIHRoaXMucGxheWVyLnNldEJ1ZmZlcihkYXRhKTsgLy8gaW50ZXJuYWxseSBzdG9wcyB0aGUgcGxheSBjb250cm9sXG5cbiAgICBpZiAocmVzZXRIaXN0b3J5KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LnJlc2V0KCk7XG4gICAgICB0aGlzLnNuYXAoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc25hcCBhbHJlYWR5IGVtaXRzIHRoZSBldmVudC4uLlxuICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRTLlVQREFURSwgdGhpcy50cmFja0RhdGEsIHRoaXMudHJhY2tNZXRhZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wKCk7XG5cbiAgICB0aGlzLnVpLnRpbWVsaW5lLnBpeGVsc1BlclNlY29uZCA9IHRoaXMud2lkdGggLyB0aGlzLmR1cmF0aW9uO1xuICAgIHRoaXMudWkudGltZUNvbnRleHQuZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZXRUcmFjaycsIGRhdGEsIG1ldGFkYXRhKTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gdW5kbyAvIHJlZG9cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gcmV2aWV3IGFsbCBoaXN0b3J5IGFsZ29yaXRobVxuICAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlIGEgc25hcHNob3Qgb2YgdGhlIGRhdGEgYWZ0ZXIgbW9kaWZpY2F0aW9ucy4gU2hvdWxkIGJlIHVzZWQgaW5cbiAgICogbW9kdWxlcyBhZnRlciBlYWNoIHNpZ25pZmljYW50IG9wZXJhdGlvbiwgaW4gb3JkZXIgdG8gYWxsb3cgYHVuZG9gIGFuZFxuICAgKiBgcmVkb2Agb3BlcmF0aW9ucy5cbiAgICovXG4gIHNuYXAoKSB7XG4gICAgdGhpcy5faGlzdG9yeS5zbmFwKCk7XG4gICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRTLlVQREFURSwgdGhpcy50cmFja0RhdGEsIHRoaXMudHJhY2tNZXRhZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gcHJldmlvdXMgc25hcHNob3QuXG4gICAqL1xuICB1bmRvKCkge1xuICAgIGlmICh0aGlzLl9oaXN0b3J5LnVuZG8oKSlcbiAgICAgIHRoaXMuX3NldFRyYWNrKHRoaXMudHJhY2tEYXRhLCB0aGlzLl9oaXN0b3J5LmhlYWQoKSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvIHRvIG5leHQgc25hcHNob3QuXG4gICAqL1xuICByZWRvKCkge1xuICAgIGlmICh0aGlzLl9oaXN0b3J5LnJlZG8oKSlcbiAgICAgIHRoaXMuX3NldFRyYWNrKHRoaXMudHJhY2tEYXRhLCB0aGlzLl9oaXN0b3J5LmhlYWQoKSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gZGVmaW5lIGlmIGl0J3MgcmVhbGx5IHRoZSBwcm9wZXIgd2F5IHRvIGdvLi4uXG4gICAqL1xuICBoZWFkKCkge1xuICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmhlYWQoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB2aXN1YWwgaW50ZXJmYWNlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgcGxheWVyLiBEZWZhdWx0cyB0byB0aGUgd2lkdGggb2YgdGhlIGdpdmVuIGNvbnRhaW5lci5cbiAgICpcbiAgICogQG5hbWUgd2lkdGhcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnVpLndpZHRoID0gdmFsdWU7XG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZXRXaWR0aCcsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy51aS53aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHBsYXllci4gRGVmYXVsdHMgdG8gdGhlIGhlaWdodCBvZiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICAgKlxuICAgKiBAbmFtZSBoZWlnaHRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy51aS5oZWlnaHQgPSB2YWx1ZTtcbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldEhlaWdodCcsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMudWkuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIERvZXMgdGhpcyBtYWtlIHNlbnMgP1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIC8vIGZvcmNlIHJlbmRlcmluZyBmcm9tIG91dHNpZGUgdGhlIG1vZHVsZSAoaS5lLiBpZiB2YWx1ZXMgaGF2ZSBjaGFuZ2VkKVxuICAgIHRoaXMudWkudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoJ3JlbmRlcicpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGF1ZGlvIGludGVyZmFjZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUG9zaXRpb24gb2YgdGhlIGhlYWQgaW4gdGhlIGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBuYW1lIHBvc2l0aW9uXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBwb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXIucG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogRHVyYXRpb24gb2YgdGhlIGN1cnJlbnQgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQG5hbWUgZHVyYXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXllci5kdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBWb2x1bWUgb2YgdGhlIGF1ZGlvIChpbiBkYikuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkYiAtIHZvbHVtZSBvZiB0aGUgcGxheWVyIGluIGRlY2liZWxzXG4gICAqL1xuICB2b2x1bWUoZGIpIHtcbiAgICB0aGlzLnBsYXllci52b2x1bWUoZGIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBwbGF5ZXIuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSB0cnVlLFxuICAgIHRoaXMucGxheWVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3N0YXJ0Jyk7XG5cbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNUQVJUKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcblxuICAgIHRoaXMuX21vbml0b3JQb3NpdGlvblJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX21vbml0b3JQb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgcGxheWVyIChzaG9ydGN1dCBmb3IgYHBhdXNlYCBhbmQgYHNlZWtgIHRvIDApLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZSxcbiAgICB0aGlzLnBsYXllci5zdG9wKCk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3N0b3AnKTtcblxuICAgIHRoaXMuZW1pdChFVkVOVFMuU1RPUCk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUGF1c2UgdGhlIHBsYXllci5cbiAgICovXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlLFxuICAgIHRoaXMucGxheWVyLnBhdXNlKCk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3BhdXNlJyk7XG5cbiAgICB0aGlzLmVtaXQoRVZFTlRTLlBBVVNFKTtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVrIHRvIGEgbmV3IHBvc2l0aW9uIGluIHRoZSBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBOZXcgcG9zaXRpb24uXG4gICAqL1xuICBzZWVrKHBvc2l0aW9uKSB7XG4gICAgcG9zaXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihwb3NpdGlvbiwgdGhpcy5wbGF5ZXIuZHVyYXRpb24pKTtcbiAgICB0aGlzLnBsYXllci5zZWVrKHBvc2l0aW9uKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2VlaycsIHBvc2l0aW9uLCB0aGlzLl9pc1BsYXlpbmcpO1xuICAgIC8vIGFzIHRoZSBwb3NpdGlvbiBjYW4gYmUgbW9kaWZpZWQgYnkgdGhlIFNlZWtDb250cm9sXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TRUVLLCB0aGlzLnBsYXllci5wb3NpdGlvbik7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wbGF5ZXIucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqIFNob3J0Y3V0IGZvciBgdGhpcy5lbWl0KCdwb3NpdGlvbicsIHBvc2l0aW9uLCBkdXJhdGlvbilgXG4gICAqL1xuICBlbWl0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICB0aGlzLmVtaXQoRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHBvc2l0aW9uLCB0aGlzLnBsYXllci5kdXJhdGlvbik7XG4gIH1cblxuICAgIC8qKlxuICAgKiBFbWl0IHRoZSBgZW5kZWRgIGV2ZW50LlxuICAgKi9cbiAgZW5kZWQocG9zaXRpb24pIHtcbiAgICB0aGlzLmVtaXQoRVZFTlRTLkVOREVELCBwb3NpdGlvbik7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogV2F0Y2ggdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBsYXllciBpbiBhIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIGxvb3AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbW9uaXRvclBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLnBsYXllci5ydW5uaW5nKVxuICAgICAgdGhpcy5fbW9uaXRvclBvc2l0aW9uUmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbW9uaXRvclBvc2l0aW9uKTtcblxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wbGF5ZXIucG9zaXRpb247XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnBsYXllci5kdXJhdGlvbjtcbiAgICB0aGlzLmVtaXRQb3NpdGlvbihwb3NpdGlvbik7XG5cbiAgICBpZiAocG9zaXRpb24gPiBkdXJhdGlvbilcbiAgICAgIHJldHVybiB0aGlzLmVuZGVkKHBvc2l0aW9uKTsgLy8gcGxheWVyIHN0b3BzIHRoZSBwbGF5Q29udHJvbFxuXG4gICAgdGhpcy5wbGF5ZXIubW9uaXRvclBvc2l0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxvY2s7XG4iXX0=