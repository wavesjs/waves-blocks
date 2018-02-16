'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _set2 = require('babel-runtime/helpers/set');

var _set3 = _interopRequireDefault(_set2);

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

var _AbstractModule2 = require('../core/AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _GridAxisModule = require('./GridAxisModule');

var _GridAxisModule2 = _interopRequireDefault(_GridAxisModule);

var _TimeAxisModule = require('./TimeAxisModule');

var _TimeAxisModule2 = _interopRequireDefault(_TimeAxisModule);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scales = ui.utils.scales;

var ZoomState = function (_ui$states$BaseState) {
  (0, _inherits3.default)(ZoomState, _ui$states$BaseState);

  function ZoomState(block, timeline, scrollBar) {
    (0, _classCallCheck3.default)(this, ZoomState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ZoomState.__proto__ || (0, _getPrototypeOf2.default)(ZoomState)).call(this, timeline));

    _this.block = block;
    _this.scrollBar = scrollBar;

    _this._pixelToExponent = scales.linear().domain([0, block.height]).range([0, 1]);
    return _this;
  }

  (0, _createClass3.default)(ZoomState, [{
    key: 'destroy',
    value: function destroy() {
      this.block = null;
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.initialZoom = this.timeline.timeContext.zoom;
      this.initialY = e.y;
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // prevent annoying text selection when dragging
      e.originalEvent.preventDefault();

      // define max/min zoom
      var maxZoom = 44100 / this.timeline.timeContext.pixelsPerSecond;
      var minZoom = 1;

      var trackDuration = this.block.duration;
      var timeContext = this.timeline.timeContext;
      var lastCenterTime = timeContext.timeToPixel.invert(e.x);
      var exponent = this._pixelToExponent(e.y - this.initialY);
      var targetZoom = this.initialZoom * Math.pow(2, exponent);

      timeContext.zoom = Math.min(Math.max(targetZoom, minZoom), maxZoom);

      var newCenterTime = timeContext.timeToPixel.invert(e.x);
      var delta = newCenterTime - lastCenterTime;

      // clamp zoomed waveform in screen
      var newOffset = timeContext.offset + delta + timeContext.timeToPixel.invert(e.dx);
      var maxOffset = 0;
      var minOffset = timeContext.visibleDuration - trackDuration;

      timeContext.offset = Math.max(minOffset, Math.min(maxOffset, newOffset));

      this.timeline.tracks.update();
      this.scrollBar.update();
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {}
  }]);
  return ZoomState;
}(ui.states.BaseState);

var ScrollState = function (_ui$states$BaseState2) {
  (0, _inherits3.default)(ScrollState, _ui$states$BaseState2);

  function ScrollState(block, timeline, scrollBar) {
    (0, _classCallCheck3.default)(this, ScrollState);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (ScrollState.__proto__ || (0, _getPrototypeOf2.default)(ScrollState)).call(this, timeline));

    _this2.block = block;
    _this2.scrollBar = scrollBar;
    return _this2;
  }

  (0, _createClass3.default)(ScrollState, [{
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var mainTimeContext = this.timeline.timeContext;
      var trackDuration = this.block.duration;
      var dt = this.scrollBar.timeContext.timeToPixel.invert(e.dx);

      // manipuate and clamp offset of the main timeline
      var newOffset = mainTimeContext.offset - dt;
      var maxOffset = 0;
      var minOffset = mainTimeContext.visibleDuration - trackDuration;

      mainTimeContext.offset = Math.max(minOffset, Math.min(maxOffset, newOffset));

      this.timeline.tracks.update();
      this.scrollBar.update();
    }
  }]);
  return ScrollState;
}(ui.states.BaseState);

var parameters = {
  axisType: {
    type: 'enum',
    list: ['time', 'grid'],
    default: 'time'
  },
  scrollBarContainer: {
    type: 'any',
    default: '',
    required: true,
    metas: {
      desc: 'CSS Selector or DOM element that should contain the scroll bar'
    }
  },
  scrollBarHeight: {
    type: 'float',
    min: 0,
    max: +Infinity,
    step: 1,
    default: 10,
    metas: {
      desc: 'height of the scroll-bar, is removed from '
    }
  },
  centeredCurrentPosition: {
    type: 'boolean',
    default: false,
    constant: true,
    metas: {
      desc: 'keep waveform center around the block\'s current position'
    }
  }
  // @todo - allow switching between time and grid axis
  // axis: {}


  /**
   *
   */
};
var ZoomModule = function (_AbstractModule) {
  (0, _inherits3.default)(ZoomModule, _AbstractModule);

  function ZoomModule(options) {
    (0, _classCallCheck3.default)(this, ZoomModule);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (ZoomModule.__proto__ || (0, _getPrototypeOf2.default)(ZoomModule)).call(this, parameters, options));

    _this3.axisModule = _this3.params.get('axisType') === 'grid' ? new _GridAxisModule2.default() : new _TimeAxisModule2.default();

    _this3._onScrollBarMouseEvent = _this3._onScrollBarMouseEvent.bind(_this3);
    _this3._updateOffset = _this3._updateOffset.bind(_this3);
    return _this3;
  }

  (0, _createClass3.default)(ZoomModule, [{
    key: 'install',
    value: function install() {
      this.axisModule.install();

      var $container = this.params.get('scrollBarContainer');

      if (!($container instanceof Element)) $container = document.querySelector($container);

      // create a new timeline to host the scroll bar
      var visibleWidth = this.block.width;
      var height = this.params.get('scrollBarHeight');

      $container.style.width = visibleWidth + 'px';
      $container.style.height = height + 'px';

      // init with dummy pixel per second
      var scrollTimeline = new ui.core.Timeline(1, visibleWidth);
      var scrollTrack = new ui.core.Track($container, height);

      scrollTimeline.add(scrollTrack, 'scroll');

      // data of the scroll bar is the timeContext of the main timeline
      var mainTimeContext = this.block.ui.timeline.timeContext;
      var scrollBar = new ui.core.Layer('entity', mainTimeContext, {
        height: height,
        yDomain: [0, 1]
      });

      var timeContext = new ui.core.LayerTimeContext(scrollTimeline.timeContext);
      scrollBar.setTimeContext(timeContext);

      scrollBar.configureShape(ui.shapes.Segment, {
        x: function x(d) {
          return -d.offset;
        },
        y: function y(d) {
          return 0;
        },
        width: function width(d) {
          return d.visibleDuration;
        },
        height: function height(d) {
          return 1;
        }
      }, {
        displayHandlers: false
      });

      scrollTrack.add(scrollBar, 'scroll');
      scrollTrack.updateContainer();

      this._scrollTimeline = scrollTimeline;
      this._scrollTrack = scrollTrack;
      this._scrollBar = scrollBar;
      this._scrollTimeline.on('event', this._onScrollBarMouseEvent);

      // init states
      this._zoomState = new ZoomState(this.block, this.block.ui.timeline, this._scrollBar);
      this._scrollState = new ScrollState(this.block, this.block.ui.timeline, this._scrollBar);

      if (this.params.get('centeredCurrentPosition')) block.addListener(block.EVENTS.CURRENT_POSITION, this._updateOffset);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      var _block$ui = this.block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track;


      timeline.zoom = 1;
      timeline.offset = 0;
      track.update();

      this.axisModule.uninstall(this.block);

      this._scrollTimeline.remove(this._scrollTrack);
      this._scrollTimeline = null;
      this._scrollTrack = null;
      this._scrollBar = null;

      this._zoomState = null;
      this._scrollState = null;

      if (this.params.get('centeredCurrentPosition')) block.removeListener(block.EVENTS.CURRENT_POSITION, this._updateOffset);
    }
  }, {
    key: 'setWidth',
    value: function setWidth(value) {
      this._scrollTimeline.maintainVisibleDuration = true;
      this._scrollTimeline.visibleWidth = value;

      this._scrollTrack.render();
      this._scrollTrack.update();
    }
  }, {
    key: 'setTrack',
    value: function setTrack(buffer, metadatas) {
      this.axisModule.setTrack(metadatas);
      // reset zoom
      var _block$ui2 = this.block.ui,
          timeline = _block$ui2.timeline,
          track = _block$ui2.track;


      timeline.zoom = 1;
      timeline.offset = 0;
      track.update();

      // reset scroll
      var duration = this.block.duration;
      var pixelsPerSecond = this.block.width / duration;

      this._scrollTimeline.pixelsPerSecond = pixelsPerSecond;
      this._scrollBar.timeContext.duration = duration;

      this._scrollTrack.render();
      this._scrollTrack.update();
    }

    /**
     * Events are forwarded by the BasePlayer, originate from the main timeline.
     */

  }, {
    key: 'onEvent',
    value: function onEvent(e, hitLayers) {
      var timeline = this.block.ui.timeline;

      switch (e.type) {
        case 'mousedown':
          // @todo - can't zoom if
          // `playControl.running === true` && `centeredCurrentPosition === true`
          if (hitLayers.indexOf(this.axisModule.layer) !== -1) {
            timeline.state = this._zoomState;
            return false;
          }
          break;
        case 'mouseup':
          if (timeline.state === this._zoomState) timeline.state = null;
          break;
      }

      return true;
    }

    /**
     * Events emitted by the scroll timeline.
     */

  }, {
    key: '_onScrollBarMouseEvent',
    value: function _onScrollBarMouseEvent(e) {
      var timeline = this.block.ui.timeline;

      switch (e.type) {
        case 'mousedown':
          if (this._scrollBar.hasElement(e.target)) timeline.state = this._scrollState;
          break;
        case 'mousemove':
          // forward event from scroll timeline to main timeline
          if (timeline.state === this._scrollState) timeline.state.onMouseMove(e);
          break;
        case 'mouseup':
          if (timeline.state === this._scrollState) timeline.state = null;
          break;
      }
    }
  }, {
    key: '_updateOffset',
    value: function _updateOffset(currentPosition) {
      var mainTimeline = this.block.ui.timeline;
      var mainTrack = this.block.ui.track;
      var mainTimeContext = mainTimeline.timeContext;
      var duration = this.block.duration;

      // zoom cannot be < 1 (cf. ZoomState)
      if (mainTimeContext.zoom > 1) {
        var offset = mainTimeContext.offset;
        var visibleDuration = mainTimeContext.visibleDuration;
        var centerScreenPosition = -offset + visibleDuration / 2;
        var lastHalfScreenPosition = duration - visibleDuration / 2;

        if (currentPosition > centerScreenPosition && currentPosition < lastHalfScreenPosition) {
          var dt = currentPosition - centerScreenPosition;
          var dx = mainTimeContext.timeToPixel(dx);
          offset -= dt;

          mainTimeContext.offset = offset;
          mainTrack.update();
          // update scroll bar
          this._scrollBar.update();
        }
      }
    }

    /** @todo - install these directly on the block ? */
    // zoomIn() {}
    // zoomOut() {}

  }, {
    key: 'block',
    set: function set(block) {
      (0, _set3.default)(ZoomModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(ZoomModule.prototype), 'block', block, this);
      this.axisModule.block = this.block;
    },
    get: function get() {
      return (0, _get3.default)(ZoomModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(ZoomModule.prototype), 'block', this);
    }
  }, {
    key: 'zIndex',
    set: function set(zIndex) {
      (0, _set3.default)(ZoomModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(ZoomModule.prototype), 'zIndex', zIndex, this);
      this.axisModule.zIndex = this.zIndex;
    },
    get: function get() {
      return (0, _get3.default)(ZoomModule.prototype.__proto__ || (0, _getPrototypeOf2.default)(ZoomModule.prototype), 'zIndex', this);
    }
  }]);
  return ZoomModule;
}(_AbstractModule3.default);

exports.default = ZoomModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJzY2FsZXMiLCJ1dGlscyIsIlpvb21TdGF0ZSIsImJsb2NrIiwidGltZWxpbmUiLCJzY3JvbGxCYXIiLCJfcGl4ZWxUb0V4cG9uZW50IiwibGluZWFyIiwiZG9tYWluIiwiaGVpZ2h0IiwicmFuZ2UiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJpbml0aWFsWm9vbSIsInRpbWVDb250ZXh0Iiwiem9vbSIsImluaXRpYWxZIiwieSIsIm9yaWdpbmFsRXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm1heFpvb20iLCJwaXhlbHNQZXJTZWNvbmQiLCJtaW5ab29tIiwidHJhY2tEdXJhdGlvbiIsImR1cmF0aW9uIiwibGFzdENlbnRlclRpbWUiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsIngiLCJleHBvbmVudCIsInRhcmdldFpvb20iLCJNYXRoIiwicG93IiwibWluIiwibWF4IiwibmV3Q2VudGVyVGltZSIsImRlbHRhIiwibmV3T2Zmc2V0Iiwib2Zmc2V0IiwiZHgiLCJtYXhPZmZzZXQiLCJtaW5PZmZzZXQiLCJ2aXNpYmxlRHVyYXRpb24iLCJ0cmFja3MiLCJ1cGRhdGUiLCJzdGF0ZXMiLCJCYXNlU3RhdGUiLCJTY3JvbGxTdGF0ZSIsIm1haW5UaW1lQ29udGV4dCIsImR0IiwicGFyYW1ldGVycyIsImF4aXNUeXBlIiwibGlzdCIsImRlZmF1bHQiLCJzY3JvbGxCYXJDb250YWluZXIiLCJyZXF1aXJlZCIsIm1ldGFzIiwiZGVzYyIsInNjcm9sbEJhckhlaWdodCIsIkluZmluaXR5Iiwic3RlcCIsImNlbnRlcmVkQ3VycmVudFBvc2l0aW9uIiwiY29uc3RhbnQiLCJab29tTW9kdWxlIiwib3B0aW9ucyIsImF4aXNNb2R1bGUiLCJwYXJhbXMiLCJnZXQiLCJfb25TY3JvbGxCYXJNb3VzZUV2ZW50IiwiYmluZCIsIl91cGRhdGVPZmZzZXQiLCJpbnN0YWxsIiwiJGNvbnRhaW5lciIsIkVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ2aXNpYmxlV2lkdGgiLCJ3aWR0aCIsInN0eWxlIiwic2Nyb2xsVGltZWxpbmUiLCJjb3JlIiwiVGltZWxpbmUiLCJzY3JvbGxUcmFjayIsIlRyYWNrIiwiYWRkIiwiTGF5ZXIiLCJ5RG9tYWluIiwiTGF5ZXJUaW1lQ29udGV4dCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJTZWdtZW50IiwiZCIsImRpc3BsYXlIYW5kbGVycyIsInVwZGF0ZUNvbnRhaW5lciIsIl9zY3JvbGxUaW1lbGluZSIsIl9zY3JvbGxUcmFjayIsIl9zY3JvbGxCYXIiLCJvbiIsIl96b29tU3RhdGUiLCJfc2Nyb2xsU3RhdGUiLCJhZGRMaXN0ZW5lciIsIkVWRU5UUyIsIkNVUlJFTlRfUE9TSVRJT04iLCJ0cmFjayIsInVuaW5zdGFsbCIsInJlbW92ZSIsInJlbW92ZUxpc3RlbmVyIiwidmFsdWUiLCJtYWludGFpblZpc2libGVEdXJhdGlvbiIsInJlbmRlciIsImJ1ZmZlciIsIm1ldGFkYXRhcyIsInNldFRyYWNrIiwiaGl0TGF5ZXJzIiwiaW5kZXhPZiIsImxheWVyIiwic3RhdGUiLCJoYXNFbGVtZW50IiwidGFyZ2V0IiwiY3VycmVudFBvc2l0aW9uIiwibWFpblRpbWVsaW5lIiwibWFpblRyYWNrIiwiY2VudGVyU2NyZWVuUG9zaXRpb24iLCJsYXN0SGFsZlNjcmVlblBvc2l0aW9uIiwiekluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUVaLElBQU1DLFNBQVNELEdBQUdFLEtBQUgsQ0FBU0QsTUFBeEI7O0lBRU1FLFM7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CQyxRQUFuQixFQUE2QkMsU0FBN0IsRUFBd0M7QUFBQTs7QUFBQSw0SUFDaENELFFBRGdDOztBQUd0QyxVQUFL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QztBQUNBLFlBQU1pRix1QkFBdUIsQ0FBRXJGLE1BQUYsR0FBWUksa0JBQWtCLENBQTNEO0FBQ0EsWUFBTWtGLHlCQUF5QnBHLFdBQVlrQixrQkFBa0IsQ0FBN0Q7O0FBRUEsWUFBSThFLGtCQUFrQkcsb0JBQWxCLElBQTBDSCxrQkFBa0JJLHNCQUFoRSxFQUF3RjtBQUN0RixjQUFNM0UsS0FBS3VFLGtCQUFrQkcsb0JBQTdCO0FBQ0EsY0FBTXBGLEtBQUtTLGdCQUFnQnRCLFdBQWhCLENBQTRCYSxFQUE1QixDQUFYO0FBQ0FELG9CQUFVVyxFQUFWOztBQUVBRCwwQkFBZ0JWLE1BQWhCLEdBQXlCQSxNQUF6QjtBQUNBb0Ysb0JBQVU5RSxNQUFWO0FBQ0E7QUFDQSxlQUFLcUQsVUFBTCxDQUFnQnJELE1BQWhCO0FBQ0Q7QUFDRjtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7OztzQkF0TVU1QyxLLEVBQU87QUFDZix5SEFBY0EsS0FBZDtBQUNBLFdBQUtpRSxVQUFMLENBQWdCakUsS0FBaEIsR0FBd0IsS0FBS0EsS0FBN0I7QUFDRCxLO3dCQUVXO0FBQ1Y7QUFDRDs7O3NCQUVVNkgsTSxFQUFRO0FBQ2pCLDBIQUFlQSxNQUFmO0FBQ0EsV0FBSzVELFVBQUwsQ0FBZ0I0RCxNQUFoQixHQUF5QixLQUFLQSxNQUE5QjtBQUNELEs7d0JBRVk7QUFDWDtBQUNEOzs7OztrQkF5TFk5RCxVIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgR3JpZEF4aXNNb2R1bGUgZnJvbSAnLi9HcmlkQXhpc01vZHVsZSc7XG5pbXBvcnQgVGltZUF4aXNNb2R1bGUgZnJvbSAnLi9UaW1lQXhpc01vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHNjYWxlcyA9IHVpLnV0aWxzLnNjYWxlcztcblxuY2xhc3MgWm9vbVN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrLCB0aW1lbGluZSwgc2Nyb2xsQmFyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgIHRoaXMuc2Nyb2xsQmFyID0gc2Nyb2xsQmFyO1xuXG4gICAgdGhpcy5fcGl4ZWxUb0V4cG9uZW50ID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCBibG9jay5oZWlnaHRdKVxuICAgICAgLnJhbmdlKFswLCAxXSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuYmxvY2sgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmluaXRpYWxab29tID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC56b29tO1xuICAgIHRoaXMuaW5pdGlhbFkgPSBlLnk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gcHJldmVudCBhbm5veWluZyB0ZXh0IHNlbGVjdGlvbiB3aGVuIGRyYWdnaW5nXG4gICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBkZWZpbmUgbWF4L21pbiB6b29tXG4gICAgY29uc3QgbWF4Wm9vbSA9IDQ0MTAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3QgbWluWm9vbSA9IDE7XG5cbiAgICBjb25zdCB0cmFja0R1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgbGFzdENlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBleHBvbmVudCA9IHRoaXMuX3BpeGVsVG9FeHBvbmVudChlLnkgLSB0aGlzLmluaXRpYWxZKTtcbiAgICBjb25zdCB0YXJnZXRab29tID0gdGhpcy5pbml0aWFsWm9vbSAqIE1hdGgucG93KDIsIGV4cG9uZW50KTtcblxuICAgIHRpbWVDb250ZXh0Lnpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0YXJnZXRab29tLCBtaW5ab29tKSwgbWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBjbGFtcCB6b29tZWQgd2F2ZWZvcm0gaW4gc2NyZWVuXG4gICAgY29uc3QgbmV3T2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0ICsgZGVsdGEgKyB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCk7XG4gICAgY29uc3QgbWF4T2Zmc2V0ID0gMDtcbiAgICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb24gLSB0cmFja0R1cmF0aW9uO1xuXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgobWluT2Zmc2V0LCBNYXRoLm1pbihtYXhPZmZzZXQsIG5ld09mZnNldCkpO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gICAgdGhpcy5zY3JvbGxCYXIudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge31cbn1cblxuXG5jbGFzcyBTY3JvbGxTdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3RvcihibG9jaywgdGltZWxpbmUsIHNjcm9sbEJhcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLnNjcm9sbEJhciA9IHNjcm9sbEJhcjtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHRyYWNrRHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuICAgIGNvbnN0IGR0ID0gdGhpcy5zY3JvbGxCYXIudGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUuZHgpO1xuXG4gICAgLy8gbWFuaXB1YXRlIGFuZCBjbGFtcCBvZmZzZXQgb2YgdGhlIG1haW4gdGltZWxpbmVcbiAgICBjb25zdCBuZXdPZmZzZXQgPSBtYWluVGltZUNvbnRleHQub2Zmc2V0IC0gZHQ7XG4gICAgY29uc3QgbWF4T2Zmc2V0ID0gMDtcbiAgICBjb25zdCBtaW5PZmZzZXQgPSBtYWluVGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uIC0gdHJhY2tEdXJhdGlvbjtcblxuICAgIG1haW5UaW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heChtaW5PZmZzZXQsIE1hdGgubWluKG1heE9mZnNldCwgbmV3T2Zmc2V0KSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgICB0aGlzLnNjcm9sbEJhci51cGRhdGUoKTtcbiAgfVxufVxuXG5cblxuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgYXhpc1R5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWyd0aW1lJywgJ2dyaWQnXSxcbiAgICBkZWZhdWx0OiAndGltZScsXG4gIH0sXG4gIHNjcm9sbEJhckNvbnRhaW5lcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6ICcnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ1NTIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IHRoYXQgc2hvdWxkIGNvbnRhaW4gdGhlIHNjcm9sbCBiYXInLFxuICAgIH0sXG4gIH0sXG4gIHNjcm9sbEJhckhlaWdodDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIHN0ZXA6IDEsXG4gICAgZGVmYXVsdDogMTAsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdoZWlnaHQgb2YgdGhlIHNjcm9sbC1iYXIsIGlzIHJlbW92ZWQgZnJvbSAnXG4gICAgfVxuICB9LFxuICBjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogYGtlZXAgd2F2ZWZvcm0gY2VudGVyIGFyb3VuZCB0aGUgYmxvY2sncyBjdXJyZW50IHBvc2l0aW9uYCxcbiAgICB9LFxuICB9LFxuICAvLyBAdG9kbyAtIGFsbG93IHN3aXRjaGluZyBiZXR3ZWVuIHRpbWUgYW5kIGdyaWQgYXhpc1xuICAvLyBheGlzOiB7fVxufVxuXG4vKipcbiAqXG4gKi9cbmNsYXNzIFpvb21Nb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYXhpc01vZHVsZSA9IHRoaXMucGFyYW1zLmdldCgnYXhpc1R5cGUnKSA9PT0gJ2dyaWQnID9cbiAgICAgIG5ldyBHcmlkQXhpc01vZHVsZSgpIDogbmV3IFRpbWVBeGlzTW9kdWxlKCk7XG5cbiAgICB0aGlzLl9vblNjcm9sbEJhck1vdXNlRXZlbnQgPSB0aGlzLl9vblNjcm9sbEJhck1vdXNlRXZlbnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91cGRhdGVPZmZzZXQgPSB0aGlzLl91cGRhdGVPZmZzZXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHNldCBibG9jayhibG9jaykge1xuICAgIHN1cGVyLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5heGlzTW9kdWxlLmJsb2NrID0gdGhpcy5ibG9jaztcbiAgfVxuXG4gIGdldCBibG9jaygpIHtcbiAgICByZXR1cm4gc3VwZXIuYmxvY2s7XG4gIH1cblxuICBzZXQgekluZGV4KHpJbmRleCkge1xuICAgIHN1cGVyLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLmF4aXNNb2R1bGUuekluZGV4ID0gdGhpcy56SW5kZXg7XG4gIH1cblxuICBnZXQgekluZGV4KCkge1xuICAgIHJldHVybiBzdXBlci56SW5kZXg7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIHRoaXMuYXhpc01vZHVsZS5pbnN0YWxsKCk7XG5cbiAgICBsZXQgJGNvbnRhaW5lciA9IHRoaXMucGFyYW1zLmdldCgnc2Nyb2xsQmFyQ29udGFpbmVyJyk7XG5cbiAgICBpZiAoISgkY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCkpXG4gICAgICAkY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigkY29udGFpbmVyKTtcblxuICAgIC8vIGNyZWF0ZSBhIG5ldyB0aW1lbGluZSB0byBob3N0IHRoZSBzY3JvbGwgYmFyXG4gICAgY29uc3QgdmlzaWJsZVdpZHRoID0gdGhpcy5ibG9jay53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5nZXQoJ3Njcm9sbEJhckhlaWdodCcpO1xuXG4gICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHZpc2libGVXaWR0aCArICdweCc7XG4gICAgJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgLy8gaW5pdCB3aXRoIGR1bW15IHBpeGVsIHBlciBzZWNvbmRcbiAgICBjb25zdCBzY3JvbGxUaW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHZpc2libGVXaWR0aCk7XG4gICAgY29uc3Qgc2Nyb2xsVHJhY2sgPSBuZXcgdWkuY29yZS5UcmFjaygkY29udGFpbmVyLCBoZWlnaHQpO1xuXG4gICAgc2Nyb2xsVGltZWxpbmUuYWRkKHNjcm9sbFRyYWNrLCAnc2Nyb2xsJyk7XG5cbiAgICAvLyBkYXRhIG9mIHRoZSBzY3JvbGwgYmFyIGlzIHRoZSB0aW1lQ29udGV4dCBvZiB0aGUgbWFpbiB0aW1lbGluZVxuICAgIGNvbnN0IG1haW5UaW1lQ29udGV4dCA9IHRoaXMuYmxvY2sudWkudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3Qgc2Nyb2xsQmFyID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2VudGl0eScsIG1haW5UaW1lQ29udGV4dCwge1xuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IG5ldyB1aS5jb3JlLkxheWVyVGltZUNvbnRleHQoc2Nyb2xsVGltZWxpbmUudGltZUNvbnRleHQpXG4gICAgc2Nyb2xsQmFyLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcblxuICAgIHNjcm9sbEJhci5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuU2VnbWVudCwge1xuICAgICAgeDogZCA9PiAtIGQub2Zmc2V0LFxuICAgICAgeTogZCA9PiAwLFxuICAgICAgd2lkdGg6IGQgPT4gZC52aXNpYmxlRHVyYXRpb24sXG4gICAgICBoZWlnaHQ6IGQgPT4gMSxcbiAgICB9LCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgc2Nyb2xsVHJhY2suYWRkKHNjcm9sbEJhciwgJ3Njcm9sbCcpO1xuICAgIHNjcm9sbFRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpO1xuXG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUgPSBzY3JvbGxUaW1lbGluZTtcbiAgICB0aGlzLl9zY3JvbGxUcmFjayA9IHNjcm9sbFRyYWNrO1xuICAgIHRoaXMuX3Njcm9sbEJhciA9IHNjcm9sbEJhcjtcbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5vbignZXZlbnQnLCB0aGlzLl9vblNjcm9sbEJhck1vdXNlRXZlbnQpO1xuXG4gICAgLy8gaW5pdCBzdGF0ZXNcbiAgICB0aGlzLl96b29tU3RhdGUgPSBuZXcgWm9vbVN0YXRlKHRoaXMuYmxvY2ssIHRoaXMuYmxvY2sudWkudGltZWxpbmUsIHRoaXMuX3Njcm9sbEJhcik7XG4gICAgdGhpcy5fc2Nyb2xsU3RhdGUgPSBuZXcgU2Nyb2xsU3RhdGUodGhpcy5ibG9jaywgdGhpcy5ibG9jay51aS50aW1lbGluZSwgdGhpcy5fc2Nyb2xsQmFyKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2NlbnRlcmVkQ3VycmVudFBvc2l0aW9uJykpXG4gICAgICBibG9jay5hZGRMaXN0ZW5lcihibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIHRpbWVsaW5lLnpvb20gPSAxO1xuICAgIHRpbWVsaW5lLm9mZnNldCA9IDA7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICB0aGlzLmF4aXNNb2R1bGUudW5pbnN0YWxsKHRoaXMuYmxvY2spO1xuXG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUucmVtb3ZlKHRoaXMuX3Njcm9sbFRyYWNrKTtcbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZSA9IG51bGw7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sgPSBudWxsO1xuICAgIHRoaXMuX3Njcm9sbEJhciA9IG51bGw7XG5cbiAgICB0aGlzLl96b29tU3RhdGUgPSBudWxsO1xuICAgIHRoaXMuX3Njcm9sbFN0YXRlID0gbnVsbDtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2NlbnRlcmVkQ3VycmVudFBvc2l0aW9uJykpXG4gICAgICBibG9jay5yZW1vdmVMaXN0ZW5lcihibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHNldFdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB0cnVlO1xuICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnZpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sucmVuZGVyKCk7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sudXBkYXRlKCk7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhcykge1xuICAgIHRoaXMuYXhpc01vZHVsZS5zZXRUcmFjayhtZXRhZGF0YXMpO1xuICAgIC8vIHJlc2V0IHpvb21cbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIHRpbWVsaW5lLnpvb20gPSAxO1xuICAgIHRpbWVsaW5lLm9mZnNldCA9IDA7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICAvLyByZXNldCBzY3JvbGxcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuYmxvY2suZHVyYXRpb247XG4gICAgY29uc3QgcGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5ibG9jay53aWR0aCAvIGR1cmF0aW9uO1xuXG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUucGl4ZWxzUGVyU2Vjb25kID0gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMuX3Njcm9sbEJhci50aW1lQ29udGV4dC5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sucmVuZGVyKCk7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGFyZSBmb3J3YXJkZWQgYnkgdGhlIEJhc2VQbGF5ZXIsIG9yaWdpbmF0ZSBmcm9tIHRoZSBtYWluIHRpbWVsaW5lLlxuICAgKi9cbiAgb25FdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG5cbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgLy8gQHRvZG8gLSBjYW4ndCB6b29tIGlmXG4gICAgICAgIC8vIGBwbGF5Q29udHJvbC5ydW5uaW5nID09PSB0cnVlYCAmJiBgY2VudGVyZWRDdXJyZW50UG9zaXRpb24gPT09IHRydWVgXG4gICAgICAgIGlmIChoaXRMYXllcnMuaW5kZXhPZih0aGlzLmF4aXNNb2R1bGUubGF5ZXIpICE9PSAtMSkge1xuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fem9vbVN0YXRlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3pvb21TdGF0ZSlcbiAgICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBzY3JvbGwgdGltZWxpbmUuXG4gICAqL1xuICBfb25TY3JvbGxCYXJNb3VzZUV2ZW50KGUpIHtcbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG5cbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgaWYgKHRoaXMuX3Njcm9sbEJhci5oYXNFbGVtZW50KGUudGFyZ2V0KSlcbiAgICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IHRoaXMuX3Njcm9sbFN0YXRlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIC8vIGZvcndhcmQgZXZlbnQgZnJvbSBzY3JvbGwgdGltZWxpbmUgdG8gbWFpbiB0aW1lbGluZVxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Njcm9sbFN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Njcm9sbFN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZU9mZnNldChjdXJyZW50UG9zaXRpb24pIHtcbiAgICBjb25zdCBtYWluVGltZWxpbmUgPSB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lO1xuICAgIGNvbnN0IG1haW5UcmFjayA9IHRoaXMuYmxvY2sudWkudHJhY2s7XG4gICAgY29uc3QgbWFpblRpbWVDb250ZXh0ID0gbWFpblRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcblxuICAgIC8vIHpvb20gY2Fubm90IGJlIDwgMSAoY2YuIFpvb21TdGF0ZSlcbiAgICBpZiAobWFpblRpbWVDb250ZXh0Lnpvb20gPiAxKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gbWFpblRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICAgIGNvbnN0IHZpc2libGVEdXJhdGlvbiA9IG1haW5UaW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gICAgICBjb25zdCBjZW50ZXJTY3JlZW5Qb3NpdGlvbiA9IC0gb2Zmc2V0ICsgKHZpc2libGVEdXJhdGlvbiAvIDIpO1xuICAgICAgY29uc3QgbGFzdEhhbGZTY3JlZW5Qb3NpdGlvbiA9IGR1cmF0aW9uIC0gKHZpc2libGVEdXJhdGlvbiAvIDIpO1xuXG4gICAgICBpZiAoY3VycmVudFBvc2l0aW9uID4gY2VudGVyU2NyZWVuUG9zaXRpb24gJiYgY3VycmVudFBvc2l0aW9uIDwgbGFzdEhhbGZTY3JlZW5Qb3NpdGlvbikge1xuICAgICAgICBjb25zdCBkdCA9IGN1cnJlbnRQb3NpdGlvbiAtIGNlbnRlclNjcmVlblBvc2l0aW9uO1xuICAgICAgICBjb25zdCBkeCA9IG1haW5UaW1lQ29udGV4dC50aW1lVG9QaXhlbChkeCk7XG4gICAgICAgIG9mZnNldCAtPSBkdDtcblxuICAgICAgICBtYWluVGltZUNvbnRleHQub2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICBtYWluVHJhY2sudXBkYXRlKCk7XG4gICAgICAgIC8vIHVwZGF0ZSBzY3JvbGwgYmFyXG4gICAgICAgIHRoaXMuX3Njcm9sbEJhci51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHRvZG8gLSBpbnN0YWxsIHRoZXNlIGRpcmVjdGx5IG9uIHRoZSBibG9jayA/ICovXG4gIC8vIHpvb21JbigpIHt9XG4gIC8vIHpvb21PdXQoKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBab29tTW9kdWxlO1xuIl19