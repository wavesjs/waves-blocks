import parameters from '@ircam/parameters';

/**
 * Abstract class to derive in order to implement a module that decorates the
 * `BasePlayer`.
 * A module must implement the `install` and `uninstall` methods.
 * Other methods may or may not be implemented accroding to the functionnality
 * offered by the module.
 *
 * @param {Object} definitions - Object defining the parameters of the module.
 *  The definitions should follow the convetions defined in
 *  [https://github.com/ircam-jstools/parameters](https://github.com/ircam-jstools/parameters)
 * @param {Object} options - Oveeride parameters default values.
 */
class AbstractModule {
  constructor(definitions, options) {
    this.params = parameters(definitions, options);

    this._block = null;
    this._zIndex = null;
  }

  set block(block) {
    this._block = block;
  }

  get block() {
    return this._block;
  }

  set zIndex(zIndex) {
    this._zIndex = zIndex;
  }

  get zIndex() {
    return this._zIndex;
  }

  /**
   * Logic to implement when the module is added to the block.
   */
  install() {}

  /**
   * Logic to implement when the module is removed to the block.
   */
  uninstall() {}

  /**
   * Abstract methods that can optionnaly be implemented.
   * These commands are executed by the player on each installed module if
   * implemented at the module level.
   */

  /**
   * @abstract
   */
  // setTrack(trackConfig)


  // setWidth(value)
  // setHeight(value)

  /**
   * force rendering
   */
  // render()

  /**
   * event emitted by the main timeline
   * if returns true, propagate event to next module
   * if returns false, stop propagation
   */
  // onEvent(e)

  /**
   * audio player commands
   */
  // start
  // stop
  // pause
  // seek(position, isPlaying)
}

export default AbstractModule;
