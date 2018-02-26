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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJwYXJhbWV0ZXJzIiwiY29sb3IiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwiTWFya2VyIiwib3B0aW9ucyIsInRpbWUiLCJsYWJlbCIsImJsb2NrIiwidGltZUNvbnRleHQiLCJ0cmFjayIsIm1hcmtlcnMiLCJjb3JlIiwiTGF5ZXIiLCJoZWlnaHQiLCJ6SW5kZXgiLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic2hhcGVzIiwieCIsImQiLCJ2IiwiTWF0aCIsIm1pbiIsImR1cmF0aW9uIiwicGFyYW1zIiwiZ2V0IiwiaGFuZGxlcldpZHRoIiwiaGFuZGxlckhlaWdodCIsImRpc3BsYXlIYW5kbGVycyIsImRpc3BsYXlMYWJlbHMiLCJvcGFjaXR5Iiwic2V0QmVoYXZpb3IiLCJiZWhhdmlvcnMiLCJNYXJrZXJCZWhhdmlvciIsImFkZCIsIl9sYXllciIsInBvc3RJbnN0YWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFHWixJQUFNQyxhQUFhO0FBQ2pCQyxTQUFPO0FBQ0xDLFVBQU0sUUFERDtBQUVMQyxhQUFTLE9BRko7QUFHTEMsY0FBVTtBQUhMO0FBRFUsQ0FBbkI7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCTUMsTTs7O0FBQ0osa0JBQVlDLE9BQVosRUFBcUI7QUFBQTtBQUFBLGlJQUNiTixVQURhLEVBQ0RNLE9BREM7QUFFcEI7O0FBRUQ7QUFDQTs7Ozs7NkNBQ3lCQyxJLEVBQU07QUFDN0IsYUFBTztBQUNMQSxjQUFNQSxJQUREO0FBRUxDLGVBQU87QUFGRixPQUFQO0FBSUQ7Ozs4QkFFUztBQUFBOztBQUNSOztBQURRLHNCQUd1QixLQUFLQyxLQUFMLENBQVdWLEVBSGxDO0FBQUEsVUFHQVcsV0FIQSxhQUdBQSxXQUhBO0FBQUEsVUFHYUMsS0FIYixhQUdhQSxLQUhiOzs7QUFLUixVQUFNQyxVQUFVLElBQUliLEdBQUdjLElBQUgsQ0FBUUMsS0FBWixDQUFrQixZQUFsQixFQUFnQyxFQUFoQyxFQUFvQztBQUNsREMsZ0JBQVEsS0FBS04sS0FBTCxDQUFXTSxNQUQrQjtBQUVsREMsZ0JBQVEsS0FBS0E7QUFGcUMsT0FBcEMsQ0FBaEI7O0FBS0FKLGNBQVFLLGNBQVIsQ0FBdUJQLFdBQXZCO0FBQ0FFLGNBQVFNLGNBQVIsQ0FBdUJuQixHQUFHb0IsTUFBSCxDQUFVZCxNQUFqQyxFQUF5QztBQUN2Q2UsV0FBRyxXQUFDQyxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUNsQixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWQsSUFBRixHQUFTZ0IsS0FBS0MsR0FBTCxDQUFTRixDQUFULEVBQVlaLFlBQVllLFFBQXhCLENBQVQ7O0FBRUYsaUJBQU9KLEVBQUVkLElBQVQ7QUFDRCxTQU5zQztBQU92Q0MsZUFBTyxlQUFDYSxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUN0QixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRWIsS0FBRixHQUFVYyxDQUFWOztBQUVGLGlCQUFPRCxFQUFFYixLQUFUO0FBQ0QsU0Fac0M7QUFhdkNQLGVBQU8sZUFBQ29CLENBQUQ7QUFBQSxpQkFBUUEsRUFBRXBCLEtBQUYsSUFBVyxPQUFLeUIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQW5CO0FBQUE7QUFiZ0MsT0FBekMsRUFjRztBQUNEQyxzQkFBYyxDQURiO0FBRURDLHVCQUFlLEVBRmQ7QUFHREMseUJBQWlCLElBSGhCO0FBSURDLHVCQUFlLElBSmQ7QUFLREMsaUJBQVM7QUFMUixPQWRIOztBQXNCQXBCLGNBQVFxQixXQUFSLENBQW9CLElBQUlsQyxHQUFHbUMsU0FBSCxDQUFhQyxjQUFqQixFQUFwQjs7QUFFQXhCLFlBQU15QixHQUFOLENBQVV4QixPQUFWOztBQUVBLFdBQUt5QixNQUFMLEdBQWN6QixPQUFkO0FBQ0EsV0FBSzBCLFdBQUwsQ0FBaUIsS0FBS0QsTUFBdEI7QUFDRDs7Ozs7a0JBR1loQyxNIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RBbm5vdGF0aW9uIGZyb20gJy4vQWJzdHJhY3RBbm5vdGF0aW9uJztcbmltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcblxuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdncmVlbicsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn07XG5cbi8qKlxuICogRnVsbHkgZWRpdGFibGUgbW9kdWxlIHRoYXQgZGlzcGxheSBtYXJrZXJzIGFjY3JvZGluZyB0byB0aGUgZ2l2ZW4gdHJhY2sgY29uZmlnLlxuICpcbiAqIE1hcmtlcnMgc2hvdWxkIGJlIGRlZmluZWQgaW4gdGhlIGBtYXJrZXJzYCBlbnRyeSBvZiB0aGUgdHJhY2sgY29uZmlndXJhdGlvbi5cbiAqIEEgbWFya2VyIGlzIGRlZmluZWQgYnkgYSBgdGltZWAsIGBsYWJlbGAgYW5kIGFuIG9wdGlvbm5hbCBgY29sb3JgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIFtcbiAqICAgeyB0aW1lOiAwLjIzMCwgbGFiZWw6ICdsYWJlbC0xJyB9LFxuICogICB7IHRpbWU6IDEuNDgwLCBsYWJlbDogJ2xhYmVsLTInIH0sXG4gKiBdXG4gKiBgYGBcbiAqXG4gKiBUaGUgbW9kdWxlIGRlZmluZXMgdGhlIGZvbGxvd2luZyBpbnRlcmFjdGlvbnM6XG4gKiAtIGVkaXQgdGhlIG1hcmtlciBwb3NpdGlvbiAoYHRpbWVgKTogbW91c2UgZHJhZ1xuICogLSBlZGl0IHRoZSBgbGFiZWxgOiBkb3VibGUgY2xpY2sgb24gdGhlIGxhYmVsIHRvIGVkaXQgaXRcbiAqIC0gY3JlYXRlIGEgbmV3IG1hcmtlcjogZG91YmxlIGNsaWNrIHNvbWV3aGVyZSBpbiB0aGUgdGltZWxpbmVcbiAqIC0gZGVsZXRlIGEgbWFya2VyOiBrZXlwZXNzIHN1cHByXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciAtIERlZmF1bHQgY29sb3Igb2YgdGhlIG1hcmtlcnMuXG4gKi9cbmNsYXNzIE1hcmtlciBleHRlbmRzIEFic3RyYWN0QW5ub3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8vIHJldHVybiBhIG5ldyBhbm5vdGF0aW9uIGRhdHVtXG4gIC8vIEBub3RlIC0gc2hvdWxkIGJlIG1vZGlmaWVkIGlmIHRoZSBkYXRhIGZvcm1hdCBjaGFuZ2VzXG4gIGNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bSh0aW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWU6IHRpbWUsXG4gICAgICBsYWJlbDogJ2xhYmVsJyxcbiAgICB9O1xuICB9XG5cbiAgaW5zdGFsbCgpIHtcbiAgICBzdXBlci5pbnN0YWxsKCk7XG5cbiAgICBjb25zdCB7IHRpbWVDb250ZXh0LCB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIGNvbnN0IG1hcmtlcnMgPSBuZXcgdWkuY29yZS5MYXllcignY29sbGVjdGlvbicsIFtdLCB7XG4gICAgICBoZWlnaHQ6IHRoaXMuYmxvY2suaGVpZ2h0LFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIG1hcmtlcnMuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIG1hcmtlcnMuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLk1hcmtlciwge1xuICAgICAgeDogKGQsIHYgPSBudWxsKSA9PiB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKVxuICAgICAgICAgIGQudGltZSA9IE1hdGgubWluKHYsIHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgICAgICByZXR1cm4gZC50aW1lO1xuICAgICAgfSxcbiAgICAgIGxhYmVsOiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpXG4gICAgICAgICAgZC5sYWJlbCA9IHY7XG5cbiAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICB9LFxuICAgICAgY29sb3I6IChkKSA9PiAoZC5jb2xvciB8fMKgdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpKSxcbiAgICB9LCB7XG4gICAgICBoYW5kbGVyV2lkdGg6IDcsXG4gICAgICBoYW5kbGVySGVpZ2h0OiAxMCxcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGRpc3BsYXlMYWJlbHM6IHRydWUsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgIH0pO1xuXG4gICAgbWFya2Vycy5zZXRCZWhhdmlvcihuZXcgdWkuYmVoYXZpb3JzLk1hcmtlckJlaGF2aW9yKCkpO1xuXG4gICAgdHJhY2suYWRkKG1hcmtlcnMpO1xuXG4gICAgdGhpcy5fbGF5ZXIgPSBtYXJrZXJzO1xuICAgIHRoaXMucG9zdEluc3RhbGwodGhpcy5fbGF5ZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcmtlcjtcbiJdfQ==