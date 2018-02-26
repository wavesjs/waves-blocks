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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsiQWJzdHJhY3RQbGF5ZXIiLCJibG9jayIsImJ1ZmZlciIsInBvc2l0aW9uIiwiZ2FpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7OztJQUtNQSxjO0FBQ0osMEJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFDakIsU0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O0FBaUNBOzs7OzhCQUlVQyxNLEVBQVEsQ0FBRTs7QUFFcEI7Ozs7Ozs0QkFHUSxDQUFFOztBQUVWOzs7Ozs7NEJBR1EsQ0FBRTs7QUFFVjs7Ozs7OzJCQUdPLENBQUU7O0FBRVQ7Ozs7Ozs7eUJBSUtDLFEsRUFBVSxDQUFFOztBQUVqQjs7Ozs7OztzQ0FJa0IsQ0FBRTs7O3dCQTNETCxDQUFFOztBQUVqQjs7Ozs7Ozs7d0JBS2UsQ0FBRTs7QUFFakI7Ozs7Ozs7O3dCQUtjLENBQUU7O0FBRWhCOzs7Ozs7O3NCQUlTQyxJLEVBQU0sQ0FFZCxDO3dCQUVVLENBRVY7Ozs7O2tCQW9DWUosYyIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEFic3RyYWN0IGludGVyZmFjZSB0aGF0IHNob3VsZCBiZSBpbXBsZW1lbnRlZCBieSBhbnkgYGJsb2NrYCBwbGF5ZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJsb2NrIC0gVGhlIGJsb2NrIGluc3RhbmNlIHRoYXQgaW5zdGFuY2lhdGUgYW5kIGNvbnN1bWUgdGhlIHBsYXllclxuICovXG5jbGFzcyBBYnN0cmFjdFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrKSB7XG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcGxheWVyLlxuICAgKiBAdHlwZSBOdW1iZXJcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgcG9zaXRpb24oKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGR1cmF0aW9uIG9mIHRoZSBhdWRpbyBidWZmZXIuXG4gICAqIEB0eXBlIE51bWJlclxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZHVyYXRpb24gb2YgdGhlIGF1ZGlvIGJ1ZmZlci5cbiAgICogQHR5cGUgQm9vbGVhblxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBydW5uaW5nKCkge31cblxuICAvKipcbiAgICogU2V0IHRoZSB2b2x1bWUgb2YgdGhlIHBsYXllclxuICAgKiBAcGFyYW0ge051bWJlcn0gZ2FpbiAtIHZvbHVtZSBbMCwgMV1cbiAgICovXG4gIHNldCBnYWluKGdhaW4pIHtcblxuICB9XG5cbiAgZ2V0IGdhaW4oKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBsYXllcidzIGF1ZGlvIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gYnVmZmVyIC0gYXVkaW8gYnVmZmVyIHRvIHJlYWRcbiAgICovXG4gIHNldEJ1ZmZlcihidWZmZXIpIHt9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBwbGF5ZXIuXG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIFBhdXNlIHRoZSBwbGF5ZXIuXG4gICAqL1xuICBwYXVzZSgpIHt9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIHBsYXllci5cbiAgICovXG4gIHN0b3AoKSB7fVxuXG4gIC8qKlxuICAgKiBTZWVrIHRvIHRoZSBnaXZlbiBwb3NpdGlvbiBpbiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBwb3NpdGlvbiBpbiBzZWNvbmQgYXQgd2hpY2ggdGhlIHBsYXllciBzaG91bGQganVtcFxuICAgKi9cbiAgc2Vlayhwb3NpdGlvbikge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZXhlY3V0ZWQgaW4gdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wIHRoYXQgYWxsb3cgdG8gaG9va1xuICAgKiBhbmQvb3Igb3ZlcnJpZGUgdGhlIGdlbmVyaWMgYmVoYXZpb3Igb2YgdGhlIHBsYXllci5cbiAgICovXG4gIG1vbml0b3JQb3NpdGlvbigpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0UGxheWVyO1xuIl19