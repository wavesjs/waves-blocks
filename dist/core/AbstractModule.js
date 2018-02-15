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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0TW9kdWxlIiwiZGVmaW5pdGlvbnMiLCJvcHRpb25zIiwicGFyYW1zIiwiX2Jsb2NrIiwiX3pJbmRleCIsImJsb2NrIiwiekluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0lBWU1BLGM7QUFDSiwwQkFBWUMsV0FBWixFQUF5QkMsT0FBekIsRUFBa0M7QUFBQTs7QUFDaEMsU0FBS0MsTUFBTCxHQUFjLDBCQUFXRixXQUFYLEVBQXdCQyxPQUF4QixDQUFkOztBQUVBLFNBQUtFLE1BQUwsR0FBYyxJQUFkO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDRDs7Ozs7O0FBa0JEOzs7OEJBR1UsQ0FBRTs7QUFFWjs7Ozs7O2dDQUdZLENBQUU7O0FBRWQ7Ozs7OztBQU1BOzs7QUFHQTs7O0FBR0E7QUFDQTs7QUFFQTs7O0FBR0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7O3NCQTNEVUMsSyxFQUFPO0FBQ2YsV0FBS0YsTUFBTCxHQUFjRSxLQUFkO0FBQ0QsSzt3QkFFVztBQUNWLGFBQU8sS0FBS0YsTUFBWjtBQUNEOzs7c0JBRVVHLE0sRUFBUTtBQUNqQixXQUFLRixPQUFMLEdBQWVFLE1BQWY7QUFDRCxLO3dCQUVZO0FBQ1gsYUFBTyxLQUFLRixPQUFaO0FBQ0Q7Ozs7O2tCQWdEWUwsYyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXJhbWV0ZXJzIGZyb20gJ0BpcmNhbS9wYXJhbWV0ZXJzJztcblxuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyB0byBkZXJpdmUgaW4gb3JkZXIgdG8gaW1wbGVtZW50IGEgbW9kdWxlIHRoYXQgZGVjb3JhdGVzIHRoZVxuICogYEJhc2VQbGF5ZXJgLlxuICogQSBtb2R1bGUgbXVzdCBpbXBsZW1lbnQgdGhlIGBpbnN0YWxsYCBhbmQgYHVuaW5zdGFsbGAgbWV0aG9kcy5cbiAqIE90aGVyIG1ldGhvZHMgbWF5IG9yIG1heSBub3QgYmUgaW1wbGVtZW50ZWQgYWNjcm9kaW5nIHRvIHRoZSBmdW5jdGlvbm5hbGl0eVxuICogb2ZmZXJlZCBieSB0aGUgbW9kdWxlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZpbml0aW9ucyAtIE9iamVjdCBkZWZpbmluZyB0aGUgcGFyYW1ldGVycyBvZiB0aGUgbW9kdWxlLlxuICogIFRoZSBkZWZpbml0aW9ucyBzaG91bGQgZm9sbG93IHRoZSBjb252ZXRpb25zIGRlZmluZWQgaW5cbiAqICBbaHR0cHM6Ly9naXRodWIuY29tL2lyY2FtLWpzdG9vbHMvcGFyYW1ldGVyc10oaHR0cHM6Ly9naXRodWIuY29tL2lyY2FtLWpzdG9vbHMvcGFyYW1ldGVycylcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlZXJpZGUgcGFyYW1ldGVycyBkZWZhdWx0IHZhbHVlcy5cbiAqL1xuY2xhc3MgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihkZWZpbml0aW9ucywgb3B0aW9ucykge1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9ibG9jayA9IG51bGw7XG4gICAgdGhpcy5fekluZGV4ID0gbnVsbDtcbiAgfVxuXG4gIHNldCBibG9jayhibG9jaykge1xuICAgIHRoaXMuX2Jsb2NrID0gYmxvY2s7XG4gIH1cblxuICBnZXQgYmxvY2soKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jsb2NrO1xuICB9XG5cbiAgc2V0IHpJbmRleCh6SW5kZXgpIHtcbiAgICB0aGlzLl96SW5kZXggPSB6SW5kZXg7XG4gIH1cblxuICBnZXQgekluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLl96SW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogTG9naWMgdG8gaW1wbGVtZW50IHdoZW4gdGhlIG1vZHVsZSBpcyBhZGRlZCB0byB0aGUgYmxvY2suXG4gICAqL1xuICBpbnN0YWxsKCkge31cblxuICAvKipcbiAgICogTG9naWMgdG8gaW1wbGVtZW50IHdoZW4gdGhlIG1vZHVsZSBpcyByZW1vdmVkIHRvIHRoZSBibG9jay5cbiAgICovXG4gIHVuaW5zdGFsbCgpIHt9XG5cbiAgLyoqXG4gICAqIEFic3RyYWN0IG1ldGhvZHMgdGhhdCBjYW4gb3B0aW9ubmFseSBiZSBpbXBsZW1lbnRlZC5cbiAgICogVGhlc2UgY29tbWFuZHMgYXJlIGV4ZWN1dGVkIGJ5IHRoZSBwbGF5ZXIgb24gZWFjaCBpbnN0YWxsZWQgbW9kdWxlIGlmXG4gICAqIGltcGxlbWVudGVkIGF0IHRoZSBtb2R1bGUgbGV2ZWwuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIC8vIHNldFRyYWNrKHRyYWNrQ29uZmlnKVxuXG5cbiAgLy8gc2V0V2lkdGgodmFsdWUpXG4gIC8vIHNldEhlaWdodCh2YWx1ZSlcblxuICAvKipcbiAgICogZm9yY2UgcmVuZGVyaW5nXG4gICAqL1xuICAvLyByZW5kZXIoKVxuXG4gIC8qKlxuICAgKiBldmVudCBlbWl0dGVkIGJ5IHRoZSBtYWluIHRpbWVsaW5lXG4gICAqIGlmIHJldHVybnMgdHJ1ZSwgcHJvcGFnYXRlIGV2ZW50IHRvIG5leHQgbW9kdWxlXG4gICAqIGlmIHJldHVybnMgZmFsc2UsIHN0b3AgcHJvcGFnYXRpb25cbiAgICovXG4gIC8vIG9uRXZlbnQoZSlcblxuICAvKipcbiAgICogYXVkaW8gcGxheWVyIGNvbW1hbmRzXG4gICAqL1xuICAvLyBzdGFydFxuICAvLyBzdG9wXG4gIC8vIHBhdXNlXG4gIC8vIHNlZWsocG9zaXRpb24sIGlzUGxheWluZylcbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RNb2R1bGU7XG4iXX0=