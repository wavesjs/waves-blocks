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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hcmtlci5qcyJdLCJuYW1lcyI6WyJ1aSIsInBhcmFtZXRlcnMiLCJjb2xvciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJNYXJrZXIiLCJvcHRpb25zIiwidGltZSIsImxhYmVsIiwiYmxvY2siLCJ0aW1lQ29udGV4dCIsInRyYWNrIiwibWFya2VycyIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJ4IiwiZCIsInYiLCJNYXRoIiwibWluIiwiZHVyYXRpb24iLCJwYXJhbXMiLCJnZXQiLCJoYW5kbGVyV2lkdGgiLCJoYW5kbGVySGVpZ2h0IiwiZGlzcGxheUhhbmRsZXJzIiwiZGlzcGxheUxhYmVscyIsIm9wYWNpdHkiLCJzZXRCZWhhdmlvciIsImJlaGF2aW9ycyIsIk1hcmtlckJlaGF2aW9yIiwiYWRkIiwiX2xheWVyIiwicG9zdEluc3RhbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUdaLElBQU1DLGFBQWE7QUFDakJDLFNBQU87QUFDTEMsVUFBTSxRQUREO0FBRUxDLGFBQVMsT0FGSjtBQUdMQyxjQUFVO0FBSEw7QUFEVSxDQUFuQjs7QUFRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJNQyxNOzs7QUFDSixrQkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEsaUlBQ2JOLFVBRGEsRUFDRE0sT0FEQztBQUVwQjs7QUFFRDtBQUNBOzs7Ozs2Q0FDeUJDLEksRUFBTTtBQUM3QixhQUFPO0FBQ0xBLGNBQU1BLElBREQ7QUFFTEMsZUFBTztBQUZGLE9BQVA7QUFJRDs7OzhCQUVTO0FBQUE7O0FBQ1I7O0FBRFEsc0JBR3VCLEtBQUtDLEtBQUwsQ0FBV1YsRUFIbEM7QUFBQSxVQUdBVyxXQUhBLGFBR0FBLFdBSEE7QUFBQSxVQUdhQyxLQUhiLGFBR2FBLEtBSGI7OztBQUtSLFVBQU1DLFVBQVUsSUFBSWIsR0FBR2MsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFlBQWxCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xEQyxnQkFBUSxLQUFLTixLQUFMLENBQVdNLE1BRCtCO0FBRWxEQyxnQkFBUSxLQUFLQTtBQUZxQyxPQUFwQyxDQUFoQjs7QUFLQUosY0FBUUssY0FBUixDQUF1QlAsV0FBdkI7QUFDQUUsY0FBUU0sY0FBUixDQUF1Qm5CLEdBQUdvQixNQUFILENBQVVkLE1BQWpDLEVBQXlDO0FBQ3ZDZSxXQUFHLFdBQUNDLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ2xCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFZCxJQUFGLEdBQVNnQixLQUFLQyxHQUFMLENBQVNGLENBQVQsRUFBWVosWUFBWWUsUUFBeEIsQ0FBVDs7QUFFRixpQkFBT0osRUFBRWQsSUFBVDtBQUNELFNBTnNDO0FBT3ZDQyxlQUFPLGVBQUNhLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ3RCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFYixLQUFGLEdBQVVjLENBQVY7O0FBRUYsaUJBQU9ELEVBQUViLEtBQVQ7QUFDRCxTQVpzQztBQWF2Q1AsZUFBTyxlQUFDb0IsQ0FBRDtBQUFBLGlCQUFRQSxFQUFFcEIsS0FBRixJQUFXLE9BQUt5QixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBbkI7QUFBQTtBQWJnQyxPQUF6QyxFQWNHO0FBQ0RDLHNCQUFjLENBRGI7QUFFREMsdUJBQWUsRUFGZDtBQUdEQyx5QkFBaUIsSUFIaEI7QUFJREMsdUJBQWUsSUFKZDtBQUtEQyxpQkFBUztBQUxSLE9BZEg7O0FBc0JBcEIsY0FBUXFCLFdBQVIsQ0FBb0IsSUFBSWxDLEdBQUdtQyxTQUFILENBQWFDLGNBQWpCLEVBQXBCOztBQUVBeEIsWUFBTXlCLEdBQU4sQ0FBVXhCLE9BQVY7O0FBRUEsV0FBS3lCLE1BQUwsR0FBY3pCLE9BQWQ7QUFDQSxXQUFLMEIsV0FBTCxDQUFpQixLQUFLRCxNQUF0QjtBQUNEOzs7OztrQkFHWWhDLE0iLCJmaWxlIjoiTWFya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0QW5ub3RhdGlvbiBmcm9tICcuL0Fic3RyYWN0QW5ub3RhdGlvbic7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cblxuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnZ3JlZW4nLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9XG59O1xuXG4vKipcbiAqIEZ1bGx5IGVkaXRhYmxlIG1vZHVsZSB0aGF0IGRpc3BsYXkgbWFya2VycyBhY2Nyb2RpbmcgdG8gdGhlIGdpdmVuIHRyYWNrIGNvbmZpZy5cbiAqXG4gKiBNYXJrZXJzIHNob3VsZCBiZSBkZWZpbmVkIGluIHRoZSBgbWFya2Vyc2AgZW50cnkgb2YgdGhlIHRyYWNrIGNvbmZpZ3VyYXRpb24uXG4gKiBBIG1hcmtlciBpcyBkZWZpbmVkIGJ5IGEgYHRpbWVgLCBgbGFiZWxgIGFuZCBhbiBvcHRpb25uYWwgYGNvbG9yYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiBbXG4gKiAgIHsgdGltZTogMC4yMzAsIGxhYmVsOiAnbGFiZWwtMScgfSxcbiAqICAgeyB0aW1lOiAxLjQ4MCwgbGFiZWw6ICdsYWJlbC0yJyB9LFxuICogXVxuICogYGBgXG4gKlxuICogVGhlIG1vZHVsZSBkZWZpbmVzIHRoZSBmb2xsb3dpbmcgaW50ZXJhY3Rpb25zOlxuICogLSBlZGl0IHRoZSBtYXJrZXIgcG9zaXRpb24gKGB0aW1lYCk6IG1vdXNlIGRyYWdcbiAqIC0gZWRpdCB0aGUgYGxhYmVsYDogZG91YmxlIGNsaWNrIG9uIHRoZSBsYWJlbCB0byBlZGl0IGl0XG4gKiAtIGNyZWF0ZSBhIG5ldyBtYXJrZXI6IGRvdWJsZSBjbGljayBzb21ld2hlcmUgaW4gdGhlIHRpbWVsaW5lXG4gKiAtIGRlbGV0ZSBhIG1hcmtlcjoga2V5cGVzcyBzdXBwclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgLSBEZWZhdWx0IGNvbG9yIG9mIHRoZSBtYXJrZXJzLlxuICovXG5jbGFzcyBNYXJrZXIgZXh0ZW5kcyBBYnN0cmFjdEFubm90YXRpb24ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gIH1cblxuICAvLyByZXR1cm4gYSBuZXcgYW5ub3RhdGlvbiBkYXR1bVxuICAvLyBAbm90ZSAtIHNob3VsZCBiZSBtb2RpZmllZCBpZiB0aGUgZGF0YSBmb3JtYXQgY2hhbmdlc1xuICBjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0odGltZSkge1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiB0aW1lLFxuICAgICAgbGFiZWw6ICdsYWJlbCcsXG4gICAgfTtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgc3VwZXIuaW5zdGFsbCgpO1xuXG4gICAgY29uc3QgeyB0aW1lQ29udGV4dCwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICBjb25zdCBtYXJrZXJzID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2NvbGxlY3Rpb24nLCBbXSwge1xuICAgICAgaGVpZ2h0OiB0aGlzLmJsb2NrLmhlaWdodCxcbiAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgfSk7XG5cbiAgICBtYXJrZXJzLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICBtYXJrZXJzLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5NYXJrZXIsIHtcbiAgICAgIHg6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLnRpbWUgPSBNYXRoLm1pbih2LCB0aW1lQ29udGV4dC5kdXJhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIGQudGltZTtcbiAgICAgIH0sXG4gICAgICBsYWJlbDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQubGFiZWwgPSB2O1xuXG4gICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgfSxcbiAgICAgIGNvbG9yOiAoZCkgPT4gKGQuY29sb3IgfHzCoHRoaXMucGFyYW1zLmdldCgnY29sb3InKSksXG4gICAgfSwge1xuICAgICAgaGFuZGxlcldpZHRoOiA3LFxuICAgICAgaGFuZGxlckhlaWdodDogMTAsXG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IHRydWUsXG4gICAgICBkaXNwbGF5TGFiZWxzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICB9KTtcblxuICAgIG1hcmtlcnMuc2V0QmVoYXZpb3IobmV3IHVpLmJlaGF2aW9ycy5NYXJrZXJCZWhhdmlvcigpKTtcblxuICAgIHRyYWNrLmFkZChtYXJrZXJzKTtcblxuICAgIHRoaXMuX2xheWVyID0gbWFya2VycztcbiAgICB0aGlzLnBvc3RJbnN0YWxsKHRoaXMuX2xheWVyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXJrZXI7XG4iXX0=