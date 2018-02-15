
/**
 * Abstract interface that should be implemented by any `block` player.
 *
 * @param {Object} block - The block instance that instanciate and consume the player
 */
class AbstractPlayer {
  constructor(block) {
    this.block = block;
  }

  /**
   * Return the current position of the player.
   * @type Number
   * @readonly
   */
  get position() {}

  /**
   * Return the duration of the audio buffer.
   * @type Number
   * @readonly
   */
  get duration() {}

  /**
   * Return the duration of the audio buffer.
   * @type Boolean
   * @readonly
   */
  get running() {}

  /**
   * Set the volume of the player
   * @param {Number} db - volume in decibels
   */
  volume(db) {}

  /**
   * Set the player's audio buffer.
   * @param {AudioBuffer} buffer - audio buffer to read
   */
  setBuffer(buffer) {}

  /**
   * Start the player.
   */
  start() {}

  /**
   * Pause the player.
   */
  pause() {}

  /**
   * Stop the player.
   */
  stop() {}

  /**
   * Seek to the given position in the buffer.
   * @param {Number} position - position in second at which the player should jump
   */
  seek(position) {}

  /**
   * Callback executed in the requestAnimationFrame loop that allow to hook
   * and/or override the generic behavior of the player.
   */
  monitorPosition() {}
}

export default AbstractPlayer;
