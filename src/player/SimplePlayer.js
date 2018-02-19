import * as audio from 'waves-audio';
import AbstractPlayer from '../core/AbstractPlayer';

const audioContext = audio.audioContext;

class SimplePlayer extends AbstractPlayer {
  constructor(block) {
    super(block);

    this.gain = audioContext.createGain();
    this.gain.connect(audioContext.destination);
    this.gain.gain.value = 1;
    this.gain.gain.setValueAtTime(1, audioContext.currentTime);

    this.engine = new audio.PlayerEngine();
    this.engine.connect(this.gain);
    this.playControl = new audio.PlayControl(this.engine);
  }

  get position() {
    return this.playControl.currentPosition;
  }

  get duration() {
    return this.engine.buffer ? this.engine.buffer.duration : 0;
  }

  get running() {
    return this.playControl.running;
  }

  set gain(gain) {
    this.gain.gain.setValueAtTime(gain, audioContext.currentTime + 0.005);
  }

  get gain() {
    return this.gain.gain.value;
  }

  setBuffer(buffer) {
    this.playControl.stop();
    this.engine.buffer = buffer;
  }

  start() {
    this.playControl.start();
  }

  pause() {
    this.playControl.pause();
  }

  stop() {
    this.playControl.stop();
  }

  seek(position) {
    this.playControl.seek(position);
  }

  monitorPosition() {}
}

export default SimplePlayer;
