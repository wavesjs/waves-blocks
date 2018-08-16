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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnQuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiU2VnbWVudCIsIm9wdGlvbnMiLCJ0aW1lIiwibGFiZWwiLCJkdXJhdGlvbiIsImJsb2NrIiwidGltZUNvbnRleHQiLCJ0cmFjayIsInNlZ21lbnRzIiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJ4IiwiZCIsInYiLCJNYXRoIiwibWluIiwid2lkdGgiLCJ5Iiwib3BhY2l0eSIsImRpc3BsYXlIYW5kbGVycyIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJPcGFjaXR5IiwiZGlzcGxheUxhYmVscyIsInNldEJlaGF2aW9yIiwiYmVoYXZpb3JzIiwiU2VnbWVudEJlaGF2aW9yIiwiYWRkIiwiX2xheWVyIiwicG9zdEluc3RhbGwiLCJBYnN0cmFjdEFubm90YXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUVaO0FBQ0EsSUFBTUMsYUFBYSxFQUFuQjs7QUFFQTs7OztJQUdNQyxPOzs7QUFDSixtQkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEsbUlBQ2JGLFVBRGEsRUFDREUsT0FEQztBQUVwQjs7Ozs2Q0FFd0JDLEksRUFBTTtBQUM3QixhQUFPO0FBQ0xBLGNBQU1BLElBREQ7QUFFTEMsZUFBTyxPQUZGO0FBR0xDLGtCQUFVO0FBSEwsT0FBUDtBQUtEOzs7OEJBRVM7QUFDUjs7QUFEUSxzQkFHdUIsS0FBS0MsS0FBTCxDQUFXUCxFQUhsQztBQUFBLFVBR0FRLFdBSEEsYUFHQUEsV0FIQTtBQUFBLFVBR2FDLEtBSGIsYUFHYUEsS0FIYjs7O0FBS1IsVUFBTUMsV0FBVyxJQUFJVixHQUFHVyxJQUFILENBQVFDLEtBQVosQ0FBa0IsWUFBbEIsRUFBZ0MsRUFBaEMsRUFBb0M7QUFDbkRDLGdCQUFRLEtBQUtOLEtBQUwsQ0FBV00sTUFEZ0M7QUFFbkRDLGlCQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FGMEM7QUFHbkRDLGdCQUFRLEtBQUtBO0FBSHNDLE9BQXBDLENBQWpCOztBQU1BTCxlQUFTTSxjQUFULENBQXdCUixXQUF4QjtBQUNBRSxlQUFTTyxjQUFULENBQXdCakIsR0FBR2tCLE1BQUgsQ0FBVWhCLE9BQWxDLEVBQTJDO0FBQ3pDaUIsV0FBRyxXQUFDQyxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUNsQjtBQUNBLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFaEIsSUFBRixHQUFTa0IsS0FBS0MsR0FBTCxDQUFTRixDQUFULEVBQVliLFlBQVlGLFFBQVosR0FBdUJjLEVBQUVkLFFBQXJDLENBQVQ7O0FBRUYsaUJBQU9jLEVBQUVoQixJQUFUO0FBQ0QsU0FQd0M7QUFRekNvQixlQUFPLGVBQUNKLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ3RCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFZCxRQUFGLEdBQWFnQixLQUFLQyxHQUFMLENBQVNGLENBQVQsRUFBWWIsWUFBWUYsUUFBWixHQUF1QmMsRUFBRWhCLElBQXJDLENBQWI7O0FBRUYsaUJBQU9nQixFQUFFZCxRQUFUO0FBQ0QsU0Fid0M7QUFjekNtQixXQUFHO0FBQUEsaUJBQUssQ0FBTDtBQUFBLFNBZHNDO0FBZXpDWixnQkFBUTtBQUFBLGlCQUFLLENBQUw7QUFBQTtBQWZpQyxPQUEzQyxFQWdCRztBQUNEYSxpQkFBUyxHQURSO0FBRURDLHlCQUFpQixJQUZoQjtBQUdEQyxzQkFBYyxDQUhiO0FBSURDLHdCQUFnQixHQUpmO0FBS0RDLHVCQUFlO0FBTGQsT0FoQkg7O0FBd0JBcEIsZUFBU3FCLFdBQVQsQ0FBcUIsSUFBSS9CLEdBQUdnQyxTQUFILENBQWFDLGVBQWpCLEVBQXJCO0FBQ0F4QixZQUFNeUIsR0FBTixDQUFVeEIsUUFBVjs7QUFFQSxXQUFLeUIsTUFBTCxHQUFjekIsUUFBZDs7QUFFQSxXQUFLMEIsV0FBTCxDQUFpQixLQUFLRCxNQUF0QjtBQUNEOzs7RUF2RG1CRSw0Qjs7a0JBMERQbkMsTyIsImZpbGUiOiJTZWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0QW5ub3RhdGlvbiBmcm9tICcuL0Fic3RyYWN0QW5ub3RhdGlvbic7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY29uc3QgcGFyYW1ldGVycyA9IHt9O1xuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGFkZHMgc2VnbWVudCBmdW5jdGlvbm5hbGl0eSB0byB0aGUgYmxvY2suXG4gKi9cbmNsYXNzIFNlZ21lbnQgZXh0ZW5kcyBBYnN0cmFjdEFubm90YXRpb24ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gIH1cblxuICBjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0odGltZSkge1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiB0aW1lLFxuICAgICAgbGFiZWw6ICdsYWJlbCcsXG4gICAgICBkdXJhdGlvbjogMSxcbiAgICB9O1xuICB9XG5cbiAgaW5zdGFsbCgpIHtcbiAgICBzdXBlci5pbnN0YWxsKCk7XG5cbiAgICBjb25zdCB7IHRpbWVDb250ZXh0LCB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIGNvbnN0IHNlZ21lbnRzID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2NvbGxlY3Rpb24nLCBbXSwge1xuICAgICAgaGVpZ2h0OiB0aGlzLmJsb2NrLmhlaWdodCxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgfSk7XG5cbiAgICBzZWdtZW50cy5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgc2VnbWVudHMuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLlNlZ21lbnQsIHtcbiAgICAgIHg6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICAvLyBjYW4ndCBnbyBiZXlvbmQgdGhlIGVuZCBvZiB0aGUgdHJhY2tcbiAgICAgICAgaWYgKHYgIT09IG51bGwpXG4gICAgICAgICAgZC50aW1lID0gTWF0aC5taW4odiwgdGltZUNvbnRleHQuZHVyYXRpb24gLSBkLmR1cmF0aW9uKTtcblxuICAgICAgICByZXR1cm4gZC50aW1lO1xuICAgICAgfSxcbiAgICAgIHdpZHRoOiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpXG4gICAgICAgICAgZC5kdXJhdGlvbiA9IE1hdGgubWluKHYsIHRpbWVDb250ZXh0LmR1cmF0aW9uIC0gZC50aW1lKTtcblxuICAgICAgICByZXR1cm4gZC5kdXJhdGlvbjtcbiAgICAgIH0sXG4gICAgICB5OiBkID0+IDAsXG4gICAgICBoZWlnaHQ6IGQgPT4gMSxcbiAgICB9LCB7XG4gICAgICBvcGFjaXR5OiAwLjIsXG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IHRydWUsXG4gICAgICBoYW5kbGVyV2lkdGg6IDEsXG4gICAgICBoYW5kbGVyT3BhY2l0eTogMC40LFxuICAgICAgZGlzcGxheUxhYmVsczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHNlZ21lbnRzLnNldEJlaGF2aW9yKG5ldyB1aS5iZWhhdmlvcnMuU2VnbWVudEJlaGF2aW9yKCkpO1xuICAgIHRyYWNrLmFkZChzZWdtZW50cyk7XG5cbiAgICB0aGlzLl9sYXllciA9IHNlZ21lbnRzO1xuXG4gICAgdGhpcy5wb3N0SW5zdGFsbCh0aGlzLl9sYXllcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VnbWVudDtcbiJdfQ==