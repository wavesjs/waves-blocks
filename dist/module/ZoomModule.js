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
  scrollBarContainer: {
    type: 'any',
    default: '',
    metas: {
      desc: 'CSS Selector or DOM element that should contain the scroll bar'
    }
  },
  scrollBarHeight: {
    type: 'float',
    min: 0,
    max: +Infinity,
    step: 1,
    default: 16,
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

    _this3.gridAxisModule = new _GridAxisModule2.default();

    _this3._onScrollBarMouseEvent = _this3._onScrollBarMouseEvent.bind(_this3);
    _this3._updateOffset = _this3._updateOffset.bind(_this3);
    return _this3;
  }

  (0, _createClass3.default)(ZoomModule, [{
    key: 'install',
    value: function install(block) {
      this._block = block;

      // @todo
      this.gridAxisModule.install(block);

      var $container = this.params.get('scrollBarContainer');

      if (!($container instanceof Element)) $container = document.querySelector($container);

      // create a new timeline to host the scroll bar
      var visibleWidth = this._block.width;
      var height = this.params.get('scrollBarHeight');

      $container.style.width = visibleWidth + 'px';
      $container.style.height = height + 'px';

      // init with dummy pixel per second
      var scrollTimeline = new ui.core.Timeline(1, visibleWidth);
      var scrollTrack = new ui.core.Track($container, height);

      scrollTimeline.add(scrollTrack, 'scroll');

      // data of the scroll bar is the timeContext of the main timeline
      var mainTimeContext = this._block.ui.timeline.timeContext;
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
      this._zoomState = new ZoomState(this._block, this._block.ui.timeline, this._scrollBar);
      this._scrollState = new ScrollState(this._block, this._block.ui.timeline, this._scrollBar);

      if (this.params.get('centeredCurrentPosition')) block.addListener(block.EVENTS.CURRENT_POSITION, this._updateOffset);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(block) {
      var _block$ui = block.ui,
          timeline = _block$ui.timeline,
          track = _block$ui.track;


      timeline.zoom = 1;
      timeline.offset = 0;
      track.update();

      this.gridAxisModule.uninstall(block);

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
    value: function setTrack(trackConfig) {
      this.gridAxisModule.setTrack(trackConfig);
      // reset zoom
      var _block$ui2 = this._block.ui,
          timeline = _block$ui2.timeline,
          track = _block$ui2.track;


      timeline.zoom = 1;
      timeline.offset = 0;
      track.update();

      // reset scroll
      var duration = this._block.duration;
      var pixelsPerSecond = this._block.width / duration;

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
      var timeline = this._block.ui.timeline;

      switch (e.type) {
        case 'mousedown':
          // @todo - can't zoom if
          // `playControl.running === true` && `centeredCurrentPosition === true`
          if (hitLayers.indexOf(this.gridAxisModule.layer) !== -1) {
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
      var timeline = this._block.ui.timeline;

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
      var mainTimeline = this._block.ui.timeline;
      var mainTrack = this._block.ui.track;
      var mainTimeContext = mainTimeline.timeContext;
      var duration = this._block.duration;

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

  }]);
  return ZoomModule;
}(_AbstractModule3.default);

exports.default = ZoomModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwic2NhbGVzIiwidXRpbHMiLCJab29tU3RhdGUiLCJibG9jayIsInRpbWVsaW5lIiwic2Nyb2xsQmFyIiwiX3BpeGVsVG9FeHBvbmVudCIsImxpbmVhciIsImRvbWFpbiIsImhlaWdodCIsInJhbmdlIiwiZSIsInR5cGUiLCJvbk1vdXNlRG93biIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwiaW5pdGlhbFpvb20iLCJ0aW1lQ29udGV4dCIsInpvb20iLCJpbml0aWFsWSIsInkiLCJvcmlnaW5hbEV2ZW50IiwicHJldmVudERlZmF1bHQiLCJtYXhab29tIiwicGl4ZWxzUGVyU2Vjb25kIiwibWluWm9vbSIsInRyYWNrRHVyYXRpb24iLCJkdXJhdGlvbiIsImxhc3RDZW50ZXJUaW1lIiwidGltZVRvUGl4ZWwiLCJpbnZlcnQiLCJ4IiwiZXhwb25lbnQiLCJ0YXJnZXRab29tIiwiTWF0aCIsInBvdyIsIm1pbiIsIm1heCIsIm5ld0NlbnRlclRpbWUiLCJkZWx0YSIsIm5ld09mZnNldCIsIm9mZnNldCIsImR4IiwibWF4T2Zmc2V0IiwibWluT2Zmc2V0IiwidmlzaWJsZUR1cmF0aW9uIiwidHJhY2tzIiwidXBkYXRlIiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiU2Nyb2xsU3RhdGUiLCJtYWluVGltZUNvbnRleHQiLCJkdCIsInBhcmFtZXRlcnMiLCJzY3JvbGxCYXJDb250YWluZXIiLCJkZWZhdWx0IiwibWV0YXMiLCJkZXNjIiwic2Nyb2xsQmFySGVpZ2h0IiwiSW5maW5pdHkiLCJzdGVwIiwiY2VudGVyZWRDdXJyZW50UG9zaXRpb24iLCJjb25zdGFudCIsIlpvb21Nb2R1bGUiLCJvcHRpb25zIiwiZ3JpZEF4aXNNb2R1bGUiLCJfb25TY3JvbGxCYXJNb3VzZUV2ZW50IiwiYmluZCIsIl91cGRhdGVPZmZzZXQiLCJfYmxvY2siLCJpbnN0YWxsIiwiJGNvbnRhaW5lciIsInBhcmFtcyIsImdldCIsIkVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ2aXNpYmxlV2lkdGgiLCJ3aWR0aCIsInN0eWxlIiwic2Nyb2xsVGltZWxpbmUiLCJjb3JlIiwiVGltZWxpbmUiLCJzY3JvbGxUcmFjayIsIlRyYWNrIiwiYWRkIiwiTGF5ZXIiLCJ5RG9tYWluIiwiTGF5ZXJUaW1lQ29udGV4dCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJTZWdtZW50IiwiZCIsImRpc3BsYXlIYW5kbGVycyIsInVwZGF0ZUNvbnRhaW5lciIsIl9zY3JvbGxUaW1lbGluZSIsIl9zY3JvbGxUcmFjayIsIl9zY3JvbGxCYXIiLCJvbiIsIl96b29tU3RhdGUiLCJfc2Nyb2xsU3RhdGUiLCJhZGRMaXN0ZW5lciIsIkVWRU5UUyIsIkNVUlJFTlRfUE9TSVRJT04iLCJ0cmFjayIsInVuaW5zdGFsbCIsInJlbW92ZSIsInJlbW92ZUxpc3RlbmVyIiwidmFsdWUiLCJtYWludGFpblZpc2libGVEdXJhdGlvbiIsInJlbmRlciIsInRyYWNrQ29uZmlnIiwic2V0VHJhY2siLCJoaXRMYXllcnMiLCJpbmRleE9mIiwibGF5ZXIiLCJzdGF0ZSIsImhhc0VsZW1lbnQiLCJ0YXJnZXQiLCJjdXJyZW50UG9zaXRpb24iLCJtYWluVGltZWxpbmUiLCJtYWluVHJhY2siLCJjZW50ZXJTY3JlZW5Qb3NpdGlvbiIsImxhc3RIYWxmU2NyZWVuUG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUVaLElBQU1DLFNBQVNELEdBQUdFLEtBQUgsQ0FBU0QsTUFBeEI7O0lBRU1FLFM7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CQyxRQUFuQixFQUE2QkMsU0FBN0IsRUFBd0M7QUFBQTs7QUFBQSw0SUFDaENELFFBRGdDOztBQUd0QyxVQUFLRCxLQUFMLEdBQWFBLEtBQWI7QUFDQSxVQUFLRSxTQUFMLEdBQWlCQSxT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LEtBQUtvRSxrQkFBa0JHLG9CQUE3QjtBQUNBLGNBQU1qRixLQUFLUyxnQkFBZ0J0QixXQUFoQixDQUE0QmEsRUFBNUIsQ0FBWDtBQUNBRCxvQkFBVVcsRUFBVjs7QUFFQUQsMEJBQWdCVixNQUFoQixHQUF5QkEsTUFBekI7QUFDQWlGLG9CQUFVM0UsTUFBVjtBQUNBO0FBQ0EsZUFBS21ELFVBQUwsQ0FBZ0JuRCxNQUFoQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7Ozs7OztrQkFHYWdCLFUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgR3JpZEF4aXNNb2R1bGUgZnJvbSAnLi9HcmlkQXhpc01vZHVsZSc7XG5pbXBvcnQgVGltZUF4aXNNb2R1bGUgZnJvbSAnLi9UaW1lQXhpc01vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cbmNvbnN0IHNjYWxlcyA9IHVpLnV0aWxzLnNjYWxlcztcblxuY2xhc3MgWm9vbVN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrLCB0aW1lbGluZSwgc2Nyb2xsQmFyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgIHRoaXMuc2Nyb2xsQmFyID0gc2Nyb2xsQmFyO1xuXG4gICAgdGhpcy5fcGl4ZWxUb0V4cG9uZW50ID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCBibG9jay5oZWlnaHRdKVxuICAgICAgLnJhbmdlKFswLCAxXSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuYmxvY2sgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmluaXRpYWxab29tID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC56b29tO1xuICAgIHRoaXMuaW5pdGlhbFkgPSBlLnk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gcHJldmVudCBhbm5veWluZyB0ZXh0IHNlbGVjdGlvbiB3aGVuIGRyYWdnaW5nXG4gICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBkZWZpbmUgbWF4L21pbiB6b29tXG4gICAgY29uc3QgbWF4Wm9vbSA9IDQ0MTAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3QgbWluWm9vbSA9IDE7XG5cbiAgICBjb25zdCB0cmFja0R1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgbGFzdENlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBleHBvbmVudCA9IHRoaXMuX3BpeGVsVG9FeHBvbmVudChlLnkgLSB0aGlzLmluaXRpYWxZKTtcbiAgICBjb25zdCB0YXJnZXRab29tID0gdGhpcy5pbml0aWFsWm9vbSAqIE1hdGgucG93KDIsIGV4cG9uZW50KTtcblxuICAgIHRpbWVDb250ZXh0Lnpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0YXJnZXRab29tLCBtaW5ab29tKSwgbWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBjbGFtcCB6b29tZWQgd2F2ZWZvcm0gaW4gc2NyZWVuXG4gICAgY29uc3QgbmV3T2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0ICsgZGVsdGEgKyB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCk7XG4gICAgY29uc3QgbWF4T2Zmc2V0ID0gMDtcbiAgICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb24gLSB0cmFja0R1cmF0aW9uO1xuXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgobWluT2Zmc2V0LCBNYXRoLm1pbihtYXhPZmZzZXQsIG5ld09mZnNldCkpO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gICAgdGhpcy5zY3JvbGxCYXIudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge31cbn1cblxuXG5jbGFzcyBTY3JvbGxTdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3RvcihibG9jaywgdGltZWxpbmUsIHNjcm9sbEJhcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLnNjcm9sbEJhciA9IHNjcm9sbEJhcjtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHRyYWNrRHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuICAgIGNvbnN0IGR0ID0gdGhpcy5zY3JvbGxCYXIudGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUuZHgpO1xuXG4gICAgLy8gbWFuaXB1YXRlIGFuZCBjbGFtcCBvZmZzZXQgb2YgdGhlIG1haW4gdGltZWxpbmVcbiAgICBjb25zdCBuZXdPZmZzZXQgPSBtYWluVGltZUNvbnRleHQub2Zmc2V0IC0gZHQ7XG4gICAgY29uc3QgbWF4T2Zmc2V0ID0gMDtcbiAgICBjb25zdCBtaW5PZmZzZXQgPSBtYWluVGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uIC0gdHJhY2tEdXJhdGlvbjtcblxuICAgIG1haW5UaW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heChtaW5PZmZzZXQsIE1hdGgubWluKG1heE9mZnNldCwgbmV3T2Zmc2V0KSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgICB0aGlzLnNjcm9sbEJhci51cGRhdGUoKTtcbiAgfVxufVxuXG5cblxuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgc2Nyb2xsQmFyQ29udGFpbmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogJycsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDU1MgU2VsZWN0b3Igb3IgRE9NIGVsZW1lbnQgdGhhdCBzaG91bGQgY29udGFpbiB0aGUgc2Nyb2xsIGJhcicsXG4gICAgfSxcbiAgfSxcbiAgc2Nyb2xsQmFySGVpZ2h0OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgc3RlcDogMSxcbiAgICBkZWZhdWx0OiAxNixcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2hlaWdodCBvZiB0aGUgc2Nyb2xsLWJhciwgaXMgcmVtb3ZlZCBmcm9tICdcbiAgICB9XG4gIH0sXG4gIGNlbnRlcmVkQ3VycmVudFBvc2l0aW9uOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiBga2VlcCB3YXZlZm9ybSBjZW50ZXIgYXJvdW5kIHRoZSBibG9jaydzIGN1cnJlbnQgcG9zaXRpb25gLFxuICAgIH0sXG4gIH0sXG4gIC8vIEB0b2RvIC0gYWxsb3cgc3dpdGNoaW5nIGJldHdlZW4gdGltZSBhbmQgZ3JpZCBheGlzXG4gIC8vIGF4aXM6IHt9XG59XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgWm9vbU1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5ncmlkQXhpc01vZHVsZSA9IG5ldyBHcmlkQXhpc01vZHVsZSgpO1xuXG4gICAgdGhpcy5fb25TY3JvbGxCYXJNb3VzZUV2ZW50ID0gdGhpcy5fb25TY3JvbGxCYXJNb3VzZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdXBkYXRlT2Zmc2V0ID0gdGhpcy5fdXBkYXRlT2Zmc2V0LmJpbmQodGhpcyk7XG4gIH1cblxuICBpbnN0YWxsKGJsb2NrKSB7XG4gICAgdGhpcy5fYmxvY2sgPSBibG9jaztcblxuICAgIC8vIEB0b2RvXG4gICAgdGhpcy5ncmlkQXhpc01vZHVsZS5pbnN0YWxsKGJsb2NrKTtcblxuICAgIGxldCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJDb250YWluZXInKTtcblxuICAgIGlmICghKCRjb250YWluZXIgaW5zdGFuY2VvZiBFbGVtZW50KSlcbiAgICAgICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuXG4gICAgLy8gY3JlYXRlIGEgbmV3IHRpbWVsaW5lIHRvIGhvc3QgdGhlIHNjcm9sbCBiYXJcbiAgICBjb25zdCB2aXNpYmxlV2lkdGggPSB0aGlzLl9ibG9jay53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5nZXQoJ3Njcm9sbEJhckhlaWdodCcpO1xuXG4gICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHZpc2libGVXaWR0aCArICdweCc7XG4gICAgJGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgLy8gaW5pdCB3aXRoIGR1bW15IHBpeGVsIHBlciBzZWNvbmRcbiAgICBjb25zdCBzY3JvbGxUaW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHZpc2libGVXaWR0aCk7XG4gICAgY29uc3Qgc2Nyb2xsVHJhY2sgPSBuZXcgdWkuY29yZS5UcmFjaygkY29udGFpbmVyLCBoZWlnaHQpO1xuXG4gICAgc2Nyb2xsVGltZWxpbmUuYWRkKHNjcm9sbFRyYWNrLCAnc2Nyb2xsJyk7XG5cbiAgICAvLyBkYXRhIG9mIHRoZSBzY3JvbGwgYmFyIGlzIHRoZSB0aW1lQ29udGV4dCBvZiB0aGUgbWFpbiB0aW1lbGluZVxuICAgIGNvbnN0IG1haW5UaW1lQ29udGV4dCA9IHRoaXMuX2Jsb2NrLnVpLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHNjcm9sbEJhciA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBtYWluVGltZUNvbnRleHQsIHtcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBuZXcgdWkuY29yZS5MYXllclRpbWVDb250ZXh0KHNjcm9sbFRpbWVsaW5lLnRpbWVDb250ZXh0KVxuICAgIHNjcm9sbEJhci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG5cbiAgICBzY3JvbGxCYXIuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLlNlZ21lbnQsIHtcbiAgICAgIHg6IGQgPT4gLSBkLm9mZnNldCxcbiAgICAgIHk6IGQgPT4gMCxcbiAgICAgIHdpZHRoOiBkID0+IGQudmlzaWJsZUR1cmF0aW9uLFxuICAgICAgaGVpZ2h0OiBkID0+IDEsXG4gICAgfSwge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHNjcm9sbFRyYWNrLmFkZChzY3JvbGxCYXIsICdzY3JvbGwnKTtcbiAgICBzY3JvbGxUcmFjay51cGRhdGVDb250YWluZXIoKTtcblxuICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lID0gc2Nyb2xsVGltZWxpbmU7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sgPSBzY3JvbGxUcmFjaztcbiAgICB0aGlzLl9zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG5cbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZS5vbignZXZlbnQnLCB0aGlzLl9vblNjcm9sbEJhck1vdXNlRXZlbnQpO1xuXG4gICAgLy8gaW5pdCBzdGF0ZXNcbiAgICB0aGlzLl96b29tU3RhdGUgPSBuZXcgWm9vbVN0YXRlKHRoaXMuX2Jsb2NrLCB0aGlzLl9ibG9jay51aS50aW1lbGluZSwgdGhpcy5fc2Nyb2xsQmFyKTtcbiAgICB0aGlzLl9zY3JvbGxTdGF0ZSA9IG5ldyBTY3JvbGxTdGF0ZSh0aGlzLl9ibG9jaywgdGhpcy5fYmxvY2sudWkudGltZWxpbmUsIHRoaXMuX3Njcm9sbEJhcik7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbicpKVxuICAgICAgYmxvY2suYWRkTGlzdGVuZXIoYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZU9mZnNldCk7XG4gIH1cblxuICB1bmluc3RhbGwoYmxvY2spIHtcbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjayB9ID0gYmxvY2sudWk7XG5cbiAgICB0aW1lbGluZS56b29tID0gMTtcbiAgICB0aW1lbGluZS5vZmZzZXQgPSAwO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5ncmlkQXhpc01vZHVsZS51bmluc3RhbGwoYmxvY2spO1xuXG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUucmVtb3ZlKHRoaXMuX3Njcm9sbFRyYWNrKTtcbiAgICB0aGlzLl9zY3JvbGxUaW1lbGluZSA9IG51bGw7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sgPSBudWxsO1xuICAgIHRoaXMuX3Njcm9sbEJhciA9IG51bGw7XG5cbiAgICB0aGlzLl96b29tU3RhdGUgPSBudWxsO1xuICAgIHRoaXMuX3Njcm9sbFN0YXRlID0gbnVsbDtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2NlbnRlcmVkQ3VycmVudFBvc2l0aW9uJykpXG4gICAgICBibG9jay5yZW1vdmVMaXN0ZW5lcihibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHNldFdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB0cnVlO1xuICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnZpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sucmVuZGVyKCk7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sudXBkYXRlKCk7XG4gIH1cblxuICBzZXRUcmFjayh0cmFja0NvbmZpZykge1xuICAgIHRoaXMuZ3JpZEF4aXNNb2R1bGUuc2V0VHJhY2sodHJhY2tDb25maWcpO1xuICAgIC8vIHJlc2V0IHpvb21cbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjayB9ID0gdGhpcy5fYmxvY2sudWk7XG5cbiAgICB0aW1lbGluZS56b29tID0gMTtcbiAgICB0aW1lbGluZS5vZmZzZXQgPSAwO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgLy8gcmVzZXQgc2Nyb2xsXG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLl9ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9ibG9jay53aWR0aCAvIGR1cmF0aW9uO1xuXG4gICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUucGl4ZWxzUGVyU2Vjb25kID0gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMuX3Njcm9sbEJhci50aW1lQ29udGV4dC5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sucmVuZGVyKCk7XG4gICAgdGhpcy5fc2Nyb2xsVHJhY2sudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGFyZSBmb3J3YXJkZWQgYnkgdGhlIEJhc2VQbGF5ZXIsIG9yaWdpbmF0ZSBmcm9tIHRoZSBtYWluIHRpbWVsaW5lLlxuICAgKi9cbiAgb25FdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMuX2Jsb2NrLnVpLnRpbWVsaW5lO1xuXG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIC8vIEB0b2RvIC0gY2FuJ3Qgem9vbSBpZlxuICAgICAgICAvLyBgcGxheUNvbnRyb2wucnVubmluZyA9PT0gdHJ1ZWAgJiYgYGNlbnRlcmVkQ3VycmVudFBvc2l0aW9uID09PSB0cnVlYFxuICAgICAgICBpZiAoaGl0TGF5ZXJzLmluZGV4T2YodGhpcy5ncmlkQXhpc01vZHVsZS5sYXllcikgIT09IC0xKSB7XG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSB0aGlzLl96b29tU3RhdGU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fem9vbVN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGVtaXR0ZWQgYnkgdGhlIHNjcm9sbCB0aW1lbGluZS5cbiAgICovXG4gIF9vblNjcm9sbEJhck1vdXNlRXZlbnQoZSkge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5fYmxvY2sudWkudGltZWxpbmU7XG5cbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgaWYgKHRoaXMuX3Njcm9sbEJhci5oYXNFbGVtZW50KGUudGFyZ2V0KSlcbiAgICAgICAgICB0aW1lbGluZS5zdGF0ZSA9IHRoaXMuX3Njcm9sbFN0YXRlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIC8vIGZvcndhcmQgZXZlbnQgZnJvbSBzY3JvbGwgdGltZWxpbmUgdG8gbWFpbiB0aW1lbGluZVxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Njcm9sbFN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICBpZiAodGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Njcm9sbFN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZU9mZnNldChjdXJyZW50UG9zaXRpb24pIHtcbiAgICBjb25zdCBtYWluVGltZWxpbmUgPSB0aGlzLl9ibG9jay51aS50aW1lbGluZTtcbiAgICBjb25zdCBtYWluVHJhY2sgPSB0aGlzLl9ibG9jay51aS50cmFjaztcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSBtYWluVGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLl9ibG9jay5kdXJhdGlvbjtcblxuICAgIC8vIHpvb20gY2Fubm90IGJlIDwgMSAoY2YuIFpvb21TdGF0ZSlcbiAgICBpZiAobWFpblRpbWVDb250ZXh0Lnpvb20gPiAxKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gbWFpblRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICAgIGNvbnN0IHZpc2libGVEdXJhdGlvbiA9IG1haW5UaW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gICAgICBjb25zdCBjZW50ZXJTY3JlZW5Qb3NpdGlvbiA9IC0gb2Zmc2V0ICsgKHZpc2libGVEdXJhdGlvbiAvIDIpO1xuICAgICAgY29uc3QgbGFzdEhhbGZTY3JlZW5Qb3NpdGlvbiA9IGR1cmF0aW9uIC0gKHZpc2libGVEdXJhdGlvbiAvIDIpO1xuXG4gICAgICBpZiAoY3VycmVudFBvc2l0aW9uID4gY2VudGVyU2NyZWVuUG9zaXRpb24gJiYgY3VycmVudFBvc2l0aW9uIDwgbGFzdEhhbGZTY3JlZW5Qb3NpdGlvbikge1xuICAgICAgICBjb25zdCBkdCA9IGN1cnJlbnRQb3NpdGlvbiAtIGNlbnRlclNjcmVlblBvc2l0aW9uO1xuICAgICAgICBjb25zdCBkeCA9IG1haW5UaW1lQ29udGV4dC50aW1lVG9QaXhlbChkeCk7XG4gICAgICAgIG9mZnNldCAtPSBkdDtcblxuICAgICAgICBtYWluVGltZUNvbnRleHQub2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICBtYWluVHJhY2sudXBkYXRlKCk7XG4gICAgICAgIC8vIHVwZGF0ZSBzY3JvbGwgYmFyXG4gICAgICAgIHRoaXMuX3Njcm9sbEJhci51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHRvZG8gLSBpbnN0YWxsIHRoZXNlIGRpcmVjdGx5IG9uIHRoZSBibG9jayA/ICovXG4gIC8vIHpvb21JbigpIHt9XG4gIC8vIHpvb21PdXQoKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBab29tTW9kdWxlO1xuIl19