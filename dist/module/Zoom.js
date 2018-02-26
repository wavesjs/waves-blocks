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

var _GridAxis = require('./GridAxis');

var _GridAxis2 = _interopRequireDefault(_GridAxis);

var _TimeAxis = require('./TimeAxis');

var _TimeAxis2 = _interopRequireDefault(_TimeAxis);

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
      desc: 'height of the scroll-bar'
    }
  },
  scrollBarColor: {
    type: 'string',
    default: '#000000',
    metas: {
      desc: 'color of the scroll-bar'
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
var Zoom = function (_AbstractModule) {
  (0, _inherits3.default)(Zoom, _AbstractModule);

  function Zoom(options) {
    (0, _classCallCheck3.default)(this, Zoom);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (Zoom.__proto__ || (0, _getPrototypeOf2.default)(Zoom)).call(this, parameters, options));

    _this3.axisModule = _this3.params.get('axisType') === 'grid' ? new _GridAxis2.default() : new _TimeAxis2.default();

    _this3._onScrollBarMouseEvent = _this3._onScrollBarMouseEvent.bind(_this3);
    _this3._updateOffset = _this3._updateOffset.bind(_this3);
    return _this3;
  }

  (0, _createClass3.default)(Zoom, [{
    key: 'install',
    value: function install() {
      var _this4 = this;

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
        },
        color: function color(d) {
          return _this4.params.get('scrollBarColor');
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

      if (this.params.get('centeredCurrentPosition')) this.block.addListener(this.block.EVENTS.CURRENT_POSITION, this._updateOffset);
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
      (0, _set3.default)(Zoom.prototype.__proto__ || (0, _getPrototypeOf2.default)(Zoom.prototype), 'block', block, this);
      this.axisModule.block = this.block;
    },
    get: function get() {
      return (0, _get3.default)(Zoom.prototype.__proto__ || (0, _getPrototypeOf2.default)(Zoom.prototype), 'block', this);
    }
  }, {
    key: 'zIndex',
    set: function set(zIndex) {
      (0, _set3.default)(Zoom.prototype.__proto__ || (0, _getPrototypeOf2.default)(Zoom.prototype), 'zIndex', zIndex, this);
      this.axisModule.zIndex = this.zIndex;
    },
    get: function get() {
      return (0, _get3.default)(Zoom.prototype.__proto__ || (0, _getPrototypeOf2.default)(Zoom.prototype), 'zIndex', this);
    }
  }]);
  return Zoom;
}(_AbstractModule3.default);

exports.default = Zoom;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJzY2FsZXMiLCJ1dGlscyIsIlpvb21TdGF0ZSIsImJsb2NrIiwidGltZWxpbmUiLCJzY3JvbGxCYXIiLCJfcGl4ZWxUb0V4cG9uZW50IiwibGluZWFyIiwiZG9tYWluIiwiaGVpZ2h0IiwicmFuZ2UiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJpbml0aWFsWm9vbSIsInRpbWVDb250ZXh0Iiwiem9vbSIsImluaXRpYWxZIiwieSIsIm9yaWdpbmFsRXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm1heFpvb20iLCJwaXhlbHNQZXJTZWNvbmQiLCJtaW5ab29tIiwidHJhY2tEdXJhdGlvbiIsImR1cmF0aW9uIiwibGFzdENlbnRlclRpbWUiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsIngiLCJleHBvbmVudCIsInRhcmdldFpvb20iLCJNYXRoIiwicG93IiwibWluIiwibWF4IiwibmV3Q2VudGVyVGltZSIsImRlbHRhIiwibmV3T2Zmc2V0Iiwib2Zmc2V0IiwiZHgiLCJtYXhPZmZzZXQiLCJtaW5PZmZzZXQiLCJ2aXNpYmxlRHVyYXRpb24iLCJ0cmFja3MiLCJ1cGRhdGUiLCJzdGF0ZXMiLCJCYXNlU3RhdGUiLCJTY3JvbGxTdGF0ZSIsIm1haW5UaW1lQ29udGV4dCIsImR0IiwicGFyYW1ldGVycyIsImF4aXNUeXBlIiwibGlzdCIsImRlZmF1bHQiLCJzY3JvbGxCYXJDb250YWluZXIiLCJyZXF1aXJlZCIsIm1ldGFzIiwiZGVzYyIsInNjcm9sbEJhckhlaWdodCIsIkluZmluaXR5Iiwic3RlcCIsInNjcm9sbEJhckNvbG9yIiwiY2VudGVyZWRDdXJyZW50UG9zaXRpb24iLCJjb25zdGFudCIsIlpvb20iLCJvcHRpb25zIiwiYXhpc01vZHVsZSIsInBhcmFtcyIsImdldCIsIl9vblNjcm9sbEJhck1vdXNlRXZlbnQiLCJiaW5kIiwiX3VwZGF0ZU9mZnNldCIsImluc3RhbGwiLCIkY29udGFpbmVyIiwiRWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInZpc2libGVXaWR0aCIsIndpZHRoIiwic3R5bGUiLCJzY3JvbGxUaW1lbGluZSIsImNvcmUiLCJUaW1lbGluZSIsInNjcm9sbFRyYWNrIiwiVHJhY2siLCJhZGQiLCJMYXllciIsInlEb21haW4iLCJMYXllclRpbWVDb250ZXh0Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlNlZ21lbnQiLCJkIiwiY29sb3IiLCJkaXNwbGF5SGFuZGxlcnMiLCJ1cGRhdGVDb250YWluZXIiLCJfc2Nyb2xsVGltZWxpbmUiLCJfc2Nyb2xsVHJhY2siLCJfc2Nyb2xsQmFyIiwib24iLCJfem9vbVN0YXRlIiwiX3Njcm9sbFN0YXRlIiwiYWRkTGlzdGVuZXIiLCJFVkVOVFMiLCJDVVJSRU5UX1BPU0lUSU9OIiwidHJhY2siLCJ1bmluc3RhbGwiLCJyZW1vdmUiLCJyZW1vdmVMaXN0ZW5lciIsInZhbHVlIiwibWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJyZW5kZXIiLCJidWZmZXIiLCJtZXRhZGF0YXMiLCJzZXRUcmFjayIsImhpdExheWVycyIsImluZGV4T2YiLCJsYXllciIsInN0YXRlIiwiaGFzRWxlbWVudCIsInRhcmdldCIsImN1cnJlbnRQb3NpdGlvbiIsIm1haW5UaW1lbGluZSIsIm1haW5UcmFjayIsImNlbnRlclNjcmVlblBvc2l0aW9uIiwibGFzdEhhbGZTY3JlZW5Qb3NpdGlvbiIsInpJbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxTQUFTRCxHQUFHRSxLQUFILENBQVNELE1BQXhCOztJQUVNRSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsUUFBbkIsRUFBNkJDLFNBQTdCLEVBQXdDO0FBQUE7O0FBQUEsNElBQ2hD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SixFQUFYLENBQWM4RyxLQUFoQztBQUNBLFVBQU0xRCxrQkFBa0IyRSxhQUFhN0csV0FBckM7QUFDQSxVQUFNVSxXQUFXLEtBQUt4QixLQUFMLENBQVd3QixRQUE1Qjs7QUFFQTtBQUNBLFVBQUl3QixnQkFBZ0JqQyxJQUFoQixHQUF1QixDQUEzQixFQUE4QjtBQUM1QixZQUFJdUIsU0FBU1UsZ0JBQWdCVixNQUE3QjtBQUNBLFlBQU1JLGtCQUFrQk0sZ0JBQWdCTixlQUF4QztBQUNBLFlBQU1tRix1QkFBdUIsQ0FBRXZGLE1BQUYsR0FBWUksa0JBQWtCLENBQTNEO0FBQ0EsWUFBTW9GLHlCQUF5QnRHLFdBQVlrQixrQkFBa0IsQ0FBN0Q7O0FBRUEsWUFBSWdGLGtCQUFrQkcsb0JBQWxCLElBQTBDSCxrQkFBa0JJLHNCQUFoRSxFQUF3RjtBQUN0RixjQUFNN0UsS0FBS3lFLGtCQUFrQkcsb0JBQTdCO0FBQ0EsY0FBTXRGLEtBQUtTLGdCQUFnQnRCLFdBQWhCLENBQTRCYSxFQUE1QixDQUFYO0FBQ0FELG9CQUFVVyxFQUFWOztBQUVBRCwwQkFBZ0JWLE1BQWhCLEdBQXlCQSxNQUF6QjtBQUNBc0Ysb0JBQVVoRixNQUFWO0FBQ0E7QUFDQSxlQUFLdUQsVUFBTCxDQUFnQnZELE1BQWhCO0FBQ0Q7QUFDRjtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7OztzQkF2TVU1QyxLLEVBQU87QUFDZiw2R0FBY0EsS0FBZDtBQUNBLFdBQUtrRSxVQUFMLENBQWdCbEUsS0FBaEIsR0FBd0IsS0FBS0EsS0FBN0I7QUFDRCxLO3dCQUVXO0FBQ1Y7QUFDRDs7O3NCQUVVK0gsTSxFQUFRO0FBQ2pCLDhHQUFlQSxNQUFmO0FBQ0EsV0FBSzdELFVBQUwsQ0FBZ0I2RCxNQUFoQixHQUF5QixLQUFLQSxNQUE5QjtBQUNELEs7d0JBRVk7QUFDWDtBQUNEOzs7OztrQkEwTFkvRCxJIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgR3JpZEF4aXMgZnJvbSAnLi9HcmlkQXhpcyc7XG5pbXBvcnQgVGltZUF4aXMgZnJvbSAnLi9UaW1lQXhpcyc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHNjYWxlcyA9IHVpLnV0aWxzLnNjYWxlcztcblxuY2xhc3MgWm9vbVN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrLCB0aW1lbGluZSwgc2Nyb2xsQmFyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgIHRoaXMuc2Nyb2xsQmFyID0gc2Nyb2xsQmFyO1xuXG4gICAgdGhpcy5fcGl4ZWxUb0V4cG9uZW50ID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCBibG9jay5oZWlnaHRdKVxuICAgICAgLnJhbmdlKFswLCAxXSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuYmxvY2sgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmluaXRpYWxab29tID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC56b29tO1xuICAgIHRoaXMuaW5pdGlhbFkgPSBlLnk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gcHJldmVudCBhbm5veWluZyB0ZXh0IHNlbGVjdGlvbiB3aGVuIGRyYWdnaW5nXG4gICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBkZWZpbmUgbWF4L21pbiB6b29tXG4gICAgY29uc3QgbWF4Wm9vbSA9IDQ0MTAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3QgbWluWm9vbSA9IDE7XG5cbiAgICBjb25zdCB0cmFja0R1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgbGFzdENlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBleHBvbmVudCA9IHRoaXMuX3BpeGVsVG9FeHBvbmVudChlLnkgLSB0aGlzLmluaXRpYWxZKTtcbiAgICBjb25zdCB0YXJnZXRab29tID0gdGhpcy5pbml0aWFsWm9vbSAqIE1hdGgucG93KDIsIGV4cG9uZW50KTtcblxuICAgIHRpbWVDb250ZXh0Lnpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0YXJnZXRab29tLCBtaW5ab29tKSwgbWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBjbGFtcCB6b29tZWQgd2F2ZWZvcm0gaW4gc2NyZWVuXG4gICAgY29uc3QgbmV3T2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0ICsgZGVsdGEgKyB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCk7XG4gICAgY29uc3QgbWF4T2Zmc2V0ID0gMDtcbiAgICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb24gLSB0cmFja0R1cmF0aW9uO1xuXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgobWluT2Zmc2V0LCBNYXRoLm1pbihtYXhPZmZzZXQsIG5ld09mZnNldCkpO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gICAgdGhpcy5zY3JvbGxCYXIudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge31cbn1cblxuXG5jbGFzcyBTY3JvbGxTdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3RvcihibG9jaywgdGltZWxpbmUsIHNjcm9sbEJhcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLnNjcm9sbEJhciA9IHNjcm9sbEJhcjtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHRyYWNrRHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuICAgIGNvbnN0IGR0ID0gdGhpcy5zY3JvbGxCYXIudGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUuZHgpO1xuXG4gICAgLy8gbWFuaXB1YXRlIGFuZCBjbGFtcCBvZmZzZXQgb2YgdGhlIG1haW4gdGltZWxpbmVcbiAgICBjb25zdCBuZXdPZmZzZXQgPSBtYWluVGltZUNvbnRleHQub2Zmc2V0IC0gZHQ7XG4gICAgY29uc3QgbWF4T2Zmc2V0ID0gMDtcbiAgICBjb25zdCBtaW5PZmZzZXQgPSBtYWluVGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uIC0gdHJhY2tEdXJhdGlvbjtcblxuICAgIG1haW5UaW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heChtaW5PZmZzZXQsIE1hdGgubWluKG1heE9mZnNldCwgbmV3T2Zmc2V0KSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgICB0aGlzLnNjcm9sbEJhci51cGRhdGUoKTtcbiAgfVxufVxuXG5cblxuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgYXhpc1R5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWyd0aW1lJywgJ2dyaWQnXSxcbiAgICBkZWZhdWx0OiAndGltZScsXG4gIH0sXG4gIHNjcm9sbEJhckNvbnRhaW5lcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6ICcnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ1NTIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IHRoYXQgc2hvdWxkIGNvbnRhaW4gdGhlIHNjcm9sbCBiYXInLFxuICAgIH0sXG4gIH0sXG4gIHNjcm9sbEJhckhlaWdodDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIHN0ZXA6IDEsXG4gICAgZGVmYXVsdDogMTAsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdoZWlnaHQgb2YgdGhlIHNjcm9sbC1iYXInXG4gICAgfVxuICB9LFxuICBzY3JvbGxCYXJDb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcjMDAwMDAwJyxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2NvbG9yIG9mIHRoZSBzY3JvbGwtYmFyJ1xuICAgIH1cbiAgfSxcbiAgY2VudGVyZWRDdXJyZW50UG9zaXRpb246IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6IGBrZWVwIHdhdmVmb3JtIGNlbnRlciBhcm91bmQgdGhlIGJsb2NrJ3MgY3VycmVudCBwb3NpdGlvbmAsXG4gICAgfSxcbiAgfSxcbiAgLy8gQHRvZG8gLSBhbGxvdyBzd2l0Y2hpbmcgYmV0d2VlbiB0aW1lIGFuZCBncmlkIGF4aXNcbiAgLy8gYXhpczoge31cbn1cblxuLyoqXG4gKlxuICovXG5jbGFzcyBab29tIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmF4aXNNb2R1bGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2F4aXNUeXBlJykgPT09ICdncmlkJyA/XG4gICAgICBuZXcgR3JpZEF4aXMoKSA6IG5ldyBUaW1lQXhpcygpO1xuXG4gICAgdGhpcy5fb25TY3JvbGxCYXJNb3VzZUV2ZW50ID0gdGhpcy5fb25TY3JvbGxCYXJNb3VzZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdXBkYXRlT2Zmc2V0ID0gdGhpcy5fdXBkYXRlT2Zmc2V0LmJpbmQodGhpcyk7XG4gIH1cblxuICBzZXQgYmxvY2soYmxvY2spIHtcbiAgICBzdXBlci5ibG9jayA9IGJsb2NrO1xuICAgIHRoaXMuYXhpc01vZHVsZS5ibG9jayA9IHRoaXMuYmxvY2s7XG4gIH1cblxuICBnZXQgYmxvY2soKSB7XG4gICAgcmV0dXJuIHN1cGVyLmJsb2NrO1xuICB9XG5cbiAgc2V0IHpJbmRleCh6SW5kZXgpIHtcbiAgICBzdXBlci56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5heGlzTW9kdWxlLnpJbmRleCA9IHRoaXMuekluZGV4O1xuICB9XG5cbiAgZ2V0IHpJbmRleCgpIHtcbiAgICByZXR1cm4gc3VwZXIuekluZGV4O1xuICB9XG5cbiAgaW5zdGFsbCgpIHtcbiAgICB0aGlzLmF4aXNNb2R1bGUuaW5zdGFsbCgpO1xuXG4gICAgbGV0ICRjb250YWluZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ3Njcm9sbEJhckNvbnRhaW5lcicpO1xuXG4gICAgaWYgKCEoJGNvbnRhaW5lciBpbnN0YW5jZW9mIEVsZW1lbnQpKVxuICAgICAgJGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJGNvbnRhaW5lcik7XG5cbiAgICAvLyBjcmVhdGUgYSBuZXcgdGltZWxpbmUgdG8gaG9zdCB0aGUgc2Nyb2xsIGJhclxuICAgIGNvbnN0IHZpc2libGVXaWR0aCA9IHRoaXMuYmxvY2sud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJIZWlnaHQnKTtcblxuICAgICRjb250YWluZXIuc3R5bGUud2lkdGggPSB2aXNpYmxlV2lkdGggKyAncHgnO1xuICAgICRjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuICAgIC8vIGluaXQgd2l0aCBkdW1teSBwaXhlbCBwZXIgc2Vjb25kXG4gICAgY29uc3Qgc2Nyb2xsVGltZWxpbmUgPSBuZXcgdWkuY29yZS5UaW1lbGluZSgxLCB2aXNpYmxlV2lkdGgpO1xuICAgIGNvbnN0IHNjcm9sbFRyYWNrID0gbmV3IHVpLmNvcmUuVHJhY2soJGNvbnRhaW5lciwgaGVpZ2h0KTtcblxuICAgIHNjcm9sbFRpbWVsaW5lLmFkZChzY3JvbGxUcmFjaywgJ3Njcm9sbCcpO1xuXG4gICAgLy8gZGF0YSBvZiB0aGUgc2Nyb2xsIGJhciBpcyB0aGUgdGltZUNvbnRleHQgb2YgdGhlIG1haW4gdGltZWxpbmVcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHNjcm9sbEJhciA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBtYWluVGltZUNvbnRleHQsIHtcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHNjcm9sbFRpbWVsaW5lLnRpbWVDb250ZXh0KVxuICAgIHNjcm9sbEJhci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG5cbiAgICBzY3JvbGxCYXIuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLlNlZ21lbnQsIHtcbiAgICAgIHg6IGQgPT4gLSBkLm9mZnNldCxcbiAgICAgIHk6IGQgPT4gMCxcbiAgICAgIHdpZHRoOiBkID0+IGQudmlzaWJsZUR1cmF0aW9uLFxuICAgICAgaGVpZ2h0OiBkID0+IDEsXG4gICAgICBjb2xvcjogZCA9PiB0aGlzLnBhcmFtcy5nZXQoJ3Njcm9sbEJhckNvbG9yJyksXG4gICAgfSwge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHNjcm9sbFRyYWNrLmFkZChzY3JvbGxCYXIsICdzY3JvbGwnKTtcbiAgICBzY3JvbGxUcmFjay51cGRhdGVDb250YWluZXIoKTtcblxuICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lID0gc2Nyb2xsVGltZWxpbmU7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sgPSBzY3JvbGxUcmFjaztcbiAgICB0aGlzLl9zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUub24oJ2V2ZW50JywgdGhpcy5fb25TY3JvbGxCYXJNb3VzZUV2ZW50KTtcblxuICAgIC8vIGluaXQgc3RhdGVzXG4gICAgdGhpcy5fem9vbVN0YXRlID0gbmV3IFpvb21TdGF0ZSh0aGlzLmJsb2NrLCB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lLCB0aGlzLl9zY3JvbGxCYXIpO1xuICAgIHRoaXMuX3Njcm9sbFN0YXRlID0gbmV3IFNjcm9sbFN0YXRlKHRoaXMuYmxvY2ssIHRoaXMuYmxvY2sudWkudGltZWxpbmUsIHRoaXMuX3Njcm9sbEJhcik7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbicpKVxuICAgICAgdGhpcy5ibG9jay5hZGRMaXN0ZW5lcih0aGlzLmJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVPZmZzZXQpO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGltZWxpbmUuem9vbSA9IDE7XG4gICAgdGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIHRoaXMuYXhpc01vZHVsZS51bmluc3RhbGwodGhpcy5ibG9jayk7XG5cbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5yZW1vdmUodGhpcy5fc2Nyb2xsVHJhY2spO1xuICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lID0gbnVsbDtcbiAgICB0aGlzLl9zY3JvbGxUcmFjayA9IG51bGw7XG4gICAgdGhpcy5fc2Nyb2xsQmFyID0gbnVsbDtcblxuICAgIHRoaXMuX3pvb21TdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fc2Nyb2xsU3RhdGUgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRDdXJyZW50UG9zaXRpb24nKSlcbiAgICAgIGJsb2NrLnJlbW92ZUxpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVPZmZzZXQpO1xuICB9XG5cbiAgc2V0V2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IHRydWU7XG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUudmlzaWJsZVdpZHRoID0gdmFsdWU7XG5cbiAgICB0aGlzLl9zY3JvbGxUcmFjay5yZW5kZXIoKTtcbiAgICB0aGlzLl9zY3JvbGxUcmFjay51cGRhdGUoKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGFzKSB7XG4gICAgdGhpcy5heGlzTW9kdWxlLnNldFRyYWNrKG1ldGFkYXRhcyk7XG4gICAgLy8gcmVzZXQgem9vbVxuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGltZWxpbmUuem9vbSA9IDE7XG4gICAgdGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIC8vIHJlc2V0IHNjcm9sbFxuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLmJsb2NrLndpZHRoIC8gZHVyYXRpb247XG5cbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5waXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5fc2Nyb2xsQmFyLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gZHVyYXRpb247XG5cbiAgICB0aGlzLl9zY3JvbGxUcmFjay5yZW5kZXIoKTtcbiAgICB0aGlzLl9zY3JvbGxUcmFjay51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudHMgYXJlIGZvcndhcmRlZCBieSB0aGUgQmFzZVBsYXllciwgb3JpZ2luYXRlIGZyb20gdGhlIG1haW4gdGltZWxpbmUuXG4gICAqL1xuICBvbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICAvLyBAdG9kbyAtIGNhbid0IHpvb20gaWZcbiAgICAgICAgLy8gYHBsYXlDb250cm9sLnJ1bm5pbmcgPT09IHRydWVgICYmIGBjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbiA9PT0gdHJ1ZWBcbiAgICAgICAgaWYgKGhpdExheWVycy5pbmRleE9mKHRoaXMuYXhpc01vZHVsZS5sYXllcikgIT09IC0xKSB7XG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSB0aGlzLl96b29tU3RhdGU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fem9vbVN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGVtaXR0ZWQgYnkgdGhlIHNjcm9sbCB0aW1lbGluZS5cbiAgICovXG4gIF9vblNjcm9sbEJhck1vdXNlRXZlbnQoZSkge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICBpZiAodGhpcy5fc2Nyb2xsQmFyLmhhc0VsZW1lbnQoZS50YXJnZXQpKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fc2Nyb2xsU3RhdGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgLy8gZm9yd2FyZCBldmVudCBmcm9tIHNjcm9sbCB0aW1lbGluZSB0byBtYWluIHRpbWVsaW5lXG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlT2Zmc2V0KGN1cnJlbnRQb3NpdGlvbikge1xuICAgIGNvbnN0IG1haW5UaW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG4gICAgY29uc3QgbWFpblRyYWNrID0gdGhpcy5ibG9jay51aS50cmFjaztcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSBtYWluVGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuXG4gICAgLy8gem9vbSBjYW5ub3QgYmUgPCAxIChjZi4gWm9vbVN0YXRlKVxuICAgIGlmIChtYWluVGltZUNvbnRleHQuem9vbSA+IDEpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBtYWluVGltZUNvbnRleHQub2Zmc2V0O1xuICAgICAgY29uc3QgdmlzaWJsZUR1cmF0aW9uID0gbWFpblRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICAgIGNvbnN0IGNlbnRlclNjcmVlblBvc2l0aW9uID0gLSBvZmZzZXQgKyAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG4gICAgICBjb25zdCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uID0gZHVyYXRpb24gLSAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG5cbiAgICAgIGlmIChjdXJyZW50UG9zaXRpb24gPiBjZW50ZXJTY3JlZW5Qb3NpdGlvbiAmJiBjdXJyZW50UG9zaXRpb24gPCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGR0ID0gY3VycmVudFBvc2l0aW9uIC0gY2VudGVyU2NyZWVuUG9zaXRpb247XG4gICAgICAgIGNvbnN0IGR4ID0gbWFpblRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKGR4KTtcbiAgICAgICAgb2Zmc2V0IC09IGR0O1xuXG4gICAgICAgIG1haW5UaW1lQ29udGV4dC5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG1haW5UcmFjay51cGRhdGUoKTtcbiAgICAgICAgLy8gdXBkYXRlIHNjcm9sbCBiYXJcbiAgICAgICAgdGhpcy5fc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAdG9kbyAtIGluc3RhbGwgdGhlc2UgZGlyZWN0bHkgb24gdGhlIGJsb2NrID8gKi9cbiAgLy8gem9vbUluKCkge31cbiAgLy8gem9vbU91dCgpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFpvb207XG4iXX0=