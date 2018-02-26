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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJsb2NrLmpzIl0sIm5hbWVzIjpbInVpIiwiZGVjaWJlbFRvTGluZWFyIiwidmFsIiwiTWF0aCIsImV4cCIsIkVWRU5UUyIsIlNUQVJUIiwiUEFVU0UiLCJTVE9QIiwiU0VFSyIsIkVOREVEIiwiQ1VSUkVOVF9QT1NJVElPTiIsIlVQREFURSIsIlVJIiwiJGNvbnRhaW5lciIsInNpemluZyIsIndpZHRoIiwiaGVpZ2h0IiwiRWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImJvdW5kaW5nQ2xpZW50UmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInN0eWxlIiwiX3dpZHRoIiwiX2hlaWdodCIsInRpbWVsaW5lIiwiY29yZSIsIlRpbWVsaW5lIiwidHJhY2siLCJUcmFjayIsImFkZCIsInVwZGF0ZUNvbnRhaW5lciIsInRpbWVDb250ZXh0IiwiTGF5ZXJUaW1lQ29udGV4dCIsInZhbHVlIiwidHJhY2tzIiwiZm9yRWFjaCIsInJlbmRlciIsInVwZGF0ZSIsIm1haW50YWluVmlzaWJsZUR1cmF0aW9uIiwidmlzaWJsZVdpZHRoIiwiZGVmaW5pdGlvbnMiLCJjb250YWluZXIiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwicGxheWVyIiwibnVsbGFibGUiLCJsaXN0IiwibWluIiwibWF4IiwiSW5maW5pdHkiLCJCbG9jayIsIm9wdGlvbnMiLCJwYXJhbXMiLCJfdHJhY2tEYXRhIiwiX3RyYWNrTWV0YWRhdGEiLCJfbGlzdGVuZXJzIiwiX21vZHVsZXMiLCJfaXNQbGF5aW5nIiwiZ2V0IiwicGxheWVyQ3RvciIsIl9oaXN0b3J5IiwiX21vbml0b3JQb3NpdGlvbiIsImJpbmQiLCJfb25FdmVudCIsImFkZExpc3RlbmVyIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0IiwibGlzdGVuZXJzIiwiZGVsZXRlIiwiY2xlYXIiLCJhcmdzIiwidW5kZWZpbmVkIiwibGlzdGVuZXIiLCJlIiwiaGl0TGF5ZXJzIiwiX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQiLCJtb2R1bGUiLCJ6SW5kZXgiLCJpbmRleCIsImluZGV4T2YiLCJibG9jayIsImluc3RhbGwiLCJzZXRUcmFjayIsInB1c2giLCJ1bmluc3RhbGwiLCJzcGxpY2UiLCJjb21tYW5kIiwiaSIsImwiLCJsZW5ndGgiLCJuZXh0IiwiZGF0YSIsIm1ldGFkYXRhIiwiX3NldFRyYWNrIiwicmVzZXRIaXN0b3J5Iiwic2V0QnVmZmVyIiwicmVzZXQiLCJzbmFwIiwiZW1pdCIsInN0b3AiLCJwaXhlbHNQZXJTZWNvbmQiLCJkdXJhdGlvbiIsIl9leGVjdXRlQ29tbWFuZEZvcndhcmQiLCJkYiIsImdhaW4iLCJzdGFydCIsImVtaXRQb3NpdGlvbiIsInBvc2l0aW9uIiwiX21vbml0b3JQb3NpdGlvblJhZklkIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicGF1c2UiLCJzZWVrIiwicnVubmluZyIsImVuZGVkIiwibW9uaXRvclBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBLFNBQVNDLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThCO0FBQzVCLFNBQU9DLEtBQUtDLEdBQUwsQ0FBUyxzQkFBc0JGLEdBQS9CLENBQVAsQ0FENEIsQ0FDZ0I7QUFDN0M7O0FBRUQsSUFBTUcsU0FBUztBQUNiO0FBQ0E7QUFDQUMsU0FBTyxPQUhNO0FBSWI7QUFDQTtBQUNBQyxTQUFPLE9BTk07QUFPYjtBQUNBO0FBQ0FDLFFBQU0sTUFUTztBQVViO0FBQ0E7QUFDQUMsUUFBTSxNQVpPO0FBYWI7QUFDQTtBQUNBQyxTQUFPLE9BZk07QUFnQmI7QUFDQTtBQUNBQyxvQkFBa0IsVUFsQkw7O0FBb0JiQyxVQUFRO0FBcEJLLENBQWY7O0lBdUJNQyxFO0FBQ0osY0FBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0NDLEtBQWhDLEVBQXVDQyxNQUF2QyxFQUErQztBQUFBOztB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V0FBV04sUUFBZixFQUNFLE9BQU8sS0FBS1ksS0FBTCxDQUFXTixRQUFYLENBQVAsQ0FUZSxDQVNjOztBQUUvQixXQUFLakUsTUFBTCxDQUFZd0UsZUFBWjtBQUNEOzs7d0JBNUxjO0FBQ2IsYUFBTyxLQUFLOUQsY0FBWjtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztzQkFPVXhCLEssRUFBTztBQUNmLFdBQUtuQyxFQUFMLENBQVFnQixLQUFSLEdBQWdCbUIsS0FBaEI7QUFDQSxXQUFLMEUsc0JBQUwsQ0FBNEIsVUFBNUIsRUFBd0MxRSxLQUF4QztBQUNELEs7d0JBRVc7QUFDVixhQUFPLEtBQUtuQyxFQUFMLENBQVFnQixLQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7c0JBT1dtQixLLEVBQU87QUFDaEIsV0FBS25DLEVBQUwsQ0FBUWlCLE1BQVIsR0FBaUJrQixLQUFqQjtBQUNBLFdBQUswRSxzQkFBTCxDQUE0QixXQUE1QixFQUF5QzFFLEtBQXpDO0FBQ0QsSzt3QkFFWTtBQUNYLGFBQU8sS0FBS25DLEVBQUwsQ0FBUWlCLE1BQWY7QUFDRDs7O3dCQW9DYztBQUNiLGFBQU8sS0FBS2dDLE1BQUwsQ0FBWWlFLFFBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3dCQVFlO0FBQ2IsYUFBTyxLQUFLakUsTUFBTCxDQUFZMkQsUUFBbkI7QUFDRDs7Ozs7a0JBdUdZckQsSyIsImZpbGUiOiJCbG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBwYXJhbWV0ZXJzIGZyb20gJ0BpcmNhbS9wYXJhbWV0ZXJzJztcbmltcG9ydCBBYnN0cmFjdFBsYXllciBmcm9tICcuL0Fic3RyYWN0UGxheWVyJztcbmltcG9ydCBIaXN0b3J5IGZyb20gJy4uL3V0aWxzL0hpc3RvcnknO1xuXG5mdW5jdGlvbiBkZWNpYmVsVG9MaW5lYXIodmFsKSB7XG4gIHJldHVybiBNYXRoLmV4cCgwLjExNTEyOTI1NDY0OTcwMjI5ICogdmFsKTsgLy8gcG93KDEwLCB2YWwgLyAyMClcbn07XG5cbmNvbnN0IEVWRU5UUyA9IHtcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBTVEFSVDogJ3N0YXJ0JyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBQQVVTRTogJ3BhdXNlJyxcbiAgLy8gQGFyZ3VtZW50c1xuICAvLyBwb3NpdGlvblxuICBTVE9QOiAnc3RvcCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gdGFyZ2V0UG9zaXRpb25cbiAgU0VFSzogJ3NlZWsnLFxuICAvLyBAYXJndW1lbnRzXG4gIC8vIGVuZFRpbWVcbiAgRU5ERUQ6ICdlbmRlZCcsXG4gIC8vIEBhcmd1bWVudHNcbiAgLy8gY3VycmVudFBvc2l0aW9uXG4gIENVUlJFTlRfUE9TSVRJT046ICdwb3NpdGlvbicsXG5cbiAgVVBEQVRFOiAndXBkYXRlJyxcbn07XG5cbmNsYXNzIFVJIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgc2l6aW5nLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgJGNvbnRhaW5lciA9ICgkY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCkgP1xuICAgICAgJGNvbnRhaW5lciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJGNvbnRhaW5lcik7XG5cbiAgICBzd2l0Y2ggKHNpemluZykge1xuICAgICAgY2FzZSAnYXV0byc6XG4gICAgICAgIGNvbnN0IGJvdW5kaW5nQ2xpZW50UmVjdCA9ICRjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHdpZHRoID0gYm91bmRpbmdDbGllbnRSZWN0LndpZHRoO1xuICAgICAgICBoZWlnaHQgPSBib3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0O1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbWFudWFsJzpcbiAgICAgICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgLy8gYXJiaXRyYXJ5IGBwaXhlbHNQZXJTZWNvbmRgIHZhbHVlIHRvIHVwZGF0ZSB3aGVuIGEgdHJhY2sgaXMgc2V0XG4gICAgdGhpcy50aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHdpZHRoKTtcbiAgICB0aGlzLnRyYWNrID0gbmV3IHVpLmNvcmUuVHJhY2soJGNvbnRhaW5lciwgaGVpZ2h0KTtcblxuICAgIHRoaXMudGltZWxpbmUuYWRkKHRoaXMudHJhY2ssICdkZWZhdWx0Jyk7XG4gICAgdGhpcy50cmFjay51cGRhdGVDb250YWluZXIoKTsgLy8gaW5pdCB0cmFjayBET00gdHJlZVxuXG4gICAgLy8gdGltZSBjb250ZXh0IHRoYXQgc2hvdWxkIGJlIHNoYXJlZCBieSBhbGwgKG1vc3QpIG1peGlucyAvIHVpIGxheWVyc1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHRoaXMudGltZWxpbmUudGltZUNvbnRleHQpO1xuICB9XG5cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICAgIHRoaXMuJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZX1weGA7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHtcbiAgICAgIHRyYWNrLmhlaWdodCA9IHZhbHVlO1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gICAgdGhpcy4kY29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7dmFsdWV9cHhgO1xuXG4gICAgdGhpcy50aW1lbGluZS5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IHRydWU7XG4gICAgdGhpcy50aW1lbGluZS52aXNpYmxlV2lkdGggPSB2YWx1ZTtcblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gIH1cbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDc3MgU2VsZWN0b3Igb3IgRE9NIEVsZW1lbnQgaG9zdGluZyB0aGUgYmxvY2snXG4gICAgfVxuICB9LFxuICBwbGF5ZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBBYnN0cmFjdFBsYXllciwgLy8gaWYgd2Ugb25seSBuZWVkIHRoZSB1aSBwYXJ0LCBkZWZhdWx0IHRvIGR1bW15IHBsYXllclxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLCAvLyBzdXJlPyB3aHkgbm90IGJlaW5nIGFibGUgdG8gY2hhbmdlIGR5bmFtaWNhbGx5P1xuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ29uc3RydWN0b3Igb2YgdGhlIHBsYXllciB0byBiZSB1c2VkIGluIHRoZSBibG9jaycsXG4gICAgfSxcbiAgfSxcbiAgc2l6aW5nOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnYXV0bycsICdtYW51YWwnXSxcbiAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHdpZHRoOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBoZWlnaHQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGF1ZGlvLXZpc3VhbCBwbGF5ZXIgdG8gYmUgZGVjb3JhdGVkIHdpdGggYWRkaXRpb25uYWwgbW9kdWxlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvbiAobm8gb3B0aW9ucyBmb3Igbm93KVxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gW29wdGlvbnMuY29udGFpbmVyXSAtIENzcyBTZWxlY3RvciBvciBET00gRWxlbWVudCB0aGF0IHdpbGxcbiAqICBob3N0IHRoZSBwbGF5ZXIgYW5kIGFkZGl0aW9ubmFsIG1vZHVsZXNcbiAqIEBwYXJhbSB7QWJzdHJhY3RQbGF5ZXJ9IC0gVGhlIHBsYXllciB0byBiZSB1c2VkIGJ5IHRoZSBibG9jay5cbiAqIEBwYXJhbSB7J2F1dG8nfCdtYW51YWwnfSBbb3B0aW9ucy5zaXppbmc9J2F1dG8nXSAtIEhvdyB0aGUgc2l6ZSBvZiB0aGUgYmxvY2tcbiAqICBzaG91bGQgYmUgZGVmaW5lZC4gSWYgJ2F1dG8nLCB0aGUgYmxvY2sgYWRqdXN0cyB0byB0aGUgc2l6ZSBvZiB0aGUgY29udGFpbmVyLlxuICogIElmICdtYW51YWwnLCB1c2UgYHdpZHRoYCBhbmQgYGhlaWdodGAgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD1udWxsXSAtIFdpZHRoIG9mIHRoZSBibG9jayBpZiBzaXplIGlzICdtYW51YWwnLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD1udWxsXSAtIEhlaWdodCBvZiB0aGUgYmxvY2sgaWYgc2l6ZSBpcyAnbWFudWFsJy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiBjb25zdCAkY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRhaW5lcicpO1xuICogY29uc3QgZGVmYXVsdFdpZHRoID0gMTAwMDtcbiAqIGNvbnN0IGRlZmF1bHRIZWlnaHQgPSAxMDAwO1xuICogY29uc3QgYmxvY2sgPSBuZXcgYmxvY2tzLmNvcmUuQmxvY2soe1xuICogICBwbGF5ZXI6IGFiYy5wbGF5ZXIuU2Vla1BsYXllcixcbiAqICAgY29udGFpbmVyOiAkY29udGFpbmVyLFxuICogICBzaXppbmc6ICdtYW51YWwnLCAvLyBpZiAnYXV0bycsIGFkanVzdCB0byBmaWxsICRjb250YWluZXIgc2l6ZVxuICogICB3aWR0aDogZGVmYXVsdFdpZHRoLFxuICogICBoZWlnaHQ6IGRlZmF1bHRIZWlnaHQsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB3YXZlZm9ybU1vZHVsZSA9IG5ldyBibG9ja3MubW9kdWxlLldhdmVmb3JtTW9kdWxlKCk7XG4gKiBjb25zdCBjdXJzb3JNb2R1bGUgPSBuZXcgYmxvY2tzLm1vZHVsZS5DdXJzb3JNb2R1bGUoKTtcbiAqXG4gKiBibG9jay5hZGQoc2ltcGxlV2F2ZWZvcm1Nb2R1bGUpO1xuICogYmxvY2suYWRkKGN1cnNvck1vZHVsZSk7XG4gKiBgYGBcbiAqL1xuY2xhc3MgQmxvY2sge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuRVZFTlRTID0gRVZFTlRTO1xuXG4gICAgdGhpcy5fdHJhY2tEYXRhID0gbnVsbDtcbiAgICB0aGlzLl90cmFja01ldGFkYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9tb2R1bGVzID0gW107XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdjb250YWluZXInKTtcbiAgICBjb25zdCBzaXppbmcgPSB0aGlzLnBhcmFtcy5nZXQoJ3NpemluZycpO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuZ2V0KCd3aWR0aCcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmdldCgnaGVpZ2h0Jyk7XG4gICAgdGhpcy51aSA9IG5ldyBVSSgkY29udGFpbmVyLCBzaXppbmcsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgcGxheWVyQ3RvciA9IHRoaXMucGFyYW1zLmdldCgncGxheWVyJyk7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgcGxheWVyQ3Rvcih0aGlzKTtcblxuICAgIHRoaXMuX2hpc3RvcnkgPSBuZXcgSGlzdG9yeSh0aGlzLCAnX3RyYWNrTWV0YWRhdGEnLCAyMCk7XG5cbiAgICB0aGlzLl9tb25pdG9yUG9zaXRpb24gPSB0aGlzLl9tb25pdG9yUG9zaXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkV2ZW50ID0gdGhpcy5fb25FdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgLy8gbGlzdGVuIGV2ZW50cyBmcm9tIHRoZSB0aW1lbGluZSB0byBwcm9wYWdhdGUgdG8gbW9kdWxlc1xuICAgIHRoaXMudWkudGltZWxpbmUuYWRkTGlzdGVuZXIoJ2V2ZW50JywgdGhpcy5fb25FdmVudCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZXZlbnQgc3lzdGVtXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIHNwZWNpZmljIGNoYW5uZWwgb2YgdGhlIHBsYXllci5cbiAgICogQXZhaWxhYmxlIGV2ZW50cyBhcmU6XG4gICAqIC0gYCdzdGFydCdgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHN0YXJ0c1xuICAgKiAtIGAncGF1c2UnYDogdHJpZ2dlcmVkIHdoZW4gdGhlIHBsYXllciBpcyBwYXVzZWRcbiAgICogLSBgJ3N0b3AnYCA6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgaXMgc3RvcHBlZCAocGF1c2UoKSArIHNlZWsoMCkpXG4gICAqIC0gYCdzZWVrJ2AgOiB0cmlnZ2VyZWQgd2hlbiB0aGUgcGxheWVyIHNlZWsgdG8gYSBuZXcgcG9zaXRpb25cbiAgICogLSBgJ2VuZGVkJ2A6IHRyaWdnZXJlZCB3aGVuIHRoZSBwbGF5ZXIgc3RvcHMgYXQgdGhlIGVuZCBvZiB0aGUgZmlsZSAob3IgYXRcbiAgICogICAgICAgICAgICAgIHRoZSBlbmQgb2YgdGhlIGxhc3Qgc2VnbWVudCkuIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZCB3aXRoIHRoZVxuICAgKiAgICAgICAgICAgICAgc3RvcCBwb3NpdGlvbi5cbiAgICogLSBgJ3Bvc2l0aW9uJ2A6IHRyaWdnZXJlZCBhdCBlYWNoIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIHdpdGggdGhlIGN1cnJlbnRcbiAgICogICAgICAgICAgICAgIHBvc2l0aW9uIGFuZCBkdXJhdGlvbiBvZiB0aGUgYXVkaW8gZmlsZS4gVHJpZ2dlciBvbmx5IHdoZW5cbiAgICogICAgICAgICAgICAgIHRoZSBwbGF5ZXIgaXMgcGxheWluZy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gZXhlY3V0ZVxuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpXG4gICAgICB0aGlzLl9saXN0ZW5lcnMuc2V0KGNoYW5uZWwsIG5ldyBTZXQoKSk7XG5cbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgIGxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gYSBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycy5oYXMoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoY2hhbm5lbCk7XG4gICAgICBsaXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBzdWJzY2liZXJzIGZyb20gYSBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGNoYW5uZWwuXG4gICAqL1xuICByZW1vdmVBbGxMaXN0ZW5lcnMoY2hhbm5lbCkge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaGFzKGNoYW5uZWwpKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuICAgICAgbGlzdGVuZXJzLmNsZWFyKCk7XG5cbiAgICAgIHRoaXMuX2xpc3RlbmVycy5kZWxldGUoY2hhbm5lbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYWxsIHN1YnNjcmliZXJzIG9mIGEgZXZlbnQgd2l0aCBnaXZlbiBhcmd1bWVudHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNoYW5uZWwpO1xuXG4gICAgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKVxuICAgICAgbGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoLi4uYXJncykpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1haW4gZXZlbnQgbGlzdGVuZXIgb2YgdGhlIHdhdmVzLXVpIHRpbWVsaW5lLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZCgnb25FdmVudCcsIGUsIGhpdExheWVycyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbW9kdWxlIGNoYWluXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBZGQgYSBtb2R1bGUgdG8gdGhlIHBsYXllci4gQSBtb2R1bGUgaXMgZGVmaW5lZCBhcyBhIHNwZWNpZmljIHNldFxuICAgKiBvZiBmdW5jdGlvbm5hbGl0eSBhbmQgdmlzdWFsaXphdGlvbnMgb24gdG9wIG9mIHRoZSBwbGF5ZXIuXG4gICAqIE1vZHVsZSBjYW4gaW1wbGVtZW50IGZlYXR1cmVzIHN1Y2ggYXMgd2F2ZWZvcm0sIG1vdmluZyBjdXJzb3IsIGV0Yy5cbiAgICpcbiAgICogQHBhcmFtIHtBYnN0cmFjdE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIGFkZFxuICAgKiBAcGFyYW0ge051bWJlcn0gekluZGV4IC0gekluZGV4IG9mIHRoZSBhZGRlZCBtb2R1bGVcbiAgICovXG4gIGFkZChtb2R1bGUsIHpJbmRleCA9IDApIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX21vZHVsZXMuaW5kZXhPZihtb2R1bGUpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgbW9kdWxlLmJsb2NrID0gdGhpcztcbiAgICAgIG1vZHVsZS56SW5kZXggPSB6SW5kZXg7XG4gICAgICBtb2R1bGUuaW5zdGFsbCh0aGlzKTtcblxuICAgICAgaWYgKHRoaXMuX3RyYWNrTWV0YWRhdGEgJiYgbW9kdWxlLnNldFRyYWNrKVxuICAgICAgICBtb2R1bGUuc2V0VHJhY2sodGhpcy5fdHJhY2tEYXRhLCB0aGlzLl90cmFja01ldGFkYXRhKTtcblxuICAgICAgdGhpcy5fbW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBtb2R1bGUgZnJvbSB0aGUgcGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0Fic3RyYWN0TW9kdWxlfSBtb2R1bGUgLSBNb2R1bGUgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmUobW9kdWxlKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kdWxlKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vZHVsZS51bmluc3RhbGwodGhpcyk7XG4gICAgICBtb2R1bGUuYmxvY2sgPSBudWxsO1xuICAgICAgbW9kdWxlLnpJbmRleCA9IG51bGw7XG5cbiAgICAgIHRoaXMuX21vZHVsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIG9yZGVyIGluIHdoaWNoIG1vZHVsZXMgd2VyZSBhZGRlZCB0byB0aGUgcGxheWVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V4ZWN1dGVDb21tYW5kRm9yd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9tb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5fbW9kdWxlc1tpXTtcblxuICAgICAgaWYgKG1vZHVsZVtjb21tYW5kXSkge1xuICAgICAgICBjb25zdCBuZXh0ID0gbW9kdWxlW2NvbW1hbmRdKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBmYWxzZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjb21tYW5kIG9uIGVhY2ggbW9kdWxlIHRoYXQgaW1wbGVtZW50cyB0aGUgbWV0aG9kLiBUaGUgY29tbWFuZFxuICAgKiBhcmUgZXhlY3V0ZWQgaW4gdGhlIHJldmVyc2Ugb3JkZXIgaW4gd2hpY2ggbW9kdWxlcyB3ZXJlIGFkZGVkIHRvIHRoZSBwbGF5ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXhlY3V0ZUNvbW1hbmRCYWNrd2FyZChjb21tYW5kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX21vZHVsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuX21vZHVsZXNbaV07XG5cbiAgICAgIGlmIChtb2R1bGVbY29tbWFuZF0pIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG1vZHVsZVtjb21tYW5kXSguLi5hcmdzKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gZmFsc2UpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb3IgY2hhbmdlIHRoZSB0cmFjayBvZiB0aGUgcGxheWVyLiBBIHRyYWNrIGlzIGEgSlNPTiBvYmplY3QgdGhhdCBtdXN0XG4gICAqIGZvbGxvdyB0aGUgY29udmVudGlvbiBkZWZpbmVkID8/XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidWZmZXIgKGkuZS4gQXVkaW9CdWZmZXIpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhZGF0YSAtIG1ldGFkYXRhIG9iamVjdFxuICAgKi9cbiAgc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl9zZXRUcmFjayhkYXRhLCBtZXRhZGF0YSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIGNoYW5nZSB0aGUgdHJhY2sgb2YgdGhlIHBsYXllci4gQSB0cmFjayBpcyBhIEpTT04gb2JqZWN0IHRoYXQgbXVzdFxuICAgKiBmb2xsb3cgdGhlIGNvbnZlbnRpb24gZGVmaW5lZCA/P1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgYnVmZmVyIChpLmUuIEF1ZGlvQnVmZmVyKVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YWRhdGEgLSBtZXRhZGF0YSBvYmplY3RcbiAgICogQHBhcmFtIHtCb29sZWFufSByZXNldEhpc3RvcnkgLSByZXNldCBoaXN0b3J5XG4gICAqL1xuICBfc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEsIHJlc2V0SGlzdG9yeSA9IGZhbHNlKSB7XG4gICAgdGhpcy5fdHJhY2tNZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgIHRoaXMuX3RyYWNrRGF0YSA9IGRhdGE7XG4gICAgdGhpcy5wbGF5ZXIuc2V0QnVmZmVyKGRhdGEpOyAvLyBpbnRlcm5hbGx5IHN0b3BzIHRoZSBwbGF5IGNvbnRyb2xcblxuICAgIGlmIChyZXNldEhpc3RvcnkpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkucmVzZXQoKTtcbiAgICAgIHRoaXMuc25hcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzbmFwIGFscmVhZHkgZW1pdHMgdGhlIGV2ZW50Li4uXG4gICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVFMuVVBEQVRFLCB0aGlzLl90cmFja0RhdGEsIHRoaXMuX3RyYWNrTWV0YWRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgdGhpcy51aS50aW1lbGluZS5waXhlbHNQZXJTZWNvbmQgPSB0aGlzLndpZHRoIC8gdGhpcy5kdXJhdGlvbjtcbiAgICB0aGlzLnVpLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kRm9yd2FyZCgnc2V0VHJhY2snLCBkYXRhLCBtZXRhZGF0YSk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHVuZG8gLyByZWRvXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIHJldmlldyBhbGwgaGlzdG9yeSBhbGdvcml0aG1cbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHNuYXBzaG90IG9mIHRoZSBkYXRhIGFmdGVyIG1vZGlmaWNhdGlvbnMuIFNob3VsZCBiZSB1c2VkIGluXG4gICAqIG1vZHVsZXMgYWZ0ZXIgZWFjaCBzaWduaWZpY2FudCBvcGVyYXRpb24sIGluIG9yZGVyIHRvIGFsbG93IGB1bmRvYCBhbmRcbiAgICogYHJlZG9gIG9wZXJhdGlvbnMuXG4gICAqL1xuICBzbmFwKCkge1xuICAgIC8vIHRoaXMuX2hpc3Rvcnkuc25hcCgpO1xuICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UUy5VUERBVEUsIHRoaXMuX3RyYWNrRGF0YSwgdGhpcy5fdHJhY2tNZXRhZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gcHJldmlvdXMgc25hcHNob3QuXG4gICAqL1xuICB1bmRvKCkge1xuICAgIC8vIGlmICh0aGlzLl9oaXN0b3J5LnVuZG8oKSlcbiAgICAvLyAgIHRoaXMuX3NldFRyYWNrKHRoaXMuX3RyYWNrRGF0YSwgdGhpcy5faGlzdG9yeS5oZWFkKCksIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHbyB0byBuZXh0IHNuYXBzaG90LlxuICAgKi9cbiAgcmVkbygpIHtcbiAgICAvLyBpZiAodGhpcy5faGlzdG9yeS5yZWRvKCkpXG4gICAgLy8gICB0aGlzLl9zZXRUcmFjayh0aGlzLl90cmFja0RhdGEsIHRoaXMuX2hpc3RvcnkuaGVhZCgpLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQHRvZG8gLSBkZWZpbmUgaWYgaXQncyByZWFsbHkgdGhlIHByb3BlciB3YXkgdG8gZ28uLi5cbiAgICovXG4gIGdldCBtZXRhZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tNZXRhZGF0YTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB2aXN1YWwgaW50ZXJmYWNlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgcGxheWVyLiBEZWZhdWx0cyB0byB0aGUgd2lkdGggb2YgdGhlIGdpdmVuIGNvbnRhaW5lci5cbiAgICpcbiAgICogQG5hbWUgd2lkdGhcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnVpLndpZHRoID0gdmFsdWU7XG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzZXRXaWR0aCcsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy51aS53aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHBsYXllci4gRGVmYXVsdHMgdG8gdGhlIGhlaWdodCBvZiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICAgKlxuICAgKiBAbmFtZSBoZWlnaHRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy51aS5oZWlnaHQgPSB2YWx1ZTtcbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NldEhlaWdodCcsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMudWkuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIERvZXMgdGhpcyBtYWtlIHNlbnMgP1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIC8vIGZvcmNlIHJlbmRlcmluZyBmcm9tIG91dHNpZGUgdGhlIG1vZHVsZSAoaS5lLiBpZiB2YWx1ZXMgaGF2ZSBjaGFuZ2VkKVxuICAgIHRoaXMudWkudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2sucmVuZGVyKCk7XG4gICAgICB0cmFjay51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kQmFja3dhcmQoJ3JlbmRlcicpO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudWkudGltZWxpbmUudHJhY2tzLmZvckVhY2godHJhY2sgPT4ge1xuICAgICAgdHJhY2sudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEJhY2t3YXJkKCdyZW5kZXInKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBhdWRpbyBpbnRlcmZhY2VcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBoZWFkIGluIHRoZSBhdWRpbyBmaWxlLlxuICAgKlxuICAgKiBAbmFtZSBwb3NpdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgcG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyLnBvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIER1cmF0aW9uIG9mIHRoZSBjdXJyZW50IGF1ZGlvIGZpbGUuXG4gICAqXG4gICAqIEBuYW1lIGR1cmF0aW9uXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXIuZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogVm9sdW1lIG9mIHRoZSBhdWRpbyAoaW4gZEIpLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZGIgLSB2b2x1bWUgb2YgdGhlIHBsYXllciBpbiBkZWNpYmVsc1xuICAgKi9cbiAgdm9sdW1lKGRiKSB7XG4gICAgY29uc3QgZ2FpbiA9IGRlY2liZWxUb0xpbmVhcihkYilcbiAgICB0aGlzLnBsYXllci5nYWluID0gZ2FpbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgcGxheWVyLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gdHJ1ZSxcbiAgICB0aGlzLnBsYXllci5zdGFydCgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzdGFydCcpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5TVEFSVCk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG5cbiAgICB0aGlzLl9tb25pdG9yUG9zaXRpb25SYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9tb25pdG9yUG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIHBsYXllciAoc2hvcnRjdXQgZm9yIGBwYXVzZWAgYW5kIGBzZWVrYCB0byAwKS5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2UsXG4gICAgdGhpcy5wbGF5ZXIuc3RvcCgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdzdG9wJyk7XG5cbiAgICB0aGlzLmVtaXQoRVZFTlRTLlNUT1ApO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdXNlIHRoZSBwbGF5ZXIuXG4gICAqL1xuICBwYXVzZSgpIHtcbiAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZSxcbiAgICB0aGlzLnBsYXllci5wYXVzZSgpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZUNvbW1hbmRGb3J3YXJkKCdwYXVzZScpO1xuXG4gICAgdGhpcy5lbWl0KEVWRU5UUy5QQVVTRSk7XG4gICAgdGhpcy5lbWl0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU2VlayB0byBhIG5ldyBwb3NpdGlvbiBpbiB0aGUgYXVkaW8gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gTmV3IHBvc2l0aW9uLlxuICAgKi9cbiAgc2Vlayhwb3NpdGlvbikge1xuICAgIHBvc2l0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ocG9zaXRpb24sIHRoaXMucGxheWVyLmR1cmF0aW9uKSk7XG4gICAgdGhpcy5wbGF5ZXIuc2Vlayhwb3NpdGlvbik7XG5cbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZEZvcndhcmQoJ3NlZWsnLCBwb3NpdGlvbiwgdGhpcy5faXNQbGF5aW5nKTtcbiAgICAvLyBhcyB0aGUgcG9zaXRpb24gY2FuIGJlIG1vZGlmaWVkIGJ5IHRoZSBTZWVrQ29udHJvbFxuICAgIHRoaXMuZW1pdChFVkVOVFMuU0VFSywgdGhpcy5wbGF5ZXIucG9zaXRpb24pO1xuICAgIHRoaXMuZW1pdFBvc2l0aW9uKHRoaXMucGxheWVyLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKiBTaG9ydGN1dCBmb3IgYHRoaXMuZW1pdCgncG9zaXRpb24nLCBwb3NpdGlvbiwgZHVyYXRpb24pYFxuICAgKi9cbiAgZW1pdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5lbWl0KEVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCBwb3NpdGlvbiwgdGhpcy5wbGF5ZXIuZHVyYXRpb24pO1xuICB9XG5cbiAgICAvKipcbiAgICogRW1pdCB0aGUgYGVuZGVkYCBldmVudC5cbiAgICovXG4gIGVuZGVkKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5lbWl0KEVWRU5UUy5FTkRFRCwgcG9zaXRpb24pO1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwbGF5ZXIgaW4gYSByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBsb29wLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21vbml0b3JQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5wbGF5ZXIucnVubmluZylcbiAgICAgIHRoaXMuX21vbml0b3JQb3NpdGlvblJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX21vbml0b3JQb3NpdGlvbik7XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucGxheWVyLnBvc2l0aW9uO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wbGF5ZXIuZHVyYXRpb247XG4gICAgdGhpcy5lbWl0UG9zaXRpb24ocG9zaXRpb24pO1xuXG4gICAgaWYgKHBvc2l0aW9uID4gZHVyYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5lbmRlZChwb3NpdGlvbik7IC8vIHBsYXllciBzdG9wcyB0aGUgcGxheUNvbnRyb2xcblxuICAgIHRoaXMucGxheWVyLm1vbml0b3JQb3NpdGlvbigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsb2NrO1xuIl19