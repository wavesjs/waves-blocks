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

var GridAxisModule = function (_AbstractModule) {
  (0, _inherits3.default)(GridAxisModule, _AbstractModule);

  function GridAxisModule() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, GridAxisModule);
    return (0, _possibleConstructorReturn3.default)(this, (GridAxisModule.__proto__ || (0, _getPrototypeOf2.default)(GridAxisModule)).call(this, parameters, options));
  }

  // for use in zoom for example


  (0, _createClass3.default)(GridAxisModule, [{
    key: 'install',
    value: function install(block) {
      var _block$ui = block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track;

      // dummy axis waiting for track config

      this._layer = new ui.axis.AxisLayer(ui.axis.gridAxisGenerator(1, '4/4'), {
        top: 0,
        height: 12
      });

      // axis use timeline time context
      this._layer.setTimeContext(timeline.timeContext);
      this._layer.configureShape(ui.shapes.Ticks, {}, { color: '#909090' });

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
      // as the signature and bpm may change between tracks,
      // we need to recreate generator
      var bpm = trackConfig.bpm,
          signature = trackConfig.signature;

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
  return GridAxisModule;
}(_AbstractModule3.default);

exports.default = GridAxisModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsIkdyaWRBeGlzTW9kdWxlIiwib3B0aW9ucyIsImJsb2NrIiwidGltZWxpbmUiLCJ0cmFjayIsIl9sYXllciIsImF4aXMiLCJBeGlzTGF5ZXIiLCJncmlkQXhpc0dlbmVyYXRvciIsInRvcCIsImhlaWdodCIsInNldFRpbWVDb250ZXh0IiwidGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlRpY2tzIiwiY29sb3IiLCJhZGQiLCJyZW1vdmUiLCJ0cmFja0NvbmZpZyIsImJwbSIsInNpZ25hdHVyZSIsImdlbmVyYXRvciIsInJlbmRlciIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxhQUFhLEVBQW5COztBQUdBOzs7OztJQUlNQyxjOzs7QUFDSiw0QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTtBQUFBLGlKQUNsQkYsVUFEa0IsRUFDTkUsT0FETTtBQUV6Qjs7QUFFRDs7Ozs7NEJBS1FDLEssRUFBTztBQUFBLHNCQUNlQSxNQUFNSixFQURyQjtBQUFBLFVBQ0xLLFFBREssYUFDTEEsUUFESztBQUFBLFVBQ0tDLEtBREwsYUFDS0EsS0FETDs7QUFHYjs7QUFDQSxXQUFLQyxNQUFMLEdBQWMsSUFBSVAsR0FBR1EsSUFBSCxDQUFRQyxTQUFaLENBQXNCVCxHQUFHUSxJQUFILENBQVFFLGlCQUFSLENBQTBCLENBQTFCLEVBQTZCLEtBQTdCLENBQXRCLEVBQTJEO0FBQ3ZFQyxhQUFLLENBRGtFO0FBRXZFQyxnQkFBUTtBQUYrRCxPQUEzRCxDQUFkOztBQUtBO0FBQ0EsV0FBS0wsTUFBTCxDQUFZTSxjQUFaLENBQTJCUixTQUFTUyxXQUFwQztBQUNBLFdBQUtQLE1BQUwsQ0FBWVEsY0FBWixDQUEyQmYsR0FBR2dCLE1BQUgsQ0FBVUMsS0FBckMsRUFBNEMsRUFBNUMsRUFBZ0QsRUFBRUMsT0FBTyxTQUFULEVBQWhEOztBQUVBWixZQUFNYSxHQUFOLENBQVUsS0FBS1osTUFBZjtBQUNEOzs7OEJBRVNILEssRUFBTztBQUFBLFVBQ1BFLEtBRE8sR0FDR0YsTUFBTUosRUFEVCxDQUNQTSxLQURPOztBQUVmQSxZQUFNYyxNQUFOLENBQWEsS0FBS2IsTUFBbEI7QUFDRDs7OzZCQUVRYyxXLEVBQWE7QUFDcEI7QUFDQTtBQUZvQixVQUdaQyxHQUhZLEdBR09ELFdBSFAsQ0FHWkMsR0FIWTtBQUFBLFVBR1BDLFNBSE8sR0FHT0YsV0FIUCxDQUdQRSxTQUhPOztBQUlwQixVQUFNQyxZQUFZeEIsR0FBR1EsSUFBSCxDQUFRRSxpQkFBUixDQUEwQlksR0FBMUIsRUFBK0JDLFNBQS9CLENBQWxCOztBQUVBLFdBQUtoQixNQUFMLENBQVlpQixTQUFaLEdBQXdCQSxTQUF4QjtBQUNBLFdBQUtqQixNQUFMLENBQVlrQixNQUFaO0FBQ0EsV0FBS2xCLE1BQUwsQ0FBWW1CLE1BQVo7QUFDRDs7O3dCQWxDVztBQUNWLGFBQU8sS0FBS25CLE1BQVo7QUFDRDs7Ozs7a0JBbUNZTCxjIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge307XG5cblxuLyoqXG4gKlxuICpcbiAqL1xuY2xhc3MgR3JpZEF4aXNNb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gZm9yIHVzZSBpbiB6b29tIGZvciBleGFtcGxlXG4gIGdldCBsYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXI7XG4gIH1cblxuICBpbnN0YWxsKGJsb2NrKSB7XG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IGJsb2NrLnVpO1xuXG4gICAgLy8gZHVtbXkgYXhpcyB3YWl0aW5nIGZvciB0cmFjayBjb25maWdcbiAgICB0aGlzLl9sYXllciA9IG5ldyB1aS5heGlzLkF4aXNMYXllcih1aS5heGlzLmdyaWRBeGlzR2VuZXJhdG9yKDEsICc0LzQnKSwge1xuICAgICAgdG9wOiAwLFxuICAgICAgaGVpZ2h0OiAxMixcbiAgICB9KTtcblxuICAgIC8vIGF4aXMgdXNlIHRpbWVsaW5lIHRpbWUgY29udGV4dFxuICAgIHRoaXMuX2xheWVyLnNldFRpbWVDb250ZXh0KHRpbWVsaW5lLnRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9sYXllci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuVGlja3MsIHt9LCB7IGNvbG9yOiAnIzkwOTA5MCcgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fbGF5ZXIpO1xuICB9XG5cbiAgdW5pbnN0YWxsKGJsb2NrKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gYmxvY2sudWk7XG4gICAgdHJhY2sucmVtb3ZlKHRoaXMuX2xheWVyKTtcbiAgfVxuXG4gIHNldFRyYWNrKHRyYWNrQ29uZmlnKSB7XG4gICAgLy8gYXMgdGhlIHNpZ25hdHVyZSBhbmQgYnBtIG1heSBjaGFuZ2UgYmV0d2VlbiB0cmFja3MsXG4gICAgLy8gd2UgbmVlZCB0byByZWNyZWF0ZSBnZW5lcmF0b3JcbiAgICBjb25zdCB7IGJwbSwgc2lnbmF0dXJlIH0gPSB0cmFja0NvbmZpZztcbiAgICBjb25zdCBnZW5lcmF0b3IgPSB1aS5heGlzLmdyaWRBeGlzR2VuZXJhdG9yKGJwbSwgc2lnbmF0dXJlKTtcblxuICAgIHRoaXMuX2xheWVyLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgICB0aGlzLl9sYXllci5yZW5kZXIoKTtcbiAgICB0aGlzLl9sYXllci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmlkQXhpc01vZHVsZTtcbiJdfQ==