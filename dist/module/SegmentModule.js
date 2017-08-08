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
    value: function install(block) {
      (0, _get3.default)(SegmentModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(SegmentModule.prototype), 'install', this).call(this, block);

      var _block$ui = block.ui,
          timeContext = _block$ui.timeContext,
          track = _block$ui.track;


      var segments = new ui.core.Layer('collection', [], {
        height: block.height,
        yDomain: [0, 1]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsIlNlZ21lbnRNb2R1bGUiLCJvcHRpb25zIiwidGltZSIsImxhYmVsIiwiZHVyYXRpb24iLCJibG9jayIsInRpbWVDb250ZXh0IiwidHJhY2siLCJzZWdtZW50cyIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInlEb21haW4iLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic2hhcGVzIiwiU2VnbWVudCIsIngiLCJkIiwidiIsIk1hdGgiLCJtaW4iLCJ3aWR0aCIsInkiLCJvcGFjaXR5IiwiZGlzcGxheUhhbmRsZXJzIiwiaGFuZGxlcldpZHRoIiwiaGFuZGxlck9wYWNpdHkiLCJkaXNwbGF5TGFiZWxzIiwic2V0QmVoYXZpb3IiLCJiZWhhdmlvcnMiLCJTZWdtZW50QmVoYXZpb3IiLCJhZGQiLCJfbGF5ZXIiLCJwb3N0SW5zdGFsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7SUFBWUEsRTs7Ozs7O0FBRVosSUFBTUMsYUFBYSxFQUFuQjs7SUFFTUMsYTs7O0FBQ0oseUJBQVlDLE9BQVosRUFBcUI7QUFBQTtBQUFBLCtJQUNiRixVQURhLEVBQ0RFLE9BREM7QUFFcEI7Ozs7NkNBRXdCQyxJLEVBQU07QUFDN0IsYUFBTztBQUNMQSxjQUFNQSxJQUREO0FBRUxDLGVBQU8sT0FGRjtBQUdMQyxrQkFBVTtBQUhMLE9BQVA7QUFLRDs7OzRCQUVPQyxLLEVBQU87QUFDYixrSkFBY0EsS0FBZDs7QUFEYSxzQkFHa0JBLE1BQU1QLEVBSHhCO0FBQUEsVUFHTFEsV0FISyxhQUdMQSxXQUhLO0FBQUEsVUFHUUMsS0FIUixhQUdRQSxLQUhSOzs7QUFLYixVQUFNQyxXQUFXLElBQUlWLEdBQUdXLElBQUgsQ0FBUUMsS0FBWixDQUFrQixZQUFsQixFQUFnQyxFQUFoQyxFQUFvQztBQUNuREMsZ0JBQVFOLE1BQU1NLE1BRHFDO0FBRW5EQyxpQkFBUyxDQUFDLENBQUQsRUFBSSxDQUFKO0FBRjBDLE9BQXBDLENBQWpCOztBQUtBSixlQUFTSyxjQUFULENBQXdCUCxXQUF4QjtBQUNBRSxlQUFTTSxjQUFULENBQXdCaEIsR0FBR2lCLE1BQUgsQ0FBVUMsT0FBbEMsRUFBMkM7QUFDekNDLFdBQUcsV0FBQ0MsQ0FBRCxFQUFpQjtBQUFBLGNBQWJDLENBQWEsdUVBQVQsSUFBUzs7QUFDbEI7QUFDQSxjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWhCLElBQUYsR0FBU2tCLEtBQUtDLEdBQUwsQ0FBU0YsQ0FBVCxFQUFZYixZQUFZRixRQUFaLEdBQXVCYyxFQUFFZCxRQUFyQyxDQUFUOztBQUVGLGlCQUFPYyxFQUFFaEIsSUFBVDtBQUNELFNBUHdDO0FBUXpDb0IsZUFBTyxlQUFDSixDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUN0QixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWQsUUFBRixHQUFhZ0IsS0FBS0MsR0FBTCxDQUFTRixDQUFULEVBQVliLFlBQVlGLFFBQVosR0FBdUJjLEVBQUVoQixJQUFyQyxDQUFiOztBQUVGLGlCQUFPZ0IsRUFBRWQsUUFBVDtBQUNELFNBYndDO0FBY3pDbUIsV0FBRztBQUFBLGlCQUFLLENBQUw7QUFBQSxTQWRzQztBQWV6Q1osZ0JBQVE7QUFBQSxpQkFBSyxDQUFMO0FBQUE7QUFmaUMsT0FBM0MsRUFnQkc7QUFDRGEsaUJBQVMsR0FEUjtBQUVEQyx5QkFBaUIsSUFGaEI7QUFHREMsc0JBQWMsQ0FIYjtBQUlEQyx3QkFBZ0IsR0FKZjtBQUtEQyx1QkFBZTtBQUxkLE9BaEJIOztBQXdCQXBCLGVBQVNxQixXQUFULENBQXFCLElBQUkvQixHQUFHZ0MsU0FBSCxDQUFhQyxlQUFqQixFQUFyQjs7QUFFQXhCLFlBQU15QixHQUFOLENBQVV4QixRQUFWOztBQUVBLFdBQUt5QixNQUFMLEdBQWN6QixRQUFkO0FBQ0EsV0FBSzBCLFdBQUwsQ0FBaUIsS0FBS0QsTUFBdEI7QUFDRDs7Ozs7a0JBR1lqQyxhIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSBmcm9tICcuL0Fic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7fTtcblxuY2xhc3MgU2VnbWVudE1vZHVsZSBleHRlbmRzIEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bSh0aW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWU6IHRpbWUsXG4gICAgICBsYWJlbDogJ2xhYmVsJyxcbiAgICAgIGR1cmF0aW9uOiAxLFxuICAgIH07XG4gIH1cblxuICBpbnN0YWxsKGJsb2NrKSB7XG4gICAgc3VwZXIuaW5zdGFsbChibG9jayk7XG5cbiAgICBjb25zdCB7IHRpbWVDb250ZXh0LCB0cmFjayB9ID0gYmxvY2sudWk7XG5cbiAgICBjb25zdCBzZWdtZW50cyA9IG5ldyB1aS5jb3JlLkxheWVyKCdjb2xsZWN0aW9uJywgW10sIHtcbiAgICAgIGhlaWdodDogYmxvY2suaGVpZ2h0LFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgIH0pO1xuXG4gICAgc2VnbWVudHMuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHNlZ21lbnRzLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5TZWdtZW50LCB7XG4gICAgICB4OiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgLy8gY2FuJ3QgZ28gYmV5b25kIHRoZSBlbmQgb2YgdGhlIHRyYWNrXG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQudGltZSA9IE1hdGgubWluKHYsIHRpbWVDb250ZXh0LmR1cmF0aW9uIC0gZC5kdXJhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIGQudGltZTtcbiAgICAgIH0sXG4gICAgICB3aWR0aDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQuZHVyYXRpb24gPSBNYXRoLm1pbih2LCB0aW1lQ29udGV4dC5kdXJhdGlvbiAtIGQudGltZSk7XG5cbiAgICAgICAgcmV0dXJuIGQuZHVyYXRpb247XG4gICAgICB9LFxuICAgICAgeTogZCA9PiAwLFxuICAgICAgaGVpZ2h0OiBkID0+IDEsXG4gICAgfSwge1xuICAgICAgb3BhY2l0eTogMC4yLFxuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgaGFuZGxlcldpZHRoOiAxLFxuICAgICAgaGFuZGxlck9wYWNpdHk6IDAuNCxcbiAgICAgIGRpc3BsYXlMYWJlbHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBzZWdtZW50cy5zZXRCZWhhdmlvcihuZXcgdWkuYmVoYXZpb3JzLlNlZ21lbnRCZWhhdmlvcigpKTtcblxuICAgIHRyYWNrLmFkZChzZWdtZW50cyk7XG5cbiAgICB0aGlzLl9sYXllciA9IHNlZ21lbnRzO1xuICAgIHRoaXMucG9zdEluc3RhbGwodGhpcy5fbGF5ZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlZ21lbnRNb2R1bGU7XG4iXX0=