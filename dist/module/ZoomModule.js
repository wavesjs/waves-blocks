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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwic2NhbGVzIiwidXRpbHMiLCJab29tU3RhdGUiLCJibG9jayIsInRpbWVsaW5lIiwic2Nyb2xsQmFyIiwiX3BpeGVsVG9FeHBvbmVudCIsImxpbmVhciIsImRvbWFpbiIsImhlaWdodCIsInJhbmdlIiwiZSIsInR5cGUiLCJvbk1vdXNlRG93biIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwiaW5pdGlhbFpvb20iLCJ0aW1lQ29udGV4dCIsInpvb20iLCJpbml0aWFsWSIsInkiLCJvcmlnaW5hbEV2ZW50IiwicHJldmVudERlZmF1bHQiLCJtYXhab29tIiwicGl4ZWxzUGVyU2Vjb25kIiwibWluWm9vbSIsInRyYWNrRHVyYXRpb24iLCJkdXJhdGlvbiIsImxhc3RDZW50ZXJUaW1lIiwidGltZVRvUGl4ZWwiLCJpbnZlcnQiLCJ4IiwiZXhwb25lbnQiLCJ0YXJnZXRab29tIiwiTWF0aCIsInBvdyIsIm1pbiIsIm1heCIsIm5ld0NlbnRlclRpbWUiLCJkZWx0YSIsIm5ld09mZnNldCIsIm9mZnNldCIsImR4IiwibWF4T2Zmc2V0IiwibWluT2Zmc2V0IiwidmlzaWJsZUR1cmF0aW9uIiwidHJhY2tzIiwidXBkYXRlIiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiU2Nyb2xsU3RhdGUiLCJtYWluVGltZUNvbnRleHQiLCJkdCIsInBhcmFtZXRlcnMiLCJheGlzVHlwZSIsImxpc3QiLCJkZWZhdWx0Iiwic2Nyb2xsQmFyQ29udGFpbmVyIiwicmVxdWlyZWQiLCJtZXRhcyIsImRlc2MiLCJzY3JvbGxCYXJIZWlnaHQiLCJJbmZpbml0eSIsInN0ZXAiLCJjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbiIsImNvbnN0YW50IiwiWm9vbU1vZHVsZSIsIm9wdGlvbnMiLCJheGlzTW9kdWxlIiwicGFyYW1zIiwiZ2V0IiwiX29uU2Nyb2xsQmFyTW91c2VFdmVudCIsImJpbmQiLCJfdXBkYXRlT2Zmc2V0IiwiaW5zdGFsbCIsIiRjb250YWluZXIiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwidmlzaWJsZVdpZHRoIiwid2lkdGgiLCJzdHlsZSIsInNjcm9sbFRpbWVsaW5lIiwiY29yZSIsIlRpbWVsaW5lIiwic2Nyb2xsVHJhY2siLCJUcmFjayIsImFkZCIsIkxheWVyIiwieURvbWFpbiIsIkxheWVyVGltZUNvbnRleHQiLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic2hhcGVzIiwiU2VnbWVudCIsImQiLCJkaXNwbGF5SGFuZGxlcnMiLCJ1cGRhdGVDb250YWluZXIiLCJfc2Nyb2xsVGltZWxpbmUiLCJfc2Nyb2xsVHJhY2siLCJfc2Nyb2xsQmFyIiwib24iLCJfem9vbVN0YXRlIiwiX3Njcm9sbFN0YXRlIiwiYWRkTGlzdGVuZXIiLCJFVkVOVFMiLCJDVVJSRU5UX1BPU0lUSU9OIiwidHJhY2siLCJ1bmluc3RhbGwiLCJyZW1vdmUiLCJyZW1vdmVMaXN0ZW5lciIsInZhbHVlIiwibWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJyZW5kZXIiLCJidWZmZXIiLCJtZXRhZGF0YXMiLCJzZXRUcmFjayIsImhpdExheWVycyIsImluZGV4T2YiLCJsYXllciIsInN0YXRlIiwiaGFzRWxlbWVudCIsInRhcmdldCIsImN1cnJlbnRQb3NpdGlvbiIsIm1haW5UaW1lbGluZSIsIm1haW5UcmFjayIsImNlbnRlclNjcmVlblBvc2l0aW9uIiwibGFzdEhhbGZTY3JlZW5Qb3NpdGlvbiIsInpJbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxTQUFTRCxHQUFHRSxLQUFILENBQVNELE1BQXhCOztJQUVNRSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsUUFBbkIsRUFBNkJDLFNBQTdCLEVBQXdDO0FBQUE7O0FBQUEsNElBQ2hDRCxRQURnQzs7QUFHdEMsVUFBS0Qs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QUFDQSxZQUFNaUYsdUJBQXVCLENBQUVyRixNQUFGLEdBQVlJLGtCQUFrQixDQUEzRDtBQUNBLFlBQU1rRix5QkFBeUJwRyxXQUFZa0Isa0JBQWtCLENBQTdEOztBQUVBLFlBQUk4RSxrQkFBa0JHLG9CQUFsQixJQUEwQ0gsa0JBQWtCSSxzQkFBaEUsRUFBd0Y7QUFDdEYsY0FBTTNFLEtBQUt1RSxrQkFBa0JHLG9CQUE3QjtBQUNBLGNBQU1wRixLQUFLUyxnQkFBZ0J0QixXQUFoQixDQUE0QmEsRUFBNUIsQ0FBWDtBQUNBRCxvQkFBVVcsRUFBVjs7QUFFQUQsMEJBQWdCVixNQUFoQixHQUF5QkEsTUFBekI7QUFDQW9GLG9CQUFVOUUsTUFBVjtBQUNBO0FBQ0EsZUFBS3FELFVBQUwsQ0FBZ0JyRCxNQUFoQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7Ozs7c0JBdE1VNUMsSyxFQUFPO0FBQ2YseUhBQWNBLEtBQWQ7QUFDQSxXQUFLaUUsVUFBTCxDQUFnQmpFLEtBQWhCLEdBQXdCLEtBQUtBLEtBQTdCO0FBQ0QsSzt3QkFFVztBQUNWO0FBQ0Q7OztzQkFFVTZILE0sRUFBUTtBQUNqQiwwSEFBZUEsTUFBZjtBQUNBLFdBQUs1RCxVQUFMLENBQWdCNEQsTUFBaEIsR0FBeUIsS0FBS0EsTUFBOUI7QUFDRCxLO3dCQUVZO0FBQ1g7QUFDRDs7Ozs7a0JBeUxZOUQsVSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcbmltcG9ydCBHcmlkQXhpc01vZHVsZSBmcm9tICcuL0dyaWRBeGlzTW9kdWxlJztcbmltcG9ydCBUaW1lQXhpc01vZHVsZSBmcm9tICcuL1RpbWVBeGlzTW9kdWxlJztcbmltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcblxuY29uc3Qgc2NhbGVzID0gdWkudXRpbHMuc2NhbGVzO1xuXG5jbGFzcyBab29tU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IoYmxvY2ssIHRpbWVsaW5lLCBzY3JvbGxCYXIpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG5cbiAgICB0aGlzLl9waXhlbFRvRXhwb25lbnQgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIGJsb2NrLmhlaWdodF0pXG4gICAgICAucmFuZ2UoWzAsIDFdKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5ibG9jayA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuaW5pdGlhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG4gICAgdGhpcy5pbml0aWFsWSA9IGUueTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyBwcmV2ZW50IGFubm95aW5nIHRleHQgc2VsZWN0aW9uIHdoZW4gZHJhZ2dpbmdcbiAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIGRlZmluZSBtYXgvbWluIHpvb21cbiAgICBjb25zdCBtYXhab29tID0gNDQxMDAgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBtaW5ab29tID0gMTtcblxuICAgIGNvbnN0IHRyYWNrRHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuICAgIGNvbnN0IGV4cG9uZW50ID0gdGhpcy5fcGl4ZWxUb0V4cG9uZW50KGUueSAtIHRoaXMuaW5pdGlhbFkpO1xuICAgIGNvbnN0IHRhcmdldFpvb20gPSB0aGlzLmluaXRpYWxab29tICogTWF0aC5wb3coMiwgZXhwb25lbnQpO1xuXG4gICAgdGltZUNvbnRleHQuem9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRhcmdldFpvb20sIG1pblpvb20pLCBtYXhab29tKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBkZWx0YSA9IG5ld0NlbnRlclRpbWUgLSBsYXN0Q2VudGVyVGltZTtcblxuICAgIC8vIGNsYW1wIHpvb21lZCB3YXZlZm9ybSBpbiBzY3JlZW5cbiAgICBjb25zdCBuZXdPZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQgKyBkZWx0YSArIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KTtcbiAgICBjb25zdCBtYXhPZmZzZXQgPSAwO1xuICAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbiAtIHRyYWNrRHVyYXRpb247XG5cbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heChtaW5PZmZzZXQsIE1hdGgubWluKG1heE9mZnNldCwgbmV3T2Zmc2V0KSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgICB0aGlzLnNjcm9sbEJhci51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7fVxufVxuXG5cbmNsYXNzIFNjcm9sbFN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrLCB0aW1lbGluZSwgc2Nyb2xsQmFyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgIHRoaXMuc2Nyb2xsQmFyID0gc2Nyb2xsQmFyO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGNvbnN0IG1haW5UaW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgdHJhY2tEdXJhdGlvbiA9IHRoaXMuYmxvY2suZHVyYXRpb247XG4gICAgY29uc3QgZHQgPSB0aGlzLnNjcm9sbEJhci50aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCk7XG5cbiAgICAvLyBtYW5pcHVhdGUgYW5kIGNsYW1wIG9mZnNldCBvZiB0aGUgbWFpbiB0aW1lbGluZVxuICAgIGNvbnN0IG5ld09mZnNldCA9IG1haW5UaW1lQ29udGV4dC5vZmZzZXQgLSBkdDtcbiAgICBjb25zdCBtYXhPZmZzZXQgPSAwO1xuICAgIGNvbnN0IG1pbk9mZnNldCA9IG1haW5UaW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb24gLSB0cmFja0R1cmF0aW9uO1xuXG4gICAgbWFpblRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KG1pbk9mZnNldCwgTWF0aC5taW4obWF4T2Zmc2V0LCBuZXdPZmZzZXQpKTtcblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZSgpO1xuICAgIHRoaXMuc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICB9XG59XG5cblxuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBheGlzVHlwZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ3RpbWUnLCAnZ3JpZCddLFxuICAgIGRlZmF1bHQ6ICd0aW1lJyxcbiAgfSxcbiAgc2Nyb2xsQmFyQ29udGFpbmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogJycsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDU1MgU2VsZWN0b3Igb3IgRE9NIGVsZW1lbnQgdGhhdCBzaG91bGQgY29udGFpbiB0aGUgc2Nyb2xsIGJhcicsXG4gICAgfSxcbiAgfSxcbiAgc2Nyb2xsQmFySGVpZ2h0OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgc3RlcDogMSxcbiAgICBkZWZhdWx0OiAxMCxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2hlaWdodCBvZiB0aGUgc2Nyb2xsLWJhciwgaXMgcmVtb3ZlZCBmcm9tICdcbiAgICB9XG4gIH0sXG4gIGNlbnRlcmVkQ3VycmVudFBvc2l0aW9uOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiBga2VlcCB3YXZlZm9ybSBjZW50ZXIgYXJvdW5kIHRoZSBibG9jaydzIGN1cnJlbnQgcG9zaXRpb25gLFxuICAgIH0sXG4gIH0sXG4gIC8vIEB0b2RvIC0gYWxsb3cgc3dpdGNoaW5nIGJldHdlZW4gdGltZSBhbmQgZ3JpZCBheGlzXG4gIC8vIGF4aXM6IHt9XG59XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgWm9vbU1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5heGlzTW9kdWxlID0gdGhpcy5wYXJhbXMuZ2V0KCdheGlzVHlwZScpID09PSAnZ3JpZCcgP1xuICAgICAgbmV3IEdyaWRBeGlzTW9kdWxlKCkgOiBuZXcgVGltZUF4aXNNb2R1bGUoKTtcblxuICAgIHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudCA9IHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VwZGF0ZU9mZnNldCA9IHRoaXMuX3VwZGF0ZU9mZnNldC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc2V0IGJsb2NrKGJsb2NrKSB7XG4gICAgc3VwZXIuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLmF4aXNNb2R1bGUuYmxvY2sgPSB0aGlzLmJsb2NrO1xuICB9XG5cbiAgZ2V0IGJsb2NrKCkge1xuICAgIHJldHVybiBzdXBlci5ibG9jaztcbiAgfVxuXG4gIHNldCB6SW5kZXgoekluZGV4KSB7XG4gICAgc3VwZXIuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuYXhpc01vZHVsZS56SW5kZXggPSB0aGlzLnpJbmRleDtcbiAgfVxuXG4gIGdldCB6SW5kZXgoKSB7XG4gICAgcmV0dXJuIHN1cGVyLnpJbmRleDtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgdGhpcy5heGlzTW9kdWxlLmluc3RhbGwoKTtcblxuICAgIGxldCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJDb250YWluZXInKTtcblxuICAgIGlmICghKCRjb250YWluZXIgaW5zdGFuY2VvZiBFbGVtZW50KSlcbiAgICAgICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuXG4gICAgLy8gY3JlYXRlIGEgbmV3IHRpbWVsaW5lIHRvIGhvc3QgdGhlIHNjcm9sbCBiYXJcbiAgICBjb25zdCB2aXNpYmxlV2lkdGggPSB0aGlzLmJsb2NrLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmdldCgnc2Nyb2xsQmFySGVpZ2h0Jyk7XG5cbiAgICAkY29udGFpbmVyLnN0eWxlLndpZHRoID0gdmlzaWJsZVdpZHRoICsgJ3B4JztcbiAgICAkY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cbiAgICAvLyBpbml0IHdpdGggZHVtbXkgcGl4ZWwgcGVyIHNlY29uZFxuICAgIGNvbnN0IHNjcm9sbFRpbWVsaW5lID0gbmV3IHVpLmNvcmUuVGltZWxpbmUoMSwgdmlzaWJsZVdpZHRoKTtcbiAgICBjb25zdCBzY3JvbGxUcmFjayA9IG5ldyB1aS5jb3JlLlRyYWNrKCRjb250YWluZXIsIGhlaWdodCk7XG5cbiAgICBzY3JvbGxUaW1lbGluZS5hZGQoc2Nyb2xsVHJhY2ssICdzY3JvbGwnKTtcblxuICAgIC8vIGRhdGEgb2YgdGhlIHNjcm9sbCBiYXIgaXMgdGhlIHRpbWVDb250ZXh0IG9mIHRoZSBtYWluIHRpbWVsaW5lXG4gICAgY29uc3QgbWFpblRpbWVDb250ZXh0ID0gdGhpcy5ibG9jay51aS50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBzY3JvbGxCYXIgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgbWFpblRpbWVDb250ZXh0LCB7XG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbmV3IHVpLmNvcmUuTGF5ZXJUaW1lQ29udGV4dChzY3JvbGxUaW1lbGluZS50aW1lQ29udGV4dClcbiAgICBzY3JvbGxCYXIuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuXG4gICAgc2Nyb2xsQmFyLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5TZWdtZW50LCB7XG4gICAgICB4OiBkID0+IC0gZC5vZmZzZXQsXG4gICAgICB5OiBkID0+IDAsXG4gICAgICB3aWR0aDogZCA9PiBkLnZpc2libGVEdXJhdGlvbixcbiAgICAgIGhlaWdodDogZCA9PiAxLFxuICAgIH0sIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBzY3JvbGxUcmFjay5hZGQoc2Nyb2xsQmFyLCAnc2Nyb2xsJyk7XG4gICAgc2Nyb2xsVHJhY2sudXBkYXRlQ29udGFpbmVyKCk7XG5cbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZSA9IHNjcm9sbFRpbWVsaW5lO1xuICAgIHRoaXMuX3Njcm9sbFRyYWNrID0gc2Nyb2xsVHJhY2s7XG4gICAgdGhpcy5fc2Nyb2xsQmFyID0gc2Nyb2xsQmFyO1xuICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLm9uKCdldmVudCcsIHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudCk7XG5cbiAgICAvLyBpbml0IHN0YXRlc1xuICAgIHRoaXMuX3pvb21TdGF0ZSA9IG5ldyBab29tU3RhdGUodGhpcy5ibG9jaywgdGhpcy5ibG9jay51aS50aW1lbGluZSwgdGhpcy5fc2Nyb2xsQmFyKTtcbiAgICB0aGlzLl9zY3JvbGxTdGF0ZSA9IG5ldyBTY3JvbGxTdGF0ZSh0aGlzLmJsb2NrLCB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lLCB0aGlzLl9zY3JvbGxCYXIpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRDdXJyZW50UG9zaXRpb24nKSlcbiAgICAgIGJsb2NrLmFkZExpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVPZmZzZXQpO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGltZWxpbmUuem9vbSA9IDE7XG4gICAgdGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIHRoaXMuYXhpc01vZHVsZS51bmluc3RhbGwodGhpcy5ibG9jayk7XG5cbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5yZW1vdmUodGhpcy5fc2Nyb2xsVHJhY2spO1xuICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lID0gbnVsbDtcbiAgICB0aGlzLl9zY3JvbGxUcmFjayA9IG51bGw7XG4gICAgdGhpcy5fc2Nyb2xsQmFyID0gbnVsbDtcblxuICAgIHRoaXMuX3pvb21TdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fc2Nyb2xsU3RhdGUgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRDdXJyZW50UG9zaXRpb24nKSlcbiAgICAgIGJsb2NrLnJlbW92ZUxpc3RlbmVyKGJsb2NrLkVWRU5UUy5DVVJSRU5UX1BPU0lUSU9OLCB0aGlzLl91cGRhdGVPZmZzZXQpO1xuICB9XG5cbiAgc2V0V2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IHRydWU7XG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUudmlzaWJsZVdpZHRoID0gdmFsdWU7XG5cbiAgICB0aGlzLl9zY3JvbGxUcmFjay5yZW5kZXIoKTtcbiAgICB0aGlzLl9zY3JvbGxUcmFjay51cGRhdGUoKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGFzKSB7XG4gICAgdGhpcy5heGlzTW9kdWxlLnNldFRyYWNrKG1ldGFkYXRhcyk7XG4gICAgLy8gcmVzZXQgem9vbVxuICAgIGNvbnN0IHsgdGltZWxpbmUsIHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGltZWxpbmUuem9vbSA9IDE7XG4gICAgdGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIC8vIHJlc2V0IHNjcm9sbFxuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLmJsb2NrLndpZHRoIC8gZHVyYXRpb247XG5cbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5waXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5fc2Nyb2xsQmFyLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gZHVyYXRpb247XG5cbiAgICB0aGlzLl9zY3JvbGxUcmFjay5yZW5kZXIoKTtcbiAgICB0aGlzLl9zY3JvbGxUcmFjay51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudHMgYXJlIGZvcndhcmRlZCBieSB0aGUgQmFzZVBsYXllciwgb3JpZ2luYXRlIGZyb20gdGhlIG1haW4gdGltZWxpbmUuXG4gICAqL1xuICBvbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICAvLyBAdG9kbyAtIGNhbid0IHpvb20gaWZcbiAgICAgICAgLy8gYHBsYXlDb250cm9sLnJ1bm5pbmcgPT09IHRydWVgICYmIGBjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbiA9PT0gdHJ1ZWBcbiAgICAgICAgaWYgKGhpdExheWVycy5pbmRleE9mKHRoaXMuYXhpc01vZHVsZS5sYXllcikgIT09IC0xKSB7XG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSB0aGlzLl96b29tU3RhdGU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fem9vbVN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGVtaXR0ZWQgYnkgdGhlIHNjcm9sbCB0aW1lbGluZS5cbiAgICovXG4gIF9vblNjcm9sbEJhck1vdXNlRXZlbnQoZSkge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICBpZiAodGhpcy5fc2Nyb2xsQmFyLmhhc0VsZW1lbnQoZS50YXJnZXQpKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fc2Nyb2xsU3RhdGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgLy8gZm9yd2FyZCBldmVudCBmcm9tIHNjcm9sbCB0aW1lbGluZSB0byBtYWluIHRpbWVsaW5lXG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlT2Zmc2V0KGN1cnJlbnRQb3NpdGlvbikge1xuICAgIGNvbnN0IG1haW5UaW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG4gICAgY29uc3QgbWFpblRyYWNrID0gdGhpcy5ibG9jay51aS50cmFjaztcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSBtYWluVGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuXG4gICAgLy8gem9vbSBjYW5ub3QgYmUgPCAxIChjZi4gWm9vbVN0YXRlKVxuICAgIGlmIChtYWluVGltZUNvbnRleHQuem9vbSA+IDEpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBtYWluVGltZUNvbnRleHQub2Zmc2V0O1xuICAgICAgY29uc3QgdmlzaWJsZUR1cmF0aW9uID0gbWFpblRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICAgIGNvbnN0IGNlbnRlclNjcmVlblBvc2l0aW9uID0gLSBvZmZzZXQgKyAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG4gICAgICBjb25zdCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uID0gZHVyYXRpb24gLSAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG5cbiAgICAgIGlmIChjdXJyZW50UG9zaXRpb24gPiBjZW50ZXJTY3JlZW5Qb3NpdGlvbiAmJiBjdXJyZW50UG9zaXRpb24gPCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGR0ID0gY3VycmVudFBvc2l0aW9uIC0gY2VudGVyU2NyZWVuUG9zaXRpb247XG4gICAgICAgIGNvbnN0IGR4ID0gbWFpblRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKGR4KTtcbiAgICAgICAgb2Zmc2V0IC09IGR0O1xuXG4gICAgICAgIG1haW5UaW1lQ29udGV4dC5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG1haW5UcmFjay51cGRhdGUoKTtcbiAgICAgICAgLy8gdXBkYXRlIHNjcm9sbCBiYXJcbiAgICAgICAgdGhpcy5fc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAdG9kbyAtIGluc3RhbGwgdGhlc2UgZGlyZWN0bHkgb24gdGhlIGJsb2NrID8gKi9cbiAgLy8gem9vbUluKCkge31cbiAgLy8gem9vbU91dCgpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFpvb21Nb2R1bGU7XG4iXX0=