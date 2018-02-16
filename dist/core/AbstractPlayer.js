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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsiQWJzdHJhY3RQbGF5ZXIiLCJibG9jayIsImRiIiwiYnVmZmVyIiwicG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7SUFLTUEsYztBQUNKLDBCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQ2pCLFNBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQXFCQTs7OzsyQkFJT0MsRSxFQUFJLENBQUU7O0FBRWI7Ozs7Ozs7OEJBSVVDLE0sRUFBUSxDQUFFOztBQUVwQjs7Ozs7OzRCQUdRLENBQUU7O0FBRVY7Ozs7Ozs0QkFHUSxDQUFFOztBQUVWOzs7Ozs7MkJBR08sQ0FBRTs7QUFFVDs7Ozs7Ozt5QkFJS0MsUSxFQUFVLENBQUU7O0FBRWpCOzs7Ozs7O3NDQUlrQixDQUFFOzs7d0JBckRMLENBQUU7O0FBRWpCOzs7Ozs7Ozt3QkFLZSxDQUFFOztBQUVqQjs7Ozs7Ozs7d0JBS2MsQ0FBRTs7Ozs7a0JBMENISixjIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQWJzdHJhY3QgaW50ZXJmYWNlIHRoYXQgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ5IGFueSBgYmxvY2tgIHBsYXllci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmxvY2sgLSBUaGUgYmxvY2sgaW5zdGFuY2UgdGhhdCBpbnN0YW5jaWF0ZSBhbmQgY29uc3VtZSB0aGUgcGxheWVyXG4gKi9cbmNsYXNzIEFic3RyYWN0UGxheWVyIHtcbiAgY29uc3RydWN0b3IoYmxvY2spIHtcbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwbGF5ZXIuXG4gICAqIEB0eXBlIE51bWJlclxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBwb3NpdGlvbigpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZHVyYXRpb24gb2YgdGhlIGF1ZGlvIGJ1ZmZlci5cbiAgICogQHR5cGUgTnVtYmVyXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge31cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXVkaW8gYnVmZmVyLlxuICAgKiBAdHlwZSBCb29sZWFuXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHJ1bm5pbmcoKSB7fVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZvbHVtZSBvZiB0aGUgcGxheWVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkYiAtIHZvbHVtZSBpbiBkZWNpYmVsc1xuICAgKi9cbiAgdm9sdW1lKGRiKSB7fVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBsYXllcidzIGF1ZGlvIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gYnVmZmVyIC0gYXVkaW8gYnVmZmVyIHRvIHJlYWRcbiAgICovXG4gIHNldEJ1ZmZlcihidWZmZXIpIHt9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBwbGF5ZXIuXG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIFBhdXNlIHRoZSBwbGF5ZXIuXG4gICAqL1xuICBwYXVzZSgpIHt9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIHBsYXllci5cbiAgICovXG4gIHN0b3AoKSB7fVxuXG4gIC8qKlxuICAgKiBTZWVrIHRvIHRoZSBnaXZlbiBwb3NpdGlvbiBpbiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBwb3NpdGlvbiBpbiBzZWNvbmQgYXQgd2hpY2ggdGhlIHBsYXllciBzaG91bGQganVtcFxuICAgKi9cbiAgc2Vlayhwb3NpdGlvbikge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZXhlY3V0ZWQgaW4gdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wIHRoYXQgYWxsb3cgdG8gaG9va1xuICAgKiBhbmQvb3Igb3ZlcnJpZGUgdGhlIGdlbmVyaWMgYmVoYXZpb3Igb2YgdGhlIHBsYXllci5cbiAgICovXG4gIG1vbml0b3JQb3NpdGlvbigpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0UGxheWVyO1xuIl19