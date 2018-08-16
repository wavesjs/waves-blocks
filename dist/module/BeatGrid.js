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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJlYXRHcmlkLmpzIl0sIm5hbWVzIjpbInVpIiwiZGVmaW5pdGlvbnMiLCJkb3duYmVhdENvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImRlc2MiLCJ1cGJlYXRDb2xvciIsIkJlYXRHcmlkIiwib3B0aW9ucyIsImJsb2NrIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsIl9iZWF0cyIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInpJbmRleCIsInBhcmFtcyIsImdldCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJNYXJrZXIiLCJ4IiwiZCIsInYiLCJ0aW1lIiwiY29sb3IiLCJtZWFzdXJlIiwiZGlzcGxheUhhbmRsZXJzIiwiZGlzcGxheUxhYmVscyIsImFkZCIsInJlbW92ZSIsImRhdGEiLCJtZXRhZGF0YSIsImJlYXRzIiwiRXJyb3IiLCJkdCIsImkiLCJsZW5ndGgiLCJ1cGRhdGUiLCJzbmFwIiwiQWJzdHJhY3RNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsY0FBYztBQUNsQkMsaUJBQWU7QUFDYkMsVUFBTSxRQURPO0FBRWJDLGFBQVMsS0FGSTtBQUdiQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUhNLEdBREc7QUFRbEJDLGVBQWE7QUFDWEosVUFBTSxRQURLO0FBRVhDLGFBQVMsUUFGRTtBQUdYQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUhJO0FBUkssQ0FBcEI7O0lBaUJNRSxROzs7QUFDSixvQkFBWUMsT0FBWixFQUFxQjtBQUFBO0FBQUEscUlBQ2JSLFdBRGEsRUFDQVEsT0FEQTtBQUVwQjs7Ozs4QkFFUztBQUFBLHNCQUN1QixLQUFLQyxLQUFMLENBQVdWLEVBRGxDO0FBQUEsVUFDQVcsS0FEQSxhQUNBQSxLQURBO0FBQUEsVUFDT0MsV0FEUCxhQUNPQSxXQURQOzs7QUFHUixXQUFLQyxNQUFMLEdBQWMsSUFBSWIsR0FBR2MsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFlBQWxCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2hEQyxnQkFBUSxLQUFLTixLQUFMLENBQVdNLE1BRDZCO0FBRWhEQyxnQkFBUSxLQUFLQTtBQUZtQyxPQUFwQyxDQUFkOztBQUtBLFVBQU1mLGdCQUFnQixLQUFLZ0IsTUFBTCxDQUFZQyxHQUFaLENBQWdCLGVBQWhCLENBQXRCO0FBQ0EsVUFBTVosY0FBYyxLQUFLVyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBcEI7O0FBRUEsV0FBS04sTUFBTCxDQUFZTyxjQUFaLENBQTJCUixXQUEzQjtBQUNBLFdBQUtDLE1BQUwsQ0FBWVEsY0FBWixDQUEyQnJCLEdBQUdzQixNQUFILENBQVVDLE1BQXJDLEVBQTZDO0FBQzNDQyxXQUFHLFdBQUNDLENBQUQsRUFBaUI7QUFBQSxjQUFiQyxDQUFhLHVFQUFULElBQVM7O0FBQ2xCLGNBQUlBLE1BQU0sSUFBVixFQUNFRCxFQUFFRSxJQUFGLEdBQVNELENBQVQ7O0FBRUYsaUJBQU9ELEVBQUVFLElBQVQ7QUFDRCxTQU4wQztBQU8zQ0MsZUFBTyxlQUFDSCxDQUFELEVBQWlCO0FBQUEsY0FBYkMsQ0FBYSx1RUFBVCxJQUFTOztBQUN0QixpQkFBT0QsRUFBRUksT0FBRixLQUFjLElBQWQsR0FBcUIzQixhQUFyQixHQUFxQ0ssV0FBNUM7QUFDRDtBQVQwQyxPQUE3QyxFQVVHO0FBQ0R1Qix5QkFBaUIsS0FEaEI7QUFFREMsdUJBQWU7QUFGZCxPQVZIOztBQWVBcEIsWUFBTXFCLEdBQU4sQ0FBVSxLQUFLbkIsTUFBZjtBQUNEOzs7Z0NBRVc7QUFBQSxVQUNGRixLQURFLEdBQ1EsS0FBS0QsS0FBTCxDQUFXVixFQURuQixDQUNGVyxLQURFOztBQUVWQSxZQUFNc0IsTUFBTixDQUFhLEtBQUtwQixNQUFsQjtBQUNEOzs7NkJBRVFxQixJLEVBQU1DLFEsRUFBVTtBQUN2QixVQUFJLENBQUNBLFNBQVNDLEtBQWQsRUFDRSxNQUFNLElBQUlDLEtBQUosQ0FBVSx5RUFBVixDQUFOOztBQUVGLFdBQUt4QixNQUFMLENBQVlxQixJQUFaLEdBQW1CQyxTQUFTQyxLQUE1QjtBQUNEOztBQUVEOzs7Ozs7MEJBR01FLEUsRUFBSTtBQUFBLFVBQ0FGLEtBREEsR0FDVSxLQUFLMUIsS0FBTCxDQUFXeUIsUUFEckIsQ0FDQUMsS0FEQTs7O0FBR1IsV0FBSyxJQUFJRyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1BQU1JLE1BQTFCLEVBQWtDRCxHQUFsQztBQUNFSCxjQUFNRyxDQUFOLEVBQVNaLElBQVQsSUFBaUJXLEVBQWpCO0FBREYsT0FHQSxLQUFLekIsTUFBTCxDQUFZNEIsTUFBWjtBQUNBLFdBQUsvQixLQUFMLENBQVdnQyxJQUFYO0FBQ0Q7OztFQTFEb0JDLHdCOztrQkE2RFJuQyxRIiwiZmlsZSI6IkJlYXRHcmlkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZG93bmJlYXRDb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdyZWQnLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ29sb3Igb2YgYSBkb3duYmVhdCAoYG1lYXN1cmUgPT09IHRydWVgKScsXG4gICAgfVxuICB9LFxuICB1cGJlYXRDb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdvcmFuZ2UnLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ29sb3Igb2YgYW4gdXBiZWF0IChgbWVhc3VyZSA9PT0gZmFsc2VgKScsXG4gICAgfVxuICB9LFxufTtcblxuY2xhc3MgQmVhdEdyaWQgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGhpcy5fYmVhdHMgPSBuZXcgdWkuY29yZS5MYXllcignY29sbGVjdGlvbicsIFtdLCB7XG4gICAgICBoZWlnaHQ6IHRoaXMuYmxvY2suaGVpZ2h0LFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRvd25iZWF0Q29sb3IgPSB0aGlzLnBhcmFtcy5nZXQoJ2Rvd25iZWF0Q29sb3InKTtcbiAgICBjb25zdCB1cGJlYXRDb2xvciA9IHRoaXMucGFyYW1zLmdldCgndXBiZWF0Q29sb3InKTtcblxuICAgIHRoaXMuX2JlYXRzLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9iZWF0cy5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuTWFya2VyLCB7XG4gICAgICB4OiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpXG4gICAgICAgICAgZC50aW1lID0gdjtcblxuICAgICAgICByZXR1cm4gZC50aW1lO1xuICAgICAgfSxcbiAgICAgIGNvbG9yOiAoZCwgdiA9IG51bGwpID0+IHtcbiAgICAgICAgcmV0dXJuIGQubWVhc3VyZSA9PT0gdHJ1ZSA/IGRvd25iZWF0Q29sb3IgOiB1cGJlYXRDb2xvcjtcbiAgICAgIH0sXG4gICAgfSwge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBmYWxzZSxcbiAgICAgIGRpc3BsYXlMYWJlbHM6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgdHJhY2suYWRkKHRoaXMuX2JlYXRzKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICBjb25zdCB7IHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuICAgIHRyYWNrLnJlbW92ZSh0aGlzLl9iZWF0cyk7XG4gIH1cblxuICBzZXRUcmFjayhkYXRhLCBtZXRhZGF0YSkge1xuICAgIGlmICghbWV0YWRhdGEuYmVhdHMpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbWV0YWRhdGEgZm9yIG1vZHVsZSBCZWF0R3JpZCwgc2hvdWxkIGNvbnRhaW4gYSBgYmVhdHNgIHByb3BlcnR5Jyk7XG5cbiAgICB0aGlzLl9iZWF0cy5kYXRhID0gbWV0YWRhdGEuYmVhdHM7XG4gIH1cblxuICAvKipcbiAgICogc2hpZnQgdGhlIGJlYXRzIHdpdGggY2VydGFpbiBkdFxuICAgKi9cbiAgc2hpZnQoZHQpIHtcbiAgICBjb25zdCB7IGJlYXRzIH0gPSB0aGlzLmJsb2NrLm1ldGFkYXRhO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZWF0cy5sZW5ndGg7IGkrKylcbiAgICAgIGJlYXRzW2ldLnRpbWUgKz0gZHQ7XG5cbiAgICB0aGlzLl9iZWF0cy51cGRhdGUoKTtcbiAgICB0aGlzLmJsb2NrLnNuYXAoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCZWF0R3JpZDtcbiJdfQ==