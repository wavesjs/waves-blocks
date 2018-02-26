
/**
 * Copy current config to create snapshots
 * @private
 */
function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 *
 *
 */
class History {
  constructor(host, attr, maxSize = 10) {
    // get a reference to host[attr]
    this.host = host;
    this.attr = attr;

    this._stack = [];
    this._pointer = -1;
    this._maxSize = maxSize;
  }

  head() {
    return this._stack[this._pointer];
  }

  snap() {
    // eliminate previous future
    this._stack = this._stack.slice(0, this._pointer + 1);

    const maxIndex = this._maxSize - 1;
    this._pointer = Math.min(maxIndex, this._pointer + 1);

    const snapshot = copy(this.host[this.attr]);

    if (this._stack.length === this._maxSize)
      this._stack.shift();

    this._stack[this._pointer] = snapshot;
    // console.log('snap', this._stack, this._pointer);
  }

  reset() {
    this._stack.length = 0;
    this._pointer = -1;
  }

  undo() {
    const pointer = this._pointer - 1;

    if (pointer >= 0) {
      this._pointer = pointer;
      return true;
    }

    return false;
  }

  redo() {
    const pointer = this._pointer + 1;

    if (this._stack[pointer]) {
      this._pointer = pointer;
      return true;
    }

    return false;
  }
}

export default History;
