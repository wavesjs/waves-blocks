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

var _AbstractAnnotation2 = require('./AbstractAnnotation');

var _AbstractAnnotation3 = _interopRequireDefault(_AbstractAnnotation2);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parameters = {};

var Segment = function (_AbstractAnnotation) {
  (0, _inherits3.default)(Segment, _AbstractAnnotation);

  function Segment(options) {
    (0, _classCallCheck3.default)(this, Segment);
    return (0, _possibleConstructorReturn3.default)(this, (Segment.__proto__ || (0, _getPrototypeOf2.default)(Segment)).call(this, parameters, options));
  }

  (0, _createClass3.default)(Segment, [{
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
      (0, _get3.default)(Segment.prototype.__proto__ || (0, _getPrototypeOf2.default)(Segment.prototype), 'install', this).call(this);

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
  return Segment;
}(_AbstractAnnotation3.default);

exports.default = Segment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnQuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiU2VnbWVudCIsIm9wdGlvbnMiLCJ0aW1lIiwibGFiZWwiLCJkdXJhdGlvbiIsImJsb2NrIiwidGltZUNvbnRleHQiLCJ0cmFjayIsInNlZ21lbnRzIiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJ4IiwiZCIsInYiLCJNYXRoIiwibWluIiwid2lkdGgiLCJ5Iiwib3BhY2l0eSIsImRpc3BsYXlIYW5kbGVycyIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJPcGFjaXR5IiwiZGlzcGxheUxhYmVscyIsInNldEJlaGF2aW9yIiwiYmVoYXZpb3JzIiwiU2VnbWVudEJlaGF2aW9yIiwiYWRkIiwiX2xheWVyIiwicG9zdEluc3RhbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUVaLElBQU1DLGFBQWEsRUFBbkI7O0lBRU1DLE87OztBQUNKLG1CQUFZQyxPQUFaLEVBQXFCO0FBQUE7QUFBQSxtSUFDYkYsVUFEYSxFQUNERSxPQURDO0FBRXBCOzs7OzZDQUV3QkMsSSxFQUFNO0FBQzdCLGFBQU87QUFDTEEsY0FBTUEsSUFERDtBQUVMQyxlQUFPLE9BRkY7QUFHTEMsa0JBQVU7QUFITCxPQUFQO0FBS0Q7Ozs4QkFFUztBQUNSOztBQURRLHNCQUd1QixLQUFLQyxLQUFMLENBQVdQLEVBSGxDO0FBQUEsVUFHQVEsV0FIQSxhQUdBQSxXQUhBO0FBQUEsVUFHYUMsS0FIYixhQUdhQSxLQUhiOzs7QUFLUixVQUFNQyxXQUFXLElBQUlWLEdBQUdXLElBQUgsQ0FBUUMsS0FBWixDQUFrQixZQUFsQixFQUFnQyxFQUFoQyxFQUFvQztBQUNuREMsZ0JBQVEsS0FBS04sS0FBTCxDQUFXTSxNQURnQztBQUVuREMsaUJBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUYwQztBQUduREMsZ0JBQVEsS0FBS0E7QUFIc0MsT0FBcEMsQ0FBakI7O0FBTUFMLGVBQVNNLGNBQVQsQ0FBd0JSLFdBQXhCO0FBQ0FFLGVBQVNPLGNBQVQsQ0FBd0JqQixHQUFHa0IsTUFBSCxDQUFVaEIsT0FBbEMsRUFBMkM7QUFDekNpQixXQUFHLFdBQUNDLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ2xCO0FBQ0EsY0FBSUEsTUFBTSxJQUFWLEVBQ0VELEVBQUVoQixJQUFGLEdBQVNrQixLQUFLQyxHQUFMLENBQVNGLENBQVQsRUFBWWIsWUFBWUYsUUFBWixHQUF1QmMsRUFBRWQsUUFBckMsQ0FBVDs7QUFFRixpQkFBT2MsRUFBRWhCLElBQVQ7QUFDRCxTQVB3QztBQVF6Q29CLGVBQU8sZUFBQ0osQ0FBRCxFQUFpQjtBQUFBLGNBQWJDLENBQWEsdUVBQVQsSUFBUzs7QUFDdEIsY0FBSUEsTUFBTSxJQUFWLEVBQ0VELEVBQUVkLFFBQUYsR0FBYWdCLEtBQUtDLEdBQUwsQ0FBU0YsQ0FBVCxFQUFZYixZQUFZRixRQUFaLEdBQXVCYyxFQUFFaEIsSUFBckMsQ0FBYjs7QUFFRixpQkFBT2dCLEVBQUVkLFFBQVQ7QUFDRCxTQWJ3QztBQWN6Q21CLFdBQUc7QUFBQSxpQkFBSyxDQUFMO0FBQUEsU0Fkc0M7QUFlekNaLGdCQUFRO0FBQUEsaUJBQUssQ0FBTDtBQUFBO0FBZmlDLE9BQTNDLEVBZ0JHO0FBQ0RhLGlCQUFTLEdBRFI7QUFFREMseUJBQWlCLElBRmhCO0FBR0RDLHNCQUFjLENBSGI7QUFJREMsd0JBQWdCLEdBSmY7QUFLREMsdUJBQWU7QUFMZCxPQWhCSDs7QUF3QkFwQixlQUFTcUIsV0FBVCxDQUFxQixJQUFJL0IsR0FBR2dDLFNBQUgsQ0FBYUMsZUFBakIsRUFBckI7QUFDQXhCLFlBQU15QixHQUFOLENBQVV4QixRQUFWOztBQUVBLFdBQUt5QixNQUFMLEdBQWN6QixRQUFkOztBQUVBLFdBQUswQixXQUFMLENBQWlCLEtBQUtELE1BQXRCO0FBQ0Q7Ozs7O2tCQUdZakMsTyIsImZpbGUiOiJTZWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0QW5ub3RhdGlvbiBmcm9tICcuL0Fic3RyYWN0QW5ub3RhdGlvbic7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7fTtcblxuY2xhc3MgU2VnbWVudCBleHRlbmRzIEFic3RyYWN0QW5ub3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bSh0aW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWU6IHRpbWUsXG4gICAgICBsYWJlbDogJ2xhYmVsJyxcbiAgICAgIGR1cmF0aW9uOiAxLFxuICAgIH07XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIHN1cGVyLmluc3RhbGwoKTtcblxuICAgIGNvbnN0IHsgdGltZUNvbnRleHQsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgY29uc3Qgc2VnbWVudHMgPSBuZXcgdWkuY29yZS5MYXllcignY29sbGVjdGlvbicsIFtdLCB7XG4gICAgICBoZWlnaHQ6IHRoaXMuYmxvY2suaGVpZ2h0LFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHNlZ21lbnRzLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICBzZWdtZW50cy5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuU2VnbWVudCwge1xuICAgICAgeDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIC8vIGNhbid0IGdvIGJleW9uZCB0aGUgZW5kIG9mIHRoZSB0cmFja1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLnRpbWUgPSBNYXRoLm1pbih2LCB0aW1lQ29udGV4dC5kdXJhdGlvbiAtIGQuZHVyYXRpb24pO1xuXG4gICAgICAgIHJldHVybiBkLnRpbWU7XG4gICAgICB9LFxuICAgICAgd2lkdGg6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLmR1cmF0aW9uID0gTWF0aC5taW4odiwgdGltZUNvbnRleHQuZHVyYXRpb24gLSBkLnRpbWUpO1xuXG4gICAgICAgIHJldHVybiBkLmR1cmF0aW9uO1xuICAgICAgfSxcbiAgICAgIHk6IGQgPT4gMCxcbiAgICAgIGhlaWdodDogZCA9PiAxLFxuICAgIH0sIHtcbiAgICAgIG9wYWNpdHk6IDAuMixcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGhhbmRsZXJXaWR0aDogMSxcbiAgICAgIGhhbmRsZXJPcGFjaXR5OiAwLjQsXG4gICAgICBkaXNwbGF5TGFiZWxzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgc2VnbWVudHMuc2V0QmVoYXZpb3IobmV3IHVpLmJlaGF2aW9ycy5TZWdtZW50QmVoYXZpb3IoKSk7XG4gICAgdHJhY2suYWRkKHNlZ21lbnRzKTtcblxuICAgIHRoaXMuX2xheWVyID0gc2VnbWVudHM7XG5cbiAgICB0aGlzLnBvc3RJbnN0YWxsKHRoaXMuX2xheWVyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWdtZW50O1xuIl19