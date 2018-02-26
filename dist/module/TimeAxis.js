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
 *
 *
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRpbWVBeGlzLmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsIlRpbWVBeGlzIiwib3B0aW9ucyIsImJsb2NrIiwidGltZWxpbmUiLCJ0cmFjayIsIl9sYXllciIsImF4aXMiLCJBeGlzTGF5ZXIiLCJ0aW1lQXhpc0dlbmVyYXRvciIsInRvcCIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwidGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlRpY2tzIiwiY29sb3IiLCJhZGQiLCJyZW1vdmUiLCJkYXRhIiwibWV0YWRhdGEiLCJyZW5kZXIiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7SUFBWUEsRTs7Ozs7O0FBRVosSUFBTUMsYUFBYSxFQUFuQjs7QUFHQTs7Ozs7SUFJTUMsUTs7O0FBQ0osc0JBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7QUFBQSxxSUFDbEJGLFVBRGtCLEVBQ05FLE9BRE07QUFFekI7O0FBRUQ7Ozs7OzhCQUtVO0FBQUEsc0JBQ29CLEtBQUtDLEtBQUwsQ0FBV0osRUFEL0I7QUFBQSxVQUNBSyxRQURBLGFBQ0FBLFFBREE7QUFBQSxVQUNVQyxLQURWLGFBQ1VBLEtBRFY7O0FBR1I7O0FBQ0EsV0FBS0MsTUFBTCxHQUFjLElBQUlQLEdBQUdRLElBQUgsQ0FBUUMsU0FBWixDQUFzQlQsR0FBR1EsSUFBSCxDQUFRRSxpQkFBUixDQUEwQixDQUExQixFQUE2QixLQUE3QixDQUF0QixFQUEyRDtBQUN2RUMsYUFBSyxDQURrRTtBQUV2RUMsZ0JBQVEsRUFGK0Q7QUFHdkVDLGdCQUFRLEtBQUtBO0FBSDBELE9BQTNELENBQWQ7O0FBTUEsV0FBS04sTUFBTCxDQUFZTyxjQUFaLENBQTJCVCxTQUFTVSxXQUFwQztBQUNBLFdBQUtSLE1BQUwsQ0FBWVMsY0FBWixDQUEyQmhCLEdBQUdpQixNQUFILENBQVVDLEtBQXJDLEVBQTRDLEVBQTVDLEVBQWdELEVBQUVDLE9BQU8sV0FBVCxFQUFoRDs7QUFFQWIsWUFBTWMsR0FBTixDQUFVLEtBQUtiLE1BQWY7QUFDRDs7O2dDQUVXO0FBQUEsVUFDRkQsS0FERSxHQUNRLEtBQUtGLEtBQUwsQ0FBV0osRUFEbkIsQ0FDRk0sS0FERTs7QUFFVkEsWUFBTWUsTUFBTixDQUFhLEtBQUtkLE1BQWxCO0FBQ0Q7Ozs2QkFFUWUsSSxFQUFNQyxRLEVBQVU7QUFDdkIsV0FBS2hCLE1BQUwsQ0FBWWlCLE1BQVo7QUFDQSxXQUFLakIsTUFBTCxDQUFZa0IsTUFBWjtBQUNEOzs7d0JBNUJXO0FBQ1YsYUFBTyxLQUFLbEIsTUFBWjtBQUNEOzs7OztrQkE2QllMLFEiLCJmaWxlIjoiVGltZUF4aXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7fTtcblxuXG4vKipcbiAqXG4gKlxuICovXG5jbGFzcyBUaW1lQXhpcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBmb3IgdXNlIGluIHpvb20gZm9yIGV4YW1wbGVcbiAgZ2V0IGxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXllcjtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICAvLyBkdW1teSBheGlzIHdhaXRpbmcgZm9yIHRyYWNrIGNvbmZpZ1xuICAgIHRoaXMuX2xheWVyID0gbmV3IHVpLmF4aXMuQXhpc0xheWVyKHVpLmF4aXMudGltZUF4aXNHZW5lcmF0b3IoMSwgJzQvNCcpLCB7XG4gICAgICB0b3A6IDAsXG4gICAgICBoZWlnaHQ6IDEyLFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHRoaXMuX2xheWVyLnNldFRpbWVDb250ZXh0KHRpbWVsaW5lLnRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9sYXllci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuVGlja3MsIHt9LCB7IGNvbG9yOiAnc3RlZWxibHVlJyB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl9sYXllcik7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcbiAgICB0cmFjay5yZW1vdmUodGhpcy5fbGF5ZXIpO1xuICB9XG5cbiAgc2V0VHJhY2soZGF0YSwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl9sYXllci5yZW5kZXIoKTtcbiAgICB0aGlzLl9sYXllci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lQXhpcztcbiJdfQ==