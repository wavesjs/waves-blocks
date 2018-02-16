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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJkZWZpbml0aW9ucyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsInNlZWsiLCJTZWVrU3RhdGUiLCJibG9jayIsInRpbWVsaW5lIiwiZSIsInRpbWVDb250ZXh0IiwidGltZVRvUGl4ZWwiLCJvZmZzZXQiLCJ0aW1lIiwiaW52ZXJ0IiwieCIsInN0YXJ0Iiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiQ3Vyc29yTW9kdWxlIiwib3B0aW9ucyIsIl9kYXRhIiwiY3VycmVudFBvc2l0aW9uIiwiX2N1cnNvciIsIl9jdXJzb3JTZWVrU3RhdGUiLCJfdXBkYXRlQ3Vyc29yUG9zaXRpb24iLCJiaW5kIiwidHJhY2siLCJjb3JlIiwiTGF5ZXIiLCJoZWlnaHQiLCJ6SW5kZXgiLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic2hhcGVzIiwiQ3Vyc29yIiwiZCIsInBhcmFtcyIsImdldCIsImFkZCIsInJlbmRlciIsImFkZExpc3RlbmVyIiwiRVZFTlRTIiwiQ1VSUkVOVF9QT1NJVElPTiIsInBvc2l0aW9uIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmUiLCJzdGF0ZSIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7Ozs7Ozs7QUFFQSxJQUFNQyxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sUUFERDtBQUVMQyxhQUFTLEtBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSkYsR0FEVztBQVNsQkMsUUFBTTtBQUNKTCxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pFLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSEg7QUFUWSxDQUFwQjs7QUFrQkE7Ozs7SUFHTUUsUzs7O0FBQ0oscUJBQVlDLEtBQVosRUFBbUJDLFFBQW5CLEVBQTZCO0FBQUE7O0FBQUEsNElBQ3JCQSxRQURxQjs7QUFHM0IsVUFBS0QsS0FBTCxHQUFhQSxLQUFiO0FBSDJCO0FBSTVCOzs7O2dDQUVXRSxDLEVBQUc7QUFDYixVQUNFQSxFQUFFVCxJQUFGLEtBQVcsV0FBWCxJQUNBUyxFQUFFVCxJQUFGLEtBQVcsV0FEWCxJQUVBUyxFQUFFVCxJQUFGLEtBQVcsVUFIYixFQUlFO0FBQUEsb0NBQ2dDLEtBQUtRLFFBQUwsQ0FBY0UsV0FEOUM7QUFBQSxZQUNRQyxXQURSLHlCQUNRQSxXQURSO0FBQUEsWUFDcUJDLE1BRHJCLHlCQUNxQkEsTUFEckI7O0FBRUEsWUFBTUMsT0FBT0YsWUFBWUcsTUFBWixDQUFtQkwsRUFBRU0sQ0FBckIsSUFBMEJILE1BQXZDO0FBQ0EsYUFBS0wsS0FBTCxDQUFXRixJQUFYLENBQWdCUSxJQUFoQjs7QUFFQSxZQUFJSixFQUFFVCxJQUFGLEtBQVcsVUFBZixFQUNFLEtBQUtPLEtBQUwsQ0FBV1MsS0FBWDtBQUNIO0FBQ0Y7OztFQXBCcUJuQixHQUFHb0IsTUFBSCxDQUFVQyxTOztJQXdCNUJDLFk7OztBQUNKLHdCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsbUpBQ2J0QixXQURhLEVBQ0FzQixPQURBOztBQUduQixXQUFLQyxLQUFMLEdBQWEsRUFBRUMsaUJBQWlCLENBQW5CLEVBQWI7QUFDQSxXQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFdBQUtDLGdCQUFMLEdBQXdCLElBQXhCOztBQUVBLFdBQUtDLHFCQUFMLEdBQTZCLE9BQUtBLHFCQUFMLENBQTJCQyxJQUEzQixRQUE3QjtBQVBtQjtBQVFwQjs7Ozs4QkFFUztBQUNSLFVBQU1uQixRQUFRLEtBQUtBLEtBQW5CO0FBRFEsc0JBRWlDQSxNQUFNVixFQUZ2QztBQUFBLFVBRUFXLFFBRkEsYUFFQUEsUUFGQTtBQUFBLFVBRVVtQixLQUZWLGFBRVVBLEtBRlY7QUFBQSxVQUVpQmpCLFdBRmpCLGFBRWlCQSxXQUZqQjs7O0FBSVIsV0FBS2EsT0FBTCxHQUFlLElBQUkxQixHQUFHK0IsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFFBQWxCLEVBQTRCLEtBQUtSLEtBQWpDLEVBQXdDO0FBQ3JEUyxnQkFBUXZCLE1BQU11QixNQUR1QztBQUVyREMsZ0JBQVEsS0FBS0E7QUFGd0MsT0FBeEMsQ0FBZjs7QUFLQSxXQUFLUixPQUFMLENBQWFTLGNBQWIsQ0FBNEJ0QixXQUE1QjtBQUNBLFdBQUthLE9BQUwsQ0FBYVUsY0FBYixDQUE0QnBDLEdBQUdxQyxNQUFILENBQVVDLE1BQXRDLEVBQThDO0FBQzVDcEIsV0FBRztBQUFBLGlCQUFLcUIsRUFBRWQsZUFBUDtBQUFBO0FBRHlDLE9BQTlDLEVBRUc7QUFDRHZCLGVBQU8sS0FBS3NDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQjtBQUROLE9BRkg7O0FBTUFYLFlBQU1ZLEdBQU4sQ0FBVSxLQUFLaEIsT0FBZjs7QUFFQSxXQUFLQSxPQUFMLENBQWFpQixNQUFiO0FBQ0EsV0FBS2hCLGdCQUFMLEdBQXdCLElBQUlsQixTQUFKLENBQWNDLEtBQWQsRUFBcUJDLFFBQXJCLENBQXhCOztBQUVBRCxZQUFNa0MsV0FBTixDQUFrQmxDLE1BQU1tQyxNQUFOLENBQWFDLGdCQUEvQixFQUFpRCxLQUFLbEIscUJBQXREOztBQUVBLFdBQUtBLHFCQUFMLENBQTJCbEIsTUFBTXFDLFFBQWpDO0FBQ0Q7OztnQ0FFVztBQUNWLFVBQU1yQyxRQUFRLEtBQUtBLEtBQW5CO0FBQ0FBLFlBQU1zQyxjQUFOLENBQXFCdEMsTUFBTW1DLE1BQU4sQ0FBYUMsZ0JBQWxDLEVBQW9ELEtBQUtsQixxQkFBekQ7QUFDQWxCLFlBQU1WLEVBQU4sQ0FBUzhCLEtBQVQsQ0FBZW1CLE1BQWYsQ0FBc0IsS0FBS3ZCLE9BQTNCO0FBQ0Q7Ozs0QkFFT2QsQyxFQUFHO0FBQ1QsVUFBSSxLQUFLNEIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE1BQWhCLE1BQTRCLEtBQWhDLEVBQ0UsT0FBTyxJQUFQOztBQUVGLFVBQU05QixXQUFXLEtBQUtELEtBQUwsQ0FBV1YsRUFBWCxDQUFjVyxRQUEvQjs7QUFFQSxjQUFRQyxFQUFFVCxJQUFWO0FBQ0UsYUFBSyxXQUFMO0FBQ0EsYUFBSyxVQUFMO0FBQ0VRLG1CQUFTdUMsS0FBVCxHQUFpQixLQUFLdkIsZ0JBQXRCO0FBQ0EsaUJBQU8sS0FBUCxDQUZGLENBRWdCO0FBQ2Q7QUFDRixhQUFLLFNBQUw7QUFDRSxjQUFJaEIsU0FBU3VDLEtBQVQsS0FBbUIsS0FBS3ZCLGdCQUE1QixFQUNFaEIsU0FBU3VDLEtBQVQsR0FBaUIsSUFBakI7QUFDRjtBQVRKOztBQVlBLGFBQU8sSUFBUDtBQUNEOzs7MENBRXFCSCxRLEVBQVU7QUFDOUIsV0FBS3ZCLEtBQUwsQ0FBV0MsZUFBWCxHQUE2QnNCLFFBQTdCO0FBQ0EsV0FBS3JCLE9BQUwsQ0FBYXlCLE1BQWI7QUFDRDs7Ozs7a0JBR1k3QixZIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdyZWQnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIGN1cnNvcidcbiAgICB9LFxuICB9LFxuICBzZWVrOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdzZWVrIGludGVyYWN0aW9uIG9mIHRoZSBtb2R1bGUnLFxuICAgIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlZWsgc3RhdGUsIG9ubHkgYXBwbHkgaWYgbm8gc3RhdGUgcHJldmlvdXMgZGVjb3JhdG9yIHRvb2sgcHJlY2VkZW5jZVxuICovXG5jbGFzcyBTZWVrU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IoYmxvY2ssIHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIGlmIChcbiAgICAgIGUudHlwZSA9PT0gJ21vdXNlZG93bicgfHzCoFxuICAgICAgZS50eXBlID09PSAnbW91c2Vtb3ZlJyB8fFxuICAgICAgZS50eXBlID09PSAnZGJsY2xpY2snXG4gICAgKSB7XG4gICAgICBjb25zdCB7IHRpbWVUb1BpeGVsLCBvZmZzZXQgfSA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgICBjb25zdCB0aW1lID0gdGltZVRvUGl4ZWwuaW52ZXJ0KGUueCkgLSBvZmZzZXQ7XG4gICAgICB0aGlzLmJsb2NrLnNlZWsodGltZSk7XG5cbiAgICAgIGlmIChlLnR5cGUgPT09ICdkYmxjbGljaycpXG4gICAgICAgIHRoaXMuYmxvY2suc3RhcnQoKTtcbiAgICB9XG4gIH1cbn1cblxuXG5jbGFzcyBDdXJzb3JNb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9kYXRhID0geyBjdXJyZW50UG9zaXRpb246IDAgfTtcbiAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgIHRoaXMuX2N1cnNvclNlZWtTdGF0ZSA9IG51bGw7XG5cbiAgICB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbiA9IHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9jaztcbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjaywgdGltZUNvbnRleHQgfSA9IGJsb2NrLnVpO1xuXG4gICAgdGhpcy5fY3Vyc29yID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2VudGl0eScsIHRoaXMuX2RhdGEsIHtcbiAgICAgIGhlaWdodDogYmxvY2suaGVpZ2h0LFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHRoaXMuX2N1cnNvci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgdGhpcy5fY3Vyc29yLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5DdXJzb3IsIHtcbiAgICAgIHg6IGQgPT4gZC5jdXJyZW50UG9zaXRpb24sXG4gICAgfSwge1xuICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmdldCgnY29sb3InKSxcbiAgICB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl9jdXJzb3IpO1xuXG4gICAgdGhpcy5fY3Vyc29yLnJlbmRlcigpO1xuICAgIHRoaXMuX2N1cnNvclNlZWtTdGF0ZSA9IG5ldyBTZWVrU3RhdGUoYmxvY2ssIHRpbWVsaW5lKTtcblxuICAgIGJsb2NrLmFkZExpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbik7XG5cbiAgICB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbihibG9jay5wb3NpdGlvbik7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2NrO1xuICAgIGJsb2NrLnJlbW92ZUxpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbik7XG4gICAgYmxvY2sudWkudHJhY2sucmVtb3ZlKHRoaXMuX2N1cnNvcik7XG4gIH1cblxuICBvbkV2ZW50KGUpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdzZWVrJykgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG5cbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgIGNhc2UgJ2RibGNsaWNrJzpcbiAgICAgICAgdGltZWxpbmUuc3RhdGUgPSB0aGlzLl9jdXJzb3JTZWVrU3RhdGU7XG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gcHJldmVudFByb3BhZ2F0aW9uXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fY3Vyc29yU2Vla1N0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBfdXBkYXRlQ3Vyc29yUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICB0aGlzLl9kYXRhLmN1cnJlbnRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX2N1cnNvci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXJzb3JNb2R1bGU7XG4iXX0=