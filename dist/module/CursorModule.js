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
      if (e.type === 'mousedown' || e.type === 'mousemove') {
        var _timeline$timeContext = this.timeline.timeContext,
            timeToPixel = _timeline$timeContext.timeToPixel,
            offset = _timeline$timeContext.offset;

        var time = timeToPixel.invert(e.x) - offset;
        this.block.seek(time);
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
    value: function install(block) {
      var _block$ui = block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;


      this._cursor = new ui.core.Layer('entity', this._data, {
        height: block.height
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

      this._block = block;
    }
  }, {
    key: 'uninstall',
    value: function uninstall(block) {
      block.removeListener(block.EVENTS.CURRENT_POSITION, this._updateCursorPosition);
      block.ui.track.remove(this._cursor);
    }
  }, {
    key: 'onEvent',
    value: function onEvent(e) {
      if (this.params.get('seek') === false) return true;

      var timeline = this._block.ui.timeline;

      switch (e.type) {
        case 'mousedown':
          timeline.state = this._cursorSeekState;
          return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwiZGVmaW5pdGlvbnMiLCJjb2xvciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJzZWVrIiwiU2Vla1N0YXRlIiwiYmxvY2siLCJ0aW1lbGluZSIsImUiLCJ0aW1lQ29udGV4dCIsInRpbWVUb1BpeGVsIiwib2Zmc2V0IiwidGltZSIsImludmVydCIsIngiLCJzdGF0ZXMiLCJCYXNlU3RhdGUiLCJDdXJzb3JNb2R1bGUiLCJvcHRpb25zIiwiX2RhdGEiLCJjdXJyZW50UG9zaXRpb24iLCJfY3Vyc29yIiwiX2N1cnNvclNlZWtTdGF0ZSIsIl91cGRhdGVDdXJzb3JQb3NpdGlvbiIsImJpbmQiLCJ0cmFjayIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJDdXJzb3IiLCJkIiwicGFyYW1zIiwiZ2V0IiwiYWRkIiwicmVuZGVyIiwiYWRkTGlzdGVuZXIiLCJFVkVOVFMiLCJDVVJSRU5UX1BPU0lUSU9OIiwicG9zaXRpb24iLCJfYmxvY2siLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZSIsInN0YXRlIiwidXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxFOztBQUNaOzs7Ozs7OztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxRQUREO0FBRUxDLGFBQVMsS0FGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFKRixHQURXO0FBU2xCQyxRQUFNO0FBQ0pMLFVBQU0sU0FERjtBQUVKQyxhQUFTLElBRkw7QUFHSkUsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFISDtBQVRZLENBQXBCOztBQWtCQTs7OztJQUdNRSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsUUFBbkIsRUFBNkI7QUFBQTs7QUFB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QVQsS0FBbUIsS0FBS3ZCLGdCQUE1QixFQUNFZixTQUFTc0MsS0FBVCxHQUFpQixJQUFqQjtBQUNGO0FBUko7O0FBV0EsYUFBTyxJQUFQO0FBQ0Q7OzswQ0FFcUJKLFEsRUFBVTtBQUM5QixXQUFLdEIsS0FBTCxDQUFXQyxlQUFYLEdBQTZCcUIsUUFBN0I7QUFDQSxXQUFLcEIsT0FBTCxDQUFheUIsTUFBYjtBQUNEOzs7OztrQkFHWTdCLFkiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdyZWQnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIGN1cnNvcidcbiAgICB9LFxuICB9LFxuICBzZWVrOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdzZWVrIGludGVyYWN0aW9uIG9mIHRoZSBtb2R1bGUnLFxuICAgIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlZWsgc3RhdGUsIG9ubHkgYXBwbHkgaWYgbm8gc3RhdGUgcHJldmlvdXMgZGVjb3JhdG9yIHRvb2sgcHJlY2VkZW5jZVxuICovXG5jbGFzcyBTZWVrU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IoYmxvY2ssIHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZWRvd24nIHx8wqBlLnR5cGUgPT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICBjb25zdCB7IHRpbWVUb1BpeGVsLCBvZmZzZXQgfSA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgICBjb25zdCB0aW1lID0gdGltZVRvUGl4ZWwuaW52ZXJ0KGUueCkgLSBvZmZzZXQ7XG4gICAgICB0aGlzLmJsb2NrLnNlZWsodGltZSk7XG4gICAgfVxuICB9XG59XG5cblxuY2xhc3MgQ3Vyc29yTW9kdWxlIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGF0YSA9IHsgY3VycmVudFBvc2l0aW9uOiAwIH07XG4gICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICB0aGlzLl9jdXJzb3JTZWVrU3RhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24gPSB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5zdGFsbChibG9jaykge1xuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gYmxvY2sudWk7XG5cbiAgICB0aGlzLl9jdXJzb3IgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgdGhpcy5fZGF0YSwge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9jdXJzb3Iuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX2N1cnNvci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuQ3Vyc29yLCB7XG4gICAgICB4OiBkID0+IGQuY3VycmVudFBvc2l0aW9uLFxuICAgIH0sIHtcbiAgICAgIGNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyksXG4gICAgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fY3Vyc29yKTtcblxuICAgIHRoaXMuX2N1cnNvci5yZW5kZXIoKTtcbiAgICB0aGlzLl9jdXJzb3JTZWVrU3RhdGUgPSBuZXcgU2Vla1N0YXRlKGJsb2NrLCB0aW1lbGluZSk7XG5cbiAgICBibG9jay5hZGRMaXN0ZW5lcihibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24pO1xuXG4gICAgdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24oYmxvY2sucG9zaXRpb24pO1xuXG4gICAgdGhpcy5fYmxvY2sgPSBibG9jaztcbiAgfVxuXG4gIHVuaW5zdGFsbChibG9jaykge1xuICAgIGJsb2NrLnJlbW92ZUxpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbik7XG4gICAgYmxvY2sudWkudHJhY2sucmVtb3ZlKHRoaXMuX2N1cnNvcik7XG4gIH1cblxuICBvbkV2ZW50KGUpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdzZWVrJykgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuX2Jsb2NrLnVpLnRpbWVsaW5lO1xuXG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fY3Vyc29yU2Vla1N0YXRlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fY3Vyc29yU2Vla1N0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBfdXBkYXRlQ3Vyc29yUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICB0aGlzLl9kYXRhLmN1cnJlbnRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX2N1cnNvci51cGRhdGUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXJzb3JNb2R1bGU7XG4iXX0=