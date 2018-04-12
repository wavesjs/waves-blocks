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

var Marker = function (_AbstractAnnotation) {
  (0, _inherits3.default)(Marker, _AbstractAnnotation);

  function Marker(options) {
    (0, _classCallCheck3.default)(this, Marker);
    return (0, _possibleConstructorReturn3.default)(this, (Marker.__proto__ || (0, _getPrototypeOf2.default)(Marker)).call(this, parameters, options));
  }

  // return a new annotation datum
  // @note - should be modified if the data format changes


  (0, _createClass3.default)(Marker, [{
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

      (0, _get3.default)(Marker.prototype.__proto__ || (0, _getPrototypeOf2.default)(Marker.prototype), 'install', this).call(this);

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
  return Marker;
}(_AbstractAnnotation3.default);

exports.default = Marker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiY29sb3IiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwiTWFya2VyIiwib3B0aW9ucyIsInRpbWUiLCJsYWJlbCIsImJsb2NrIiwidGltZUNvbnRleHQiLCJ0cmFjayIsIm1hcmtlcnMiLCJjb3JlIiwiTGF5ZXIiLCJoZWlnaHQiLCJ6SW5kZXgiLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic2hhcGVzIiwieCIsImQiLCJ2IiwiTWF0aCIsIm1pbiIsImR1cmF0aW9uIiwicGFyYW1zIiwiZ2V0IiwiaGFuZGxlcldpZHRoIiwiaGFuZGxlckhlaWdodCIsImRpc3BsYXlIYW5kbGVycyIsImRpc3BsYXlMYWJlbHMiLCJvcGFjaXR5Iiwic2V0QmVoYXZpb3IiLCJiZWhhdmlvcnMiLCJNYXJrZXJCZWhhdmlvciIsImFkZCIsIl9sYXllciIsInBvc3RJbnN0YWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWjtBQUNBLElBQU1DLGFBQWE7QUFDakJDLFNBQU87QUFDTEMsVUFBTSxRQUREO0FBRUxDLGFBQVMsT0FGSjtBQUdMQyxjQUFVO0FBSEw7QUFEVSxDQUFuQjs7QUFRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJNQyxNOzs7QUFDSixrQkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEsaUlBQ2JOLFVBRGEsRUFDRE0sT0FEQztBQUVwQjs7QUFFRDtBQUNBOzs7Ozs2Q0FDeUJDLEksRUFBTTtBQUM3QixhQUFPO0FBQ0xBLGNBQU1BLElBREQ7QUFFTEMsZUFBTztBQUZGLE9BQVA7QUFJRDs7OzhCQUVTO0FBQUE7O0FBQ1I7O0FBRFEsc0JBR3VCLEtBQUtDLEtBQUwsQ0FBV1YsRUFIbEM7QUFBQSxVQUdBVyxXQUhBLGFBR0FBLFdBSEE7QUFBQSxVQUdhQyxLQUhiLGFBR2FBLEtBSGI7OztBQUtSLFVBQU1DLFVBQVUsSUFBSWIsR0FBR2MsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFlBQWxCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xEQyxnQkFBUSxLQUFLTixLQUFMLENBQVdNLE1BRCtCO0FBRWxEQyxnQkFBUSxLQUFLQTtBQUZxQyxPQUFwQyxDQUFoQjs7QUFLQUosY0FBUUssY0FBUixDQUF1QlAsV0FBdkI7QUFDQUUsY0FBUU0sY0FBUixDQUF1Qm5CLEdBQUdvQixNQUFILENBQVVkLE1BQWpDLEVBQXlDO0FBQ3ZDZSxXQUFHLFdBQUNDLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ2xCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFZCxJQUFGLEdBQVNnQixLQUFLQyxHQUFMLENBQVNGLENBQVQsRUFBWVosWUFBWWUsUUFBeEIsQ0FBVDs7QUFFRixpQkFBT0osRUFBRWQsSUFBVDtBQUNELFNBTnNDO0FBT3ZDQyxlQUFPLGVBQUNhLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ3RCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFYixLQUFGLEdBQVVjLENBQVY7O0FBRUYsaUJBQU9ELEVBQUViLEtBQVQ7QUFDRCxTQVpzQztBQWF2Q1AsZUFBTyxlQUFDb0IsQ0FBRDtBQUFBLGlCQUFRQSxFQUFFcEIsS0FBRixJQUFXLE9BQUt5QixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBbkI7QUFBQTtBQWJnQyxPQUF6QyxFQWNHO0FBQ0RDLHNCQUFjLENBRGI7QUFFREMsdUJBQWUsRUFGZDtBQUdEQyx5QkFBaUIsSUFIaEI7QUFJREMsdUJBQWUsSUFKZDtBQUtEQyxpQkFBUztBQUxSLE9BZEg7O0FBc0JBcEIsY0FBUXFCLFdBQVIsQ0FBb0IsSUFBSWxDLEdBQUdtQyxTQUFILENBQWFDLGNBQWpCLEVBQXBCOztBQUVBeEIsWUFBTXlCLEdBQU4sQ0FBVXhCLE9BQVY7O0FBRUEsV0FBS3lCLE1BQUwsR0FBY3pCLE9BQWQ7QUFDQSxXQUFLMEIsV0FBTCxDQUFpQixLQUFLRCxNQUF0QjtBQUNEOzs7OztrQkFHWWhDLE0iLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdEFubm90YXRpb24gZnJvbSAnLi9BYnN0cmFjdEFubm90YXRpb24nO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG4vKiogQHByaXZhdGUgKi9cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ2dyZWVuJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufTtcblxuLyoqXG4gKiBGdWxseSBlZGl0YWJsZSBtb2R1bGUgdGhhdCBkaXNwbGF5IG1hcmtlcnMgYWNjcm9kaW5nIHRvIHRoZSBnaXZlbiB0cmFjayBjb25maWcuXG4gKlxuICogTWFya2VycyBzaG91bGQgYmUgZGVmaW5lZCBpbiB0aGUgYG1hcmtlcnNgIGVudHJ5IG9mIHRoZSB0cmFjayBjb25maWd1cmF0aW9uLlxuICogQSBtYXJrZXIgaXMgZGVmaW5lZCBieSBhIGB0aW1lYCwgYGxhYmVsYCBhbmQgYW4gb3B0aW9ubmFsIGBjb2xvcmAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogW1xuICogICB7IHRpbWU6IDAuMjMwLCBsYWJlbDogJ2xhYmVsLTEnIH0sXG4gKiAgIHsgdGltZTogMS40ODAsIGxhYmVsOiAnbGFiZWwtMicgfSxcbiAqIF1cbiAqIGBgYFxuICpcbiAqIFRoZSBtb2R1bGUgZGVmaW5lcyB0aGUgZm9sbG93aW5nIGludGVyYWN0aW9uczpcbiAqIC0gZWRpdCB0aGUgbWFya2VyIHBvc2l0aW9uIChgdGltZWApOiBtb3VzZSBkcmFnXG4gKiAtIGVkaXQgdGhlIGBsYWJlbGA6IGRvdWJsZSBjbGljayBvbiB0aGUgbGFiZWwgdG8gZWRpdCBpdFxuICogLSBjcmVhdGUgYSBuZXcgbWFya2VyOiBkb3VibGUgY2xpY2sgc29tZXdoZXJlIGluIHRoZSB0aW1lbGluZVxuICogLSBkZWxldGUgYSBtYXJrZXI6IGtleXBlc3Mgc3VwcHJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIC0gRGVmYXVsdCBjb2xvciBvZiB0aGUgbWFya2Vycy5cbiAqL1xuY2xhc3MgTWFya2VyIGV4dGVuZHMgQWJzdHJhY3RBbm5vdGF0aW9uIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gcmV0dXJuIGEgbmV3IGFubm90YXRpb24gZGF0dW1cbiAgLy8gQG5vdGUgLSBzaG91bGQgYmUgbW9kaWZpZWQgaWYgdGhlIGRhdGEgZm9ybWF0IGNoYW5nZXNcbiAgY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtKHRpbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGltZTogdGltZSxcbiAgICAgIGxhYmVsOiAnbGFiZWwnLFxuICAgIH07XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIHN1cGVyLmluc3RhbGwoKTtcblxuICAgIGNvbnN0IHsgdGltZUNvbnRleHQsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgY29uc3QgbWFya2VycyA9IG5ldyB1aS5jb3JlLkxheWVyKCdjb2xsZWN0aW9uJywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgbWFya2Vycy5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgbWFya2Vycy5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuTWFya2VyLCB7XG4gICAgICB4OiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpXG4gICAgICAgICAgZC50aW1lID0gTWF0aC5taW4odiwgdGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgICAgIHJldHVybiBkLnRpbWU7XG4gICAgICB9LFxuICAgICAgbGFiZWw6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLmxhYmVsID0gdjtcblxuICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgIH0sXG4gICAgICBjb2xvcjogKGQpID0+IChkLmNvbG9yIHx8wqB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJykpLFxuICAgIH0sIHtcbiAgICAgIGhhbmRsZXJXaWR0aDogNyxcbiAgICAgIGhhbmRsZXJIZWlnaHQ6IDEwLFxuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgZGlzcGxheUxhYmVsczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgfSk7XG5cbiAgICBtYXJrZXJzLnNldEJlaGF2aW9yKG5ldyB1aS5iZWhhdmlvcnMuTWFya2VyQmVoYXZpb3IoKSk7XG5cbiAgICB0cmFjay5hZGQobWFya2Vycyk7XG5cbiAgICB0aGlzLl9sYXllciA9IG1hcmtlcnM7XG4gICAgdGhpcy5wb3N0SW5zdGFsbCh0aGlzLl9sYXllcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2VyO1xuIl19