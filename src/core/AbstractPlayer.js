

class AbstractPlayer {
  constructor(block) {
    this.block = block;
  }

  get position() {}

  get duration() {}

  get running() {}

  setTrack(trackBuffer) {

  }

  start() {}

  pause() {}

  stop() {}

  seek(position) {}

  monitorPosition() {}
}

export default AbstractPlayer;
