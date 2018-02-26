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

var GridAxis = function (_AbstractModule) {
  (0, _inherits3.default)(GridAxis, _AbstractModule);

  function GridAxis() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, GridAxis);
    return (0, _possibleConstructorReturn3.default)(this, (GridAxis.__proto__ || (0, _getPrototypeOf2.default)(GridAxis)).call(this, parameters, options));
  }

  // for use in zoom for example


  (0, _createClass3.default)(GridAxis, [{
    key: 'install',
    value: function install() {
      var _block$ui = this.block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track;

      // dummy axis waiting for track config

      this._layer = new ui.axis.AxisLayer(ui.axis.gridAxisGenerator(1, '4/4'), {
        top: 0,
        height: 12,
        zIndex: this.zIndex
      });

      // axis use timeline time context
      this._layer.setTimeContext(timeline.timeContext);
      this._layer.configureShape(ui.shapes.Ticks, {}, { color: '#909090' });

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
    value: function setTrack(buffer, metadata) {
      // as the signature and bpm may change between tracks,
      // we need to recreate generator
      var bpm = metadata.bpm,
          signature = metadata.signature;

      var generator = ui.axis.gridAxisGenerator(bpm, signature);

      this._layer.generator = generator;
      this._layer.render();
      this._layer.update();
    }
  }, {
    key: 'layer',
    get: function get() {
      return this._layer;
    }
  }]);
  return GridAxis;
}(_AbstractModule3.default);

exports.default = GridAxis;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyaWRBeGlzLmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsIkdyaWRBeGlzIiwib3B0aW9ucyIsImJsb2NrIiwidGltZWxpbmUiLCJ0cmFjayIsIl9sYXllciIsImF4aXMiLCJBeGlzTGF5ZXIiLCJncmlkQXhpc0dlbmVyYXRvciIsInRvcCIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwidGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlRpY2tzIiwiY29sb3IiLCJhZGQiLCJyZW1vdmUiLCJidWZmZXIiLCJtZXRhZGF0YSIsImJwbSIsInNpZ25hdHVyZSIsImdlbmVyYXRvciIsInJlbmRlciIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxhQUFhLEVBQW5COztBQUdBOzs7OztJQUlNQyxROzs7QUFDSixzQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTtBQUFBLHFJQUNsQkYsVUFEa0IsRUFDTkUsT0FETTtBQUV6Qjs7QUFFRDs7Ozs7OEJBS1U7QUFBQSxzQkFDb0IsS0FBS0MsS0FBTCxDQUFXSixFQUQvQjtBQUFBLFVBQ0FLLFFBREEsYUFDQUEsUUFEQTtBQUFBLFVBQ1VDLEtBRFYsYUFDVUEsS0FEVjs7QUFHUjs7QUFDQSxXQUFLQyxNQUFMLEdBQWMsSUFBSVAsR0FBR1EsSUFBSCxDQUFRQyxTQUFaLENBQXNCVCxHQUFHUSxJQUFILENBQVFFLGlCQUFSLENBQTBCLENBQTFCLEVBQTZCLEtBQTdCLENBQXRCLEVBQTJEO0FBQ3ZFQyxhQUFLLENBRGtFO0FBRXZFQyxnQkFBUSxFQUYrRDtBQUd2RUMsZ0JBQVEsS0FBS0E7QUFIMEQsT0FBM0QsQ0FBZDs7QUFNQTtBQUNBLFdBQUtOLE1BQUwsQ0FBWU8sY0FBWixDQUEyQlQsU0FBU1UsV0FBcEM7QUFDQSxXQUFLUixNQUFMLENBQVlTLGNBQVosQ0FBMkJoQixHQUFHaUIsTUFBSCxDQUFVQyxLQUFyQyxFQUE0QyxFQUE1QyxFQUFnRCxFQUFFQyxPQUFPLFNBQVQsRUFBaEQ7O0FBRUFiLFlBQU1jLEdBQU4sQ0FBVSxLQUFLYixNQUFmO0FBQ0Q7OztnQ0FFVztBQUFBLFVBQ0ZELEtBREUsR0FDUSxLQUFLRixLQUFMLENBQVdKLEVBRG5CLENBQ0ZNLEtBREU7O0FBRVZBLFlBQU1lLE1BQU4sQ0FBYSxLQUFLZCxNQUFsQjtBQUNEOzs7NkJBRVFlLE0sRUFBUUMsUSxFQUFVO0FBQ3pCO0FBQ0E7QUFGeUIsVUFHakJDLEdBSGlCLEdBR0VELFFBSEYsQ0FHakJDLEdBSGlCO0FBQUEsVUFHWkMsU0FIWSxHQUdFRixRQUhGLENBR1pFLFNBSFk7O0FBSXpCLFVBQU1DLFlBQVkxQixHQUFHUSxJQUFILENBQVFFLGlCQUFSLENBQTBCYyxHQUExQixFQUErQkMsU0FBL0IsQ0FBbEI7O0FBRUEsV0FBS2xCLE1BQUwsQ0FBWW1CLFNBQVosR0FBd0JBLFNBQXhCO0FBQ0EsV0FBS25CLE1BQUwsQ0FBWW9CLE1BQVo7QUFDQSxXQUFLcEIsTUFBTCxDQUFZcUIsTUFBWjtBQUNEOzs7d0JBbkNXO0FBQ1YsYUFBTyxLQUFLckIsTUFBWjtBQUNEOzs7OztrQkFvQ1lMLFEiLCJmaWxlIjoiR3JpZEF4aXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7fTtcblxuXG4vKipcbiAqXG4gKlxuICovXG5jbGFzcyBHcmlkQXhpcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBmb3IgdXNlIGluIHpvb20gZm9yIGV4YW1wbGVcbiAgZ2V0IGxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXllcjtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICAvLyBkdW1teSBheGlzIHdhaXRpbmcgZm9yIHRyYWNrIGNvbmZpZ1xuICAgIHRoaXMuX2xheWVyID0gbmV3IHVpLmF4aXMuQXhpc0xheWVyKHVpLmF4aXMuZ3JpZEF4aXNHZW5lcmF0b3IoMSwgJzQvNCcpLCB7XG4gICAgICB0b3A6IDAsXG4gICAgICBoZWlnaHQ6IDEyLFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIC8vIGF4aXMgdXNlIHRpbWVsaW5lIHRpbWUgY29udGV4dFxuICAgIHRoaXMuX2xheWVyLnNldFRpbWVDb250ZXh0KHRpbWVsaW5lLnRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9sYXllci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuVGlja3MsIHt9LCB7IGNvbG9yOiAnIzkwOTA5MCcgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fbGF5ZXIpO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG4gICAgdHJhY2sucmVtb3ZlKHRoaXMuX2xheWVyKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGEpIHtcbiAgICAvLyBhcyB0aGUgc2lnbmF0dXJlIGFuZCBicG0gbWF5IGNoYW5nZSBiZXR3ZWVuIHRyYWNrcyxcbiAgICAvLyB3ZSBuZWVkIHRvIHJlY3JlYXRlIGdlbmVyYXRvclxuICAgIGNvbnN0IHsgYnBtLCBzaWduYXR1cmUgfSA9IG1ldGFkYXRhO1xuICAgIGNvbnN0IGdlbmVyYXRvciA9IHVpLmF4aXMuZ3JpZEF4aXNHZW5lcmF0b3IoYnBtLCBzaWduYXR1cmUpO1xuXG4gICAgdGhpcy5fbGF5ZXIuZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuICAgIHRoaXMuX2xheWVyLnJlbmRlcigpO1xuICAgIHRoaXMuX2xheWVyLnVwZGF0ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyaWRBeGlzO1xuIl19