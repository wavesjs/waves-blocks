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
  color: {
    type: 'string',
    default: 'red',
    constant: true,
    metas: {
      desc: 'color of the cursor'
    }
  },
  seek: {
    type: 'boolean',
    default: true,
    metas: {
      desc: 'seek interaction of the module'
    }
  }
};

/**
 * Seek state, only apply if no state previous decorator took precedence
 */

var SeekState = function (_ui$states$BaseState) {
  (0, _inherits3.default)(SeekState, _ui$states$BaseState);

  function SeekState(block, timeline) {
    (0, _classCallCheck3.default)(this, SeekState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SeekState.__proto__ || (0, _getPrototypeOf2.default)(SeekState)).call(this, timeline));

    _this.block = block;
    return _this;
  }

  (0, _createClass3.default)(SeekState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      if (e.type === 'mousedown' || e.type === 'mousemove' || e.type === 'dblclick') {
        var _timeline$timeContext = this.timeline.timeContext,
            timeToPixel = _timeline$timeContext.timeToPixel,
            offset = _timeline$timeContext.offset;

        var time = timeToPixel.invert(e.x) - offset;
        this.block.seek(time);

        if (e.type === 'dblclick') this.block.start();
      }
    }
  }]);
  return SeekState;
}(ui.states.BaseState);

var CursorModule = function (_AbstractModule) {
  (0, _inherits3.default)(CursorModule, _AbstractModule);

  function CursorModule(options) {
    (0, _classCallCheck3.default)(this, CursorModule);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (CursorModule.__proto__ || (0, _getPrototypeOf2.default)(CursorModule)).call(this, definitions, options));

    _this2._data = { currentPosition: 0 };
    _this2._cursor = null;
    _this2._cursorSeekState = null;

    _this2._updateCursorPosition = _this2._updateCursorPosition.bind(_this2);
    return _this2;
  }

  (0, _createClass3.default)(CursorModule, [{
    key: 'install',
    value: function install() {
      var block = this.block;
      var _block$ui = block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;


      this._cursor = new ui.core.Layer('entity', this._data, {
        height: block.height,
        zIndex: this.zIndex
      });

      this._cursor.setTimeContext(timeContext);
      this._cursor.configureShape(ui.shapes.Cursor, {
        x: function x(d) {
          return d.currentPosition;
        }
      }, {
        color: this.params.get('color')
      });

      track.add(this._cursor);

      this._cursor.render();
      this._cursorSeekState = new SeekState(block, timeline);

      block.addListener(block.EVENTS.CURRENT_POSITION, this._updateCursorPosition);

      this._updateCursorPosition(block.position);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      var block = this.block;
      block.removeListener(block.EVENTS.CURRENT_POSITION, this._updateCursorPosition);
      block.ui.track.remove(this._cursor);
    }
  }, {
    key: 'onEvent',
    value: function onEvent(e) {
      if (this.params.get('seek') === false) return true;

      var timeline = this.block.ui.timeline;

      switch (e.type) {
        case 'mousedown':
        case 'dblclick':
          timeline.state = this._cursorSeekState;
          return false; // preventPropagation
          break;
        case 'mouseup':
          if (timeline.state === this._cursorSeekState) timeline.state = null;
          break;
      }

      return true;
    }
  }, {
    key: '_updateCursorPosition',
    value: function _updateCursorPosition(position) {
      this._data.currentPosition = position;
      this._cursor.update();
    }
  }]);
  return CursorModule;
}(_AbstractModule3.default);

exports.default = CursorModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwiZGVmaW5pdGlvbnMiLCJjb2xvciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJzZWVrIiwiU2Vla1N0YXRlIiwiYmxvY2siLCJ0aW1lbGluZSIsImUiLCJ0aW1lQ29udGV4dCIsInRpbWVUb1BpeGVsIiwib2Zmc2V0IiwidGltZSIsImludmVydCIsIngiLCJzdGFydCIsInN0YXRlcyIsIkJhc2VTdGF0ZSIsIkN1cnNvck1vZHVsZSIsIm9wdGlvbnMiLCJfZGF0YSIsImN1cnJlbnRQb3NpdGlvbiIsIl9jdXJzb3IiLCJfY3Vyc29yU2Vla1N0YXRlIiwiX3VwZGF0ZUN1cnNvclBvc2l0aW9uIiwiYmluZCIsInRyYWNrIiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwiekluZGV4Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIkN1cnNvciIsImQiLCJwYXJhbXMiLCJnZXQiLCJhZGQiLCJyZW5kZXIiLCJhZGRMaXN0ZW5lciIsIkVWRU5UUyIsIkNVUlJFTlRfUE9TSVRJT04iLCJwb3NpdGlvbiIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlIiwic3RhdGUiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLFFBREQ7QUFFTEMsYUFBUyxLQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUpGLEdBRFc7QUFTbEJDLFFBQU07QUFDSkwsVUFBTSxTQURGO0FBRUpDLGFBQVMsSUFGTDtBQUdKRSxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUhIO0FBVFksQ0FBcEI7O0FBa0JBOzs7O0lBR01FLFM7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CQyxRQUFuQixFQUE2QjtBQUFBOztBQUFBLDRJQUNyQkEsUUFEcUI7O0FBRzNCLFVBQUtELEtBQUwsR0FBYUEsS0FBYjtBQUgyQjtBQUk1Qjs7OztnQ0FFV0UsQyxFQUFHO0FBQ2IsVUFDRUEsRUFBRVQsSUFBRixLQUFXLFdBQVgsSUFDQVMsRUFBRVQsSUFBRixLQUFXLFdBRFgsSUFFQVMsRUFBRVQsSUFBRixLQUFXLFVBSGIsRUFJRTtBQUFBLG9DQUNnQyxLQUFLUSxRQUFMLENBQWNFLFdBRDlDO0FBQUEsWUFDUUMsV0FEUix5QkFDUUEsV0FEUjtBQUFBLFlBQ3FCQyxNQURyQix5QkFDcUJBLE1BRHJCOztBQUVBLFlBQU1DLE9BQU9GLFlBQVlHLE1BQVosQ0FBbUJMLEVBQUVNLENBQXJCLElBQTBCSCxNQUF2QztBQUNBLGFBQUtMLEtBQUwsQ0FBV0YsSUFBWCxDQUFnQlEsSUFBaEI7O0FBRUEsWUFBSUosRUFBRVQsSUFBRixLQUFXLFVBQWYsRUFDRSxLQUFLTyxLQUFMLENBQVdTLEtBQVg7QUFDSDtBQUNGOzs7RUFwQnFCbkIsR0FBR29CLE1BQUgsQ0FBVUMsUzs7SUF3QjVCQyxZOzs7QUFDSix3QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBLG1KQUNidEIsV0FEYSxFQUNBc0IsT0FEQTs7QUFHbkIsV0FBS0MsS0FBTCxHQUFhLEVBQUVDLGlCQUFpQixDQUFuQixFQUFiO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxXQUFLQyxnQkFBTCxHQUF3QixJQUF4Qjs7QUFFQSxXQUFLQyxxQkFBTCxHQUE2QixPQUFLQSxxQkFBTCxDQUEyQkMsSUFBM0IsUUFBN0I7QUFQbUI7QUFRcEI7Ozs7OEJBRVM7QUFDUixVQUFNbkIsUUFBUSxLQUFLQSxLQUFuQjtBQURRLHNCQUVpQ0EsTUFBTVYsRUFGdkM7QUFBQSxVQUVBVyxRQUZBLGFBRUFBLFFBRkE7QUFBQSxVQUVVbUIsS0FGVixhQUVVQSxLQUZWO0FBQUEsVUFFaUJqQixXQUZqQixhQUVpQkEsV0FGakI7OztBQUlSLFdBQUthLE9BQUwsR0FBZSxJQUFJMUIsR0FBRytCLElBQUgsQ0FBUUMsS0FBWixDQUFrQixRQUFsQixFQUE0QixLQUFLUixLQUFqQyxFQUF3QztBQUNyRFMsZ0JBQVF2QixNQUFNdUIsTUFEdUM7QUFFckRDLGdCQUFRLEtBQUtBO0FBRndDLE9BQXhDLENBQWY7O0FBS0EsV0FBS1IsT0FBTCxDQUFhUyxjQUFiLENBQTRCdEIsV0FBNUI7QUFDQSxXQUFLYSxPQUFMLENBQWFVLGNBQWIsQ0FBNEJwQyxHQUFHcUMsTUFBSCxDQUFVQyxNQUF0QyxFQUE4QztBQUM1Q3BCLFdBQUc7QUFBQSxpQkFBS3FCLEVBQUVkLGVBQVA7QUFBQTtBQUR5QyxPQUE5QyxFQUVHO0FBQ0R2QixlQUFPLEtBQUtzQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEI7QUFETixPQUZIOztBQU1BWCxZQUFNWSxHQUFOLENBQVUsS0FBS2hCLE9BQWY7O0FBRUEsV0FBS0EsT0FBTCxDQUFhaUIsTUFBYjtBQUNBLFdBQUtoQixnQkFBTCxHQUF3QixJQUFJbEIsU0FBSixDQUFjQyxLQUFkLEVBQXFCQyxRQUFyQixDQUF4Qjs7QUFFQUQsWUFBTWtDLFdBQU4sQ0FBa0JsQyxNQUFNbUMsTUFBTixDQUFhQyxnQkFBL0IsRUFBaUQsS0FBS2xCLHFCQUF0RDs7QUFFQSxXQUFLQSxxQkFBTCxDQUEyQmxCLE1BQU1xQyxRQUFqQztBQUNEOzs7Z0NBRVc7QUFDVixVQUFNckMsUUFBUSxLQUFLQSxLQUFuQjtBQUNBQSxZQUFNc0MsY0FBTixDQUFxQnRDLE1BQU1tQyxNQUFOLENBQWFDLGdCQUFsQyxFQUFvRCxLQUFLbEIscUJBQXpEO0FBQ0FsQixZQUFNVixFQUFOLENBQVM4QixLQUFULENBQWVtQixNQUFmLENBQXNCLEtBQUt2QixPQUEzQjtBQUNEOzs7NEJBRU9kLEMsRUFBRztBQUNULFVBQUksS0FBSzRCLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixNQUE0QixLQUFoQyxFQUNFLE9BQU8sSUFBUDs7QUFFRixVQUFNOUIsV0FBVyxLQUFLRCxLQUFMLENBQVdWLEVBQVgsQ0FBY1csUUFBL0I7O0FBRUEsY0FBUUMsRUFBRVQsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNBLGFBQUssVUFBTDtBQUNFUSxtQkFBU3VDLEtBQVQsR0FBaUIsS0FBS3ZCLGdCQUF0QjtBQUNBLGlCQUFPLEtBQVAsQ0FGRixDQUVnQjtBQUNkO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsY0FBSWhCLFNBQVN1QyxLQUFULEtBQW1CLEtBQUt2QixnQkFBNUIsRUFDRWhCLFNBQVN1QyxLQUFULEdBQWlCLElBQWpCO0FBQ0Y7QUFUSjs7QUFZQSxhQUFPLElBQVA7QUFDRDs7OzBDQUVxQkgsUSxFQUFVO0FBQzlCLFdBQUt2QixLQUFMLENBQVdDLGVBQVgsR0FBNkJzQixRQUE3QjtBQUNBLFdBQUtyQixPQUFMLENBQWF5QixNQUFiO0FBQ0Q7Ozs7O2tCQUdZN0IsWSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3JlZCcsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgY3Vyc29yJ1xuICAgIH0sXG4gIH0sXG4gIHNlZWs6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ3NlZWsgaW50ZXJhY3Rpb24gb2YgdGhlIG1vZHVsZScsXG4gICAgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogU2VlayBzdGF0ZSwgb25seSBhcHBseSBpZiBubyBzdGF0ZSBwcmV2aW91cyBkZWNvcmF0b3IgdG9vayBwcmVjZWRlbmNlXG4gKi9cbmNsYXNzIFNlZWtTdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3RvcihibG9jaywgdGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgaWYgKFxuICAgICAgZS50eXBlID09PSAnbW91c2Vkb3duJyB8fMKgXG4gICAgICBlLnR5cGUgPT09ICdtb3VzZW1vdmUnIHx8XG4gICAgICBlLnR5cGUgPT09ICdkYmxjbGljaydcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgdGltZVRvUGl4ZWwsIG9mZnNldCB9ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aW1lVG9QaXhlbC5pbnZlcnQoZS54KSAtIG9mZnNldDtcbiAgICAgIHRoaXMuYmxvY2suc2Vlayh0aW1lKTtcblxuICAgICAgaWYgKGUudHlwZSA9PT0gJ2RibGNsaWNrJylcbiAgICAgICAgdGhpcy5ibG9jay5zdGFydCgpO1xuICAgIH1cbiAgfVxufVxuXG5cbmNsYXNzIEN1cnNvck1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RhdGEgPSB7IGN1cnJlbnRQb3NpdGlvbjogMCB9O1xuICAgIHRoaXMuX2N1cnNvciA9IG51bGw7XG4gICAgdGhpcy5fY3Vyc29yU2Vla1N0YXRlID0gbnVsbDtcblxuICAgIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uID0gdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2NrO1xuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gYmxvY2sudWk7XG5cbiAgICB0aGlzLl9jdXJzb3IgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgdGhpcy5fZGF0YSwge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgdGhpcy5fY3Vyc29yLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9jdXJzb3IuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLkN1cnNvciwge1xuICAgICAgeDogZCA9PiBkLmN1cnJlbnRQb3NpdGlvbixcbiAgICB9LCB7XG4gICAgICBjb2xvcjogdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpLFxuICAgIH0pO1xuXG4gICAgdHJhY2suYWRkKHRoaXMuX2N1cnNvcik7XG5cbiAgICB0aGlzLl9jdXJzb3IucmVuZGVyKCk7XG4gICAgdGhpcy5fY3Vyc29yU2Vla1N0YXRlID0gbmV3IFNlZWtTdGF0ZShibG9jaywgdGltZWxpbmUpO1xuXG4gICAgYmxvY2suYWRkTGlzdGVuZXIoYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uKTtcblxuICAgIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uKGJsb2NrLnBvc2l0aW9uKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2s7XG4gICAgYmxvY2sucmVtb3ZlTGlzdGVuZXIoYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uKTtcbiAgICBibG9jay51aS50cmFjay5yZW1vdmUodGhpcy5fY3Vyc29yKTtcbiAgfVxuXG4gIG9uRXZlbnQoZSkge1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ3NlZWsnKSA9PT0gZmFsc2UpXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgY2FzZSAnZGJsY2xpY2snOlxuICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IHRoaXMuX2N1cnNvclNlZWtTdGF0ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBwcmV2ZW50UHJvcGFnYXRpb25cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgaWYgKHRpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9jdXJzb3JTZWVrU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIF91cGRhdGVDdXJzb3JQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIHRoaXMuX2RhdGEuY3VycmVudFBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgdGhpcy5fY3Vyc29yLnVwZGF0ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEN1cnNvck1vZHVsZTtcbiJdfQ==