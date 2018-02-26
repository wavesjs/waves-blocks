"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copy current config to create snapshots
 * @private
 */
function copy(obj) {
  return JSON.parse((0, _stringify2.default)(obj));
}

/**
 *
 *
 */

var History = function () {
  function History(host, attr) {
    var maxSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    (0, _classCallCheck3.default)(this, History);

    // get a reference to host[attr]
    this.host = host;
    this.attr = attr;

    this._stack = [];
    this._pointer = -1;
    this._maxSize = maxSize;
  }

  (0, _createClass3.default)(History, [{
    key: "head",
    value: function head() {
      return this._stack[this._pointer];
    }
  }, {
    key: "snap",
    value: function snap() {
      // eliminate previous future
      this._stack = this._stack.slice(0, this._pointer + 1);

      var maxIndex = this._maxSize - 1;
      this._pointer = Math.min(maxIndex, this._pointer + 1);

      var snapshot = copy(this.host[this.attr]);

      if (this._stack.length === this._maxSize) this._stack.shift();

      this._stack[this._pointer] = snapshot;
      // console.log('snap', this._stack, this._pointer);
    }
  }, {
    key: "reset",
    value: function reset() {
      this._stack.length = 0;
      this._pointer = -1;
    }
  }, {
    key: "undo",
    value: function undo() {
      var pointer = this._pointer - 1;

      if (pointer >= 0) {
        this._pointer = pointer;
        return true;
      }

      return false;
    }
  }, {
    key: "redo",
    value: function redo() {
      var pointer = this._pointer + 1;

      if (this._stack[pointer]) {
        this._pointer = pointer;
        return true;
      }

      return false;
    }
  }]);
  return History;
}();

exports.default = History;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsiY29weSIsIm9iaiIsIkpTT04iLCJwYXJzZSIsIkhpc3RvcnkiLCJob3N0IiwiYXR0ciIsIm1heFNpemUiLCJfc3RhY2siLCJfcG9pbnRlciIsIl9tYXhTaXplIiwic2xpY2UiLCJtYXhJbmRleCIsIk1hdGgiLCJtaW4iLCJzbmFwc2hvdCIsImxlbmd0aCIsInNoaWZ0IiwicG9pbnRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7OztBQUlBLFNBQVNBLElBQVQsQ0FBY0MsR0FBZCxFQUFtQjtBQUNqQixTQUFPQyxLQUFLQyxLQUFMLENBQVcseUJBQWVGLEdBQWYsQ0FBWCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0lBSU1HLE87QUFDSixtQkFBWUMsSUFBWixFQUFrQkMsSUFBbEIsRUFBc0M7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDcEM7QUFDQSxTQUFLRixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7O0FBRUEsU0FBS0UsTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLENBQUMsQ0FBakI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCSCxPQUFoQjtBQUNEOzs7OzJCQUVNO0FBQ0wsYUFBTyxLQUFLQyxNQUFMLENBQVksS0FBS0MsUUFBakIsQ0FBUDtBQUNEOzs7MkJBRU07QUFDTDtBQUNBLFdBQUtELE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVlHLEtBQVosQ0FBa0IsQ0FBbEIsRUFBcUIsS0FBS0YsUUFBTCxHQUFnQixDQUFyQyxDQUFkOztBQUVBLFVBQU1HLFdBQVcsS0FBS0YsUUFBTCxHQUFnQixDQUFqQztBQUNBLFdBQUtELFFBQUwsR0FBZ0JJLEtBQUtDLEdBQUwsQ0FBU0YsUUFBVCxFQUFtQixLQUFLSCxRQUFMLEdBQWdCLENBQW5DLENBQWhCOztBQUVBLFVBQU1NLFdBQVdmLEtBQUssS0FBS0ssSUFBTCxDQUFVLEtBQUtDLElBQWYsQ0FBTCxDQUFqQjs7QUFFQSxVQUFJLEtBQUtFLE1BQUwsQ0FBWVEsTUFBWixLQUF1QixLQUFLTixRQUFoQyxFQUNFLEtBQUtGLE1BQUwsQ0FBWVMsS0FBWjs7QUFFRixXQUFLVCxNQUFMLENBQVksS0FBS0MsUUFBakIsSUFBNkJNLFFBQTdCO0FBQ0E7QUFDRDs7OzRCQUVPO0FBQ04sV0FBS1AsTUFBTCxDQUFZUSxNQUFaLEdBQXFCLENBQXJCO0FBQ0EsV0FBS1AsUUFBTCxHQUFnQixDQUFDLENBQWpCO0FBQ0Q7OzsyQkFFTTtBQUNMLFVBQU1TLFVBQVUsS0FBS1QsUUFBTCxHQUFnQixDQUFoQzs7QUFFQSxVQUFJUyxXQUFXLENBQWYsRUFBa0I7QUFDaEIsYUFBS1QsUUFBTCxHQUFnQlMsT0FBaEI7QUFDQSxlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsVUFBTUEsVUFBVSxLQUFLVCxRQUFMLEdBQWdCLENBQWhDOztBQUVBLFVBQUksS0FBS0QsTUFBTCxDQUFZVSxPQUFaLENBQUosRUFBMEI7QUFDeEIsYUFBS1QsUUFBTCxHQUFnQlMsT0FBaEI7QUFDQSxlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQVA7QUFDRDs7Ozs7a0JBR1lkLE8iLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDb3B5IGN1cnJlbnQgY29uZmlnIHRvIGNyZWF0ZSBzbmFwc2hvdHNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNvcHkob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufVxuXG4vKipcbiAqXG4gKlxuICovXG5jbGFzcyBIaXN0b3J5IHtcbiAgY29uc3RydWN0b3IoaG9zdCwgYXR0ciwgbWF4U2l6ZSA9IDEwKSB7XG4gICAgLy8gZ2V0IGEgcmVmZXJlbmNlIHRvIGhvc3RbYXR0cl1cbiAgICB0aGlzLmhvc3QgPSBob3N0O1xuICAgIHRoaXMuYXR0ciA9IGF0dHI7XG5cbiAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgIHRoaXMuX3BvaW50ZXIgPSAtMTtcbiAgICB0aGlzLl9tYXhTaXplID0gbWF4U2l6ZTtcbiAgfVxuXG4gIGhlYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWNrW3RoaXMuX3BvaW50ZXJdO1xuICB9XG5cbiAgc25hcCgpIHtcbiAgICAvLyBlbGltaW5hdGUgcHJldmlvdXMgZnV0dXJlXG4gICAgdGhpcy5fc3RhY2sgPSB0aGlzLl9zdGFjay5zbGljZSgwLCB0aGlzLl9wb2ludGVyICsgMSk7XG5cbiAgICBjb25zdCBtYXhJbmRleCA9IHRoaXMuX21heFNpemUgLSAxO1xuICAgIHRoaXMuX3BvaW50ZXIgPSBNYXRoLm1pbihtYXhJbmRleCwgdGhpcy5fcG9pbnRlciArIDEpO1xuXG4gICAgY29uc3Qgc25hcHNob3QgPSBjb3B5KHRoaXMuaG9zdFt0aGlzLmF0dHJdKTtcblxuICAgIGlmICh0aGlzLl9zdGFjay5sZW5ndGggPT09IHRoaXMuX21heFNpemUpXG4gICAgICB0aGlzLl9zdGFjay5zaGlmdCgpO1xuXG4gICAgdGhpcy5fc3RhY2tbdGhpcy5fcG9pbnRlcl0gPSBzbmFwc2hvdDtcbiAgICAvLyBjb25zb2xlLmxvZygnc25hcCcsIHRoaXMuX3N0YWNrLCB0aGlzLl9wb2ludGVyKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX3N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fcG9pbnRlciA9IC0xO1xuICB9XG5cbiAgdW5kbygpIHtcbiAgICBjb25zdCBwb2ludGVyID0gdGhpcy5fcG9pbnRlciAtIDE7XG5cbiAgICBpZiAocG9pbnRlciA+PSAwKSB7XG4gICAgICB0aGlzLl9wb2ludGVyID0gcG9pbnRlcjtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJlZG8oKSB7XG4gICAgY29uc3QgcG9pbnRlciA9IHRoaXMuX3BvaW50ZXIgKyAxO1xuXG4gICAgaWYgKHRoaXMuX3N0YWNrW3BvaW50ZXJdKSB7XG4gICAgICB0aGlzLl9wb2ludGVyID0gcG9pbnRlcjtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19