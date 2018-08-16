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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN1cnNvci5qcyJdLCJuYW1lcyI6WyJ1aSIsImRlZmluaXRpb25zIiwiY29sb3IiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwic2VlayIsInN0YXJ0T25EYmxDbGljayIsIlNlZWtTdGF0ZSIsImJsb2NrIiwidGltZWxpbmUiLCJvcHRpb25zIiwiZSIsInRpbWVDb250ZXh0IiwidGltZVRvUGl4ZWwiLCJvZmZzZXQiLCJ0aW1lIiwiaW52ZXJ0IiwieCIsInN0YXJ0Iiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiQ3Vyc29yIiwiX2RhdGEiLCJjdXJyZW50UG9zaXRpb24iLCJfY3Vyc29yIiwiX2N1cnNvclNlZWtTdGF0ZSIsIl91cGRhdGVDdXJzb3JQb3NpdGlvbiIsImJpbmQiLCJ0cmFjayIsImNvcmUiLCJMYXllciIsImhlaWdodCIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJkIiwicGFyYW1zIiwiZ2V0IiwiYWRkIiwicmVuZGVyIiwiYWRkTGlzdGVuZXIiLCJFVkVOVFMiLCJDVVJSRU5UX1BPU0lUSU9OIiwicG9zaXRpb24iLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZSIsInN0YXRlIiwidXBkYXRlIiwiQWJzdHJhY3RNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLFFBREQ7QUFFTEMsYUFBUyxLQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUpGLEdBRFc7QUFTbEJDLFFBQU07QUFDSkwsVUFBTSxTQURGO0FBRUpDLGFBQVMsSUFGTDtBQUdKRSxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUhILEdBVFk7QUFnQmxCRSxtQkFBaUI7QUFDZk4sVUFBTSxTQURTO0FBRWZDLGFBQVMs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TixDQUFxQnJDLE1BQU1rQyxNQUFOLENBQWFDLGdCQUFsQyxFQUFvRCxLQUFLakIscUJBQXpEO0FBQ0FsQixZQUFNWCxFQUFOLENBQVMrQixLQUFULENBQWVrQixNQUFmLENBQXNCLEtBQUt0QixPQUEzQjtBQUNEOzs7NEJBRU9iLEMsRUFBRztBQUNULFVBQUksS0FBSzBCLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixNQUE0QixLQUFoQyxFQUNFLE9BQU8sSUFBUDs7QUFFRixVQUFNN0IsV0FBVyxLQUFLRCxLQUFMLENBQVdYLEVBQVgsQ0FBY1ksUUFBL0I7O0FBRUEsY0FBUUUsRUFBRVgsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNBLGFBQUssVUFBTDtBQUNFUyxtQkFBU3NDLEtBQVQsR0FBaUIsS0FBS3RCLGdCQUF0QjtBQUNBLGlCQUFPLEtBQVAsQ0FGRixDQUVnQjtBQUNkO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsY0FBSWhCLFNBQVNzQyxLQUFULEtBQW1CLEtBQUt0QixnQkFBNUIsRUFDRWhCLFNBQVNzQyxLQUFULEdBQWlCLElBQWpCO0FBQ0Y7QUFUSjs7QUFZQSxhQUFPLElBQVA7QUFDRDs7OzBDQUVxQkgsUSxFQUFVO0FBQzlCLFdBQUt0QixLQUFMLENBQVdDLGVBQVgsR0FBNkJxQixRQUE3QjtBQUNBLFdBQUtwQixPQUFMLENBQWF3QixNQUFiO0FBQ0Q7OztFQXJFa0JDLHdCOztrQkF3RU41QixNIiwiZmlsZSI6IkN1cnNvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3JlZCcsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgY3Vyc29yJ1xuICAgIH0sXG4gIH0sXG4gIHNlZWs6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ3NlZWsgaW50ZXJhY3Rpb24gb2YgdGhlIG1vZHVsZScsXG4gICAgfSxcbiAgfSxcbiAgc3RhcnRPbkRibENsaWNrOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnc2VlayBhbmQgc3RhcnQgdGhlIHBsYXllciBvbiBkb3VibGUgY2xpY2snLFxuICAgIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlZWsgc3RhdGUsIG9ubHkgYXBwbHkgaWYgbm8gc3RhdGUgcHJldmlvdXMgZGVjb3JhdG9yIHRvb2sgcHJlY2VkZW5jZVxuICovXG5jbGFzcyBTZWVrU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IoYmxvY2ssIHRpbWVsaW5lLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBpZiAoXG4gICAgICBlLnR5cGUgPT09ICdtb3VzZWRvd24nIHx8wqBcbiAgICAgIGUudHlwZSA9PT0gJ21vdXNlbW92ZScgfHxcbiAgICAgIGUudHlwZSA9PT0gJ2RibGNsaWNrJ1xuICAgICkge1xuICAgICAgY29uc3QgeyB0aW1lVG9QaXhlbCwgb2Zmc2V0IH0gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgICAgY29uc3QgdGltZSA9IHRpbWVUb1BpeGVsLmludmVydChlLngpIC0gb2Zmc2V0O1xuICAgICAgdGhpcy5ibG9jay5zZWVrKHRpbWUpO1xuXG4gICAgICBpZiAoZS50eXBlID09PSAnZGJsY2xpY2snICYmIHRoaXMub3B0aW9ucy5zdGFydE9uRGJsQ2xpY2sgPT09IHRydWUpXG4gICAgICAgIHRoaXMuYmxvY2suc3RhcnQoKTtcbiAgICB9XG4gIH1cbn1cblxuXG5jbGFzcyBDdXJzb3IgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9kYXRhID0geyBjdXJyZW50UG9zaXRpb246IDAgfTtcbiAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgIHRoaXMuX2N1cnNvclNlZWtTdGF0ZSA9IG51bGw7XG5cbiAgICB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbiA9IHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9jaztcbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjaywgdGltZUNvbnRleHQgfSA9IGJsb2NrLnVpO1xuXG4gICAgdGhpcy5fY3Vyc29yID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2VudGl0eScsIHRoaXMuX2RhdGEsIHtcbiAgICAgIGhlaWdodDogYmxvY2suaGVpZ2h0LFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHRoaXMuX2N1cnNvci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgdGhpcy5fY3Vyc29yLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5DdXJzb3IsIHtcbiAgICAgIHg6IGQgPT4gZC5jdXJyZW50UG9zaXRpb24sXG4gICAgfSwge1xuICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmdldCgnY29sb3InKSxcbiAgICB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl9jdXJzb3IpO1xuXG4gICAgdGhpcy5fY3Vyc29yLnJlbmRlcigpO1xuICAgIHRoaXMuX2N1cnNvclNlZWtTdGF0ZSA9IG5ldyBTZWVrU3RhdGUoYmxvY2ssIHRpbWVsaW5lLCB7XG4gICAgICBzdGFydE9uRGJsQ2xpY2s6IHRoaXMucGFyYW1zLmdldCgnc3RhcnRPbkRibENsaWNrJyksXG4gICAgfSk7XG5cbiAgICBibG9jay5hZGRMaXN0ZW5lcihibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24pO1xuXG4gICAgdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24oYmxvY2sucG9zaXRpb24pO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9jaztcbiAgICBibG9jay5yZW1vdmVMaXN0ZW5lcihibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24pO1xuICAgIGJsb2NrLnVpLnRyYWNrLnJlbW92ZSh0aGlzLl9jdXJzb3IpO1xuICB9XG5cbiAgb25FdmVudChlKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnc2VlaycpID09PSBmYWxzZSlcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3QgdGltZWxpbmUgPSB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lO1xuXG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICBjYXNlICdkYmxjbGljayc6XG4gICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fY3Vyc29yU2Vla1N0YXRlO1xuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIHByZXZlbnRQcm9wYWdhdGlvblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX2N1cnNvclNlZWtTdGF0ZSlcbiAgICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgX3VwZGF0ZUN1cnNvclBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5fZGF0YS5jdXJyZW50UG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB0aGlzLl9jdXJzb3IudXBkYXRlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3Vyc29yO1xuIl19