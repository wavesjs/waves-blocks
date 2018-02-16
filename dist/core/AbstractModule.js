'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _parameters = require('@ircam/parameters');

var _parameters2 = _interopRequireDefault(_parameters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var AbstractModule = function () {
  function AbstractModule(definitions, options) {
    (0, _classCallCheck3.default)(this, AbstractModule);

    this.params = (0, _parameters2.default)(definitions, options);

    this._block = null;
    this._zIndex = null;
  }

  (0, _createClass3.default)(AbstractModule, [{
    key: 'install',


    /**
     * Logic to implement when the module is added to the block.
     */
    value: function install() {}

    /**
     * Logic to implement when the module is removed to the block.
     */

  }, {
    key: 'uninstall',
    value: function uninstall() {}

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

  }, {
    key: 'block',
    set: function set(block) {
      this._block = block;
    },
    get: function get() {
      return this._block;
    }
  }, {
    key: 'zIndex',
    set: function set(zIndex) {
      this._zIndex = zIndex;
    },
    get: function get() {
      return this._zIndex;
    }
  }]);
  return AbstractModule;
}();

exports.default = AbstractModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsiQWJzdHJhY3RNb2R1bGUiLCJkZWZpbml0aW9ucyIsIm9wdGlvbnMiLCJwYXJhbXMiLCJfYmxvY2siLCJfekluZGV4IiwiYmxvY2siLCJ6SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7SUFZTUEsYztBQUNKLDBCQUFZQyxXQUFaLEVBQXlCQyxPQUF6QixFQUFrQztBQUFBOztBQUNoQyxTQUFLQyxNQUFMLEdBQWMsMEJBQVdGLFdBQVgsRUFBd0JDLE9BQXhCLENBQWQ7O0FBRUEsU0FBS0UsTUFBTCxHQUFjLElBQWQ7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNEOzs7Ozs7QUFrQkQ7Ozs4QkFHVSxDQUFFOztBQUVaOzs7Ozs7Z0NBR1ksQ0FBRTs7QUFFZDs7Ozs7O0FBTUE7OztBQUdBOzs7QUFHQTtBQUNBOztBQUVBOzs7QUFHQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7c0JBM0RVQyxLLEVBQU87QUFDZixXQUFLRixNQUFMLEdBQWNFLEtBQWQ7QUFDRCxLO3dCQUVXO0FBQ1YsYUFBTyxLQUFLRixNQUFaO0FBQ0Q7OztzQkFFVUcsTSxFQUFRO0FBQ2pCLFdBQUtGLE9BQUwsR0FBZUUsTUFBZjtBQUNELEs7d0JBRVk7QUFDWCxhQUFPLEtBQUtGLE9BQVo7QUFDRDs7Ozs7a0JBZ0RZTCxjIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGFyYW1ldGVycyBmcm9tICdAaXJjYW0vcGFyYW1ldGVycyc7XG5cbi8qKlxuICogQWJzdHJhY3QgY2xhc3MgdG8gZGVyaXZlIGluIG9yZGVyIHRvIGltcGxlbWVudCBhIG1vZHVsZSB0aGF0IGRlY29yYXRlcyB0aGVcbiAqIGBCYXNlUGxheWVyYC5cbiAqIEEgbW9kdWxlIG11c3QgaW1wbGVtZW50IHRoZSBgaW5zdGFsbGAgYW5kIGB1bmluc3RhbGxgIG1ldGhvZHMuXG4gKiBPdGhlciBtZXRob2RzIG1heSBvciBtYXkgbm90IGJlIGltcGxlbWVudGVkIGFjY3JvZGluZyB0byB0aGUgZnVuY3Rpb25uYWxpdHlcbiAqIG9mZmVyZWQgYnkgdGhlIG1vZHVsZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmaW5pdGlvbnMgLSBPYmplY3QgZGVmaW5pbmcgdGhlIHBhcmFtZXRlcnMgb2YgdGhlIG1vZHVsZS5cbiAqICBUaGUgZGVmaW5pdGlvbnMgc2hvdWxkIGZvbGxvdyB0aGUgY29udmV0aW9ucyBkZWZpbmVkIGluXG4gKiAgW2h0dHBzOi8vZ2l0aHViLmNvbS9pcmNhbS1qc3Rvb2xzL3BhcmFtZXRlcnNdKGh0dHBzOi8vZ2l0aHViLmNvbS9pcmNhbS1qc3Rvb2xzL3BhcmFtZXRlcnMpXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZWVyaWRlIHBhcmFtZXRlcnMgZGVmYXVsdCB2YWx1ZXMuXG4gKi9cbmNsYXNzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtZXRlcnMoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fYmxvY2sgPSBudWxsO1xuICAgIHRoaXMuX3pJbmRleCA9IG51bGw7XG4gIH1cblxuICBzZXQgYmxvY2soYmxvY2spIHtcbiAgICB0aGlzLl9ibG9jayA9IGJsb2NrO1xuICB9XG5cbiAgZ2V0IGJsb2NrKCkge1xuICAgIHJldHVybiB0aGlzLl9ibG9jaztcbiAgfVxuXG4gIHNldCB6SW5kZXgoekluZGV4KSB7XG4gICAgdGhpcy5fekluZGV4ID0gekluZGV4O1xuICB9XG5cbiAgZ2V0IHpJbmRleCgpIHtcbiAgICByZXR1cm4gdGhpcy5fekluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ2ljIHRvIGltcGxlbWVudCB3aGVuIHRoZSBtb2R1bGUgaXMgYWRkZWQgdG8gdGhlIGJsb2NrLlxuICAgKi9cbiAgaW5zdGFsbCgpIHt9XG5cbiAgLyoqXG4gICAqIExvZ2ljIHRvIGltcGxlbWVudCB3aGVuIHRoZSBtb2R1bGUgaXMgcmVtb3ZlZCB0byB0aGUgYmxvY2suXG4gICAqL1xuICB1bmluc3RhbGwoKSB7fVxuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBtZXRob2RzIHRoYXQgY2FuIG9wdGlvbm5hbHkgYmUgaW1wbGVtZW50ZWQuXG4gICAqIFRoZXNlIGNvbW1hbmRzIGFyZSBleGVjdXRlZCBieSB0aGUgcGxheWVyIG9uIGVhY2ggaW5zdGFsbGVkIG1vZHVsZSBpZlxuICAgKiBpbXBsZW1lbnRlZCBhdCB0aGUgbW9kdWxlIGxldmVsLlxuICAgKi9cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICAvLyBzZXRUcmFjayh0cmFja0NvbmZpZylcblxuXG4gIC8vIHNldFdpZHRoKHZhbHVlKVxuICAvLyBzZXRIZWlnaHQodmFsdWUpXG5cbiAgLyoqXG4gICAqIGZvcmNlIHJlbmRlcmluZ1xuICAgKi9cbiAgLy8gcmVuZGVyKClcblxuICAvKipcbiAgICogZXZlbnQgZW1pdHRlZCBieSB0aGUgbWFpbiB0aW1lbGluZVxuICAgKiBpZiByZXR1cm5zIHRydWUsIHByb3BhZ2F0ZSBldmVudCB0byBuZXh0IG1vZHVsZVxuICAgKiBpZiByZXR1cm5zIGZhbHNlLCBzdG9wIHByb3BhZ2F0aW9uXG4gICAqL1xuICAvLyBvbkV2ZW50KGUpXG5cbiAgLyoqXG4gICAqIGF1ZGlvIHBsYXllciBjb21tYW5kc1xuICAgKi9cbiAgLy8gc3RhcnRcbiAgLy8gc3RvcFxuICAvLyBwYXVzZVxuICAvLyBzZWVrKHBvc2l0aW9uLCBpc1BsYXlpbmcpXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0TW9kdWxlO1xuIl19