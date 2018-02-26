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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiVGltZUF4aXMiLCJvcHRpb25zIiwiYmxvY2siLCJ0aW1lbGluZSIsInRyYWNrIiwiX2xheWVyIiwiYXhpcyIsIkF4aXNMYXllciIsInRpbWVBeGlzR2VuZXJhdG9yIiwidG9wIiwiaGVpZ2h0IiwiekluZGV4Iiwic2V0VGltZUNvbnRleHQiLCJ0aW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic2hhcGVzIiwiVGlja3MiLCJjb2xvciIsImFkZCIsInJlbW92ZSIsImRhdGEiLCJtZXRhZGF0YSIsInJlbmRlciIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxhQUFhLEVBQW5COztBQUdBOzs7OztJQUlNQyxROzs7QUFDSixzQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTtBQUFBLHFJQUNsQkYsVUFEa0IsRUFDTkUsT0FETTtBQUV6Qjs7QUFFRDs7Ozs7OEJBS1U7QUFBQSxzQkFDb0IsS0FBS0MsS0FBTCxDQUFXSixFQUQvQjtBQUFBLFVBQ0FLLFFBREEsYUFDQUEsUUFEQTtBQUFBLFVBQ1VDLEtBRFYsYUFDVUEsS0FEVjs7QUFHUjs7QUFDQSxXQUFLQyxNQUFMLEdBQWMsSUFBSVAsR0FBR1EsSUFBSCxDQUFRQyxTQUFaLENBQXNCVCxHQUFHUSxJQUFILENBQVFFLGlCQUFSLENBQTBCLENBQTFCLEVBQTZCLEtBQTdCLENBQXRCLEVBQTJEO0FBQ3ZFQyxhQUFLLENBRGtFO0FBRXZFQyxnQkFBUSxFQUYrRDtBQUd2RUMsZ0JBQVEsS0FBS0E7QUFIMEQsT0FBM0QsQ0FBZDs7QUFNQSxXQUFLTixNQUFMLENBQVlPLGNBQVosQ0FBMkJULFNBQVNVLFdBQXBDO0FBQ0EsV0FBS1IsTUFBTCxDQUFZUyxjQUFaLENBQTJCaEIsR0FBR2lCLE1BQUgsQ0FBVUMsS0FBckMsRUFBNEMsRUFBNUMsRUFBZ0QsRUFBRUMsT0FBTyxXQUFULEVBQWhEOztBQUVBYixZQUFNYyxHQUFOLENBQVUsS0FBS2IsTUFBZjtBQUNEOzs7Z0NBRVc7QUFBQSxVQUNGRCxLQURFLEdBQ1EsS0FBS0YsS0FBTCxDQUFXSixFQURuQixDQUNGTSxLQURFOztBQUVWQSxZQUFNZSxNQUFOLENBQWEsS0FBS2QsTUFBbEI7QUFDRDs7OzZCQUVRZSxJLEVBQU1DLFEsRUFBVTtBQUN2QixXQUFLaEIsTUFBTCxDQUFZaUIsTUFBWjtBQUNBLFdBQUtqQixNQUFMLENBQVlrQixNQUFaO0FBQ0Q7Ozt3QkE1Qlc7QUFDVixhQUFPLEtBQUtsQixNQUFaO0FBQ0Q7Ozs7O2tCQTZCWUwsUSIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge307XG5cblxuLyoqXG4gKlxuICpcbiAqL1xuY2xhc3MgVGltZUF4aXMgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gZm9yIHVzZSBpbiB6b29tIGZvciBleGFtcGxlXG4gIGdldCBsYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXI7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgLy8gZHVtbXkgYXhpcyB3YWl0aW5nIGZvciB0cmFjayBjb25maWdcbiAgICB0aGlzLl9sYXllciA9IG5ldyB1aS5heGlzLkF4aXNMYXllcih1aS5heGlzLnRpbWVBeGlzR2VuZXJhdG9yKDEsICc0LzQnKSwge1xuICAgICAgdG9wOiAwLFxuICAgICAgaGVpZ2h0OiAxMixcbiAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9sYXllci5zZXRUaW1lQ29udGV4dCh0aW1lbGluZS50aW1lQ29udGV4dCk7XG4gICAgdGhpcy5fbGF5ZXIuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLlRpY2tzLCB7fSwgeyBjb2xvcjogJ3N0ZWVsYmx1ZScgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fbGF5ZXIpO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG4gICAgdHJhY2sucmVtb3ZlKHRoaXMuX2xheWVyKTtcbiAgfVxuXG4gIHNldFRyYWNrKGRhdGEsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy5fbGF5ZXIucmVuZGVyKCk7XG4gICAgdGhpcy5fbGF5ZXIudXBkYXRlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZUF4aXM7XG4iXX0=