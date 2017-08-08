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

var TimeAxisModule = function (_AbstractModule) {
  (0, _inherits3.default)(TimeAxisModule, _AbstractModule);

  function TimeAxisModule() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, TimeAxisModule);
    return (0, _possibleConstructorReturn3.default)(this, (TimeAxisModule.__proto__ || (0, _getPrototypeOf2.default)(TimeAxisModule)).call(this, parameters, options));
  }

  // for use in zoom for example


  (0, _createClass3.default)(TimeAxisModule, [{
    key: 'install',
    value: function install(block) {
      var _block$ui = block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track;

      // dummy axis waiting for track config

      this._layer = new ui.axis.AxisLayer(ui.axis.timeAxisGenerator(1, '4/4'), {
        top: 0,
        height: 12
      });

      this._layer.setTimeContext(timeline.timeContext);
      this._layer.configureShape(ui.shapes.Ticks, {}, { color: 'steelblue' });

      track.add(this._layer);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(block) {
      var track = block.ui.track;

      track.remove(this._layer);
    }
  }, {
    key: 'setTrack',
    value: function setTrack(trackConfig) {
      this._layer.render();
      this._layer.update();
    }
  }, {
    key: 'layer',
    get: function get() {
      return this._layer;
    }
  }]);
  return TimeAxisModule;
}(_AbstractModule3.default);

exports.default = TimeAxisModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsIlRpbWVBeGlzTW9kdWxlIiwib3B0aW9ucyIsImJsb2NrIiwidGltZWxpbmUiLCJ0cmFjayIsIl9sYXllciIsImF4aXMiLCJBeGlzTGF5ZXIiLCJ0aW1lQXhpc0dlbmVyYXRvciIsInRvcCIsImhlaWdodCIsInNldFRpbWVDb250ZXh0IiwidGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlRpY2tzIiwiY29sb3IiLCJhZGQiLCJyZW1vdmUiLCJ0cmFja0NvbmZpZyIsInJlbmRlciIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxhQUFhLEVBQW5COztBQUdBOzs7OztJQUlNQyxjOzs7QUFDSiw0QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTtBQUFBLGlKQUNsQkYsVUFEa0IsRUFDTkUsT0FETTtBQUV6Qjs7QUFFRDs7Ozs7NEJBS1FDLEssRUFBTztBQUFBLHNCQUNlQSxNQUFNSixFQURyQjtBQUFBLFVBQ0xLLFFBREssYUFDTEEsUUFESztBQUFBLFVBQ0tDLEtBREwsYUFDS0EsS0FETDs7QUFHYjs7QUFDQSxXQUFLQyxNQUFMLEdBQWMsSUFBSVAsR0FBR1EsSUFBSCxDQUFRQyxTQUFaLENBQXNCVCxHQUFHUSxJQUFILENBQVFFLGlCQUFSLENBQTBCLENBQTFCLEVBQTZCLEtBQTdCLENBQXRCLEVBQTJEO0FBQ3ZFQyxhQUFLLENBRGtFO0FBRXZFQyxnQkFBUTtBQUYrRCxPQUEzRCxDQUFkOztBQUtBLFdBQUtMLE1BQUwsQ0FBWU0sY0FBWixDQUEyQlIsU0FBU1MsV0FBcEM7QUFDQSxXQUFLUCxNQUFMLENBQVlRLGNBQVosQ0FBMkJmLEdBQUdnQixNQUFILENBQVVDLEtBQXJDLEVBQTRDLEVBQTVDLEVBQWdELEVBQUVDLE9BQU8sV0FBVCxFQUFoRDs7QUFFQVosWUFBTWEsR0FBTixDQUFVLEtBQUtaLE1BQWY7QUFDRDs7OzhCQUVTSCxLLEVBQU87QUFBQSxVQUNQRSxLQURPLEdBQ0dGLE1BQU1KLEVBRFQsQ0FDUE0sS0FETzs7QUFFZkEsWUFBTWMsTUFBTixDQUFhLEtBQUtiLE1BQWxCO0FBQ0Q7Ozs2QkFFUWMsVyxFQUFhO0FBQ3BCLFdBQUtkLE1BQUwsQ0FBWWUsTUFBWjtBQUNBLFdBQUtmLE1BQUwsQ0FBWWdCLE1BQVo7QUFDRDs7O3dCQTNCVztBQUNWLGFBQU8sS0FBS2hCLE1BQVo7QUFDRDs7Ozs7a0JBNEJZTCxjIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge307XG5cblxuLyoqXG4gKlxuICpcbiAqL1xuY2xhc3MgVGltZUF4aXNNb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gZm9yIHVzZSBpbiB6b29tIGZvciBleGFtcGxlXG4gIGdldCBsYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXI7XG4gIH1cblxuICBpbnN0YWxsKGJsb2NrKSB7XG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IGJsb2NrLnVpO1xuXG4gICAgLy8gZHVtbXkgYXhpcyB3YWl0aW5nIGZvciB0cmFjayBjb25maWdcbiAgICB0aGlzLl9sYXllciA9IG5ldyB1aS5heGlzLkF4aXNMYXllcih1aS5heGlzLnRpbWVBeGlzR2VuZXJhdG9yKDEsICc0LzQnKSwge1xuICAgICAgdG9wOiAwLFxuICAgICAgaGVpZ2h0OiAxMixcbiAgICB9KTtcblxuICAgIHRoaXMuX2xheWVyLnNldFRpbWVDb250ZXh0KHRpbWVsaW5lLnRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9sYXllci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuVGlja3MsIHt9LCB7IGNvbG9yOiAnc3RlZWxibHVlJyB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl9sYXllcik7XG4gIH1cblxuICB1bmluc3RhbGwoYmxvY2spIHtcbiAgICBjb25zdCB7IHRyYWNrIH0gPSBibG9jay51aTtcbiAgICB0cmFjay5yZW1vdmUodGhpcy5fbGF5ZXIpO1xuICB9XG5cbiAgc2V0VHJhY2sodHJhY2tDb25maWcpIHtcbiAgICB0aGlzLl9sYXllci5yZW5kZXIoKTtcbiAgICB0aGlzLl9sYXllci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lQXhpc01vZHVsZTtcbiJdfQ==