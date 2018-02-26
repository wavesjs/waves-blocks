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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

var _AbstractModule2 = require('../core/AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  downbeatColor: {
    type: 'string',
    default: 'red',
    metas: {
      desc: 'Color of a downbeat (`measure === true`)'
    }
  },
  upbeatColor: {
    type: 'string',
    default: 'orange',
    metas: {
      desc: 'Color of an upbeat (`measure === false`)'
    }
  }
};

var BeatGrid = function (_AbstractModule) {
  (0, _inherits3.default)(BeatGrid, _AbstractModule);

  function BeatGrid(options) {
    (0, _classCallCheck3.default)(this, BeatGrid);
    return (0, _possibleConstructorReturn3.default)(this, (BeatGrid.__proto__ || (0, _getPrototypeOf2.default)(BeatGrid)).call(this, definitions, options));
  }

  (0, _createClass3.default)(BeatGrid, [{
    key: 'install',
    value: function install() {
      var _block$ui = this.block.ui,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;


      this._beats = new ui.core.Layer('collection', [], {
        height: this.block.height,
        zIndex: this.zIndex
      });

      var downbeatColor = this.params.get('downbeatColor');
      var upbeatColor = this.params.get('upbeatColor');

      this._beats.setTimeContext(timeContext);
      this._beats.configureShape(ui.shapes.Marker, {
        x: function x(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          if (v !== null) d.time = v;

          return d.time;
        },
        color: function color(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          return d.measure === true ? downbeatColor : upbeatColor;
        }
      }, {
        displayHandlers: false,
        displayLabels: false
      });

      track.add(this._beats);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      var track = this.block.ui.track;

      track.remove(this._beats);
    }
  }, {
    key: 'setTrack',
    value: function setTrack(data, metadata) {
      if (!metadata.beats) throw new Error('Invalid metadata for module BeatGrid, should contain a `beats` property');

      this._beats.data = metadata.beats;
    }

    /**
     * shift the beats with certain dt
     */

  }, {
    key: 'shift',
    value: function shift(dt) {
      var beats = this.block.metadata.beats;


      for (var i = 0; i < beats.length; i++) {
        beats[i].time += dt;
      }this._beats.update();
      this.block.snap();
    }
  }]);
  return BeatGrid;
}(_AbstractModule3.default);

exports.default = BeatGrid;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJlYXRHcmlkLmpzIl0sIm5hbWVzIjpbInVpIiwiZGVmaW5pdGlvbnMiLCJkb3duYmVhdENvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImRlc2MiLCJ1cGJlYXRDb2xvciIsIkJlYXRHcmlkIiwib3B0aW9ucyIsImJsb2NrIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsIl9iZWF0cyIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInpJbmRleCIsInBhcmFtcyIsImdldCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJNYXJrZXIiLCJ4IiwiZCIsInYiLCJ0aW1lIiwiY29sb3IiLCJtZWFzdXJlIiwiZGlzcGxheUhhbmRsZXJzIiwiZGlzcGxheUxhYmVscyIsImFkZCIsInJlbW92ZSIsImRhdGEiLCJtZXRhZGF0YSIsImJlYXRzIiwiRXJyb3IiLCJkdCIsImkiLCJsZW5ndGgiLCJ1cGRhdGUiLCJzbmFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxFOztBQUNaOzs7Ozs7OztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLGlCQUFlO0FBQ2JDLFVBQU0sUUFETztBQUViQyxhQUFTLEtBRkk7QUFHYkMsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFITSxHQURHO0FBUWxCQyxlQUFhO0FBQ1hKLFVBQU0sUUFESztBQUVYQyxhQUFTLFFBRkU7QUFHWEMsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFISTtBQVJLLENBQXBCOztJQWlCTUUsUTs7O0FBQ0osb0JBQVlDLE9BQVosRUFBcUI7QUFBQTtBQUFBLHFJQUNiUixXQURhLEVBQ0FRLE9BREE7QUFFcEI7Ozs7OEJBRVM7QUFBQSxzQkFDdUIsS0FBS0MsS0FBTCxDQUFXVixFQURsQztBQUFBLFVBQ0FXLEtBREEsYUFDQUEsS0FEQTtBQUFBLFVBQ09DLFdBRFAsYUFDT0EsV0FEUDs7O0FBR1IsV0FBS0MsTUFBTCxHQUFjLElBQUliLEdBQUdjLElBQUgsQ0FBUUMsS0FBWixDQUFrQixZQUFsQixFQUFnQyxFQUFoQyxFQUFvQztBQUNoREMsZ0JBQVEsS0FBS04sS0FBTCxDQUFXTSxNQUQ2QjtBQUVoREMsZ0JBQVEsS0FBS0E7QUFGbUMsT0FBcEMsQ0FBZDs7QUFLQSxVQUFNZixnQkFBZ0IsS0FBS2dCLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixlQUFoQixDQUF0QjtBQUNBLFVBQU1aLGNBQWMsS0FBS1csTUFBTCxDQUFZQyxHQUFaLENBQWdCLGFBQWhCLENBQXBCOztBQUVBLFdBQUtOLE1BQUwsQ0FBWU8sY0FBWixDQUEyQlIsV0FBM0I7QUFDQSxXQUFLQyxNQUFMLENBQVlRLGNBQVosQ0FBMkJyQixHQUFHc0IsTUFBSCxDQUFVQyxNQUFyQyxFQUE2QztBQUMzQ0MsV0FBRyxXQUFDQyxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUNsQixjQUFJQSxNQUFNLElBQVYsRUFDRUQsRUFBRUUsSUFBRixHQUFTRCxDQUFUOztBQUVGLGlCQUFPRCxFQUFFRSxJQUFUO0FBQ0QsU0FOMEM7QUFPM0NDLGVBQU8sZUFBQ0gsQ0FBRCxFQUFpQjtBQUFBLGNBQWJDLENBQWEsdUVBQVQsSUFBUzs7QUFDdEIsaUJBQU9ELEVBQUVJLE9BQUYsS0FBYyxJQUFkLEdBQXFCM0IsYUFBckIsR0FBcUNLLFdBQTVDO0FBQ0Q7QUFUMEMsT0FBN0MsRUFVRztBQUNEdUIseUJBQWlCLEtBRGhCO0FBRURDLHVCQUFlO0FBRmQsT0FWSDs7QUFlQXBCLFlBQU1xQixHQUFOLENBQVUsS0FBS25CLE1BQWY7QUFDRDs7O2dDQUVXO0FBQUEsVUFDRkYsS0FERSxHQUNRLEtBQUtELEtBQUwsQ0FBV1YsRUFEbkIsQ0FDRlcsS0FERTs7QUFFVkEsWUFBTXNCLE1BQU4sQ0FBYSxLQUFLcEIsTUFBbEI7QUFDRDs7OzZCQUVRcUIsSSxFQUFNQyxRLEVBQVU7QUFDdkIsVUFBSSxDQUFDQSxTQUFTQyxLQUFkLEVBQ0UsTUFBTSxJQUFJQyxLQUFKLENBQVUseUVBQVYsQ0FBTjs7QUFFRixXQUFLeEIsTUFBTCxDQUFZcUIsSUFBWixHQUFtQkMsU0FBU0MsS0FBNUI7QUFDRDs7QUFFRDs7Ozs7OzBCQUdNRSxFLEVBQUk7QUFBQSxVQUNBRixLQURBLEdBQ1UsS0FBSzFCLEtBQUwsQ0FBV3lCLFFBRHJCLENBQ0FDLEtBREE7OztBQUdSLFdBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSCxNQUFNSSxNQUExQixFQUFrQ0QsR0FBbEM7QUFDRUgsY0FBTUcsQ0FBTixFQUFTWixJQUFULElBQWlCVyxFQUFqQjtBQURGLE9BR0EsS0FBS3pCLE1BQUwsQ0FBWTRCLE1BQVo7QUFDQSxXQUFLL0IsS0FBTCxDQUFXZ0MsSUFBWDtBQUNEOzs7OztrQkFHWWxDLFEiLCJmaWxlIjoiQmVhdEdyaWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBkb3duYmVhdENvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3JlZCcsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDb2xvciBvZiBhIGRvd25iZWF0IChgbWVhc3VyZSA9PT0gdHJ1ZWApJyxcbiAgICB9XG4gIH0sXG4gIHVwYmVhdENvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ29yYW5nZScsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDb2xvciBvZiBhbiB1cGJlYXQgKGBtZWFzdXJlID09PSBmYWxzZWApJyxcbiAgICB9XG4gIH0sXG59O1xuXG5jbGFzcyBCZWF0R3JpZCBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICB0aGlzLl9iZWF0cyA9IG5ldyB1aS5jb3JlLkxheWVyKCdjb2xsZWN0aW9uJywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZG93bmJlYXRDb2xvciA9IHRoaXMucGFyYW1zLmdldCgnZG93bmJlYXRDb2xvcicpO1xuICAgIGNvbnN0IHVwYmVhdENvbG9yID0gdGhpcy5wYXJhbXMuZ2V0KCd1cGJlYXRDb2xvcicpO1xuXG4gICAgdGhpcy5fYmVhdHMuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX2JlYXRzLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5NYXJrZXIsIHtcbiAgICAgIHg6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICBpZiAodiAhPT0gbnVsbClcbiAgICAgICAgICBkLnRpbWUgPSB2O1xuXG4gICAgICAgIHJldHVybiBkLnRpbWU7XG4gICAgICB9LFxuICAgICAgY29sb3I6IChkLCB2ID0gbnVsbCkgPT4ge1xuICAgICAgICByZXR1cm4gZC5tZWFzdXJlID09PSB0cnVlID8gZG93bmJlYXRDb2xvciA6IHVwYmVhdENvbG9yO1xuICAgICAgfSxcbiAgICB9LCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IGZhbHNlLFxuICAgICAgZGlzcGxheUxhYmVsczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fYmVhdHMpO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG4gICAgdHJhY2sucmVtb3ZlKHRoaXMuX2JlYXRzKTtcbiAgfVxuXG4gIHNldFRyYWNrKGRhdGEsIG1ldGFkYXRhKSB7XG4gICAgaWYgKCFtZXRhZGF0YS5iZWF0cylcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtZXRhZGF0YSBmb3IgbW9kdWxlIEJlYXRHcmlkLCBzaG91bGQgY29udGFpbiBhIGBiZWF0c2AgcHJvcGVydHknKTtcblxuICAgIHRoaXMuX2JlYXRzLmRhdGEgPSBtZXRhZGF0YS5iZWF0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBzaGlmdCB0aGUgYmVhdHMgd2l0aCBjZXJ0YWluIGR0XG4gICAqL1xuICBzaGlmdChkdCkge1xuICAgIGNvbnN0IHsgYmVhdHMgfSA9IHRoaXMuYmxvY2subWV0YWRhdGE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJlYXRzLmxlbmd0aDsgaSsrKVxuICAgICAgYmVhdHNbaV0udGltZSArPSBkdDtcblxuICAgIHRoaXMuX2JlYXRzLnVwZGF0ZSgpO1xuICAgIHRoaXMuYmxvY2suc25hcCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJlYXRHcmlkO1xuIl19