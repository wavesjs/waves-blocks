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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyaWRBeGlzLmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsIkdyaWRBeGlzIiwib3B0aW9ucyIsImJsb2NrIiwidGltZWxpbmUiLCJ0cmFjayIsIl9sYXllciIsImF4aXMiLCJBeGlzTGF5ZXIiLCJncmlkQXhpc0dlbmVyYXRvciIsInRvcCIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwidGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlRpY2tzIiwiY29sb3IiLCJhZGQiLCJyZW1vdmUiLCJidWZmZXIiLCJtZXRhZGF0YSIsImJwbSIsInNpZ25hdHVyZSIsImdlbmVyYXRvciIsInJlbmRlciIsInVwZGF0ZSIsIkFic3RyYWN0TW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUVaLElBQU1DLGFBQWEsRUFBbkI7O0FBR0E7Ozs7O0lBSU1DLFE7OztBQUNKLHNCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBO0FBQUEscUlBQ2xCRixVQURrQixFQUNORSxPQURNO0FBRXpCOztBQUVEOzs7Ozs4QkFLVTtBQUFBLHNCQUNvQixLQUFLQyxLQUFMLENBQVdKLEVBRC9CO0FBQUEsVUFDQUssUUFEQSxhQUNBQSxRQURBO0FBQUEsVUFDVUMsS0FEVixhQUNVQSxLQURWOztBQUdSOztBQUNBLFdBQUtDLE1BQUwsR0FBYyxJQUFJUCxHQUFHUSxJQUFILENBQVFDLFNBQVosQ0FBc0JULEdBQUdRLElBQUgsQ0FBUUUsaUJBQVIsQ0FBMEIsQ0FBMUIsRUFBNkIsS0FBN0IsQ0FBdEIsRUFBMkQ7QUFDdkVDLGFBQUssQ0FEa0U7QUFFdkVDLGdCQUFRLEVBRitEO0FBR3ZFQyxnQkFBUSxLQUFLQTtBQUgwRCxPQUEzRCxDQUFkOztBQU1BO0FBQ0EsV0FBS04sTUFBTCxDQUFZTyxjQUFaLENBQTJCVCxTQUFTVSxXQUFwQztBQUNBLFdBQUtSLE1BQUwsQ0FBWVMsY0FBWixDQUEyQmhCLEdBQUdpQixNQUFILENBQVVDLEtBQXJDLEVBQTRDLEVBQTVDLEVBQWdELEVBQUVDLE9BQU8sU0FBVCxFQUFoRDs7QUFFQWIsWUFBTWMsR0FBTixDQUFVLEtBQUtiLE1BQWY7QUFDRDs7O2dDQUVXO0FBQUEsVUFDRkQsS0FERSxHQUNRLEtBQUtGLEtBQUwsQ0FBV0osRUFEbkIsQ0FDRk0sS0FERTs7QUFFVkEsWUFBTWUsTUFBTixDQUFhLEtBQUtkLE1BQWxCO0FBQ0Q7Ozs2QkFFUWUsTSxFQUFRQyxRLEVBQVU7QUFDekI7QUFDQTtBQUZ5QixVQUdqQkMsR0FIaUIsR0FHRUQsUUFIRixDQUdqQkMsR0FIaUI7QUFBQSxVQUdaQyxTQUhZLEdBR0VGLFFBSEYsQ0FHWkUsU0FIWTs7QUFJekIsVUFBTUMsWUFBWTFCLEdBQUdRLElBQUgsQ0FBUUUsaUJBQVIsQ0FBMEJjLEdBQTFCLEVBQStCQyxTQUEvQixDQUFsQjs7QUFFQSxXQUFLbEIsTUFBTCxDQUFZbUIsU0FBWixHQUF3QkEsU0FBeEI7QUFDQSxXQUFLbkIsTUFBTCxDQUFZb0IsTUFBWjtBQUNBLFdBQUtwQixNQUFMLENBQVlxQixNQUFaO0FBQ0Q7Ozt3QkFuQ1c7QUFDVixhQUFPLEtBQUtyQixNQUFaO0FBQ0Q7OztFQVJvQnNCLHdCOztrQkE0Q1IzQixRIiwiZmlsZSI6IkdyaWRBeGlzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge307XG5cblxuLyoqXG4gKlxuICpcbiAqL1xuY2xhc3MgR3JpZEF4aXMgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gZm9yIHVzZSBpbiB6b29tIGZvciBleGFtcGxlXG4gIGdldCBsYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXI7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgLy8gZHVtbXkgYXhpcyB3YWl0aW5nIGZvciB0cmFjayBjb25maWdcbiAgICB0aGlzLl9sYXllciA9IG5ldyB1aS5heGlzLkF4aXNMYXllcih1aS5heGlzLmdyaWRBeGlzR2VuZXJhdG9yKDEsICc0LzQnKSwge1xuICAgICAgdG9wOiAwLFxuICAgICAgaGVpZ2h0OiAxMixcbiAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgfSk7XG5cbiAgICAvLyBheGlzIHVzZSB0aW1lbGluZSB0aW1lIGNvbnRleHRcbiAgICB0aGlzLl9sYXllci5zZXRUaW1lQ29udGV4dCh0aW1lbGluZS50aW1lQ29udGV4dCk7XG4gICAgdGhpcy5fbGF5ZXIuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLlRpY2tzLCB7fSwgeyBjb2xvcjogJyM5MDkwOTAnIH0pO1xuXG4gICAgdHJhY2suYWRkKHRoaXMuX2xheWVyKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICBjb25zdCB7IHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuICAgIHRyYWNrLnJlbW92ZSh0aGlzLl9sYXllcik7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhKSB7XG4gICAgLy8gYXMgdGhlIHNpZ25hdHVyZSBhbmQgYnBtIG1heSBjaGFuZ2UgYmV0d2VlbiB0cmFja3MsXG4gICAgLy8gd2UgbmVlZCB0byByZWNyZWF0ZSBnZW5lcmF0b3JcbiAgICBjb25zdCB7IGJwbSwgc2lnbmF0dXJlIH0gPSBtZXRhZGF0YTtcbiAgICBjb25zdCBnZW5lcmF0b3IgPSB1aS5heGlzLmdyaWRBeGlzR2VuZXJhdG9yKGJwbSwgc2lnbmF0dXJlKTtcblxuICAgIHRoaXMuX2xheWVyLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgICB0aGlzLl9sYXllci5yZW5kZXIoKTtcbiAgICB0aGlzLl9sYXllci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmlkQXhpcztcbiJdfQ==