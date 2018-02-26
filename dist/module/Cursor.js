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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJkZWZpbml0aW9ucyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsInNlZWsiLCJzdGFydE9uRGJsQ2xpY2siLCJTZWVrU3RhdGUiLCJibG9jayIsInRpbWVsaW5lIiwib3B0aW9ucyIsImUiLCJ0aW1lQ29udGV4dCIsInRpbWVUb1BpeGVsIiwib2Zmc2V0IiwidGltZSIsImludmVydCIsIngiLCJzdGFydCIsInN0YXRlcyIsIkJhc2VTdGF0ZSIsIkN1cnNvciIsIl9kYXRhIiwiY3VycmVudFBvc2l0aW9uIiwiX2N1cnNvciIsIl9jdXJzb3JTZWVrU3RhdGUiLCJfdXBkYXRlQ3Vyc29yUG9zaXRpb24iLCJiaW5kIiwidHJhY2siLCJjb3JlIiwiTGF5ZXIiLCJoZWlnaHQiLCJ6SW5kZXgiLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic2hhcGVzIiwiZCIsInBhcmFtcyIsImdldCIsImFkZCIsInJlbmRlciIsImFkZExpc3RlbmVyIiwiRVZFTlRTIiwiQ1VSUkVOVF9QT1NJVElPTiIsInBvc2l0aW9uIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmUiLCJzdGF0ZSIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7Ozs7Ozs7QUFFQSxJQUFNQyxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sUUFERDtBQUVMQyxhQUFTLEtBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSkYsR0FEVztBQVNsQkMsUUFBTTtBQUNKTCxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pFLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSEgsR0FUWTtBQWdCbEJFLG1CQUFpQjtBQUNmTixVQUFNLFNBRFM7QUFFZkMsYUFBUyxLQUZNO0FBR2ZFLFdBQU87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LE1BQU4sQ0FBYUMsZ0JBQWxDLEVBQW9ELEtBQUtqQixxQkFBekQ7QUFDQWxCLFlBQU1YLEVBQU4sQ0FBUytCLEtBQVQsQ0FBZWtCLE1BQWYsQ0FBc0IsS0FBS3RCLE9BQTNCO0FBQ0Q7Ozs0QkFFT2IsQyxFQUFHO0FBQ1QsVUFBSSxLQUFLMEIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE1BQWhCLE1BQTRCLEtBQWhDLEVBQ0UsT0FBTyxJQUFQOztBQUVGLFVBQU03QixXQUFXLEtBQUtELEtBQUwsQ0FBV1gsRUFBWCxDQUFjWSxRQUEvQjs7QUFFQSxjQUFRRSxFQUFFWCxJQUFWO0FBQ0UsYUFBSyxXQUFMO0FBQ0EsYUFBSyxVQUFMO0FBQ0VTLG1CQUFTc0MsS0FBVCxHQUFpQixLQUFLdEIsZ0JBQXRCO0FBQ0EsaUJBQU8sS0FBUCxDQUZGLENBRWdCO0FBQ2Q7QUFDRixhQUFLLFNBQUw7QUFDRSxjQUFJaEIsU0FBU3NDLEtBQVQsS0FBbUIsS0FBS3RCLGdCQUE1QixFQUNFaEIsU0FBU3NDLEtBQVQsR0FBaUIsSUFBakI7QUFDRjtBQVRKOztBQVlBLGFBQU8sSUFBUDtBQUNEOzs7MENBRXFCSCxRLEVBQVU7QUFDOUIsV0FBS3RCLEtBQUwsQ0FBV0MsZUFBWCxHQUE2QnFCLFFBQTdCO0FBQ0EsV0FBS3BCLE9BQUwsQ0FBYXdCLE1BQWI7QUFDRDs7Ozs7a0JBR1kzQixNIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdyZWQnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIGN1cnNvcidcbiAgICB9LFxuICB9LFxuICBzZWVrOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdzZWVrIGludGVyYWN0aW9uIG9mIHRoZSBtb2R1bGUnLFxuICAgIH0sXG4gIH0sXG4gIHN0YXJ0T25EYmxDbGljazoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ3NlZWsgYW5kIHN0YXJ0IHRoZSBwbGF5ZXIgb24gZG91YmxlIGNsaWNrJyxcbiAgICB9LFxuICB9LFxufTtcblxuLyoqXG4gKiBTZWVrIHN0YXRlLCBvbmx5IGFwcGx5IGlmIG5vIHN0YXRlIHByZXZpb3VzIGRlY29yYXRvciB0b29rIHByZWNlZGVuY2VcbiAqL1xuY2xhc3MgU2Vla1N0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrLCB0aW1lbGluZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgaWYgKFxuICAgICAgZS50eXBlID09PSAnbW91c2Vkb3duJyB8fMKgXG4gICAgICBlLnR5cGUgPT09ICdtb3VzZW1vdmUnIHx8XG4gICAgICBlLnR5cGUgPT09ICdkYmxjbGljaydcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgdGltZVRvUGl4ZWwsIG9mZnNldCB9ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aW1lVG9QaXhlbC5pbnZlcnQoZS54KSAtIG9mZnNldDtcbiAgICAgIHRoaXMuYmxvY2suc2Vlayh0aW1lKTtcblxuICAgICAgaWYgKGUudHlwZSA9PT0gJ2RibGNsaWNrJyAmJiB0aGlzLm9wdGlvbnMuc3RhcnRPbkRibENsaWNrID09PSB0cnVlKVxuICAgICAgICB0aGlzLmJsb2NrLnN0YXJ0KCk7XG4gICAgfVxuICB9XG59XG5cblxuY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGF0YSA9IHsgY3VycmVudFBvc2l0aW9uOiAwIH07XG4gICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICB0aGlzLl9jdXJzb3JTZWVrU3RhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5fdXBkYXRlQ3Vyc29yUG9zaXRpb24gPSB0aGlzLl91cGRhdGVDdXJzb3JQb3NpdGlvbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5zdGFsbCgpIHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2s7XG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSBibG9jay51aTtcblxuICAgIHRoaXMuX2N1cnNvciA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCB0aGlzLl9kYXRhLCB7XG4gICAgICBoZWlnaHQ6IGJsb2NrLmhlaWdodCxcbiAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9jdXJzb3Iuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX2N1cnNvci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuQ3Vyc29yLCB7XG4gICAgICB4OiBkID0+IGQuY3VycmVudFBvc2l0aW9uLFxuICAgIH0sIHtcbiAgICAgIGNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyksXG4gICAgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fY3Vyc29yKTtcblxuICAgIHRoaXMuX2N1cnNvci5yZW5kZXIoKTtcbiAgICB0aGlzLl9jdXJzb3JTZWVrU3RhdGUgPSBuZXcgU2Vla1N0YXRlKGJsb2NrLCB0aW1lbGluZSwge1xuICAgICAgc3RhcnRPbkRibENsaWNrOiB0aGlzLnBhcmFtcy5nZXQoJ3N0YXJ0T25EYmxDbGljaycpLFxuICAgIH0pO1xuXG4gICAgYmxvY2suYWRkTGlzdGVuZXIoYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uKTtcblxuICAgIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uKGJsb2NrLnBvc2l0aW9uKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2s7XG4gICAgYmxvY2sucmVtb3ZlTGlzdGVuZXIoYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZUN1cnNvclBvc2l0aW9uKTtcbiAgICBibG9jay51aS50cmFjay5yZW1vdmUodGhpcy5fY3Vyc29yKTtcbiAgfVxuXG4gIG9uRXZlbnQoZSkge1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ3NlZWsnKSA9PT0gZmFsc2UpXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgY2FzZSAnZGJsY2xpY2snOlxuICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IHRoaXMuX2N1cnNvclNlZWtTdGF0ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBwcmV2ZW50UHJvcGFnYXRpb25cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgaWYgKHRpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9jdXJzb3JTZWVrU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIF91cGRhdGVDdXJzb3JQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIHRoaXMuX2RhdGEuY3VycmVudFBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgdGhpcy5fY3Vyc29yLnVwZGF0ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEN1cnNvcjtcbiJdfQ==