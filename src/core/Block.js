import * as ui from 'waves-ui';
// import AbstractModule from './AbstractModule';
import parameters from '@ircam/parameters';

const EVENTS = {
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
  CURRENT_POSITION: 'position',
};

class UI {
  constructor($container, width, height) {
    // arbitrary `pixelsPerSecond` value to update when a track is set
    this.timeline = new ui.core.Timeline(1, width);
    this.track = new ui.core.Track($container, height);

    this.timeline.add(this.track, 'default');
    this.track.updateContainer(); // init track DOM tree

    // time context that should be shared by all (most) mixins / ui layers
    this.timeContext = new ui.core.LayerTimeContext(this.timeline.timeContext);
  }
}

const definitions = {
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
      desc: 'Constructor of the player to be used in the block',
    },
  },
  size: {
    type: 'enum',
    list: ['auto', 'manual'],
    default: 'auto',
    constant: true,
  },
  width: {
    type: 'integer',
    min: 0,
    max: +Infinity,
    default: null,
    nullable: true,
    constant: true,
  },
  height: {
    type: 'integer',
    min: 0,
    max: +Infinity,
    default: null,
    nullable: true,
    constant: true,
  }
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
class Block {
  constructor(options) {
    this.params = parameters(definitions, options);

    let $container = this.params.get('container');

    $container = ($container instanceof Element) ?
      $container : document.querySelector($container);

    const size = this.params.get('size');

    if (size === 'auto') {
      const boundingClientRect = $container.getBoundingClientRect();

      this._width = boundingClientRect.width;
      this._height = boundingClientRect.height;

    } else if (size === 'manual') {
      const width = this.params.get('width');
      const height = this.params.get('height');

      $container.style.width = `${width}px`;
      $container.style.height = `${height}px`;

      this._width = width;
      this._height = height;
    }

    this.$container = $container;

    const playerCtor = this.params.get('player');
    this.player = new playerCtor(this);
    this.ui = new UI(container, this.width, this.height);

    this.EVENTS = EVENTS;
    // snapshots of the data
    this._history = [];
    this._historyLength = 10;
    this._historyPointer = -1;

    this._listeners = new Map();
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
  addListener(channel, callback) {
    if (!this._listeners.has(channel))
      this._listeners.set(channel, new Set());

    const listeners = this._listeners.get(channel);
    listeners.add(callback);
  }

  /**
   * Remove a listener from a channel.
   *
   * @param {String} channel - Name of the channel
   * @param {Function} callback - Function to remove
   */
  removeListener(channel, callback) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);
      listeners.delete(callback);
    }
  }

  /**
   * Remove all subscibers from a channel.
   *
   * @param {String} channel - Name of the channel.
   */
  removeAllListeners(channel) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);
      listeners.clear();

      this._listeners.delete(channel);
    }
  }

  /**
   * Execute all subscribers of a event with given arguments.
   * @private
   */
  emit(channel, ...args) {
    const listeners = this._listeners.get(channel);

    if (listeners !== undefined)
      listeners.forEach(listener => listener(...args));
  }

  /**
   * Main event listener of the waves-ui timeline.
   * @private
   */
  _onEvent(e, hitLayers) {
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
  add(module, zIndex = 0) {
    const index = this._modules.indexOf(module);

    if (index === -1) {
      module.block = this;
      module.zIndex = zIndex;
      module.install(this);

      if (this.trackMetadata && module.setTrack)
        module.setTrack(this.trackData, this.trackMetadata);

      this._modules.push(module);
      this.render();
    }
  }

  /**
   * Remove a module from the player.
   *
   * @param {AbstractModule} module - Module to remove
   */
  remove(module) {
    const index = this._modules.indexOf(module);

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
  setTrack(trackData, trackMetadata, createSnapshot = true) {
    this.trackMetadata = trackMetadata;
    this.trackData = trackData;
    this.player.setBuffer(trackData); // internally stops the play control

    // @todo - should reset history when false
    if (createSnapshot === true)
      this.createSnapshot();

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
  _executeCommandForward(command, ...args) {
    for (let i = 0, l = this._modules.length; i < l; i++) {
      const module = this._modules[i];

      if (module[command]) {
        const next = module[command](...args);

        if (next === false)
          return;
      }
    }
  }

  /**
   * Execute a command on each module that implements the method. The command
   * are executed in the reverse order in which modules were added to the player.
   * @private
   */
  _executeCommandBackward(command, ...args) {
    for (let i = this._modules.length - 1; i >= 0; i--) {
      const module = this._modules[i];

      if (module[command]) {
        const next = module[command](...args);

        if (next === false)
          return;
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
  _copy(obj) {
    const copy = JSON.parse(JSON.stringify(obj));
    return copy;
  }

  /**
   * Create a snapshot of the data after modifications. Should be used in modules
   * after each significant operation, in order to allow `undo` and `redo`
   * operations.
   */
  createSnapshot() {
    // eliminate previous future, create a dystopia...
    this._history = this._history.slice(0, this._historyPointer + 1);

    const maxIndex = this._historyLength - 1;
    this._historyPointer = Math.min(maxIndex, this._historyPointer + 1);

    const json = this._copy(this.trackMetadata);

    if (this._history.length === this._historyLength)
      this._history.shift();

    this._history[this._historyPointer] = json;
  }

  getSnapshot() {
    if (this.trackMetadata)
      return this._copy(this.trackMetadata);
    else
      return null;
  }

  /**
   * Go to last snapshot.
   */
  undo() {
    const pointer = this._historyPointer - 1;

    if (pointer >= 0) {
      const json = this._history[pointer];
      this._historyPointer = pointer;
      // create a copy for use as a working object
      this.setTrack(this._copy(json), this.trackData, false);
    }
  }

  /**
   * Go to next snapshot.
   */
  redo() {
    const pointer = this._historyPointer + 1;
    const json = this._history[pointer];

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
  set width(value) {
    this._width = value;
    this.$container.style.width = `${value}px`;

    this.ui.timeline.maintainVisibleDuration = true;
    this.ui.timeline.visibleWidth = value;

    this.ui.timeline.tracks.forEach(track => {
      track.render();
      track.update();
    });

    this._executeCommandForward('setWidth', value);
  }

  get width() {
    return this._width;
  }

  /**
   * Height of the player. Defaults to the height of the given container.
   *
   * @name height
   * @type {Number}
   * @instance
   */
  set height(value) {
    this._height = value;
    this.$container.style.height = `${value}px`;

    this.ui.timeline.tracks.forEach(track => {
      track.height = value;
      track.render();
      track.update();
    });

    this._executeCommandForward('setHeight', value);
  }

  get height() {
    return this._height;
  }

  /**
   * Does this make sens ?
   * @private
   */
  render() {
    // force rendering from outside the module (i.e. if values have changed)
    this.ui.timeline.tracks.forEach(track => {
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
  get position() {
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
  get duration() {
    return this.player.duration;
  }

  /**
   * Volume of the audio (in db).
   *
   * @param {Number} db - volume of the player in decibels
   */
  volume(db) {
    this.player.volume(db);
  }

  /**
   * Start the player.
   */
  start() {
    this._isPlaying = true,
    this.player.start();

    this._executeCommandForward('start');

    this.emit(EVENTS.START);
    this.emitPosition(this.position);

    this._monitorPositionRafId = requestAnimationFrame(this._monitorPosition);
  }

  /**
   * Stop the player (shortcut for `pause` and `seek` to 0).
   */
  stop() {
    this._isPlaying = false,
    this.player.stop();

    this._executeCommandForward('stop');

    this.emit(EVENTS.STOP);
    this.emitPosition(this.position);
  }

  /**
   * Pause the player.
   */
  pause() {
    this._isPlaying = false,
    this.player.pause();

    this._executeCommandForward('pause');

    this.emit(EVENTS.PAUSE);
    this.emitPosition(this.position);
  }

  /**
   * Seek to a new position in the audio file.
   *
   * @param {Number} position - New position.
   */
  seek(position) {
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
  emitPosition(position) {
    this.emit(EVENTS.CURRENT_POSITION, position, this.player.duration);
  }

    /**
   * Emit the `ended` event.
   */
  ended(position) {
    this.emit(EVENTS.ENDED, position);
    this.stop();
  }

  /**
   * Watch the current position of the player in a request animation frame loop.
   * @private
   */
  _monitorPosition() {
    if (this.player.running)
      this._monitorPositionRafId = requestAnimationFrame(this._monitorPosition);

    const position = this.player.position;
    const duration = this.player.duration;
    this.emitPosition(position);

    if (position > duration)
      return this.ended(position); // player stops the playControl

    this.player.monitorPosition();
  }
}

export default Block;
