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

  function ZoomState(block, timeline) {
    var scrollBar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
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

      if (this.scrollBar) this.scrollBar.update();
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
    default: null,
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

    _this3.hasScrollBar = false;

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

      if ($container !== null) {
        if (!($container instanceof Element)) $container = document.querySelector($container);

        this.hasScrollBar = true;

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

        this._scrollState = new ScrollState(this.block, this.block.ui.timeline, this._scrollBar);
        this._zoomState = new ZoomState(this.block, this.block.ui.timeline, this._scrollBar);
      } else {
        this._zoomState = new ZoomState(this.block, this.block.ui.timeline);
      }

      if (this.params.get('centeredCurrentPosition')) this.block.addListener(this.block.EVENTS.CURRENT_POSITION, this._updateOffset);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      var _block$ui = this.block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track;

      // reset zoom value

      timeline.zoom = 1;
      timeline.offset = 0;
      track.update();

      this.axisModule.uninstall(this.block);

      if (this.hasScrollBar) {
        this._scrollTimeline.removeListener('event', this._onScrollBarMouseEvent);
        this._scrollTimeline.remove(this._scrollTrack);
        this._scrollTimeline = null;
        this._scrollTrack = null;
        this._scrollBar = null;
        this._scrollState = null;
      }

      this._zoomState = null;

      if (this.params.get('centeredCurrentPosition')) block.removeListener(block.EVENTS.CURRENT_POSITION, this._updateOffset);
    }
  }, {
    key: 'setWidth',
    value: function setWidth(value) {
      if (this.hasScrollBar) {
        this._scrollTimeline.maintainVisibleDuration = true;
        this._scrollTimeline.visibleWidth = value;

        this._scrollTrack.render();
        this._scrollTrack.update();
      }
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

      if (this.hasScrollBar) {
        var duration = this.block.duration;
        var pixelsPerSecond = this.block.width / duration;

        this._scrollTimeline.pixelsPerSecond = pixelsPerSecond;
        this._scrollBar.timeContext.duration = duration;

        this._scrollTrack.render();
        this._scrollTrack.update();
      }
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

          if (this.hasScrollBar) this._scrollBar.update();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJzY2FsZXMiLCJ1dGlscyIsIlpvb21TdGF0ZSIsImJsb2NrIiwidGltZWxpbmUiLCJzY3JvbGxCYXIiLCJfcGl4ZWxUb0V4cG9uZW50IiwibGluZWFyIiwiZG9tYWluIiwiaGVpZ2h0IiwicmFuZ2UiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJpbml0aWFsWm9vbSIsInRpbWVDb250ZXh0Iiwiem9vbSIsImluaXRpYWxZIiwieSIsIm9yaWdpbmFsRXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm1heFpvb20iLCJwaXhlbHNQZXJTZWNvbmQiLCJtaW5ab29tIiwidHJhY2tEdXJhdGlvbiIsImR1cmF0aW9uIiwibGFzdENlbnRlclRpbWUiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsIngiLCJleHBvbmVudCIsInRhcmdldFpvb20iLCJNYXRoIiwicG93IiwibWluIiwibWF4IiwibmV3Q2VudGVyVGltZSIsImRlbHRhIiwibmV3T2Zmc2V0Iiwib2Zmc2V0IiwiZHgiLCJtYXhPZmZzZXQiLCJtaW5PZmZzZXQiLCJ2aXNpYmxlRHVyYXRpb24iLCJ0cmFja3MiLCJ1cGRhdGUiLCJzdGF0ZXMiLCJCYXNlU3RhdGUiLCJTY3JvbGxTdGF0ZSIsIm1haW5UaW1lQ29udGV4dCIsImR0IiwicGFyYW1ldGVycyIsImF4aXNUeXBlIiwibGlzdCIsImRlZmF1bHQiLCJzY3JvbGxCYXJDb250YWluZXIiLCJyZXF1aXJlZCIsIm1ldGFzIiwiZGVzYyIsInNjcm9sbEJhckhlaWdodCIsIkluZmluaXR5Iiwic3RlcCIsInNjcm9sbEJhckNvbG9yIiwiY2VudGVyZWRDdXJyZW50UG9zaXRpb24iLCJjb25zdGFudCIsIlpvb20iLCJvcHRpb25zIiwiYXhpc01vZHVsZSIsInBhcmFtcyIsImdldCIsImhhc1Njcm9sbEJhciIsIl9vblNjcm9sbEJhck1vdXNlRXZlbnQiLCJiaW5kIiwiX3VwZGF0ZU9mZnNldCIsImluc3RhbGwiLCIkY29udGFpbmVyIiwiRWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInZpc2libGVXaWR0aCIsIndpZHRoIiwic3R5bGUiLCJzY3JvbGxUaW1lbGluZSIsImNvcmUiLCJUaW1lbGluZSIsInNjcm9sbFRyYWNrIiwiVHJhY2siLCJhZGQiLCJMYXllciIsInlEb21haW4iLCJMYXllclRpbWVDb250ZXh0Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlNlZ21lbnQiLCJkIiwiY29sb3IiLCJkaXNwbGF5SGFuZGxlcnMiLCJ1cGRhdGVDb250YWluZXIiLCJfc2Nyb2xsVGltZWxpbmUiLCJfc2Nyb2xsVHJhY2siLCJfc2Nyb2xsQmFyIiwib24iLCJfc2Nyb2xsU3RhdGUiLCJfem9vbVN0YXRlIiwiYWRkTGlzdGVuZXIiLCJFVkVOVFMiLCJDVVJSRU5UX1BPU0lUSU9OIiwidHJhY2siLCJ1bmluc3RhbGwiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZSIsInZhbHVlIiwibWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJyZW5kZXIiLCJidWZmZXIiLCJtZXRhZGF0YXMiLCJzZXRUcmFjayIsImhpdExheWVycyIsImluZGV4T2YiLCJsYXllciIsInN0YXRlIiwiaGFzRWxlbWVudCIsInRhcmdldCIsImN1cnJlbnRQb3NpdGlvbiIsIm1haW5UaW1lbGluZSIsIm1haW5UcmFjayIsImNlbnRlclNjcmVlblBvc2l0aW9uIiwibGFzdEhhbGZTY3JlZW5Qb3NpdGlvbiIsInpJbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxTQUFTRCxHQUFHRSxLQUFILENBQVNELE1BQXhCOztJQUVNRSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsUUFBbkIsRUFBK0M7QUFBQSxRQUFsQkMsU0FB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QUFoQixHQUF5QkEsTUFBekI7QUFDQXVGLG9CQUFVakYsTUFBVjs7QUFFQSxjQUFJLEtBQUt5QixZQUFULEVBQ0UsS0FBSytCLFVBQUwsQ0FBZ0J4RCxNQUFoQjtBQUNIO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7Ozs7c0JBcE5VNUMsSyxFQUFPO0FBQ2YsNkdBQWNBLEtBQWQ7QUFDQSxXQUFLa0UsVUFBTCxDQUFnQmxFLEtBQWhCLEdBQXdCLEtBQUtBLEtBQTdCO0FBQ0QsSzt3QkFFVztBQUNWO0FBQ0Q7OztzQkFFVWdJLE0sRUFBUTtBQUNqQiw4R0FBZUEsTUFBZjtBQUNBLFdBQUs5RCxVQUFMLENBQWdCOEQsTUFBaEIsR0FBeUIsS0FBS0EsTUFBOUI7QUFDRCxLO3dCQUVZO0FBQ1g7QUFDRDs7Ozs7a0JBdU1ZaEUsSSIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0IEdyaWRBeGlzIGZyb20gJy4vR3JpZEF4aXMnO1xuaW1wb3J0IFRpbWVBeGlzIGZyb20gJy4vVGltZUF4aXMnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5jb25zdCBzY2FsZXMgPSB1aS51dGlscy5zY2FsZXM7XG5cbmNsYXNzIFpvb21TdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3RvcihibG9jaywgdGltZWxpbmUsIHNjcm9sbEJhciA9IG51bGwpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG5cbiAgICB0aGlzLl9waXhlbFRvRXhwb25lbnQgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIGJsb2NrLmhlaWdodF0pXG4gICAgICAucmFuZ2UoWzAsIDFdKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5ibG9jayA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuaW5pdGlhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG4gICAgdGhpcy5pbml0aWFsWSA9IGUueTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyBwcmV2ZW50IGFubm95aW5nIHRleHQgc2VsZWN0aW9uIHdoZW4gZHJhZ2dpbmdcbiAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIGRlZmluZSBtYXgvbWluIHpvb21cbiAgICBjb25zdCBtYXhab29tID0gNDQxMDAgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBtaW5ab29tID0gMTtcblxuICAgIGNvbnN0IHRyYWNrRHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuICAgIGNvbnN0IGV4cG9uZW50ID0gdGhpcy5fcGl4ZWxUb0V4cG9uZW50KGUueSAtIHRoaXMuaW5pdGlhbFkpO1xuICAgIGNvbnN0IHRhcmdldFpvb20gPSB0aGlzLmluaXRpYWxab29tICogTWF0aC5wb3coMiwgZXhwb25lbnQpO1xuXG4gICAgdGltZUNvbnRleHQuem9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRhcmdldFpvb20sIG1pblpvb20pLCBtYXhab29tKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBkZWx0YSA9IG5ld0NlbnRlclRpbWUgLSBsYXN0Q2VudGVyVGltZTtcblxuICAgIC8vIGNsYW1wIHpvb21lZCB3YXZlZm9ybSBpbiBzY3JlZW5cbiAgICBjb25zdCBuZXdPZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQgKyBkZWx0YSArIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KTtcbiAgICBjb25zdCBtYXhPZmZzZXQgPSAwO1xuICAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbiAtIHRyYWNrRHVyYXRpb247XG5cbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heChtaW5PZmZzZXQsIE1hdGgubWluKG1heE9mZnNldCwgbmV3T2Zmc2V0KSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbEJhcilcbiAgICAgIHRoaXMuc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHt9XG59XG5cblxuY2xhc3MgU2Nyb2xsU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IoYmxvY2ssIHRpbWVsaW5lLCBzY3JvbGxCYXIpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgY29uc3QgbWFpblRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCB0cmFja0R1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCBkdCA9IHRoaXMuc2Nyb2xsQmFyLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KTtcblxuICAgIC8vIG1hbmlwdWF0ZSBhbmQgY2xhbXAgb2Zmc2V0IG9mIHRoZSBtYWluIHRpbWVsaW5lXG4gICAgY29uc3QgbmV3T2Zmc2V0ID0gbWFpblRpbWVDb250ZXh0Lm9mZnNldCAtIGR0O1xuICAgIGNvbnN0IG1heE9mZnNldCA9IDA7XG4gICAgY29uc3QgbWluT2Zmc2V0ID0gbWFpblRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbiAtIHRyYWNrRHVyYXRpb247XG5cbiAgICBtYWluVGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgobWluT2Zmc2V0LCBNYXRoLm1pbihtYXhPZmZzZXQsIG5ld09mZnNldCkpO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gICAgdGhpcy5zY3JvbGxCYXIudXBkYXRlKCk7XG4gIH1cbn1cblxuXG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIGF4aXNUeXBlOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsndGltZScsICdncmlkJ10sXG4gICAgZGVmYXVsdDogJ3RpbWUnLFxuICB9LFxuICBzY3JvbGxCYXJDb250YWluZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ1NTIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IHRoYXQgc2hvdWxkIGNvbnRhaW4gdGhlIHNjcm9sbCBiYXInLFxuICAgIH0sXG4gIH0sXG4gIHNjcm9sbEJhckhlaWdodDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIHN0ZXA6IDEsXG4gICAgZGVmYXVsdDogMTAsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdoZWlnaHQgb2YgdGhlIHNjcm9sbC1iYXInXG4gICAgfVxuICB9LFxuICBzY3JvbGxCYXJDb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcjMDAwMDAwJyxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2NvbG9yIG9mIHRoZSBzY3JvbGwtYmFyJ1xuICAgIH1cbiAgfSxcbiAgY2VudGVyZWRDdXJyZW50UG9zaXRpb246IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6IGBrZWVwIHdhdmVmb3JtIGNlbnRlciBhcm91bmQgdGhlIGJsb2NrJ3MgY3VycmVudCBwb3NpdGlvbmAsXG4gICAgfSxcbiAgfSxcbiAgLy8gQHRvZG8gLSBhbGxvdyBzd2l0Y2hpbmcgYmV0d2VlbiB0aW1lIGFuZCBncmlkIGF4aXNcbiAgLy8gYXhpczoge31cbn1cblxuLyoqXG4gKlxuICovXG5jbGFzcyBab29tIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmF4aXNNb2R1bGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2F4aXNUeXBlJykgPT09ICdncmlkJyA/XG4gICAgICBuZXcgR3JpZEF4aXMoKSA6IG5ldyBUaW1lQXhpcygpO1xuXG4gICAgdGhpcy5oYXNTY3JvbGxCYXIgPSBmYWxzZTtcblxuICAgIHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudCA9IHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VwZGF0ZU9mZnNldCA9IHRoaXMuX3VwZGF0ZU9mZnNldC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc2V0IGJsb2NrKGJsb2NrKSB7XG4gICAgc3VwZXIuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLmF4aXNNb2R1bGUuYmxvY2sgPSB0aGlzLmJsb2NrO1xuICB9XG5cbiAgZ2V0IGJsb2NrKCkge1xuICAgIHJldHVybiBzdXBlci5ibG9jaztcbiAgfVxuXG4gIHNldCB6SW5kZXgoekluZGV4KSB7XG4gICAgc3VwZXIuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuYXhpc01vZHVsZS56SW5kZXggPSB0aGlzLnpJbmRleDtcbiAgfVxuXG4gIGdldCB6SW5kZXgoKSB7XG4gICAgcmV0dXJuIHN1cGVyLnpJbmRleDtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgdGhpcy5heGlzTW9kdWxlLmluc3RhbGwoKTtcblxuICAgIGxldCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJDb250YWluZXInKTtcblxuICAgIGlmICgkY29udGFpbmVyICE9PSBudWxsKSB7XG4gICAgICBpZiAoISgkY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCkpXG4gICAgICAgICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuXG4gICAgICB0aGlzLmhhc1Njcm9sbEJhciA9IHRydWU7XG5cbiAgICAgIC8vIGNyZWF0ZSBhIG5ldyB0aW1lbGluZSB0byBob3N0IHRoZSBzY3JvbGwgYmFyXG4gICAgICBjb25zdCB2aXNpYmxlV2lkdGggPSB0aGlzLmJsb2NrLndpZHRoO1xuICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJIZWlnaHQnKTtcblxuICAgICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHZpc2libGVXaWR0aCArICdweCc7XG4gICAgICAkY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cbiAgICAgIC8vIGluaXQgd2l0aCBkdW1teSBwaXhlbCBwZXIgc2Vjb25kXG4gICAgICBjb25zdCBzY3JvbGxUaW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHZpc2libGVXaWR0aCk7XG4gICAgICBjb25zdCBzY3JvbGxUcmFjayA9IG5ldyB1aS5jb3JlLlRyYWNrKCRjb250YWluZXIsIGhlaWdodCk7XG5cbiAgICAgIHNjcm9sbFRpbWVsaW5lLmFkZChzY3JvbGxUcmFjaywgJ3Njcm9sbCcpO1xuXG4gICAgICAvLyBkYXRhIG9mIHRoZSBzY3JvbGwgYmFyIGlzIHRoZSB0aW1lQ29udGV4dCBvZiB0aGUgbWFpbiB0aW1lbGluZVxuICAgICAgY29uc3QgbWFpblRpbWVDb250ZXh0ID0gdGhpcy5ibG9jay51aS50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICAgIGNvbnN0IHNjcm9sbEJhciA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBtYWluVGltZUNvbnRleHQsIHtcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IG5ldyB1aS5jb3JlLkxheWVyVGltZUNvbnRleHQoc2Nyb2xsVGltZWxpbmUudGltZUNvbnRleHQpXG4gICAgICBzY3JvbGxCYXIuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuXG4gICAgICBzY3JvbGxCYXIuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLlNlZ21lbnQsIHtcbiAgICAgICAgeDogZCA9PiAtIGQub2Zmc2V0LFxuICAgICAgICB5OiBkID0+IDAsXG4gICAgICAgIHdpZHRoOiBkID0+IGQudmlzaWJsZUR1cmF0aW9uLFxuICAgICAgICBoZWlnaHQ6IGQgPT4gMSxcbiAgICAgICAgY29sb3I6IGQgPT4gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJDb2xvcicpLFxuICAgICAgfSwge1xuICAgICAgICBkaXNwbGF5SGFuZGxlcnM6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIHNjcm9sbFRyYWNrLmFkZChzY3JvbGxCYXIsICdzY3JvbGwnKTtcbiAgICAgIHNjcm9sbFRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpO1xuXG4gICAgICB0aGlzLl9zY3JvbGxUaW1lbGluZSA9IHNjcm9sbFRpbWVsaW5lO1xuICAgICAgdGhpcy5fc2Nyb2xsVHJhY2sgPSBzY3JvbGxUcmFjaztcbiAgICAgIHRoaXMuX3Njcm9sbEJhciA9IHNjcm9sbEJhcjtcbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLm9uKCdldmVudCcsIHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudCk7XG5cbiAgICAgIHRoaXMuX3Njcm9sbFN0YXRlID0gbmV3IFNjcm9sbFN0YXRlKHRoaXMuYmxvY2ssIHRoaXMuYmxvY2sudWkudGltZWxpbmUsIHRoaXMuX3Njcm9sbEJhcik7XG4gICAgICB0aGlzLl96b29tU3RhdGUgPSBuZXcgWm9vbVN0YXRlKHRoaXMuYmxvY2ssIHRoaXMuYmxvY2sudWkudGltZWxpbmUsIHRoaXMuX3Njcm9sbEJhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3pvb21TdGF0ZSA9IG5ldyBab29tU3RhdGUodGhpcy5ibG9jaywgdGhpcy5ibG9jay51aS50aW1lbGluZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRDdXJyZW50UG9zaXRpb24nKSlcbiAgICAgIHRoaXMuYmxvY2suYWRkTGlzdGVuZXIodGhpcy5ibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIC8vIHJlc2V0IHpvb20gdmFsdWVcbiAgICB0aW1lbGluZS56b29tID0gMTtcbiAgICB0aW1lbGluZS5vZmZzZXQgPSAwO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5heGlzTW9kdWxlLnVuaW5zdGFsbCh0aGlzLmJsb2NrKTtcblxuICAgIGlmICh0aGlzLmhhc1Njcm9sbEJhcikge1xuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUucmVtb3ZlTGlzdGVuZXIoJ2V2ZW50JywgdGhpcy5fb25TY3JvbGxCYXJNb3VzZUV2ZW50KTtcbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnJlbW92ZSh0aGlzLl9zY3JvbGxUcmFjayk7XG4gICAgICB0aGlzLl9zY3JvbGxUaW1lbGluZSA9IG51bGw7XG4gICAgICB0aGlzLl9zY3JvbGxUcmFjayA9IG51bGw7XG4gICAgICB0aGlzLl9zY3JvbGxCYXIgPSBudWxsO1xuICAgICAgdGhpcy5fc2Nyb2xsU3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX3pvb21TdGF0ZSA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbicpKVxuICAgICAgYmxvY2sucmVtb3ZlTGlzdGVuZXIoYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZU9mZnNldCk7XG4gIH1cblxuICBzZXRXaWR0aCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmhhc1Njcm9sbEJhcikge1xuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUudmlzaWJsZVdpZHRoID0gdmFsdWU7XG5cbiAgICAgIHRoaXMuX3Njcm9sbFRyYWNrLnJlbmRlcigpO1xuICAgICAgdGhpcy5fc2Nyb2xsVHJhY2sudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0VHJhY2soYnVmZmVyLCBtZXRhZGF0YXMpIHtcbiAgICB0aGlzLmF4aXNNb2R1bGUuc2V0VHJhY2sobWV0YWRhdGFzKTtcbiAgICAvLyByZXNldCB6b29tXG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICB0aW1lbGluZS56b29tID0gMTtcbiAgICB0aW1lbGluZS5vZmZzZXQgPSAwO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgaWYgKHRoaXMuaGFzU2Nyb2xsQmFyKSB7XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuYmxvY2suZHVyYXRpb247XG4gICAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLmJsb2NrLndpZHRoIC8gZHVyYXRpb247XG5cbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnBpeGVsc1BlclNlY29uZCA9IHBpeGVsc1BlclNlY29uZDtcbiAgICAgIHRoaXMuX3Njcm9sbEJhci50aW1lQ29udGV4dC5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG4gICAgICB0aGlzLl9zY3JvbGxUcmFjay5yZW5kZXIoKTtcbiAgICAgIHRoaXMuX3Njcm9sbFRyYWNrLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudHMgYXJlIGZvcndhcmRlZCBieSB0aGUgQmFzZVBsYXllciwgb3JpZ2luYXRlIGZyb20gdGhlIG1haW4gdGltZWxpbmUuXG4gICAqL1xuICBvbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICAvLyBAdG9kbyAtIGNhbid0IHpvb20gaWZcbiAgICAgICAgLy8gYHBsYXlDb250cm9sLnJ1bm5pbmcgPT09IHRydWVgICYmIGBjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbiA9PT0gdHJ1ZWBcbiAgICAgICAgaWYgKGhpdExheWVycy5pbmRleE9mKHRoaXMuYXhpc01vZHVsZS5sYXllcikgIT09IC0xKSB7XG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSB0aGlzLl96b29tU3RhdGU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fem9vbVN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGVtaXR0ZWQgYnkgdGhlIHNjcm9sbCB0aW1lbGluZS5cbiAgICovXG4gIF9vblNjcm9sbEJhck1vdXNlRXZlbnQoZSkge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICBpZiAodGhpcy5fc2Nyb2xsQmFyLmhhc0VsZW1lbnQoZS50YXJnZXQpKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fc2Nyb2xsU3RhdGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgLy8gZm9yd2FyZCBldmVudCBmcm9tIHNjcm9sbCB0aW1lbGluZSB0byBtYWluIHRpbWVsaW5lXG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlT2Zmc2V0KGN1cnJlbnRQb3NpdGlvbikge1xuICAgIGNvbnN0IG1haW5UaW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG4gICAgY29uc3QgbWFpblRyYWNrID0gdGhpcy5ibG9jay51aS50cmFjaztcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSBtYWluVGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuXG4gICAgLy8gem9vbSBjYW5ub3QgYmUgPCAxIChjZi4gWm9vbVN0YXRlKVxuICAgIGlmIChtYWluVGltZUNvbnRleHQuem9vbSA+IDEpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBtYWluVGltZUNvbnRleHQub2Zmc2V0O1xuICAgICAgY29uc3QgdmlzaWJsZUR1cmF0aW9uID0gbWFpblRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICAgIGNvbnN0IGNlbnRlclNjcmVlblBvc2l0aW9uID0gLSBvZmZzZXQgKyAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG4gICAgICBjb25zdCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uID0gZHVyYXRpb24gLSAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG5cbiAgICAgIGlmIChjdXJyZW50UG9zaXRpb24gPiBjZW50ZXJTY3JlZW5Qb3NpdGlvbiAmJiBjdXJyZW50UG9zaXRpb24gPCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGR0ID0gY3VycmVudFBvc2l0aW9uIC0gY2VudGVyU2NyZWVuUG9zaXRpb247XG4gICAgICAgIGNvbnN0IGR4ID0gbWFpblRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKGR4KTtcbiAgICAgICAgb2Zmc2V0IC09IGR0O1xuXG4gICAgICAgIG1haW5UaW1lQ29udGV4dC5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG1haW5UcmFjay51cGRhdGUoKTtcblxuICAgICAgICBpZiAodGhpcy5oYXNTY3JvbGxCYXIpXG4gICAgICAgICAgdGhpcy5fc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAdG9kbyAtIGluc3RhbGwgdGhlc2UgZGlyZWN0bHkgb24gdGhlIGJsb2NrID8gKi9cbiAgLy8gem9vbUluKCkge31cbiAgLy8gem9vbU91dCgpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFpvb207XG4iXX0=