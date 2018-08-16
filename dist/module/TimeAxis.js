'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractModule2 = require('../core/AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parameters = {};

/**
 * Modules that adds a timed axis to the block.
 */

var TimeAxis = function (_AbstractModule) {
  (0, _inherits3.default)(TimeAxis, _AbstractModule);

  function TimeAxis() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, TimeAxis);
    return (0, _possibleConstructorReturn3.default)(this, (TimeAxis.__proto__ || (0, _getPrototypeOf2.default)(TimeAxis)).call(this, parameters, options));
  }

  // for use in zoom for example


  (0, _createClass3.default)(TimeAxis, [{
    key: 'install',
    value: function install() {
      var _block$ui = this.block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track;

      // dummy axis waiting for track config

      this._layer = new ui.axis.AxisLayer(ui.axis.timeAxisGenerator(1, '4/4'), {
        top: 0,
        height: 12,
        zIndex: this.zIndex
      });

      this._layer.setTimeContext(timeline.timeContext);
      this._layer.configureShape(ui.shapes.Ticks, {}, { color: 'steelblue' });

      track.add(this._layer);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      var track = this.block.ui.track;

      track.remove(this._layer);
    }
  }, {
    key: 'setTrack',
    value: function setTrack(data, metadata) {
      this._layer.render();
      this._layer.update();
    }
  }, {
    key: 'layer',
    get: function get() {
      return this._layer;
    }
  }]);
  return TimeAxis;
}(_AbstractModule3.default);

exports.default = TimeAxis;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRpbWVBeGlzLmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsIlRpbWVBeGlzIiwib3B0aW9ucyIsImJsb2NrIiwidGltZWxpbmUiLCJ0cmFjayIsIl9sYXllciIsImF4aXMiLCJBeGlzTGF5ZXIiLCJ0aW1lQXhpc0dlbmVyYXRvciIsInRvcCIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwidGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlRpY2tzIiwiY29sb3IiLCJhZGQiLCJyZW1vdmUiLCJkYXRhIiwibWV0YWRhdGEiLCJyZW5kZXIiLCJ1cGRhdGUiLCJBYnN0cmFjdE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxhQUFhLEVBQW5COztBQUVBOzs7O0lBR01DLFE7OztBQUNKLHNCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBO0FBQUEscUlBQ2xCRixVQURrQixFQUNORSxPQURNO0FBRXpCOztBQUVEOzs7Ozs4QkFLVTtBQUFBLHNCQUNvQixLQUFLQyxLQUFMLENBQVdKLEVBRC9CO0FBQUEsVUFDQUssUUFEQSxhQUNBQSxRQURBO0FBQUEsVUFDVUMsS0FEVixhQUNVQSxLQURWOztBQUdSOztBQUNBLFdBQUtDLE1BQUwsR0FBYyxJQUFJUCxHQUFHUSxJQUFILENBQVFDLFNBQVosQ0FBc0JULEdBQUdRLElBQUgsQ0FBUUUsaUJBQVIsQ0FBMEIsQ0FBMUIsRUFBNkIsS0FBN0IsQ0FBdEIsRUFBMkQ7QUFDdkVDLGFBQUssQ0FEa0U7QUFFdkVDLGdCQUFRLEVBRitEO0FBR3ZFQyxnQkFBUSxLQUFLQTtBQUgwRCxPQUEzRCxDQUFkOztBQU1BLFdBQUtOLE1BQUwsQ0FBWU8sY0FBWixDQUEyQlQsU0FBU1UsV0FBcEM7QUFDQSxXQUFLUixNQUFMLENBQVlTLGNBQVosQ0FBMkJoQixHQUFHaUIsTUFBSCxDQUFVQyxLQUFyQyxFQUE0QyxFQUE1QyxFQUFnRCxFQUFFQyxPQUFPLFdBQVQsRUFBaEQ7O0FBRUFiLFlBQU1jLEdBQU4sQ0FBVSxLQUFLYixNQUFmO0FBQ0Q7OztnQ0FFVztBQUFBLFVBQ0ZELEtBREUsR0FDUSxLQUFLRixLQUFMLENBQVdKLEVBRG5CLENBQ0ZNLEtBREU7O0FBRVZBLFlBQU1lLE1BQU4sQ0FBYSxLQUFLZCxNQUFsQjtBQUNEOzs7NkJBRVFlLEksRUFBTUMsUSxFQUFVO0FBQ3ZCLFdBQUtoQixNQUFMLENBQVlpQixNQUFaO0FBQ0EsV0FBS2pCLE1BQUwsQ0FBWWtCLE1BQVo7QUFDRDs7O3dCQTVCVztBQUNWLGFBQU8sS0FBS2xCLE1BQVo7QUFDRDs7O0VBUm9CbUIsd0I7O2tCQXFDUnhCLFEiLCJmaWxlIjoiVGltZUF4aXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7fTtcblxuLyoqXG4gKiBNb2R1bGVzIHRoYXQgYWRkcyBhIHRpbWVkIGF4aXMgdG8gdGhlIGJsb2NrLlxuICovXG5jbGFzcyBUaW1lQXhpcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBmb3IgdXNlIGluIHpvb20gZm9yIGV4YW1wbGVcbiAgZ2V0IGxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXllcjtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICAvLyBkdW1teSBheGlzIHdhaXRpbmcgZm9yIHRyYWNrIGNvbmZpZ1xuICAgIHRoaXMuX2xheWVyID0gbmV3IHVpLmF4aXMuQXhpc0xheWVyKHVpLmF4aXMudGltZUF4aXNHZW5lcmF0b3IoMSwgJzQvNCcpLCB7XG4gICAgICB0b3A6IDAsXG4gICAgICBoZWlnaHQ6IDEyLFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHRoaXMuX2xheWVyLnNldFRpbWVDb250ZXh0KHRpbWVsaW5lLnRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9sYXllci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuVGlja3MsIHt9LCB7IGNvbG9yOiAnc3RlZWxibHVlJyB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl9sYXllcik7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcbiAgICB0cmFjay5yZW1vdmUodGhpcy5fbGF5ZXIpO1xuICB9XG5cbiAgc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl9sYXllci5yZW5kZXIoKTtcbiAgICB0aGlzLl9sYXllci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lQXhpcztcbiJdfQ==