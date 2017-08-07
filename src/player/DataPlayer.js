import * as lfo from 'waves-lfo/common';
import AbstractPlayer from '../core/AbstractPlayer';


class DataPlayer extends AbstractPlayer {
  constructor(block) {
    super(block);

    this._running = false;

    this._listeners = new Set();

    this._emit = this._emit.bind(this);
    this._ended = this._ended.bind(this);

    this.dataReader = new lfo.source.DataReader();
    this.bridge = new lfo.sink.Bridge({
      processFrame: this._emit,
      finalizeStream: this._ended,
    });
    this.dataReader.connect(this.bridge);
  }

  get position() {
    // index / numFrames * duration
    const frameIndex = this.dataReader._frameIndex;
    const numFrames = this.dataReader._numFrames;
    const duration = this.duration;

    let position = frameIndex / numFrames * duration;
    // if for some reason setTrack has not been called yet
    // (aka some module, like cursor, asking for a position too early)
    if (isNaN(position))
      position = 0;

    return position;
  }

  get duration() {
    return this.dataReader.sourceEndTime - this.dataReader.sourceStartTime;
  }

  get running() {
    return this._running;
  }

  setTrack(trackConfig) {
    this.dataReader.params.set('source', trackConfig.data);
    this.dataReader.initStream(); // we know everthing is synchronous in the chain
    this.dataReader.initialized = true;
  }

  start() {
    if (this._running === false) {
      this._running = true;
      this.dataReader.start();
    }
  }

  stop() {
    this._running = false;
    this.dataReader.stop();
  }

  pause() {
    this._running = false;
    this.dataReader.pause();
  }

  seek(position) {
    const realPosition = position + this.dataReader.sourceStartTime;
    this.dataReader.seek(position);
  }

  // player specific
  addListener(listener) {
    this._listeners.add(listener);
  }

  removeListener(listener) {
    this._listeners.remove(listener);
  }

  _emit(data) {
    this._listeners.forEach(listener => listener(data));
  }

  _ended() {
    this.block.ended(this.position);
  }
}

export default DataPlayer;
