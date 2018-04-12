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
    key: 'accessMetadata',


    /**
     * Access the object reference on which the module should operate.
     *
     * @param {Object} metadata - Track metadata.
     * @param {String} accessor - Dot sparated path to the target object reference
     *  (ex. 'machineLearningMetadata.summary').
     * @return {Object}
     */
    value: function accessMetadata(metadata, accessor) {
      var path = accessor.split('.');
      var target = metadata;

      for (var i = 0; i < path.length; i++) {
        var key = path[i];
        target = target[key];
      }

      if (target === undefined) console.error('Invalid metadataAccessor: "' + accessor + '" does not refer to a valid object reference in', metadata);

      return target;
    }

    /**
     * Logic to implement when the module is added to the block.
     */

  }, {
    key: 'install',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFic3RyYWN0TW9kdWxlLmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0TW9kdWxlIiwiZGVmaW5pdGlvbnMiLCJvcHRpb25zIiwicGFyYW1zIiwiX2Jsb2NrIiwiX3pJbmRleCIsIm1ldGFkYXRhIiwiYWNjZXNzb3IiLCJwYXRoIiwic3BsaXQiLCJ0YXJnZXQiLCJpIiwibGVuZ3RoIiwia2V5IiwidW5kZWZpbmVkIiwiY29uc29sZSIsImVycm9yIiwiYmxvY2siLCJ6SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7SUFZTUEsYztBQUNKLDBCQUFZQyxXQUFaLEVBQXlCQyxPQUF6QixFQUFrQztBQUFBOztBQUNoQyxTQUFLQyxNQUFMLEdBQWMsMEJBQVdGLFdBQVgsRUFBd0JDLE9BQXhCLENBQWQ7O0FBRUEsU0FBS0UsTUFBTCxHQUFjLElBQWQ7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNEOzs7Ozs7QUFrQkQ7Ozs7Ozs7O21DQVFlQyxRLEVBQVVDLFEsRUFBVTtBQUNqQyxVQUFNQyxPQUFPRCxTQUFTRSxLQUFULENBQWUsR0FBZixDQUFiO0FBQ0EsVUFBSUMsU0FBU0osUUFBYjs7QUFFQSxXQUFLLElBQUlLLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsS0FBS0ksTUFBekIsRUFBaUNELEdBQWpDLEVBQXNDO0FBQ3BDLFlBQU1FLE1BQU1MLEtBQUtHLENBQUwsQ0FBWjtBQUNBRCxpQkFBU0EsT0FBT0csR0FBUCxDQUFUO0FBQ0Q7O0FBRUQsVUFBSUgsV0FBV0ksU0FBZixFQUNFQyxRQUFRQyxLQUFSLGlDQUE0Q1QsUUFBNUMsc0RBQXVHRCxRQUF2Rzs7QUFFRixhQUFPSSxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs4QkFHVSxDQUFFOztBQUVaOzs7Ozs7Z0NBR1ksQ0FBRTs7QUFFZDs7Ozs7O0FBTUE7OztBQUdBOzs7QUFHQTtBQUNBOztBQUVBOzs7QUFHQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7c0JBbEZVTyxLLEVBQU87QUFDZixXQUFLYixNQUFMLEdBQWNhLEtBQWQ7QUFDRCxLO3dCQUVXO0FBQ1YsYUFBTyxLQUFLYixNQUFaO0FBQ0Q7OztzQkFFVWMsTSxFQUFRO0FBQ2pCLFdBQUtiLE9BQUwsR0FBZWEsTUFBZjtBQUNELEs7d0JBRVk7QUFDWCxhQUFPLEtBQUtiLE9BQVo7QUFDRDs7Ozs7a0JBdUVZTCxjIiwiZmlsZSI6IkFic3RyYWN0TW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAnQGlyY2FtL3BhcmFtZXRlcnMnO1xuXG4vKipcbiAqIEFic3RyYWN0IGNsYXNzIHRvIGRlcml2ZSBpbiBvcmRlciB0byBpbXBsZW1lbnQgYSBtb2R1bGUgdGhhdCBkZWNvcmF0ZXMgdGhlXG4gKiBgQmFzZVBsYXllcmAuXG4gKiBBIG1vZHVsZSBtdXN0IGltcGxlbWVudCB0aGUgYGluc3RhbGxgIGFuZCBgdW5pbnN0YWxsYCBtZXRob2RzLlxuICogT3RoZXIgbWV0aG9kcyBtYXkgb3IgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBhY2Nyb2RpbmcgdG8gdGhlIGZ1bmN0aW9ubmFsaXR5XG4gKiBvZmZlcmVkIGJ5IHRoZSBtb2R1bGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb25zIC0gT2JqZWN0IGRlZmluaW5nIHRoZSBwYXJhbWV0ZXJzIG9mIHRoZSBtb2R1bGUuXG4gKiAgVGhlIGRlZmluaXRpb25zIHNob3VsZCBmb2xsb3cgdGhlIGNvbnZldGlvbnMgZGVmaW5lZCBpblxuICogIFtodHRwczovL2dpdGh1Yi5jb20vaXJjYW0tanN0b29scy9wYXJhbWV0ZXJzXShodHRwczovL2dpdGh1Yi5jb20vaXJjYW0tanN0b29scy9wYXJhbWV0ZXJzKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVlcmlkZSBwYXJhbWV0ZXJzIGRlZmF1bHQgdmFsdWVzLlxuICovXG5jbGFzcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKGRlZmluaXRpb25zLCBvcHRpb25zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2Jsb2NrID0gbnVsbDtcbiAgICB0aGlzLl96SW5kZXggPSBudWxsO1xuICB9XG5cbiAgc2V0IGJsb2NrKGJsb2NrKSB7XG4gICAgdGhpcy5fYmxvY2sgPSBibG9jaztcbiAgfVxuXG4gIGdldCBibG9jaygpIHtcbiAgICByZXR1cm4gdGhpcy5fYmxvY2s7XG4gIH1cblxuICBzZXQgekluZGV4KHpJbmRleCkge1xuICAgIHRoaXMuX3pJbmRleCA9IHpJbmRleDtcbiAgfVxuXG4gIGdldCB6SW5kZXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pJbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2Nlc3MgdGhlIG9iamVjdCByZWZlcmVuY2Ugb24gd2hpY2ggdGhlIG1vZHVsZSBzaG91bGQgb3BlcmF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gVHJhY2sgbWV0YWRhdGEuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY2Nlc3NvciAtIERvdCBzcGFyYXRlZCBwYXRoIHRvIHRoZSB0YXJnZXQgb2JqZWN0IHJlZmVyZW5jZVxuICAgKiAgKGV4LiAnbWFjaGluZUxlYXJuaW5nTWV0YWRhdGEuc3VtbWFyeScpLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBhY2Nlc3NNZXRhZGF0YShtZXRhZGF0YSwgYWNjZXNzb3IpIHtcbiAgICBjb25zdCBwYXRoID0gYWNjZXNzb3Iuc3BsaXQoJy4nKTtcbiAgICBsZXQgdGFyZ2V0ID0gbWV0YWRhdGE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IHBhdGhbaV07XG4gICAgICB0YXJnZXQgPSB0YXJnZXRba2V5XTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpXG4gICAgICBjb25zb2xlLmVycm9yKGBJbnZhbGlkIG1ldGFkYXRhQWNjZXNzb3I6IFwiJHthY2Nlc3Nvcn1cIiBkb2VzIG5vdCByZWZlciB0byBhIHZhbGlkIG9iamVjdCByZWZlcmVuY2UgaW5gLCBtZXRhZGF0YSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ2ljIHRvIGltcGxlbWVudCB3aGVuIHRoZSBtb2R1bGUgaXMgYWRkZWQgdG8gdGhlIGJsb2NrLlxuICAgKi9cbiAgaW5zdGFsbCgpIHt9XG5cbiAgLyoqXG4gICAqIExvZ2ljIHRvIGltcGxlbWVudCB3aGVuIHRoZSBtb2R1bGUgaXMgcmVtb3ZlZCB0byB0aGUgYmxvY2suXG4gICAqL1xuICB1bmluc3RhbGwoKSB7fVxuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBtZXRob2RzIHRoYXQgY2FuIG9wdGlvbm5hbHkgYmUgaW1wbGVtZW50ZWQuXG4gICAqIFRoZXNlIGNvbW1hbmRzIGFyZSBleGVjdXRlZCBieSB0aGUgcGxheWVyIG9uIGVhY2ggaW5zdGFsbGVkIG1vZHVsZSBpZlxuICAgKiBpbXBsZW1lbnRlZCBhdCB0aGUgbW9kdWxlIGxldmVsLlxuICAgKi9cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICAvLyBzZXRUcmFjayh0cmFja0NvbmZpZylcblxuXG4gIC8vIHNldFdpZHRoKHZhbHVlKVxuICAvLyBzZXRIZWlnaHQodmFsdWUpXG5cbiAgLyoqXG4gICAqIGZvcmNlIHJlbmRlcmluZ1xuICAgKi9cbiAgLy8gcmVuZGVyKClcblxuICAvKipcbiAgICogZXZlbnQgZW1pdHRlZCBieSB0aGUgbWFpbiB0aW1lbGluZVxuICAgKiBpZiByZXR1cm5zIHRydWUsIHByb3BhZ2F0ZSBldmVudCB0byBuZXh0IG1vZHVsZVxuICAgKiBpZiByZXR1cm5zIGZhbHNlLCBzdG9wIHByb3BhZ2F0aW9uXG4gICAqL1xuICAvLyBvbkV2ZW50KGUpXG5cbiAgLyoqXG4gICAqIGF1ZGlvIHBsYXllciBjb21tYW5kc1xuICAgKi9cbiAgLy8gc3RhcnRcbiAgLy8gc3RvcFxuICAvLyBwYXVzZVxuICAvLyBzZWVrKHBvc2l0aW9uLCBpc1BsYXlpbmcpXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0TW9kdWxlO1xuIl19