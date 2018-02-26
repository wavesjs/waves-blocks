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
  },
  startOnDblClick: {
    type: 'boolean',
    default: false,
    metas: {
      desc: 'seek and start the player on double click'
    }
  }
};

/**
 * Seek state, only apply if no state previous decorator took precedence
 */

var SeekState = function (_ui$states$BaseState) {
  (0, _inherits3.default)(SeekState, _ui$states$BaseState);

  function SeekState(block, timeline) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, SeekState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SeekState.__proto__ || (0, _getPrototypeOf2.default)(SeekState)).call(this, timeline));

    _this.block = block;
    _this.options = options;
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

        if (e.type === 'dblclick' && this.options.startOnDblClick === true) this.block.start();
      }
    }
  }]);
  return SeekState;
}(ui.states.BaseState);

var Cursor = function (_AbstractModule) {
  (0, _inherits3.default)(Cursor, _AbstractModule);

  function Cursor(options) {
    (0, _classCallCheck3.default)(this, Cursor);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Cursor.__proto__ || (0, _getPrototypeOf2.default)(Cursor)).call(this, definitions, options));

    _this2._data = { currentPosition: 0 };
    _this2._cursor = null;
    _this2._cursorSeekState = null;

    _this2._updateCursorPosition = _this2._updateCursorPosition.bind(_this2);
    return _this2;
  }

  (0, _createClass3.default)(Cursor, [{
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
      this._cursorSeekState = new SeekState(block, timeline, {
        startOnDblClick: this.params.get('startOnDblClick')
      });

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
  return Cursor;
}(_AbstractModule3.default);

exports.default = Cursor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN1cnNvci5qcyJdLCJuYW1lcyI6WyJ1aSIsImRlZmluaXRpb25zIiwiY29sb3IiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwic2VlayIsInN0YXJ0T25EYmxDbGljayIsIlNlZWtTdGF0ZSIsImJsb2NrIiwidGltZWxpbmUiLCJvcHRpb25zIiwiZSIsInRpbWVDb250ZXh0IiwidGltZVRvUGl4ZWwiLCJvZmZzZXQiLCJ0aW1lIiwiaW52ZXJ0IiwieCIsInN0YXJ0Iiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiQ3Vyc29yIiwiX2RhdGEiLCJjdXJyZW50UG9zaXRpb24iLCJfY3Vyc29yIiwiX2N1cnNvclNlZWtTdGF0ZSIsIl91cGRhdGVDdXJzb3JQb3NpdGlvbiIsImJpbmQiLCJ0cmFjayIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJkIiwicGFyYW1zIiwiZ2V0IiwiYWRkIiwicmVuZGVyIiwiYWRkTGlzdGVuZXIiLCJFVkVOVFMiLCJDVVJSRU5UX1BPU0lUSU9OIiwicG9zaXRpb24iLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZSIsInN0YXRlIiwidXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxFOztBQUNaOzs7Ozs7OztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxRQUREO0FBRUxDLGFBQVMsS0FGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFKRixHQURXO0FBU2xCQyxRQUFNO0FBQ0pMLFVBQU0sU0FERjtBQUVKQyxhQUFTLElBRkw7QUFHSkUsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFISCxHQVRZO0FBZ0JsQkUsbUJBQWlCO0FBQ2ZOLFVBQU0sU0FEUztBQUVmQyxhQUFTLEtBRk07QUFHZkUsV0FBTztB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TUFBTixDQUFhQyxnQkFBbEMsRUFBb0QsS0FBS2pCLHFCQUF6RDtBQUNBbEIsWUFBTVgsRUFBTixDQUFTK0IsS0FBVCxDQUFla0IsTUFBZixDQUFzQixLQUFLdEIsT0FBM0I7QUFDRDs7OzRCQUVPYixDLEVBQUc7QUFDVCxVQUFJLEtBQUswQixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsTUFBaEIsTUFBNEIsS0FBaEMsRUFDRSxPQUFPLElBQVA7O0FBRUYsVUFBTTdCLFdBQVcsS0FBS0QsS0FBTCxDQUFXWCxFQUFYLENBQWNZLFFBQS9COztBQUVBLGNBQVFFLEVBQUVYLElBQVY7QUFDRSxhQUFLLFdBQUw7QUFDQSxhQUFLLFVBQUw7QUFDRVMsbUJBQVNzQyxLQUFULEdBQWlCLEtBQUt0QixnQkFBdEI7QUFDQSxpQkFBTyxLQUFQLENBRkYsQ0FFZ0I7QUFDZDtBQUNGLGFBQUssU0FBTDtBQUNFLGNBQUloQixTQUFTc0MsS0FBVCxLQUFtQixLQUFLdEIsZ0JBQTVCLEVBQ0VoQixTQUFTc0MsS0FBVCxHQUFpQixJQUFqQjtBQUNGO0FBVEo7O0FBWUEsYUFBTyxJQUFQO0FBQ0Q7OzswQ0FFcUJILFEsRUFBVTtBQUM5QixXQUFLdEIsS0FBTCxDQUFXQyxlQUFYLEdBQTZCcUIsUUFBN0I7QUFDQSxXQUFLcEIsT0FBTCxDQUFhd0IsTUFBYjtBQUNEOzs7OztrQkFHWTNCLE0iLCJmaWxlIjoiQ3Vyc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAncmVkJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2NvbG9yIG9mIHRoZSBjdXJzb3InXG4gICAgfSxcbiAgfSxcbiAgc2Vlazoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnc2VlayBpbnRlcmFjdGlvbiBvZiB0aGUgbW9kdWxlJyxcbiAgICB9LFxuICB9LFxuICBzdGFydE9uRGJsQ2xpY2s6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdzZWVrIGFuZCBzdGFydCB0aGUgcGxheWVyIG9uIGRvdWJsZSBjbGljaycsXG4gICAgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogU2VlayBzdGF0ZSwgb25seSBhcHBseSBpZiBubyBzdGF0ZSBwcmV2aW91cyBkZWNvcmF0b3IgdG9vayBwcmVjZWRlbmNlXG4gKi9cbmNsYXNzIFNlZWtTdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3RvcihibG9jaywgdGltZWxpbmUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIGlmIChcbiAgICAgIGUudHlwZSA9PT0gJ21vdXNlZG93bicgfHzCoFxuICAgICAgZS50eXBlID09PSAnbW91c2Vtb3ZlJyB8fFxuICAgICAgZS50eXBlID09PSAnZGJsY2xpY2snXG4gICAgKSB7XG4gICAgICBjb25zdCB7IHRpbWVUb1BpeGVsLCBvZmZzZXQgfSA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgICBjb25zdCB0aW1lID0gdGltZVRvUGl4ZWwuaW52ZXJ0KGUueCkgLSBvZmZzZXQ7XG4gICAgICB0aGlzLmJsb2NrLnNlZWsodGltZSk7XG5cbiAgICAgIGlmIChlLnR5cGUgPT09ICdkYmxjbGljaycgJiYgdGhpcy5vcHRpb25zLnN0YXJ0T25EYmxDbGljayA9PT0gdHJ1ZSlcbiAgICAgICAgdGhpcy5ibG9jay5zdGFydCgpO1xuICAgIH1cbiAgfVxufVxuXG5cbmNsYXNzIEN1cnNvciBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RhdGEgPSB7IGN1cnJlbnRQb3NpdGlvbjogMCB9O1xuICAgIHRoaXMuX2N1cnNvciA9IG51bGw7XG4gICAgdGhpcy5fY3Vyc29yU2Vla1N0YXRlID0gbnVsbDtcblxuICAgIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uID0gdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2NrO1xuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gYmxvY2sudWk7XG5cbiAgICB0aGlzLl9jdXJzb3IgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgdGhpcy5fZGF0YSwge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgdGhpcy5fY3Vyc29yLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl9jdXJzb3IuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLkN1cnNvciwge1xuICAgICAgeDogZCA9PiBkLmN1cnJlbnRQb3NpdGlvbixcbiAgICB9LCB7XG4gICAgICBjb2xvcjogdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpLFxuICAgIH0pO1xuXG4gICAgdHJhY2suYWRkKHRoaXMuX2N1cnNvcik7XG5cbiAgICB0aGlzLl9jdXJzb3IucmVuZGVyKCk7XG4gICAgdGhpcy5fY3Vyc29yU2Vla1N0YXRlID0gbmV3IFNlZWtTdGF0ZShibG9jaywgdGltZWxpbmUsIHtcbiAgICAgIHN0YXJ0T25EYmxDbGljazogdGhpcy5wYXJhbXMuZ2V0KCdzdGFydE9uRGJsQ2xpY2snKSxcbiAgICB9KTtcblxuICAgIGJsb2NrLmFkZExpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbik7XG5cbiAgICB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbihibG9jay5wb3NpdGlvbik7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2NrO1xuICAgIGJsb2NrLnJlbW92ZUxpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbik7XG4gICAgYmxvY2sudWkudHJhY2sucmVtb3ZlKHRoaXMuX2N1cnNvcik7XG4gIH1cblxuICBvbkV2ZW50KGUpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdzZWVrJykgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG5cbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgIGNhc2UgJ2RibGNsaWNrJzpcbiAgICAgICAgdGltZWxpbmUuc3RhdGUgPSB0aGlzLl9jdXJzb3JTZWVrU3RhdGU7XG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gcHJldmVudFByb3BhZ2F0aW9uXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fY3Vyc29yU2Vla1N0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBfdXBkYXRlQ3Vyc29yUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICB0aGlzLl9kYXRhLmN1cnJlbnRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX2N1cnNvci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXJzb3I7XG4iXX0=