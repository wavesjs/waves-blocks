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

/** @private */
var parameters = {};

/**
 * Module that adds segment functionnality to the block.
 */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiU2VnbWVudCIsIm9wdGlvbnMiLCJ0aW1lIiwibGFiZWwiLCJkdXJhdGlvbiIsImJsb2NrIiwidGltZUNvbnRleHQiLCJ0cmFjayIsInNlZ21lbnRzIiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJ4IiwiZCIsInYiLCJNYXRoIiwibWluIiwid2lkdGgiLCJ5Iiwib3BhY2l0eSIsImRpc3BsYXlIYW5kbGVycyIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJPcGFjaXR5IiwiZGlzcGxheUxhYmVscyIsInNldEJlaGF2aW9yIiwiYmVoYXZpb3JzIiwiU2VnbWVudEJlaGF2aW9yIiwiYWRkIiwiX2xheWVyIiwicG9zdEluc3RhbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUVaO0FBQ0EsSUFBTUMsYUFBYSxFQUFuQjs7QUFFQTs7OztJQUdNQyxPOzs7QUFDSixtQkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEsbUlBQ2JGLFVBRGEsRUFDREUsT0FEQztBQUVwQjs7Ozs2Q0FFd0JDLEksRUFBTTtBQUM3QixhQUFPO0FBQ0xBLGNBQU1BLElBREQ7QUFFTEMsZUFBTyxPQUZGO0FBR0xDLGtCQUFVO0FBSEwsT0FBUDtBQUtEOzs7OEJBRVM7QUFDUjs7QUFEUSxzQkFHdUIsS0FBS0MsS0FBTCxDQUFXUCxFQUhsQztBQUFBLFVBR0FRLFdBSEEsYUFHQUEsV0FIQTtBQUFBLFVBR2FDLEtBSGIsYUFHYUEsS0FIYjs7O0FBS1IsVUFBTUMsV0FBVyxJQUFJVixHQUFHVyxJQUFILENBQVFDLEtBQVosQ0FBa0IsWUFBbEIsRUFBZ0MsRUFBaEMsRUFBb0M7QUFDbkRDLGdCQUFRLEtBQUtOLEtBQUwsQ0FBV00sTUFEZ0M7QUFFbkRDLGlCQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FGMEM7QUFHbkRDLGdCQUFRLEtBQUtBO0FBSHNDLE9BQXBDLENBQWpCOztBQU1BTCxlQUFTTSxjQUFULENBQXdCUixXQUF4QjtBQUNBRSxlQUFTTyxjQUFULENBQXdCakIsR0FBR2tCLE1BQUgsQ0FBVWhCLE9BQWxDLEVBQTJDO0FBQ3pDaUIsV0FBRyxXQUFDQyxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUNsQjtBQUNBLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFaEIsSUFBRixHQUFTa0IsS0FBS0MsR0FBTCxDQUFTRixDQUFULEVBQVliLFlBQVlGLFFBQVosR0FBdUJjLEVBQUVkLFFBQXJDLENBQVQ7O0FBRUYsaUJBQU9jLEVBQUVoQixJQUFUO0FBQ0QsU0FQd0M7QUFRekNvQixlQUFPLGVBQUNKLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ3RCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFZCxRQUFGLEdBQWFnQixLQUFLQyxHQUFMLENBQVNGLENBQVQsRUFBWWIsWUFBWUYsUUFBWixHQUF1QmMsRUFBRWhCLElBQXJDLENBQWI7O0FBRUYsaUJBQU9nQixFQUFFZCxRQUFUO0FBQ0QsU0Fid0M7QUFjekNtQixXQUFHO0FBQUEsaUJBQUssQ0FBTDtBQUFBLFNBZHNDO0FBZXpDWixnQkFBUTtBQUFBLGlCQUFLLENBQUw7QUFBQTtBQWZpQyxPQUEzQyxFQWdCRztBQUNEYSxpQkFBUyxHQURSO0FBRURDLHlCQUFpQixJQUZoQjtBQUdEQyxzQkFBYyxDQUhiO0FBSURDLHdCQUFnQixHQUpmO0FBS0RDLHVCQUFlO0FBTGQsT0FoQkg7O0FBd0JBcEIsZUFBU3FCLFdBQVQsQ0FBcUIsSUFBSS9CLEdBQUdnQyxTQUFILENBQWFDLGVBQWpCLEVBQXJCO0FBQ0F4QixZQUFNeUIsR0FBTixDQUFVeEIsUUFBVjs7QUFFQSxXQUFLeUIsTUFBTCxHQUFjekIsUUFBZDs7QUFFQSxXQUFLMEIsV0FBTCxDQUFpQixLQUFLRCxNQUF0QjtBQUNEOzs7OztrQkFHWWpDLE8iLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdEFubm90YXRpb24gZnJvbSAnLi9BYnN0cmFjdEFubm90YXRpb24nO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG4vKiogQHByaXZhdGUgKi9cbmNvbnN0IHBhcmFtZXRlcnMgPSB7fTtcblxuLyoqXG4gKiBNb2R1bGUgdGhhdCBhZGRzIHNlZ21lbnQgZnVuY3Rpb25uYWxpdHkgdG8gdGhlIGJsb2NrLlxuICovXG5jbGFzcyBTZWdtZW50IGV4dGVuZHMgQWJzdHJhY3RBbm5vdGF0aW9uIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtKHRpbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGltZTogdGltZSxcbiAgICAgIGxhYmVsOiAnbGFiZWwnLFxuICAgICAgZHVyYXRpb246IDEsXG4gICAgfTtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgc3VwZXIuaW5zdGFsbCgpO1xuXG4gICAgY29uc3QgeyB0aW1lQ29udGV4dCwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICBjb25zdCBzZWdtZW50cyA9IG5ldyB1aS5jb3JlLkxheWVyKCdjb2xsZWN0aW9uJywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgc2VnbWVudHMuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHNlZ21lbnRzLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5TZWdtZW50LCB7XG4gICAgICB4OiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgLy8gY2FuJ3QgZ28gYmV5b25kIHRoZSBlbmQgb2YgdGhlIHRyYWNrXG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQudGltZSA9IE1hdGgubWluKHYsIHRpbWVDb250ZXh0LmR1cmF0aW9uIC0gZC5kdXJhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIGQudGltZTtcbiAgICAgIH0sXG4gICAgICB3aWR0aDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQuZHVyYXRpb24gPSBNYXRoLm1pbih2LCB0aW1lQ29udGV4dC5kdXJhdGlvbiAtIGQudGltZSk7XG5cbiAgICAgICAgcmV0dXJuIGQuZHVyYXRpb247XG4gICAgICB9LFxuICAgICAgeTogZCA9PiAwLFxuICAgICAgaGVpZ2h0OiBkID0+IDEsXG4gICAgfSwge1xuICAgICAgb3BhY2l0eTogMC4yLFxuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgaGFuZGxlcldpZHRoOiAxLFxuICAgICAgaGFuZGxlck9wYWNpdHk6IDAuNCxcbiAgICAgIGRpc3BsYXlMYWJlbHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBzZWdtZW50cy5zZXRCZWhhdmlvcihuZXcgdWkuYmVoYXZpb3JzLlNlZ21lbnRCZWhhdmlvcigpKTtcbiAgICB0cmFjay5hZGQoc2VnbWVudHMpO1xuXG4gICAgdGhpcy5fbGF5ZXIgPSBzZWdtZW50cztcblxuICAgIHRoaXMucG9zdEluc3RhbGwodGhpcy5fbGF5ZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlZ21lbnQ7XG4iXX0=