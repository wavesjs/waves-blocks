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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractAnnotationModule = require('./AbstractAnnotationModule');

var _AbstractAnnotationModule2 = _interopRequireDefault(_AbstractAnnotationModule);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parameters = {};

var SegmentModule = function (_AbstractAnnotationMo) {
  (0, _inherits3.default)(SegmentModule, _AbstractAnnotationMo);

  function SegmentModule(options) {
    (0, _classCallCheck3.default)(this, SegmentModule);
    return (0, _possibleConstructorReturn3.default)(this, (SegmentModule.__proto__ || (0, _getPrototypeOf2.default)(SegmentModule)).call(this, parameters, options));
  }

  (0, _createClass3.default)(SegmentModule, [{
    key: 'createNewAnnotationDatum',
    value: function createNewAnnotationDatum(time) {
      return {
        time: time,
        label: 'label',
        duration: 1
      };
    }
  }, {
    key: 'install',
    value: function install() {
      (0, _get3.default)(SegmentModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(SegmentModule.prototype), 'install', this).call(this);

      var _block$ui = this.block.ui,
          timeContext = _block$ui.timeContext,
          track = _block$ui.track;


      var segments = new ui.core.Layer('collection', [], {
        height: this.block.height,
        yDomain: [0, 1],
        zIndex: this.zIndex
      });

      segments.setTimeContext(timeContext);
      segments.configureShape(ui.shapes.Segment, {
        x: function x(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          // can't go beyond the end of the track
          if (v !== null) d.time = Math.min(v, timeContext.duration - d.duration);

          return d.time;
        },
        width: function width(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          if (v !== null) d.duration = Math.min(v, timeContext.duration - d.time);

          return d.duration;
        },
        y: function y(d) {
          return 0;
        },
        height: function height(d) {
          return 1;
        }
      }, {
        opacity: 0.2,
        displayHandlers: true,
        handlerWidth: 1,
        handlerOpacity: 0.4,
        displayLabels: true
      });

      segments.setBehavior(new ui.behaviors.SegmentBehavior());
      track.add(segments);

      this._layer = segments;

      this.postInstall(this._layer);
    }
  }]);
  return SegmentModule;
}(_AbstractAnnotationModule2.default);

exports.default = SegmentModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiU2VnbWVudE1vZHVsZSIsIm9wdGlvbnMiLCJ0aW1lIiwibGFiZWwiLCJkdXJhdGlvbiIsImJsb2NrIiwidGltZUNvbnRleHQiLCJ0cmFjayIsInNlZ21lbnRzIiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJTZWdtZW50IiwieCIsImQiLCJ2IiwiTWF0aCIsIm1pbiIsIndpZHRoIiwieSIsIm9wYWNpdHkiLCJkaXNwbGF5SGFuZGxlcnMiLCJoYW5kbGVyV2lkdGgiLCJoYW5kbGVyT3BhY2l0eSIsImRpc3BsYXlMYWJlbHMiLCJzZXRCZWhhdmlvciIsImJlaGF2aW9ycyIsIlNlZ21lbnRCZWhhdmlvciIsImFkZCIsIl9sYXllciIsInBvc3RJbnN0YWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxhQUFhLEVBQW5COztJQUVNQyxhOzs7QUFDSix5QkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEsK0lBQ2JGLFVBRGEsRUFDREUsT0FEQztBQUVwQjs7Ozs2Q0FFd0JDLEksRUFBTTtBQUM3QixhQUFPO0FBQ0xBLGNBQU1BLElBREQ7QUFFTEMsZUFBTyxPQUZGO0FBR0xDLGtCQUFVO0FBSEwsT0FBUDtBQUtEOzs7OEJBRVM7QUFDUjs7QUFEUSxzQkFHdUIsS0FBS0MsS0FBTCxDQUFXUCxFQUhsQztBQUFBLFVBR0FRLFdBSEEsYUFHQUEsV0FIQTtBQUFBLFVBR2FDLEtBSGIsYUFHYUEsS0FIYjs7O0FBS1IsVUFBTUMsV0FBVyxJQUFJVixHQUFHVyxJQUFILENBQVFDLEtBQVosQ0FBa0IsWUFBbEIsRUFBZ0MsRUFBaEMsRUFBb0M7QUFDbkRDLGdCQUFRLEtBQUtOLEtBQUwsQ0FBV00sTUFEZ0M7QUFFbkRDLGlCQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FGMEM7QUFHbkRDLGdCQUFRLEtBQUtBO0FBSHNDLE9BQXBDLENBQWpCOztBQU1BTCxlQUFTTSxjQUFULENBQXdCUixXQUF4QjtBQUNBRSxlQUFTTyxjQUFULENBQXdCakIsR0FBR2tCLE1BQUgsQ0FBVUMsT0FBbEMsRUFBMkM7QUFDekNDLFdBQUcsV0FBQ0MsQ0FBRCxFQUFpQjtBQUFBLGNBQWJDLENBQWEsdUVBQVQsSUFBUzs7QUFDbEI7QUFDQSxjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWpCLElBQUYsR0FBU21CLEtBQUtDLEdBQUwsQ0FBU0YsQ0FBVCxFQUFZZCxZQUFZRixRQUFaLEdBQXVCZSxFQUFFZixRQUFyQyxDQUFUOztBQUVGLGlCQUFPZSxFQUFFakIsSUFBVDtBQUNELFNBUHdDO0FBUXpDcUIsZUFBTyxlQUFDSixDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUN0QixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWYsUUFBRixHQUFhaUIsS0FBS0MsR0FBTCxDQUFTRixDQUFULEVBQVlkLFlBQVlGLFFBQVosR0FBdUJlLEVBQUVqQixJQUFyQyxDQUFiOztBQUVGLGlCQUFPaUIsRUFBRWYsUUFBVDtBQUNELFNBYndDO0FBY3pDb0IsV0FBRztBQUFBLGlCQUFLLENBQUw7QUFBQSxTQWRzQztBQWV6Q2IsZ0JBQVE7QUFBQSxpQkFBSyxDQUFMO0FBQUE7QUFmaUMsT0FBM0MsRUFnQkc7QUFDRGMsaUJBQVMsR0FEUjtBQUVEQyx5QkFBaUIsSUFGaEI7QUFHREMsc0JBQWMsQ0FIYjtBQUlEQyx3QkFBZ0IsR0FKZjtBQUtEQyx1QkFBZTtBQUxkLE9BaEJIOztBQXdCQXJCLGVBQVNzQixXQUFULENBQXFCLElBQUloQyxHQUFHaUMsU0FBSCxDQUFhQyxlQUFqQixFQUFyQjtBQUNBekIsWUFBTTBCLEdBQU4sQ0FBVXpCLFFBQVY7O0FBRUEsV0FBSzBCLE1BQUwsR0FBYzFCLFFBQWQ7O0FBRUEsV0FBSzJCLFdBQUwsQ0FBaUIsS0FBS0QsTUFBdEI7QUFDRDs7Ozs7a0JBR1lsQyxhIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIGZyb20gJy4vQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlJztcbmltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcblxuY29uc3QgcGFyYW1ldGVycyA9IHt9O1xuXG5jbGFzcyBTZWdtZW50TW9kdWxlIGV4dGVuZHMgQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtKHRpbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGltZTogdGltZSxcbiAgICAgIGxhYmVsOiAnbGFiZWwnLFxuICAgICAgZHVyYXRpb246IDEsXG4gICAgfTtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgc3VwZXIuaW5zdGFsbCgpO1xuXG4gICAgY29uc3QgeyB0aW1lQ29udGV4dCwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICBjb25zdCBzZWdtZW50cyA9IG5ldyB1aS5jb3JlLkxheWVyKCdjb2xsZWN0aW9uJywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgc2VnbWVudHMuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHNlZ21lbnRzLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5TZWdtZW50LCB7XG4gICAgICB4OiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgLy8gY2FuJ3QgZ28gYmV5b25kIHRoZSBlbmQgb2YgdGhlIHRyYWNrXG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQudGltZSA9IE1hdGgubWluKHYsIHRpbWVDb250ZXh0LmR1cmF0aW9uIC0gZC5kdXJhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIGQudGltZTtcbiAgICAgIH0sXG4gICAgICB3aWR0aDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQuZHVyYXRpb24gPSBNYXRoLm1pbih2LCB0aW1lQ29udGV4dC5kdXJhdGlvbiAtIGQudGltZSk7XG5cbiAgICAgICAgcmV0dXJuIGQuZHVyYXRpb247XG4gICAgICB9LFxuICAgICAgeTogZCA9PiAwLFxuICAgICAgaGVpZ2h0OiBkID0+IDEsXG4gICAgfSwge1xuICAgICAgb3BhY2l0eTogMC4yLFxuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgaGFuZGxlcldpZHRoOiAxLFxuICAgICAgaGFuZGxlck9wYWNpdHk6IDAuNCxcbiAgICAgIGRpc3BsYXlMYWJlbHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBzZWdtZW50cy5zZXRCZWhhdmlvcihuZXcgdWkuYmVoYXZpb3JzLlNlZ21lbnRCZWhhdmlvcigpKTtcbiAgICB0cmFjay5hZGQoc2VnbWVudHMpO1xuXG4gICAgdGhpcy5fbGF5ZXIgPSBzZWdtZW50cztcblxuICAgIHRoaXMucG9zdEluc3RhbGwodGhpcy5fbGF5ZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlZ21lbnRNb2R1bGU7XG4iXX0=