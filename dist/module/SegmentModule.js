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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRNb2R1bGUuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiU2VnbWVudE1vZHVsZSIsIm9wdGlvbnMiLCJ0aW1lIiwibGFiZWwiLCJkdXJhdGlvbiIsImJsb2NrIiwidGltZUNvbnRleHQiLCJ0cmFjayIsInNlZ21lbnRzIiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwieURvbWFpbiIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJTZWdtZW50IiwieCIsImQiLCJ2IiwiTWF0aCIsIm1pbiIsIndpZHRoIiwieSIsIm9wYWNpdHkiLCJkaXNwbGF5SGFuZGxlcnMiLCJoYW5kbGVyV2lkdGgiLCJoYW5kbGVyT3BhY2l0eSIsImRpc3BsYXlMYWJlbHMiLCJzZXRCZWhhdmlvciIsImJlaGF2aW9ycyIsIlNlZ21lbnRCZWhhdmlvciIsImFkZCIsIl9sYXllciIsInBvc3RJbnN0YWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxhQUFhLEVBQW5COztJQUVNQyxhOzs7QUFDSix5QkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEsK0lBQ2JGLFVBRGEsRUFDREUsT0FEQztBQUVwQjs7Ozs2Q0FFd0JDLEksRUFBTTtBQUM3QixhQUFPO0FBQ0xBLGNBQU1BLElBREQ7QUFFTEMsZUFBTyxPQUZGO0FBR0xDLGtCQUFVO0FBSEwsT0FBUDtBQUtEOzs7OEJBRVM7QUFDUjs7QUFEUSxzQkFHdUIsS0FBS0MsS0FBTCxDQUFXUCxFQUhsQztBQUFBLFVBR0FRLFdBSEEsYUFHQUEsV0FIQTtBQUFBLFVBR2FDLEtBSGIsYUFHYUEsS0FIYjs7O0FBS1IsVUFBTUMsV0FBVyxJQUFJVixHQUFHVyxJQUFILENBQVFDLEtBQVosQ0FBa0IsWUFBbEIsRUFBZ0MsRUFBaEMsRUFBb0M7QUFDbkRDLGdCQUFRLEtBQUtOLEtBQUwsQ0FBV00sTUFEZ0M7QUFFbkRDLGlCQUFTLENBQUMsQ0FBRCxFQUFJLENBQUo7QUFGMEMsT0FBcEMsQ0FBakI7O0FBS0FKLGVBQVNLLGNBQVQsQ0FBd0JQLFdBQXhCO0FBQ0FFLGVBQVNNLGNBQVQsQ0FBd0JoQixHQUFHaUIsTUFBSCxDQUFVQyxPQUFsQyxFQUEyQztBQUN6Q0MsV0FBRyxXQUFDQyxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUNsQjtBQUNBLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFaEIsSUFBRixHQUFTa0IsS0FBS0MsR0FBTCxDQUFTRixDQUFULEVBQVliLFlBQVlGLFFBQVosR0FBdUJjLEVBQUVkLFFBQXJDLENBQVQ7O0FBRUYsaUJBQU9jLEVBQUVoQixJQUFUO0FBQ0QsU0FQd0M7QUFRekNvQixlQUFPLGVBQUNKLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ3RCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFZCxRQUFGLEdBQWFnQixLQUFLQyxHQUFMLENBQVNGLENBQVQsRUFBWWIsWUFBWUYsUUFBWixHQUF1QmMsRUFBRWhCLElBQXJDLENBQWI7O0FBRUYsaUJBQU9nQixFQUFFZCxRQUFUO0FBQ0QsU0Fid0M7QUFjekNtQixXQUFHO0FBQUEsaUJBQUssQ0FBTDtBQUFBLFNBZHNDO0FBZXpDWixnQkFBUTtBQUFBLGlCQUFLLENBQUw7QUFBQTtBQWZpQyxPQUEzQyxFQWdCRztBQUNEYSxpQkFBUyxHQURSO0FBRURDLHlCQUFpQixJQUZoQjtBQUdEQyxzQkFBYyxDQUhiO0FBSURDLHdCQUFnQixHQUpmO0FBS0RDLHVCQUFlO0FBTGQsT0FoQkg7O0FBd0JBcEIsZUFBU3FCLFdBQVQsQ0FBcUIsSUFBSS9CLEdBQUdnQyxTQUFILENBQWFDLGVBQWpCLEVBQXJCO0FBQ0F4QixZQUFNeUIsR0FBTixDQUFVeEIsUUFBVjs7QUFFQSxXQUFLeUIsTUFBTCxHQUFjekIsUUFBZDs7QUFFQSxXQUFLMEIsV0FBTCxDQUFpQixLQUFLRCxNQUF0QjtBQUNEOzs7OztrQkFHWWpDLGEiLCJmaWxlIjoiU2VnbWVudE1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdEFubm90YXRpb25Nb2R1bGUgZnJvbSAnLi9BYnN0cmFjdEFubm90YXRpb25Nb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge307XG5cbmNsYXNzIFNlZ21lbnRNb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdEFubm90YXRpb25Nb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gIH1cblxuICBjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0odGltZSkge1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiB0aW1lLFxuICAgICAgbGFiZWw6ICdsYWJlbCcsXG4gICAgICBkdXJhdGlvbjogMSxcbiAgICB9O1xuICB9XG5cbiAgaW5zdGFsbCgpIHtcbiAgICBzdXBlci5pbnN0YWxsKCk7XG5cbiAgICBjb25zdCB7IHRpbWVDb250ZXh0LCB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIGNvbnN0IHNlZ21lbnRzID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2NvbGxlY3Rpb24nLCBbXSwge1xuICAgICAgaGVpZ2h0OiB0aGlzLmJsb2NrLmhlaWdodCxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICB9KTtcblxuICAgIHNlZ21lbnRzLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICBzZWdtZW50cy5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuU2VnbWVudCwge1xuICAgICAgeDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIC8vIGNhbid0IGdvIGJleW9uZCB0aGUgZW5kIG9mIHRoZSB0cmFja1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLnRpbWUgPSBNYXRoLm1pbih2LCB0aW1lQ29udGV4dC5kdXJhdGlvbiAtIGQuZHVyYXRpb24pO1xuXG4gICAgICAgIHJldHVybiBkLnRpbWU7XG4gICAgICB9LFxuICAgICAgd2lkdGg6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLmR1cmF0aW9uID0gTWF0aC5taW4odiwgdGltZUNvbnRleHQuZHVyYXRpb24gLSBkLnRpbWUpO1xuXG4gICAgICAgIHJldHVybiBkLmR1cmF0aW9uO1xuICAgICAgfSxcbiAgICAgIHk6IGQgPT4gMCxcbiAgICAgIGhlaWdodDogZCA9PiAxLFxuICAgIH0sIHtcbiAgICAgIG9wYWNpdHk6IDAuMixcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGhhbmRsZXJXaWR0aDogMSxcbiAgICAgIGhhbmRsZXJPcGFjaXR5OiAwLjQsXG4gICAgICBkaXNwbGF5TGFiZWxzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgc2VnbWVudHMuc2V0QmVoYXZpb3IobmV3IHVpLmJlaGF2aW9ycy5TZWdtZW50QmVoYXZpb3IoKSk7XG4gICAgdHJhY2suYWRkKHNlZ21lbnRzKTtcblxuICAgIHRoaXMuX2xheWVyID0gc2VnbWVudHM7XG5cbiAgICB0aGlzLnBvc3RJbnN0YWxsKHRoaXMuX2xheWVyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWdtZW50TW9kdWxlO1xuIl19