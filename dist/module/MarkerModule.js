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

var parameters = {
  color: {
    type: 'string',
    default: 'green',
    constant: true
  }
};

/**
 * Fully editable module that display markers accroding to the given track config.
 *
 * Markers should be defined in the `markers` entry of the track configuration.
 * A marker is defined by a `time`, `label` and an optionnal `color`.
 *
 * @example
 * ```
 * [
 *   { time: 0.230, label: 'label-1' },
 *   { time: 1.480, label: 'label-2' },
 * ]
 * ```
 *
 * The module defines the following interactions:
 * - edit the marker position (`time`): mouse drag
 * - edit the `label`: double click on the label to edit it
 * - create a new marker: double click somewhere in the timeline
 * - delete a marker: keypess suppr
 *
 * @param {Object} options - Override default parameters
 * @param {String} color - Default color of the markers.
 */

var MarkerModule = function (_AbstractAnnotationMo) {
  (0, _inherits3.default)(MarkerModule, _AbstractAnnotationMo);

  function MarkerModule(options) {
    (0, _classCallCheck3.default)(this, MarkerModule);
    return (0, _possibleConstructorReturn3.default)(this, (MarkerModule.__proto__ || (0, _getPrototypeOf2.default)(MarkerModule)).call(this, parameters, options));
  }

  // return a new annotation datum
  // @note - should be modified if the data format changes


  (0, _createClass3.default)(MarkerModule, [{
    key: 'createNewAnnotationDatum',
    value: function createNewAnnotationDatum(time) {
      return {
        time: time,
        label: 'label'
      };
    }
  }, {
    key: 'install',
    value: function install() {
      var _this2 = this;

      (0, _get3.default)(MarkerModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(MarkerModule.prototype), 'install', this).call(this);

      var _block$ui = this.block.ui,
          timeContext = _block$ui.timeContext,
          track = _block$ui.track;


      var markers = new ui.core.Layer('collection', [], {
        height: this.block.height,
        zIndex: this.zIndex
      });

      markers.setTimeContext(timeContext);
      markers.configureShape(ui.shapes.Marker, {
        x: function x(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          if (v !== null) d.time = Math.min(v, timeContext.duration);

          return d.time;
        },
        label: function label(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          if (v !== null) d.label = v;

          return d.label;
        },
        color: function color(d) {
          return d.color || _this2.params.get('color');
        }
      }, {
        handlerWidth: 7,
        handlerHeight: 10,
        displayHandlers: true,
        displayLabels: true,
        opacity: 1
      });

      markers.setBehavior(new ui.behaviors.MarkerBehavior());

      track.add(markers);

      this._layer = markers;
      this.postInstall(this._layer);
    }
  }]);
  return MarkerModule;
}(_AbstractAnnotationModule2.default);

exports.default = MarkerModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hcmtlck1vZHVsZS5qcyJdLCJuYW1lcyI6WyJ1aSIsInBhcmFtZXRlcnMiLCJjb2xvciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJNYXJrZXJNb2R1bGUiLCJvcHRpb25zIiwidGltZSIsImxhYmVsIiwiYmxvY2siLCJ0aW1lQ29udGV4dCIsInRyYWNrIiwibWFya2VycyIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJNYXJrZXIiLCJ4IiwiZCIsInYiLCJNYXRoIiwibWluIiwiZHVyYXRpb24iLCJwYXJhbXMiLCJnZXQiLCJoYW5kbGVyV2lkdGgiLCJoYW5kbGVySGVpZ2h0IiwiZGlzcGxheUhhbmRsZXJzIiwiZGlzcGxheUxhYmVscyIsIm9wYWNpdHkiLCJzZXRCZWhhdmlvciIsImJlaGF2aW9ycyIsIk1hcmtlckJlaGF2aW9yIiwiYWRkIiwiX2xheWVyIiwicG9zdEluc3RhbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUdaLElBQU1DLGFBQWE7QUFDakJDLFNBQU87QUFDTEMsVUFBTSxRQUREO0FBRUxDLGFBQVMsT0FGSjtBQUdMQyxjQUFVO0FBSEw7QUFEVSxDQUFuQjs7QUFRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJNQyxZOzs7QUFDSix3QkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEsNklBQ2JOLFVBRGEsRUFDRE0sT0FEQztBQUVwQjs7QUFFRDtBQUNBOzs7Ozs2Q0FDeUJDLEksRUFBTTtBQUM3QixhQUFPO0FBQ0xBLGNBQU1BLElBREQ7QUFFTEMsZUFBTztBQUZGLE9BQVA7QUFJRDs7OzhCQUVTO0FBQUE7O0FBQ1I7O0FBRFEsc0JBR3VCLEtBQUtDLEtBQUwsQ0FBV1YsRUFIbEM7QUFBQSxVQUdBVyxXQUhBLGFBR0FBLFdBSEE7QUFBQSxVQUdhQyxLQUhiLGFBR2FBLEtBSGI7OztBQUtSLFVBQU1DLFVBQVUsSUFBSWIsR0FBR2MsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFlBQWxCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xEQyxnQkFBUSxLQUFLTixLQUFMLENBQVdNLE1BRCtCO0FBRWxEQyxnQkFBUSxLQUFLQTtBQUZxQyxPQUFwQyxDQUFoQjs7QUFLQUosY0FBUUssY0FBUixDQUF1QlAsV0FBdkI7QUFDQUUsY0FBUU0sY0FBUixDQUF1Qm5CLEdBQUdvQixNQUFILENBQVVDLE1BQWpDLEVBQXlDO0FBQ3ZDQyxXQUFHLFdBQUNDLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ2xCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFZixJQUFGLEdBQVNpQixLQUFLQyxHQUFMLENBQVNGLENBQVQsRUFBWWIsWUFBWWdCLFFBQXhCLENBQVQ7O0FBRUYsaUJBQU9KLEVBQUVmLElBQVQ7QUFDRCxTQU5zQztBQU92Q0MsZUFBTyxlQUFDYyxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUN0QixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWQsS0FBRixHQUFVZSxDQUFWOztBQUVGLGlCQUFPRCxFQUFFZCxLQUFUO0FBQ0QsU0Fac0M7QUFhdkNQLGVBQU8sZUFBQ3FCLENBQUQ7QUFBQSxpQkFBUUEsRUFBRXJCLEtBQUYsSUFBVyxPQUFLMEIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQW5CO0FBQUE7QUFiZ0MsT0FBekMsRUFjRztBQUNEQyxzQkFBYyxDQURiO0FBRURDLHVCQUFlLEVBRmQ7QUFHREMseUJBQWlCLElBSGhCO0FBSURDLHVCQUFlLElBSmQ7QUFLREMsaUJBQVM7QUFMUixPQWRIOztBQXNCQXJCLGNBQVFzQixXQUFSLENBQW9CLElBQUluQyxHQUFHb0MsU0FBSCxDQUFhQyxjQUFqQixFQUFwQjs7QUFFQXpCLFlBQU0wQixHQUFOLENBQVV6QixPQUFWOztBQUVBLFdBQUswQixNQUFMLEdBQWMxQixPQUFkO0FBQ0EsV0FBSzJCLFdBQUwsQ0FBaUIsS0FBS0QsTUFBdEI7QUFDRDs7Ozs7a0JBR1lqQyxZIiwiZmlsZSI6Ik1hcmtlck1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdEFubm90YXRpb25Nb2R1bGUgZnJvbSAnLi9BYnN0cmFjdEFubm90YXRpb25Nb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ2dyZWVuJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufTtcblxuLyoqXG4gKiBGdWxseSBlZGl0YWJsZSBtb2R1bGUgdGhhdCBkaXNwbGF5IG1hcmtlcnMgYWNjcm9kaW5nIHRvIHRoZSBnaXZlbiB0cmFjayBjb25maWcuXG4gKlxuICogTWFya2VycyBzaG91bGQgYmUgZGVmaW5lZCBpbiB0aGUgYG1hcmtlcnNgIGVudHJ5IG9mIHRoZSB0cmFjayBjb25maWd1cmF0aW9uLlxuICogQSBtYXJrZXIgaXMgZGVmaW5lZCBieSBhIGB0aW1lYCwgYGxhYmVsYCBhbmQgYW4gb3B0aW9ubmFsIGBjb2xvcmAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogW1xuICogICB7IHRpbWU6IDAuMjMwLCBsYWJlbDogJ2xhYmVsLTEnIH0sXG4gKiAgIHsgdGltZTogMS40ODAsIGxhYmVsOiAnbGFiZWwtMicgfSxcbiAqIF1cbiAqIGBgYFxuICpcbiAqIFRoZSBtb2R1bGUgZGVmaW5lcyB0aGUgZm9sbG93aW5nIGludGVyYWN0aW9uczpcbiAqIC0gZWRpdCB0aGUgbWFya2VyIHBvc2l0aW9uIChgdGltZWApOiBtb3VzZSBkcmFnXG4gKiAtIGVkaXQgdGhlIGBsYWJlbGA6IGRvdWJsZSBjbGljayBvbiB0aGUgbGFiZWwgdG8gZWRpdCBpdFxuICogLSBjcmVhdGUgYSBuZXcgbWFya2VyOiBkb3VibGUgY2xpY2sgc29tZXdoZXJlIGluIHRoZSB0aW1lbGluZVxuICogLSBkZWxldGUgYSBtYXJrZXI6IGtleXBlc3Mgc3VwcHJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIC0gRGVmYXVsdCBjb2xvciBvZiB0aGUgbWFya2Vycy5cbiAqL1xuY2xhc3MgTWFya2VyTW9kdWxlIGV4dGVuZHMgQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gcmV0dXJuIGEgbmV3IGFubm90YXRpb24gZGF0dW1cbiAgLy8gQG5vdGUgLSBzaG91bGQgYmUgbW9kaWZpZWQgaWYgdGhlIGRhdGEgZm9ybWF0IGNoYW5nZXNcbiAgY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtKHRpbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGltZTogdGltZSxcbiAgICAgIGxhYmVsOiAnbGFiZWwnLFxuICAgIH07XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIHN1cGVyLmluc3RhbGwoKTtcblxuICAgIGNvbnN0IHsgdGltZUNvbnRleHQsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgY29uc3QgbWFya2VycyA9IG5ldyB1aS5jb3JlLkxheWVyKCdjb2xsZWN0aW9uJywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgbWFya2Vycy5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgbWFya2Vycy5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuTWFya2VyLCB7XG4gICAgICB4OiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpXG4gICAgICAgICAgZC50aW1lID0gTWF0aC5taW4odiwgdGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgICAgIHJldHVybiBkLnRpbWU7XG4gICAgICB9LFxuICAgICAgbGFiZWw6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLmxhYmVsID0gdjtcblxuICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgIH0sXG4gICAgICBjb2xvcjogKGQpID0+IChkLmNvbG9yIHx8wqB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJykpLFxuICAgIH0sIHtcbiAgICAgIGhhbmRsZXJXaWR0aDogNyxcbiAgICAgIGhhbmRsZXJIZWlnaHQ6IDEwLFxuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgZGlzcGxheUxhYmVsczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgfSk7XG5cbiAgICBtYXJrZXJzLnNldEJlaGF2aW9yKG5ldyB1aS5iZWhhdmlvcnMuTWFya2VyQmVoYXZpb3IoKSk7XG5cbiAgICB0cmFjay5hZGQobWFya2Vycyk7XG5cbiAgICB0aGlzLl9sYXllciA9IG1hcmtlcnM7XG4gICAgdGhpcy5wb3N0SW5zdGFsbCh0aGlzLl9sYXllcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2VyTW9kdWxlO1xuIl19