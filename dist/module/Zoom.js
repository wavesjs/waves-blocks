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

/** @private */

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

      // @note - where does this maxZoom value comes from ?
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

/** @private */


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

/** @private */


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
};

/**
 * Module that adds zoom functionnality to the block.
 *
 * @param {Object} options - Override default options.
 * @param {String|Element} [options.scrollBarContainer=null] - Element where
 *  an additionnal scrollbar should be displayed.
 * @param {Number} options.scrollBarHeight - Height of the scrollbar.
 * @param {String} [options.scrollBarColor='#000000'] - Color of the scrollbar.
 * @param {Boolean} [options.centeredCurrentPosition=false] - Scroll to keep
 *  the block centered on current position while playing.
 */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJzY2FsZXMiLCJ1dGlscyIsIlpvb21TdGF0ZSIsImJsb2NrIiwidGltZWxpbmUiLCJzY3JvbGxCYXIiLCJfcGl4ZWxUb0V4cG9uZW50IiwibGluZWFyIiwiZG9tYWluIiwiaGVpZ2h0IiwicmFuZ2UiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJpbml0aWFsWm9vbSIsInRpbWVDb250ZXh0Iiwiem9vbSIsImluaXRpYWxZIiwieSIsIm9yaWdpbmFsRXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm1heFpvb20iLCJwaXhlbHNQZXJTZWNvbmQiLCJtaW5ab29tIiwidHJhY2tEdXJhdGlvbiIsImR1cmF0aW9uIiwibGFzdENlbnRlclRpbWUiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsIngiLCJleHBvbmVudCIsInRhcmdldFpvb20iLCJNYXRoIiwicG93IiwibWluIiwibWF4IiwibmV3Q2VudGVyVGltZSIsImRlbHRhIiwibmV3T2Zmc2V0Iiwib2Zmc2V0IiwiZHgiLCJtYXhPZmZzZXQiLCJtaW5PZmZzZXQiLCJ2aXNpYmxlRHVyYXRpb24iLCJ0cmFja3MiLCJ1cGRhdGUiLCJzdGF0ZXMiLCJCYXNlU3RhdGUiLCJTY3JvbGxTdGF0ZSIsIm1haW5UaW1lQ29udGV4dCIsImR0IiwicGFyYW1ldGVycyIsImF4aXNUeXBlIiwibGlzdCIsImRlZmF1bHQiLCJzY3JvbGxCYXJDb250YWluZXIiLCJyZXF1aXJlZCIsIm1ldGFzIiwiZGVzYyIsInNjcm9sbEJhckhlaWdodCIsIkluZmluaXR5Iiwic3RlcCIsInNjcm9sbEJhckNvbG9yIiwiY2VudGVyZWRDdXJyZW50UG9zaXRpb24iLCJjb25zdGFudCIsIlpvb20iLCJvcHRpb25zIiwiYXhpc01vZHVsZSIsInBhcmFtcyIsImdldCIsImhhc1Njcm9sbEJhciIsIl9vblNjcm9sbEJhck1vdXNlRXZlbnQiLCJiaW5kIiwiX3VwZGF0ZU9mZnNldCIsImluc3RhbGwiLCIkY29udGFpbmVyIiwiRWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInZpc2libGVXaWR0aCIsIndpZHRoIiwic3R5bGUiLCJzY3JvbGxUaW1lbGluZSIsImNvcmUiLCJUaW1lbGluZSIsInNjcm9sbFRyYWNrIiwiVHJhY2siLCJhZGQiLCJMYXllciIsInlEb21haW4iLCJMYXllclRpbWVDb250ZXh0Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIlNlZ21lbnQiLCJkIiwiY29sb3IiLCJkaXNwbGF5SGFuZGxlcnMiLCJ1cGRhdGVDb250YWluZXIiLCJfc2Nyb2xsVGltZWxpbmUiLCJfc2Nyb2xsVHJhY2siLCJfc2Nyb2xsQmFyIiwib24iLCJfc2Nyb2xsU3RhdGUiLCJfem9vbVN0YXRlIiwiYWRkTGlzdGVuZXIiLCJFVkVOVFMiLCJDVVJSRU5UX1BPU0lUSU9OIiwidHJhY2siLCJ1bmluc3RhbGwiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZSIsInZhbHVlIiwibWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJyZW5kZXIiLCJidWZmZXIiLCJtZXRhZGF0YXMiLCJzZXRUcmFjayIsImhpdExheWVycyIsImluZGV4T2YiLCJsYXllciIsInN0YXRlIiwiaGFzRWxlbWVudCIsInRhcmdldCIsImN1cnJlbnRQb3NpdGlvbiIsIm1haW5UaW1lbGluZSIsIm1haW5UcmFjayIsImNlbnRlclNjcmVlblBvc2l0aW9uIiwibGFzdEhhbGZTY3JlZW5Qb3NpdGlvbiIsInpJbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxTQUFTRCxHQUFHRSxLQUFILENBQVNELE1BQXhCOztBQUVBOztJQUNNRSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsUUFBbkIsRUFBK0M7QUFBQSxRQUFs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O0FBRUFELDBCQUFnQlYsTUFBaEIsR0FBeUJBLE1BQXpCO0FBQ0F1RixvQkFBVWpGLE1BQVY7O0FBRUEsY0FBSSxLQUFLeUIsWUFBVCxFQUNFLEtBQUsrQixVQUFMLENBQWdCeEQsTUFBaEI7QUFDSDtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBOzs7O3NCQXBOVTVDLEssRUFBTztBQUNmLDZHQUFjQSxLQUFkO0FBQ0EsV0FBS2tFLFVBQUwsQ0FBZ0JsRSxLQUFoQixHQUF3QixLQUFLQSxLQUE3QjtBQUNELEs7d0JBRVc7QUFDVjtBQUNEOzs7c0JBRVVnSSxNLEVBQVE7QUFDakIsOEdBQWVBLE1BQWY7QUFDQSxXQUFLOUQsVUFBTCxDQUFnQjhELE1BQWhCLEdBQXlCLEtBQUtBLE1BQTlCO0FBQ0QsSzt3QkFFWTtBQUNYO0FBQ0Q7Ozs7O2tCQXVNWWhFLEkiLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcbmltcG9ydCBHcmlkQXhpcyBmcm9tICcuL0dyaWRBeGlzJztcbmltcG9ydCBUaW1lQXhpcyBmcm9tICcuL1RpbWVBeGlzJztcbmltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcblxuY29uc3Qgc2NhbGVzID0gdWkudXRpbHMuc2NhbGVzO1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIFpvb21TdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3RvcihibG9jaywgdGltZWxpbmUsIHNjcm9sbEJhciA9IG51bGwpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG5cbiAgICB0aGlzLl9waXhlbFRvRXhwb25lbnQgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIGJsb2NrLmhlaWdodF0pXG4gICAgICAucmFuZ2UoWzAsIDFdKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5ibG9jayA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuaW5pdGlhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG4gICAgdGhpcy5pbml0aWFsWSA9IGUueTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyBwcmV2ZW50IGFubm95aW5nIHRleHQgc2VsZWN0aW9uIHdoZW4gZHJhZ2dpbmdcbiAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIEBub3RlIC0gd2hlcmUgZG9lcyB0aGlzIG1heFpvb20gdmFsdWUgY29tZXMgZnJvbSA/XG4gICAgY29uc3QgbWF4Wm9vbSA9IDQ0MTAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3QgbWluWm9vbSA9IDE7XG5cbiAgICBjb25zdCB0cmFja0R1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgbGFzdENlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBleHBvbmVudCA9IHRoaXMuX3BpeGVsVG9FeHBvbmVudChlLnkgLSB0aGlzLmluaXRpYWxZKTtcbiAgICBjb25zdCB0YXJnZXRab29tID0gdGhpcy5pbml0aWFsWm9vbSAqIE1hdGgucG93KDIsIGV4cG9uZW50KTtcblxuICAgIHRpbWVDb250ZXh0Lnpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0YXJnZXRab29tLCBtaW5ab29tKSwgbWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBjbGFtcCB6b29tZWQgd2F2ZWZvcm0gaW4gc2NyZWVuXG4gICAgY29uc3QgbmV3T2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0ICsgZGVsdGEgKyB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCk7XG4gICAgY29uc3QgbWF4T2Zmc2V0ID0gMDtcbiAgICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb24gLSB0cmFja0R1cmF0aW9uO1xuXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgobWluT2Zmc2V0LCBNYXRoLm1pbihtYXhPZmZzZXQsIG5ld09mZnNldCkpO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxCYXIpXG4gICAgICB0aGlzLnNjcm9sbEJhci51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7fVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIFNjcm9sbFN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrLCB0aW1lbGluZSwgc2Nyb2xsQmFyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgIHRoaXMuc2Nyb2xsQmFyID0gc2Nyb2xsQmFyO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGNvbnN0IG1haW5UaW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgdHJhY2tEdXJhdGlvbiA9IHRoaXMuYmxvY2suZHVyYXRpb247XG4gICAgY29uc3QgZHQgPSB0aGlzLnNjcm9sbEJhci50aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCk7XG5cbiAgICAvLyBtYW5pcHVhdGUgYW5kIGNsYW1wIG9mZnNldCBvZiB0aGUgbWFpbiB0aW1lbGluZVxuICAgIGNvbnN0IG5ld09mZnNldCA9IG1haW5UaW1lQ29udGV4dC5vZmZzZXQgLSBkdDtcbiAgICBjb25zdCBtYXhPZmZzZXQgPSAwO1xuICAgIGNvbnN0IG1pbk9mZnNldCA9IG1haW5UaW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb24gLSB0cmFja0R1cmF0aW9uO1xuXG4gICAgbWFpblRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KG1pbk9mZnNldCwgTWF0aC5taW4obWF4T2Zmc2V0LCBuZXdPZmZzZXQpKTtcblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZSgpO1xuICAgIHRoaXMuc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgYXhpc1R5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWyd0aW1lJywgJ2dyaWQnXSxcbiAgICBkZWZhdWx0OiAndGltZScsXG4gIH0sXG4gIHNjcm9sbEJhckNvbnRhaW5lcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDU1MgU2VsZWN0b3Igb3IgRE9NIGVsZW1lbnQgdGhhdCBzaG91bGQgY29udGFpbiB0aGUgc2Nyb2xsIGJhcicsXG4gICAgfSxcbiAgfSxcbiAgc2Nyb2xsQmFySGVpZ2h0OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgc3RlcDogMSxcbiAgICBkZWZhdWx0OiAxMCxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2hlaWdodCBvZiB0aGUgc2Nyb2xsLWJhcidcbiAgICB9XG4gIH0sXG4gIHNjcm9sbEJhckNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJyMwMDAwMDAnLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIHNjcm9sbC1iYXInXG4gICAgfVxuICB9LFxuICBjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogYGtlZXAgd2F2ZWZvcm0gY2VudGVyIGFyb3VuZCB0aGUgYmxvY2sncyBjdXJyZW50IHBvc2l0aW9uYCxcbiAgICB9LFxuICB9LFxufTtcblxuLyoqXG4gKiBNb2R1bGUgdGhhdCBhZGRzIHpvb20gZnVuY3Rpb25uYWxpdHkgdG8gdGhlIGJsb2NrLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBvcHRpb25zLlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gW29wdGlvbnMuc2Nyb2xsQmFyQ29udGFpbmVyPW51bGxdIC0gRWxlbWVudCB3aGVyZVxuICogIGFuIGFkZGl0aW9ubmFsIHNjcm9sbGJhciBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuc2Nyb2xsQmFySGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSBzY3JvbGxiYXIuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc2Nyb2xsQmFyQ29sb3I9JyMwMDAwMDAnXSAtIENvbG9yIG9mIHRoZSBzY3JvbGxiYXIuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNlbnRlcmVkQ3VycmVudFBvc2l0aW9uPWZhbHNlXSAtIFNjcm9sbCB0byBrZWVwXG4gKiAgdGhlIGJsb2NrIGNlbnRlcmVkIG9uIGN1cnJlbnQgcG9zaXRpb24gd2hpbGUgcGxheWluZy5cbiAqL1xuY2xhc3MgWm9vbSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5heGlzTW9kdWxlID0gdGhpcy5wYXJhbXMuZ2V0KCdheGlzVHlwZScpID09PSAnZ3JpZCcgP1xuICAgICAgbmV3IEdyaWRBeGlzKCkgOiBuZXcgVGltZUF4aXMoKTtcblxuICAgIHRoaXMuaGFzU2Nyb2xsQmFyID0gZmFsc2U7XG5cbiAgICB0aGlzLl9vblNjcm9sbEJhck1vdXNlRXZlbnQgPSB0aGlzLl9vblNjcm9sbEJhck1vdXNlRXZlbnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91cGRhdGVPZmZzZXQgPSB0aGlzLl91cGRhdGVPZmZzZXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHNldCBibG9jayhibG9jaykge1xuICAgIHN1cGVyLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5heGlzTW9kdWxlLmJsb2NrID0gdGhpcy5ibG9jaztcbiAgfVxuXG4gIGdldCBibG9jaygpIHtcbiAgICByZXR1cm4gc3VwZXIuYmxvY2s7XG4gIH1cblxuICBzZXQgekluZGV4KHpJbmRleCkge1xuICAgIHN1cGVyLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLmF4aXNNb2R1bGUuekluZGV4ID0gdGhpcy56SW5kZXg7XG4gIH1cblxuICBnZXQgekluZGV4KCkge1xuICAgIHJldHVybiBzdXBlci56SW5kZXg7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIHRoaXMuYXhpc01vZHVsZS5pbnN0YWxsKCk7XG5cbiAgICBsZXQgJGNvbnRhaW5lciA9IHRoaXMucGFyYW1zLmdldCgnc2Nyb2xsQmFyQ29udGFpbmVyJyk7XG5cbiAgICBpZiAoJGNvbnRhaW5lciAhPT0gbnVsbCkge1xuICAgICAgaWYgKCEoJGNvbnRhaW5lciBpbnN0YW5jZW9mIEVsZW1lbnQpKVxuICAgICAgICAkY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigkY29udGFpbmVyKTtcblxuICAgICAgdGhpcy5oYXNTY3JvbGxCYXIgPSB0cnVlO1xuXG4gICAgICAvLyBjcmVhdGUgYSBuZXcgdGltZWxpbmUgdG8gaG9zdCB0aGUgc2Nyb2xsIGJhclxuICAgICAgY29uc3QgdmlzaWJsZVdpZHRoID0gdGhpcy5ibG9jay53aWR0aDtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmdldCgnc2Nyb2xsQmFySGVpZ2h0Jyk7XG5cbiAgICAgICRjb250YWluZXIuc3R5bGUud2lkdGggPSB2aXNpYmxlV2lkdGggKyAncHgnO1xuICAgICAgJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgICAvLyBpbml0IHdpdGggZHVtbXkgcGl4ZWwgcGVyIHNlY29uZFxuICAgICAgY29uc3Qgc2Nyb2xsVGltZWxpbmUgPSBuZXcgdWkuY29yZS5UaW1lbGluZSgxLCB2aXNpYmxlV2lkdGgpO1xuICAgICAgY29uc3Qgc2Nyb2xsVHJhY2sgPSBuZXcgdWkuY29yZS5UcmFjaygkY29udGFpbmVyLCBoZWlnaHQpO1xuXG4gICAgICBzY3JvbGxUaW1lbGluZS5hZGQoc2Nyb2xsVHJhY2ssICdzY3JvbGwnKTtcblxuICAgICAgLy8gZGF0YSBvZiB0aGUgc2Nyb2xsIGJhciBpcyB0aGUgdGltZUNvbnRleHQgb2YgdGhlIG1haW4gdGltZWxpbmVcbiAgICAgIGNvbnN0IG1haW5UaW1lQ29udGV4dCA9IHRoaXMuYmxvY2sudWkudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgICBjb25zdCBzY3JvbGxCYXIgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgbWFpblRpbWVDb250ZXh0LCB7XG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHNjcm9sbFRpbWVsaW5lLnRpbWVDb250ZXh0KVxuICAgICAgc2Nyb2xsQmFyLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcblxuICAgICAgc2Nyb2xsQmFyLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5TZWdtZW50LCB7XG4gICAgICAgIHg6IGQgPT4gLSBkLm9mZnNldCxcbiAgICAgICAgeTogZCA9PiAwLFxuICAgICAgICB3aWR0aDogZCA9PiBkLnZpc2libGVEdXJhdGlvbixcbiAgICAgICAgaGVpZ2h0OiBkID0+IDEsXG4gICAgICAgIGNvbG9yOiBkID0+IHRoaXMucGFyYW1zLmdldCgnc2Nyb2xsQmFyQ29sb3InKSxcbiAgICAgIH0sIHtcbiAgICAgICAgZGlzcGxheUhhbmRsZXJzOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBzY3JvbGxUcmFjay5hZGQoc2Nyb2xsQmFyLCAnc2Nyb2xsJyk7XG4gICAgICBzY3JvbGxUcmFjay51cGRhdGVDb250YWluZXIoKTtcblxuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUgPSBzY3JvbGxUaW1lbGluZTtcbiAgICAgIHRoaXMuX3Njcm9sbFRyYWNrID0gc2Nyb2xsVHJhY2s7XG4gICAgICB0aGlzLl9zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG4gICAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5vbignZXZlbnQnLCB0aGlzLl9vblNjcm9sbEJhck1vdXNlRXZlbnQpO1xuXG4gICAgICB0aGlzLl9zY3JvbGxTdGF0ZSA9IG5ldyBTY3JvbGxTdGF0ZSh0aGlzLmJsb2NrLCB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lLCB0aGlzLl9zY3JvbGxCYXIpO1xuICAgICAgdGhpcy5fem9vbVN0YXRlID0gbmV3IFpvb21TdGF0ZSh0aGlzLmJsb2NrLCB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lLCB0aGlzLl9zY3JvbGxCYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl96b29tU3RhdGUgPSBuZXcgWm9vbVN0YXRlKHRoaXMuYmxvY2ssIHRoaXMuYmxvY2sudWkudGltZWxpbmUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2NlbnRlcmVkQ3VycmVudFBvc2l0aW9uJykpXG4gICAgICB0aGlzLmJsb2NrLmFkZExpc3RlbmVyKHRoaXMuYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZU9mZnNldCk7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICAvLyByZXNldCB6b29tIHZhbHVlXG4gICAgdGltZWxpbmUuem9vbSA9IDE7XG4gICAgdGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIHRoaXMuYXhpc01vZHVsZS51bmluc3RhbGwodGhpcy5ibG9jayk7XG5cbiAgICBpZiAodGhpcy5oYXNTY3JvbGxCYXIpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnJlbW92ZUxpc3RlbmVyKCdldmVudCcsIHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudCk7XG4gICAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5yZW1vdmUodGhpcy5fc2Nyb2xsVHJhY2spO1xuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUgPSBudWxsO1xuICAgICAgdGhpcy5fc2Nyb2xsVHJhY2sgPSBudWxsO1xuICAgICAgdGhpcy5fc2Nyb2xsQmFyID0gbnVsbDtcbiAgICAgIHRoaXMuX3Njcm9sbFN0YXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl96b29tU3RhdGUgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRDdXJyZW50UG9zaXRpb24nKSlcbiAgICAgIGJsb2NrLnJlbW92ZUxpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVPZmZzZXQpO1xuICB9XG5cbiAgc2V0V2lkdGgodmFsdWUpIHtcbiAgICBpZiAodGhpcy5oYXNTY3JvbGxCYXIpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnZpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgICB0aGlzLl9zY3JvbGxUcmFjay5yZW5kZXIoKTtcbiAgICAgIHRoaXMuX3Njcm9sbFRyYWNrLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGFzKSB7XG4gICAgdGhpcy5heGlzTW9kdWxlLnNldFRyYWNrKG1ldGFkYXRhcyk7XG4gICAgLy8gcmVzZXQgem9vbVxuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGltZWxpbmUuem9vbSA9IDE7XG4gICAgdGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIGlmICh0aGlzLmhhc1Njcm9sbEJhcikge1xuICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuICAgICAgY29uc3QgcGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5ibG9jay53aWR0aCAvIGR1cmF0aW9uO1xuXG4gICAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5waXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgICB0aGlzLl9zY3JvbGxCYXIudGltZUNvbnRleHQuZHVyYXRpb24gPSBkdXJhdGlvbjtcblxuICAgICAgdGhpcy5fc2Nyb2xsVHJhY2sucmVuZGVyKCk7XG4gICAgICB0aGlzLl9zY3JvbGxUcmFjay51cGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGFyZSBmb3J3YXJkZWQgYnkgdGhlIEJhc2VQbGF5ZXIsIG9yaWdpbmF0ZSBmcm9tIHRoZSBtYWluIHRpbWVsaW5lLlxuICAgKi9cbiAgb25FdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG5cbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgLy8gQHRvZG8gLSBjYW4ndCB6b29tIGlmXG4gICAgICAgIC8vIGBwbGF5Q29udHJvbC5ydW5uaW5nID09PSB0cnVlYCAmJiBgY2VudGVyZWRDdXJyZW50UG9zaXRpb24gPT09IHRydWVgXG4gICAgICAgIGlmIChoaXRMYXllcnMuaW5kZXhPZih0aGlzLmF4aXNNb2R1bGUubGF5ZXIpICE9PSAtMSkge1xuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fem9vbVN0YXRlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3pvb21TdGF0ZSlcbiAgICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBzY3JvbGwgdGltZWxpbmUuXG4gICAqL1xuICBfb25TY3JvbGxCYXJNb3VzZUV2ZW50KGUpIHtcbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG5cbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgaWYgKHRoaXMuX3Njcm9sbEJhci5oYXNFbGVtZW50KGUudGFyZ2V0KSlcbiAgICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IHRoaXMuX3Njcm9sbFN0YXRlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIC8vIGZvcndhcmQgZXZlbnQgZnJvbSBzY3JvbGwgdGltZWxpbmUgdG8gbWFpbiB0aW1lbGluZVxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Njcm9sbFN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Njcm9sbFN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZU9mZnNldChjdXJyZW50UG9zaXRpb24pIHtcbiAgICBjb25zdCBtYWluVGltZWxpbmUgPSB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lO1xuICAgIGNvbnN0IG1haW5UcmFjayA9IHRoaXMuYmxvY2sudWkudHJhY2s7XG4gICAgY29uc3QgbWFpblRpbWVDb250ZXh0ID0gbWFpblRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcblxuICAgIC8vIHpvb20gY2Fubm90IGJlIDwgMSAoY2YuIFpvb21TdGF0ZSlcbiAgICBpZiAobWFpblRpbWVDb250ZXh0Lnpvb20gPiAxKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gbWFpblRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICAgIGNvbnN0IHZpc2libGVEdXJhdGlvbiA9IG1haW5UaW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gICAgICBjb25zdCBjZW50ZXJTY3JlZW5Qb3NpdGlvbiA9IC0gb2Zmc2V0ICsgKHZpc2libGVEdXJhdGlvbiAvIDIpO1xuICAgICAgY29uc3QgbGFzdEhhbGZTY3JlZW5Qb3NpdGlvbiA9IGR1cmF0aW9uIC0gKHZpc2libGVEdXJhdGlvbiAvIDIpO1xuXG4gICAgICBpZiAoY3VycmVudFBvc2l0aW9uID4gY2VudGVyU2NyZWVuUG9zaXRpb24gJiYgY3VycmVudFBvc2l0aW9uIDwgbGFzdEhhbGZTY3JlZW5Qb3NpdGlvbikge1xuICAgICAgICBjb25zdCBkdCA9IGN1cnJlbnRQb3NpdGlvbiAtIGNlbnRlclNjcmVlblBvc2l0aW9uO1xuICAgICAgICBjb25zdCBkeCA9IG1haW5UaW1lQ29udGV4dC50aW1lVG9QaXhlbChkeCk7XG4gICAgICAgIG9mZnNldCAtPSBkdDtcblxuICAgICAgICBtYWluVGltZUNvbnRleHQub2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICBtYWluVHJhY2sudXBkYXRlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzU2Nyb2xsQmFyKVxuICAgICAgICAgIHRoaXMuX3Njcm9sbEJhci51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHRvZG8gLSBpbnN0YWxsIHRoZXNlIGRpcmVjdGx5IG9uIHRoZSBibG9jayA/ICovXG4gIC8vIHpvb21JbigpIHt9XG4gIC8vIHpvb21PdXQoKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBab29tO1xuIl19