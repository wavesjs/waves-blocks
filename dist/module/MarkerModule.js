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
    value: function install(block) {
      var _this2 = this;

      (0, _get3.default)(MarkerModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(MarkerModule.prototype), 'install', this).call(this, block);

      var _block$ui = block.ui,
          timeContext = _block$ui.timeContext,
          track = _block$ui.track;


      var markers = new ui.core.Layer('collection', [], {
        height: block.height
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwicGFyYW1ldGVycyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIk1hcmtlck1vZHVsZSIsIm9wdGlvbnMiLCJ0aW1lIiwibGFiZWwiLCJibG9jayIsInRpbWVDb250ZXh0IiwidHJhY2siLCJtYXJrZXJzIiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIk1hcmtlciIsIngiLCJkIiwidiIsIk1hdGgiLCJtaW4iLCJkdXJhdGlvbiIsInBhcmFtcyIsImdldCIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJIZWlnaHQiLCJkaXNwbGF5SGFuZGxlcnMiLCJkaXNwbGF5TGFiZWxzIiwib3BhY2l0eSIsInNldEJlaGF2aW9yIiwiYmVoYXZpb3JzIiwiTWFya2VyQmVoYXZpb3IiLCJhZGQiLCJfbGF5ZXIiLCJwb3N0SW5zdGFsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7SUFBWUEsRTs7Ozs7O0FBR1osSUFBTUMsYUFBYTtBQUNqQkMsU0FBTztBQUNMQyxVQUFNLFFBREQ7QUFFTEMsYUFBUyxPQUZKO0FBR0xDLGNBQVU7QUFITDtBQURVLENBQW5COztBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF1Qk1DLFk7OztBQUNKLHdCQUFZQyxPQUFaLEVBQXFCO0FBQUE7QUFBQSw2SUFDYk4sVUFEYSxFQUNETSxPQURDO0FBRXBCOzs7OzZDQUV3QkMsSSxFQUFNO0FBQzdCLGFBQU87QUFDTEEsY0FBTUEsSUFERDtBQUVMQyxlQUFPO0FBRkYsT0FBUDtBQUlEOzs7NEJBRU9DLEssRUFBTztBQUFBOztBQUNiLGdKQUFjQSxLQUFkOztBQURhLHNCQUdrQkEsTUFBTVYsRUFIeEI7QUFBQSxVQUdMVyxXQUhLLGFBR0xBLFdBSEs7QUFBQSxVQUdRQyxLQUhSLGFBR1FBLEtBSFI7OztBQUtiLFVBQU1DLFVBQVUsSUFBSWIsR0FBR2MsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFlBQWxCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xEQyxnQkFBUU4sTUFBTU07QUFEb0MsT0FBcEMsQ0FBaEI7O0FBSUFILGNBQVFJLGNBQVIsQ0FBdUJOLFdBQXZCO0FBQ0FFLGNBQVFLLGNBQVIsQ0FBdUJsQixHQUFHbUIsTUFBSCxDQUFVQyxNQUFqQyxFQUF5QztBQUN2Q0MsV0FBRyxXQUFDQyxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUNsQixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWQsSUFBRixHQUFTZ0IsS0FBS0MsR0FBTCxDQUFTRixDQUFULEVBQVlaLFlBQVllLFFBQXhCLENBQVQ7O0FBRUYsaUJBQU9KLEVBQUVkLElBQVQ7QUFDRCxTQU5zQztBQU92Q0MsZUFBTyxlQUFDYSxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUN0QixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWIsS0FBRixHQUFVYyxDQUFWOztBQUVGLGlCQUFPRCxFQUFFYixLQUFUO0FBQ0QsU0Fac0M7QUFhdkNQLGVBQU8sZUFBQ29CLENBQUQ7QUFBQSxpQkFBUUEsRUFBRXBCLEtBQUYsSUFBVyxPQUFLeUIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQW5CO0FBQUE7QUFiZ0MsT0FBekMsRUFjRztBQUNEQyxzQkFBYyxDQURiO0FBRURDLHVCQUFlLEVBRmQ7QUFHREMseUJBQWlCLElBSGhCO0FBSURDLHVCQUFlLElBSmQ7QUFLREMsaUJBQVM7QUFMUixPQWRIOztBQXNCQXBCLGNBQVFxQixXQUFSLENBQW9CLElBQUlsQyxHQUFHbUMsU0FBSCxDQUFhQyxjQUFqQixFQUFwQjs7QUFFQXhCLFlBQU15QixHQUFOLENBQVV4QixPQUFWOztBQUVBLFdBQUt5QixNQUFMLEdBQWN6QixPQUFkO0FBQ0EsV0FBSzBCLFdBQUwsQ0FBaUIsS0FBS0QsTUFBdEI7QUFDRDs7Ozs7a0JBR1loQyxZIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSBmcm9tICcuL0Fic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cblxuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnZ3JlZW4nLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9XG59O1xuXG4vKipcbiAqIEZ1bGx5IGVkaXRhYmxlIG1vZHVsZSB0aGF0IGRpc3BsYXkgbWFya2VycyBhY2Nyb2RpbmcgdG8gdGhlIGdpdmVuIHRyYWNrIGNvbmZpZy5cbiAqXG4gKiBNYXJrZXJzIHNob3VsZCBiZSBkZWZpbmVkIGluIHRoZSBgbWFya2Vyc2AgZW50cnkgb2YgdGhlIHRyYWNrIGNvbmZpZ3VyYXRpb24uXG4gKiBBIG1hcmtlciBpcyBkZWZpbmVkIGJ5IGEgYHRpbWVgLCBgbGFiZWxgIGFuZCBhbiBvcHRpb25uYWwgYGNvbG9yYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiBbXG4gKiAgIHsgdGltZTogMC4yMzAsIGxhYmVsOiAnbGFiZWwtMScgfSxcbiAqICAgeyB0aW1lOiAxLjQ4MCwgbGFiZWw6ICdsYWJlbC0yJyB9LFxuICogXVxuICogYGBgXG4gKlxuICogVGhlIG1vZHVsZSBkZWZpbmVzIHRoZSBmb2xsb3dpbmcgaW50ZXJhY3Rpb25zOlxuICogLSBlZGl0IHRoZSBtYXJrZXIgcG9zaXRpb24gKGB0aW1lYCk6IG1vdXNlIGRyYWdcbiAqIC0gZWRpdCB0aGUgYGxhYmVsYDogZG91YmxlIGNsaWNrIG9uIHRoZSBsYWJlbCB0byBlZGl0IGl0XG4gKiAtIGNyZWF0ZSBhIG5ldyBtYXJrZXI6IGRvdWJsZSBjbGljayBzb21ld2hlcmUgaW4gdGhlIHRpbWVsaW5lXG4gKiAtIGRlbGV0ZSBhIG1hcmtlcjoga2V5cGVzcyBzdXBwclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgLSBEZWZhdWx0IGNvbG9yIG9mIHRoZSBtYXJrZXJzLlxuICovXG5jbGFzcyBNYXJrZXJNb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdEFubm90YXRpb25Nb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gIH1cblxuICBjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0odGltZSkge1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiB0aW1lLFxuICAgICAgbGFiZWw6ICdsYWJlbCcsXG4gICAgfTtcbiAgfVxuXG4gIGluc3RhbGwoYmxvY2spIHtcbiAgICBzdXBlci5pbnN0YWxsKGJsb2NrKTtcblxuICAgIGNvbnN0IHsgdGltZUNvbnRleHQsIHRyYWNrIH0gPSBibG9jay51aTtcblxuICAgIGNvbnN0IG1hcmtlcnMgPSBuZXcgdWkuY29yZS5MYXllcignY29sbGVjdGlvbicsIFtdLCB7XG4gICAgICBoZWlnaHQ6IGJsb2NrLmhlaWdodCxcbiAgICB9KTtcblxuICAgIG1hcmtlcnMuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIG1hcmtlcnMuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLk1hcmtlciwge1xuICAgICAgeDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQudGltZSA9IE1hdGgubWluKHYsIHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgICAgICByZXR1cm4gZC50aW1lO1xuICAgICAgfSxcbiAgICAgIGxhYmVsOiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpXG4gICAgICAgICAgZC5sYWJlbCA9IHY7XG5cbiAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICB9LFxuICAgICAgY29sb3I6IChkKSA9PiAoZC5jb2xvciB8fMKgdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpKSxcbiAgICB9LCB7XG4gICAgICBoYW5kbGVyV2lkdGg6IDcsXG4gICAgICBoYW5kbGVySGVpZ2h0OiAxMCxcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGRpc3BsYXlMYWJlbHM6IHRydWUsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgIH0pO1xuXG4gICAgbWFya2Vycy5zZXRCZWhhdmlvcihuZXcgdWkuYmVoYXZpb3JzLk1hcmtlckJlaGF2aW9yKCkpO1xuXG4gICAgdHJhY2suYWRkKG1hcmtlcnMpO1xuXG4gICAgdGhpcy5fbGF5ZXIgPSBtYXJrZXJzO1xuICAgIHRoaXMucG9zdEluc3RhbGwodGhpcy5fbGF5ZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcmtlck1vZHVsZTtcbiJdfQ==