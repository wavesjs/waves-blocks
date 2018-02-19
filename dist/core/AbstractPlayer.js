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
    key: "setBuffer",


    /**
     * Set the player's audio buffer.
     * @param {AudioBuffer} buffer - audio buffer to read
     */
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

    /**
     * Set the volume of the player
     * @param {Number} gain - volume [0, 1]
     */

  }, {
    key: "gain",
    set: function set(gain) {},
    get: function get() {}
  }]);
  return AbstractPlayer;
}();

exports.default = AbstractPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFic3RyYWN0UGxheWVyLmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0UGxheWVyIiwiYmxvY2siLCJidWZmZXIiLCJwb3NpdGlvbiIsImdhaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7SUFLTUEsYztBQUNKLDBCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQ2pCLFNBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQWlDQTs7Ozs4QkFJVUMsTSxFQUFRLENBQUU7O0FBRXBCOzs7Ozs7NEJBR1EsQ0FBRTs7QUFFVjs7Ozs7OzRCQUdRLENBQUU7O0FBRVY7Ozs7OzsyQkFHTyxDQUFFOztBQUVUOzs7Ozs7O3lCQUlLQyxRLEVBQVUsQ0FBRTs7QUFFakI7Ozs7Ozs7c0NBSWtCLENBQUU7Ozt3QkEzREwsQ0FBRTs7QUFFakI7Ozs7Ozs7O3dCQUtlLENBQUU7O0FBRWpCOzs7Ozs7Ozt3QkFLYyxDQUFFOztBQUVoQjs7Ozs7OztzQkFJU0MsSSxFQUFNLENBRWQsQzt3QkFFVSxDQUVWOzs7OztrQkFvQ1lKLGMiLCJmaWxlIjoiQWJzdHJhY3RQbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQWJzdHJhY3QgaW50ZXJmYWNlIHRoYXQgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ5IGFueSBgYmxvY2tgIHBsYXllci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmxvY2sgLSBUaGUgYmxvY2sgaW5zdGFuY2UgdGhhdCBpbnN0YW5jaWF0ZSBhbmQgY29uc3VtZSB0aGUgcGxheWVyXG4gKi9cbmNsYXNzIEFic3RyYWN0UGxheWVyIHtcbiAgY29uc3RydWN0b3IoYmxvY2spIHtcbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwbGF5ZXIuXG4gICAqIEB0eXBlIE51bWJlclxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBwb3NpdGlvbigpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZHVyYXRpb24gb2YgdGhlIGF1ZGlvIGJ1ZmZlci5cbiAgICogQHR5cGUgTnVtYmVyXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge31cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXVkaW8gYnVmZmVyLlxuICAgKiBAdHlwZSBCb29sZWFuXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHJ1bm5pbmcoKSB7fVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZvbHVtZSBvZiB0aGUgcGxheWVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBnYWluIC0gdm9sdW1lIFswLCAxXVxuICAgKi9cbiAgc2V0IGdhaW4oZ2Fpbikge1xuXG4gIH1cblxuICBnZXQgZ2FpbigpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGxheWVyJ3MgYXVkaW8gYnVmZmVyLlxuICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBidWZmZXIgLSBhdWRpbyBidWZmZXIgdG8gcmVhZFxuICAgKi9cbiAgc2V0QnVmZmVyKGJ1ZmZlcikge31cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHBsYXllci5cbiAgICovXG4gIHN0YXJ0KCkge31cblxuICAvKipcbiAgICogUGF1c2UgdGhlIHBsYXllci5cbiAgICovXG4gIHBhdXNlKCkge31cblxuICAvKipcbiAgICogU3RvcCB0aGUgcGxheWVyLlxuICAgKi9cbiAgc3RvcCgpIHt9XG5cbiAgLyoqXG4gICAqIFNlZWsgdG8gdGhlIGdpdmVuIHBvc2l0aW9uIGluIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIHBvc2l0aW9uIGluIHNlY29uZCBhdCB3aGljaCB0aGUgcGxheWVyIHNob3VsZCBqdW1wXG4gICAqL1xuICBzZWVrKHBvc2l0aW9uKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBleGVjdXRlZCBpbiB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGxvb3AgdGhhdCBhbGxvdyB0byBob29rXG4gICAqIGFuZC9vciBvdmVycmlkZSB0aGUgZ2VuZXJpYyBiZWhhdmlvciBvZiB0aGUgcGxheWVyLlxuICAgKi9cbiAgbW9uaXRvclBvc2l0aW9uKCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RQbGF5ZXI7XG4iXX0=