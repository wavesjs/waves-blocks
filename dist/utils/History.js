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
      return copy(this._stack[this._pointer]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsiY29weSIsIm9iaiIsIkpTT04iLCJwYXJzZSIsIkhpc3RvcnkiLCJob3N0IiwiYXR0ciIsIm1heFNpemUiLCJfc3RhY2siLCJfcG9pbnRlciIsIl9tYXhTaXplIiwic2xpY2UiLCJtYXhJbmRleCIsIk1hdGgiLCJtaW4iLCJzbmFwc2hvdCIsImxlbmd0aCIsInNoaWZ0IiwicG9pbnRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7OztBQUlBLFNBQVNBLElBQVQsQ0FBY0MsR0FBZCxFQUFtQjtBQUNqQixTQUFPQyxLQUFLQyxLQUFMLENBQVcseUJBQWVGLEdBQWYsQ0FBWCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0lBSU1HLE87QUFDSixtQkFBWUMsSUFBWixFQUFrQkMsSUFBbEIsRUFBc0M7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDcEM7QUFDQSxTQUFLRixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7O0FBRUEsU0FBS0UsTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLENBQUMsQ0FBakI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCSCxPQUFoQjtBQUNEOzs7OzJCQUVNO0FBQ0wsYUFBT1AsS0FBSyxLQUFLUSxNQUFMLENBQVksS0FBS0MsUUFBakIsQ0FBTCxDQUFQO0FBQ0Q7OzsyQkFFTTtBQUNMO0FBQ0EsV0FBS0QsTUFBTCxHQUFjLEtBQUtBLE1BQUwsQ0FBWUcsS0FBWixDQUFrQixDQUFsQixFQUFxQixLQUFLRixRQUFMLEdBQWdCLENBQXJDLENBQWQ7O0FBRUEsVUFBTUcsV0FBVyxLQUFLRixRQUFMLEdBQWdCLENBQWpDO0FBQ0EsV0FBS0QsUUFBTCxHQUFnQkksS0FBS0MsR0FBTCxDQUFTRixRQUFULEVBQW1CLEtBQUtILFFBQUwsR0FBZ0IsQ0FBbkMsQ0FBaEI7O0FBRUEsVUFBTU0sV0FBV2YsS0FBSyxLQUFLSyxJQUFMLENBQVUsS0FBS0MsSUFBZixDQUFMLENBQWpCOztBQUVBLFVBQUksS0FBS0UsTUFBTCxDQUFZUSxNQUFaLEtBQXVCLEtBQUtOLFFBQWhDLEVBQ0UsS0FBS0YsTUFBTCxDQUFZUyxLQUFaOztBQUVGLFdBQUtULE1BQUwsQ0FBWSxLQUFLQyxRQUFqQixJQUE2Qk0sUUFBN0I7QUFDQTtBQUNEOzs7NEJBRU87QUFDTixXQUFLUCxNQUFMLENBQVlRLE1BQVosR0FBcUIsQ0FBckI7QUFDQSxXQUFLUCxRQUFMLEdBQWdCLENBQUMsQ0FBakI7QUFDRDs7OzJCQUVNO0FBQ0wsVUFBTVMsVUFBVSxLQUFLVCxRQUFMLEdBQWdCLENBQWhDOztBQUVBLFVBQUlTLFdBQVcsQ0FBZixFQUFrQjtBQUNoQixhQUFLVCxRQUFMLEdBQWdCUyxPQUFoQjtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU8sS0FBUDtBQUNEOzs7MkJBRU07QUFDTCxVQUFNQSxVQUFVLEtBQUtULFFBQUwsR0FBZ0IsQ0FBaEM7O0FBRUEsVUFBSSxLQUFLRCxNQUFMLENBQVlVLE9BQVosQ0FBSixFQUEwQjtBQUN4QixhQUFLVCxRQUFMLEdBQWdCUyxPQUFoQjtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU8sS0FBUDtBQUNEOzs7OztrQkFHWWQsTyIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIENvcHkgY3VycmVudCBjb25maWcgdG8gY3JlYXRlIHNuYXBzaG90c1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY29weShvYmopIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59XG5cbi8qKlxuICpcbiAqXG4gKi9cbmNsYXNzIEhpc3Rvcnkge1xuICBjb25zdHJ1Y3Rvcihob3N0LCBhdHRyLCBtYXhTaXplID0gMTApIHtcbiAgICAvLyBnZXQgYSByZWZlcmVuY2UgdG8gaG9zdFthdHRyXVxuICAgIHRoaXMuaG9zdCA9IGhvc3Q7XG4gICAgdGhpcy5hdHRyID0gYXR0cjtcblxuICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgdGhpcy5fcG9pbnRlciA9IC0xO1xuICAgIHRoaXMuX21heFNpemUgPSBtYXhTaXplO1xuICB9XG5cbiAgaGVhZCgpIHtcbiAgICByZXR1cm4gY29weSh0aGlzLl9zdGFja1t0aGlzLl9wb2ludGVyXSk7XG4gIH1cblxuICBzbmFwKCkge1xuICAgIC8vIGVsaW1pbmF0ZSBwcmV2aW91cyBmdXR1cmVcbiAgICB0aGlzLl9zdGFjayA9IHRoaXMuX3N0YWNrLnNsaWNlKDAsIHRoaXMuX3BvaW50ZXIgKyAxKTtcblxuICAgIGNvbnN0IG1heEluZGV4ID0gdGhpcy5fbWF4U2l6ZSAtIDE7XG4gICAgdGhpcy5fcG9pbnRlciA9IE1hdGgubWluKG1heEluZGV4LCB0aGlzLl9wb2ludGVyICsgMSk7XG5cbiAgICBjb25zdCBzbmFwc2hvdCA9IGNvcHkodGhpcy5ob3N0W3RoaXMuYXR0cl0pO1xuXG4gICAgaWYgKHRoaXMuX3N0YWNrLmxlbmd0aCA9PT0gdGhpcy5fbWF4U2l6ZSlcbiAgICAgIHRoaXMuX3N0YWNrLnNoaWZ0KCk7XG5cbiAgICB0aGlzLl9zdGFja1t0aGlzLl9wb2ludGVyXSA9IHNuYXBzaG90O1xuICAgIC8vIGNvbnNvbGUubG9nKCdzbmFwJywgdGhpcy5fc3RhY2ssIHRoaXMuX3BvaW50ZXIpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fc3RhY2subGVuZ3RoID0gMDtcbiAgICB0aGlzLl9wb2ludGVyID0gLTE7XG4gIH1cblxuICB1bmRvKCkge1xuICAgIGNvbnN0IHBvaW50ZXIgPSB0aGlzLl9wb2ludGVyIC0gMTtcblxuICAgIGlmIChwb2ludGVyID49IDApIHtcbiAgICAgIHRoaXMuX3BvaW50ZXIgPSBwb2ludGVyO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmVkbygpIHtcbiAgICBjb25zdCBwb2ludGVyID0gdGhpcy5fcG9pbnRlciArIDE7XG5cbiAgICBpZiAodGhpcy5fc3RhY2tbcG9pbnRlcl0pIHtcbiAgICAgIHRoaXMuX3BvaW50ZXIgPSBwb2ludGVyO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhpc3Rvcnk7XG4iXX0=