"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Abstract interface that should be implemented by any `block` player.
 *
 * @param {Object} block - The block instance that instanciate and consume the player
 */
var AbstractPlayer = function () {
  function AbstractPlayer(block) {
    (0, _classCallCheck3.default)(this, AbstractPlayer);

    this.block = block;
  }

  /**
   * Return the current position of the player.
   * @type Number
   * @readonly
   */


  (0, _createClass3.default)(AbstractPlayer, [{
    key: "volume",


    /**
     * Set the volume of the player
     * @param {Number} db - volume in decibels
     */
    value: function volume(db) {}

    /**
     * Set the player's audio buffer.
     * @param {AudioBuffer} buffer - audio buffer to read
     */

  }, {
    key: "setBuffer",
    value: function setBuffer(buffer) {}

    /**
     * Start the player.
     */

  }, {
    key: "start",
    value: function start() {}

    /**
     * Pause the player.
     */

  }, {
    key: "pause",
    value: function pause() {}

    /**
     * Stop the player.
     */

  }, {
    key: "stop",
    value: function stop() {}

    /**
     * Seek to the given position in the buffer.
     * @param {Number} position - position in second at which the player should jump
     */

  }, {
    key: "seek",
    value: function seek(position) {}

    /**
     * Callback executed in the requestAnimationFrame loop that allow to hook
     * and/or override the generic behavior of the player.
     */

  }, {
    key: "monitorPosition",
    value: function monitorPosition() {}
  }, {
    key: "position",
    get: function get() {}

    /**
     * Return the duration of the audio buffer.
     * @type Number
     * @readonly
     */

  }, {
    key: "duration",
    get: function get() {}

    /**
     * Return the duration of the audio buffer.
     * @type Boolean
     * @readonly
     */

  }, {
    key: "running",
    get: function get() {}
  }]);
  return AbstractPlayer;
}();

exports.default = AbstractPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0UGxheWVyIiwiYmxvY2siLCJkYiIsImJ1ZmZlciIsInBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7O0lBS01BLGM7QUFDSiwwQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUNqQixTQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7QUFxQkE7Ozs7MkJBSU9DLEUsRUFBSSxDQUFFOztBQUViOzs7Ozs7OzhCQUlVQyxNLEVBQVEsQ0FBRTs7QUFFcEI7Ozs7Ozs0QkFHUSxDQUFFOztBQUVWOzs7Ozs7NEJBR1EsQ0FBRTs7QUFFVjs7Ozs7OzJCQUdPLENBQUU7O0FBRVQ7Ozs7Ozs7eUJBSUtDLFEsRUFBVSxDQUFFOztBQUVqQjs7Ozs7OztzQ0FJa0IsQ0FBRTs7O3dCQXJETCxDQUFFOztBQUVqQjs7Ozs7Ozs7d0JBS2UsQ0FBRTs7QUFFakI7Ozs7Ozs7O3dCQUtjLENBQUU7Ozs7O2tCQTBDSEosYyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBBYnN0cmFjdCBpbnRlcmZhY2UgdGhhdCBzaG91bGQgYmUgaW1wbGVtZW50ZWQgYnkgYW55IGBibG9ja2AgcGxheWVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBibG9jayAtIFRoZSBibG9jayBpbnN0YW5jZSB0aGF0IGluc3RhbmNpYXRlIGFuZCBjb25zdW1lIHRoZSBwbGF5ZXJcbiAqL1xuY2xhc3MgQWJzdHJhY3RQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihibG9jaykge1xuICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBsYXllci5cbiAgICogQHR5cGUgTnVtYmVyXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHBvc2l0aW9uKCkge31cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXVkaW8gYnVmZmVyLlxuICAgKiBAdHlwZSBOdW1iZXJcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGR1cmF0aW9uIG9mIHRoZSBhdWRpbyBidWZmZXIuXG4gICAqIEB0eXBlIEJvb2xlYW5cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgcnVubmluZygpIHt9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdm9sdW1lIG9mIHRoZSBwbGF5ZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRiIC0gdm9sdW1lIGluIGRlY2liZWxzXG4gICAqL1xuICB2b2x1bWUoZGIpIHt9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGxheWVyJ3MgYXVkaW8gYnVmZmVyLlxuICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBidWZmZXIgLSBhdWRpbyBidWZmZXIgdG8gcmVhZFxuICAgKi9cbiAgc2V0QnVmZmVyKGJ1ZmZlcikge31cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHBsYXllci5cbiAgICovXG4gIHN0YXJ0KCkge31cblxuICAvKipcbiAgICogUGF1c2UgdGhlIHBsYXllci5cbiAgICovXG4gIHBhdXNlKCkge31cblxuICAvKipcbiAgICogU3RvcCB0aGUgcGxheWVyLlxuICAgKi9cbiAgc3RvcCgpIHt9XG5cbiAgLyoqXG4gICAqIFNlZWsgdG8gdGhlIGdpdmVuIHBvc2l0aW9uIGluIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIHBvc2l0aW9uIGluIHNlY29uZCBhdCB3aGljaCB0aGUgcGxheWVyIHNob3VsZCBqdW1wXG4gICAqL1xuICBzZWVrKHBvc2l0aW9uKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBleGVjdXRlZCBpbiB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGxvb3AgdGhhdCBhbGxvdyB0byBob29rXG4gICAqIGFuZC9vciBvdmVycmlkZSB0aGUgZ2VuZXJpYyBiZWhhdmlvciBvZiB0aGUgcGxheWVyLlxuICAgKi9cbiAgbW9uaXRvclBvc2l0aW9uKCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RQbGF5ZXI7XG4iXX0=