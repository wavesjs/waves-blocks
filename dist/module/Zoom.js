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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlpvb20uanMiXSwibmFtZXMiOlsidWkiLCJzY2FsZXMiLCJ1dGlscyIsIlpvb21TdGF0ZSIsImJsb2NrIiwidGltZWxpbmUiLCJzY3JvbGxCYXIiLCJfcGl4ZWxUb0V4cG9uZW50IiwibGluZWFyIiwiZG9tYWluIiwiaGVpZ2h0IiwicmFuZ2UiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJpbml0aWFsWm9vbSIsInRpbWVDb250ZXh0Iiwiem9vbSIsImluaXRpYWxZIiwieSIsIm9yaWdpbmFsRXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm1heFpvb20iLCJwaXhlbHNQZXJTZWNvbmQiLCJtaW5ab29tIiwidHJhY2tEdXJhdGlvbiIsImR1cmF0aW9uIiwibGFzdENlbnRlclRpbWUiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsIngiLCJleHBvbmVudCIsInRhcmdldFpvb20iLCJNYXRoIiwicG93IiwibWluIiwibWF4IiwibmV3Q2VudGVyVGltZSIsImRlbHRhIiwibmV3T2Zmc2V0Iiwib2Zmc2V0IiwiZHgiLCJtYXhPZmZzZXQiLCJtaW5PZmZzZXQiLCJ2aXNpYmxlRHVyYXRpb24iLCJ0cmFja3MiLCJ1cGRhdGUiLCJzdGF0ZXMiLCJCYXNlU3RhdGUiLCJTY3JvbGxTdGF0ZSIsIm1haW5UaW1lQ29udGV4dCIsImR0IiwicGFyYW1ldGVycyIsImF4aXNUeXBlIiwibGlzdCIsImRlZmF1bHQiLCJzY3JvbGxCYXJDb250YWluZXIiLCJyZXF1aXJlZCIsIm1ldGFzIiwiZGVzYyIsInNjcm9sbEJhckhlaWdodCIsIkluZmluaXR5Iiwic3RlcCIsInNjcm9sbEJhckNvbG9yIiwiY2VudGVyZWRDdXJyZW50UG9zaXRpb24iLCJjb25zdGFudCIsIlpvb20iLCJvcHRpb25zIiwiYXhpc01vZHVsZSIsInBhcmFtcyIsImdldCIsIkdyaWRBeGlzIiwiVGltZUF4aXMiLCJoYXNTY3JvbGxCYXIiLCJfb25TY3JvbGxCYXJNb3VzZUV2ZW50IiwiYmluZCIsIl91cGRhdGVPZmZzZXQiLCJpbnN0YWxsIiwiJGNvbnRhaW5lciIsIkVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ2aXNpYmxlV2lkdGgiLCJ3aWR0aCIsInN0eWxlIiwic2Nyb2xsVGltZWxpbmUiLCJjb3JlIiwiVGltZWxpbmUiLCJzY3JvbGxUcmFjayIsIlRyYWNrIiwiYWRkIiwiTGF5ZXIiLCJ5RG9tYWluIiwiTGF5ZXJUaW1lQ29udGV4dCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJTZWdtZW50IiwiZCIsImNvbG9yIiwiZGlzcGxheUhhbmRsZXJzIiwidXBkYXRlQ29udGFpbmVyIiwiX3Njcm9sbFRpbWVsaW5lIiwiX3Njcm9sbFRyYWNrIiwiX3Njcm9sbEJhciIsIm9uIiwiX3Njcm9sbFN0YXRlIiwiX3pvb21TdGF0ZSIsImFkZExpc3RlbmVyIiwiRVZFTlRTIiwiQ1VSUkVOVF9QT1NJVElPTiIsInRyYWNrIiwidW5pbnN0YWxsIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmUiLCJ2YWx1ZSIsIm1haW50YWluVmlzaWJsZUR1cmF0aW9uIiwicmVuZGVyIiwiYnVmZmVyIiwibWV0YWRhdGFzIiwic2V0VHJhY2siLCJoaXRMYXllcnMiLCJpbmRleE9mIiwibGF5ZXIiLCJzdGF0ZSIsImhhc0VsZW1lbnQiLCJ0YXJnZXQiLCJjdXJyZW50UG9zaXRpb24iLCJtYWluVGltZWxpbmUiLCJtYWluVHJhY2siLCJjZW50ZXJTY3JlZW5Qb3NpdGlvbiIsImxhc3RIYWxmU2NyZWVuUG9zaXRpb24iLCJ6SW5kZXgiLCJBYnN0cmFjdE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFFWixJQUFNQyxTQUFTRCxHQUFHRSxLQUFILENBQVNELE1BQXhCOztBQUVBOztJQUNNRSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsUUFBbkIsRUFBK0M7QUFBQSxRQUFsQkMsU0FBa0IsdUVBQU4sSUFBTTtBQUFBOztBQUFBLDRJQUN2Q0QsUUFEdUM7O0FBRzdDLFVBQUtELEtBQUwsR0FBYUEsS0FBYjtBQUNBLFVBQUtFLFNBQUwsR0FBaUJBLFNBQWpCOztBQUVBLFVBQUtDLGdCQUFMLEdBQXdCTixPQUFPTyxNQUFQLEdBQ3JCQyxNQURxQixDQUNkLENBQUMsQ0FBRCxFQUFJTCxNQUFNTSxNQUFWLENBRGMsRUFFckJDLEtBRnFCLENBRWYsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZlLENBQXhCO0FBTjZDO0FBUzlDOzs7OzhCQUVTO0FBQ1IsV0FBS1AsS0FBTCxHQUFhLElBQWI7QUFDRDs7O2dDQUVXUSxDLEVBQUc7QUFDYixjQUFPQSxFQUFFQyxJQUFUO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBS0MsV0FBTCxDQUFpQkYsQ0FBakI7QUFDQTtBQUNGLGFBQUssV0FBTDtBQUNFLGVBQUtHLFdBQUwsQ0FBaUJILENBQWpCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLSSxTQUFMLENBQWVKLENBQWY7QUFDQTtBQVRKO0FBV0Q7OztnQ0FFV0EsQyxFQUFHO0FBQ2IsV0FBS0ssV0FBTCxHQUFtQixLQUFLWixRQUFMLENBQWNhLFdBQWQsQ0FBMEJDLElBQTdDO0FBQ0EsV0FBS0MsUUFBTCxHQUFnQlIsRUFBRVMsQ0FBbEI7QUFDRDs7O2dDQUVXVCxDLEVBQUc7QUFDYjtBQUNBQSxRQUFFVSxhQUFGLENBQWdCQyxjQUFoQjs7QUFFQTtBQUNBLFVBQU1DLFVBQVUsUUFBUSxLQUFLbkIsUUFBTCxDQUFjYSxXQUFkLENBQTBCTyxlQUFsRDtBQUNBLFVBQU1DLFVBQVUsQ0FBaEI7O0FBRUEsVUFBTUMsZ0JBQWdCLEtBQUt2QixLQUFMLENBQVd3QixRQUFqQztBQUNBLFVBQU1WLGNBQWMsS0FBS2IsUUFBTCxDQUFjYSxXQUFsQztBQUNBLFVBQU1XLGlCQUFpQlgsWUFBWVksV0FBWixDQUF3QkMsTUFBeEIsQ0FBK0JuQixFQUFFb0IsQ0FBakMsQ0FBdkI7QUFDQSxVQUFNQyxXQUFXLEtBQUsxQixnQkFBTCxDQUFzQkssRUFBRVMsQ0FBRixHQUFNLEtBQUtELFFBQWpDLENBQWpCO0FBQ0EsVUFBTWMsYUFBYSxLQUFLakIsV0FBTCxHQUFtQmtCLEtBQUtDLEdBQUwsQ0FBUyxDQUFULEVBQVlILFFBQVosQ0FBdEM7O0FBRUFmLGtCQUFZQyxJQUFaLEdBQW1CZ0IsS0FBS0UsR0FBTCxDQUFTRixLQUFLRyxHQUFMLENBQVNKLFVBQVQsRUFBcUJSLE9BQXJCLENBQVQsRUFBd0NGLE9BQXhDLENBQW5COztBQUVBLFVBQU1lLGdCQUFnQnJCLFlBQVlZLFdBQVosQ0FBd0JDLE1BQXhCLENBQStCbkIsRUFBRW9CLENBQWpDLENBQXRCO0FBQ0EsVUFBTVEsUUFBUUQsZ0JBQWdCVixjQUE5Qjs7QUFFQTtBQUNBLFVBQU1ZLFlBQVl2QixZQUFZd0IsTUFBWixHQUFxQkYsS0FBckIsR0FBNkJ0QixZQUFZWSxXQUFaLENBQXdCQyxNQUF4QixDQUErQm5CLEVBQUUrQixFQUFqQyxDQUEvQztBQUNBLFVBQU1DLFlBQVksQ0FBbEI7QUFDQSxVQUFNQyxZQUFZM0IsWUFBWTRCLGVBQVosR0FBOEJuQixhQUFoRDs7QUFFQVQsa0JBQVl3QixNQUFaLEdBQXFCUCxLQUFLRyxHQUFMLENBQVNPLFNBQVQsRUFBb0JWLEtBQUtFLEdBQUwsQ0FBU08sU0FBVCxFQUFvQkgsU0FBcEIsQ0FBcEIsQ0FBckI7O0FBRUEsV0FBS3BDLFFBQUwsQ0FBYzBDLE1BQWQsQ0FBcUJDLE1BQXJCOztBQUVBLFVBQUksS0FBSzFDLFNBQVQsRUFDRSxLQUFLQSxTQUFMLENBQWUwQyxNQUFmO0FBQ0g7Ozs4QkFFU3BDLEMsRUFBRyxDQUFFOzs7RUFuRU9aLEdBQUdpRCxNQUFILENBQVVDLFM7O0FBc0VsQzs7O0lBQ01DLFc7OztBQUNKLHVCQUFZL0MsS0FBWixFQUFtQkMsUUFBbkIsRUFBNkJDLFNBQTdCLEVBQXdDO0FBQUE7O0FBQUEsaUpBQ2hDRCxRQURnQzs7QUFHdEMsV0FBS0QsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsV0FBS0UsU0FBTCxHQUFpQkEsU0FBakI7QUFKc0M7QUFLdkM7Ozs7Z0NBRVdNLEMsRUFBRztBQUNiLFVBQU13QyxrQkFBa0IsS0FBSy9DLFFBQUwsQ0FBY2EsV0FBdEM7QUFDQSxVQUFNUyxnQkFBZ0IsS0FBS3ZCLEtBQUwsQ0FBV3dCLFFBQWpDO0FBQ0EsVUFBTXlCLEtBQUssS0FBSy9DLFNBQUwsQ0FBZVksV0FBZixDQUEyQlksV0FBM0IsQ0FBdUNDLE1BQXZDLENBQThDbkIsRUFBRStCLEVBQWhELENBQVg7O0FBRUE7QUFDQSxVQUFNRixZQUFZVyxnQkFBZ0JWLE1BQWhCLEdBQXlCVyxFQUEzQztBQUNBLFVBQU1ULFlBQVksQ0FBbEI7QUFDQSxVQUFNQyxZQUFZTyxnQkFBZ0JOLGVBQWhCLEdBQWtDbkIsYUFBcEQ7O0FBRUF5QixzQkFBZ0JWLE1BQWhCLEdBQXlCUCxLQUFLRyxHQUFMLENBQVNPLFNBQVQsRUFBb0JWLEtBQUtFLEdBQUwsQ0FBU08sU0FBVCxFQUFvQkgsU0FBcEIsQ0FBcEIsQ0FBekI7O0FBRUEsV0FBS3BDLFFBQUwsQ0FBYzBDLE1BQWQsQ0FBcUJDLE1BQXJCO0FBQ0EsV0FBSzFDLFNBQUwsQ0FBZTBDLE1BQWY7QUFDRDs7O0VBdEJ1QmhELEdBQUdpRCxNQUFILENBQVVDLFM7O0FBeUJwQzs7O0FBQ0EsSUFBTUksYUFBYTtBQUNqQkMsWUFBVTtBQUNSMUMsVUFBTSxNQURFO0FBRVIyQyxVQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FGRTtBQUdSQyxhQUFTO0FBSEQsR0FETztBQU1qQkMsc0JBQW9CO0FBQ2xCN0MsVUFBTSxLQURZO0FBRWxCNEMsYUFBUyxJQUZTO0FBR2xCRSxjQUFVLElBSFE7QUFJbEJDLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSlcsR0FOSDtBQWNqQkMsbUJBQWlCO0FBQ2ZqRCxVQUFNLE9BRFM7QUFFZndCLFNBQUssQ0FGVTtBQUdmQyxTQUFLLENBQUN5QixRQUhTO0FBSWZDLFVBQU0sQ0FKUztBQUtmUCxhQUFTLEVBTE07QUFNZkcsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFOUSxHQWRBO0FBd0JqQkksa0JBQWdCO0FBQ2RwRCxVQUFNLFFBRFE7QUFFZDRDLGFBQVMsU0FGSztBQUdkRyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUhPLEdBeEJDO0FBK0JqQkssMkJBQXlCO0FBQ3ZCckQsVUFBTSxTQURpQjtBQUV2QjRDLGFBQVMsS0FGYztBQUd2QlUsY0FBVSxJQUhhO0FBSXZCUCxXQUFPO0FBQ0xDO0FBREs7QUFKZ0I7QUEvQlIsQ0FBbkI7O0FBeUNBOzs7Ozs7Ozs7Ozs7SUFXTU8sSTs7O0FBQ0osZ0JBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQSxtSUFDYmYsVUFEYSxFQUNEZSxPQURDOztBQUduQixXQUFLQyxVQUFMLEdBQWtCLE9BQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixNQUFnQyxNQUFoQyxHQUNoQixJQUFJQyxrQkFBSixFQURnQixHQUNDLElBQUlDLGtCQUFKLEVBRG5COztBQUdBLFdBQUtDLFlBQUwsR0FBb0IsS0FBcEI7O0FBRUEsV0FBS0Msc0JBQUwsR0FBOEIsT0FBS0Esc0JBQUwsQ0FBNEJDLElBQTVCLFFBQTlCO0FBQ0EsV0FBS0MsYUFBTCxHQUFxQixPQUFLQSxhQUFMLENBQW1CRCxJQUFuQixRQUFyQjtBQVRtQjtBQVVwQjs7Ozs4QkFvQlM7QUFBQTs7QUFDUixXQUFLUCxVQUFMLENBQWdCUyxPQUFoQjs7QUFFQSxVQUFJQyxhQUFhLEtBQUtULE1BQUwsQ0FBWUMsR0FBWixDQUFnQixvQkFBaEIsQ0FBakI7O0FBRUEsVUFBSVEsZUFBZSxJQUFuQixFQUF5QjtBQUN2QixZQUFJLEVBQUVBLHNCQUFzQkMsT0FBeEIsQ0FBSixFQUNFRCxhQUFhRSxTQUFTQyxhQUFULENBQXVCSCxVQUF2QixDQUFiOztBQUVGLGFBQUtMLFlBQUwsR0FBb0IsSUFBcEI7O0FBRUE7QUFDQSxZQUFNUyxlQUFlLEtBQUtoRixLQUFMLENBQVdpRixLQUFoQztBQUNBLFlBQU0zRSxTQUFTLEtBQUs2RCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsaUJBQWhCLENBQWY7O0FBRUFRLG1CQUFXTSxLQUFYLENBQWlCRCxLQUFqQixHQUF5QkQsZUFBZSxJQUF4QztBQUNBSixtQkFBV00sS0FBWCxDQUFpQjVFLE1BQWpCLEdBQTBCQSxTQUFTLElBQW5DOztBQUVBO0FBQ0EsWUFBTTZFLGlCQUFpQixJQUFJdkYsR0FBR3dGLElBQUgsQ0FBUUMsUUFBWixDQUFxQixDQUFyQixFQUF3QkwsWUFBeEIsQ0FBdkI7QUFDQSxZQUFNTSxjQUFjLElBQUkxRixHQUFHd0YsSUFBSCxDQUFRRyxLQUFaLENBQWtCWCxVQUFsQixFQUE4QnRFLE1BQTlCLENBQXBCOztBQUVBNkUsdUJBQWVLLEdBQWYsQ0FBbUJGLFdBQW5CLEVBQWdDLFFBQWhDOztBQUVBO0FBQ0EsWUFBTXRDLGtCQUFrQixLQUFLaEQsS0FBTCxDQUFXSixFQUFYLENBQWNLLFFBQWQsQ0FBdUJhLFdBQS9DO0FBQ0EsWUFBTVosWUFBWSxJQUFJTixHQUFHd0YsSUFBSCxDQUFRSyxLQUFaLENBQWtCLFFBQWxCLEVBQTRCekMsZUFBNUIsRUFBNkM7QUFDN0QxQyxrQkFBUUEsTUFEcUQ7QUFFN0RvRixtQkFBUyxDQUFDLENBQUQsRUFBSSxDQUFKO0FBRm9ELFNBQTdDLENBQWxCOztBQUtBLFlBQU01RSxjQUFjLElBQUlsQixHQUFHd0YsSUFBSCxDQUFRTyxnQkFBWixDQUE2QlIsZUFBZXJFLFdBQTVDLENBQXBCO0FBQ0FaLGtCQUFVMEYsY0FBVixDQUF5QjlFLFdBQXpCOztBQUVBWixrQkFBVTJGLGNBQVYsQ0FBeUJqRyxHQUFHa0csTUFBSCxDQUFVQyxPQUFuQyxFQUE0QztBQUMxQ25FLGFBQUc7QUFBQSxtQkFBSyxDQUFFb0UsRUFBRTFELE1BQVQ7QUFBQSxXQUR1QztBQUUxQ3JCLGFBQUc7QUFBQSxtQkFBSyxDQUFMO0FBQUEsV0FGdUM7QUFHMUNnRSxpQkFBTztBQUFBLG1CQUFLZSxFQUFFdEQsZUFBUDtBQUFBLFdBSG1DO0FBSTFDcEMsa0JBQVE7QUFBQSxtQkFBSyxDQUFMO0FBQUEsV0FKa0M7QUFLMUMyRixpQkFBTztBQUFBLG1CQUFLLE9BQUs5QixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsZ0JBQWhCLENBQUw7QUFBQTtBQUxtQyxTQUE1QyxFQU1HO0FBQ0Q4QiwyQkFBaUI7QUFEaEIsU0FOSDs7QUFVQVosb0JBQVlFLEdBQVosQ0FBZ0J0RixTQUFoQixFQUEyQixRQUEzQjtBQUNBb0Ysb0JBQVlhLGVBQVo7O0FBRUEsYUFBS0MsZUFBTCxHQUF1QmpCLGNBQXZCO0FBQ0EsYUFBS2tCLFlBQUwsR0FBb0JmLFdBQXBCO0FBQ0EsYUFBS2dCLFVBQUwsR0FBa0JwRyxTQUFsQjtBQUNBLGFBQUtrRyxlQUFMLENBQXFCRyxFQUFyQixDQUF3QixPQUF4QixFQUFpQyxLQUFLL0Isc0JBQXRDOztBQUVBLGFBQUtnQyxZQUFMLEdBQW9CLElBQUl6RCxXQUFKLENBQWdCLEtBQUsvQyxLQUFyQixFQUE0QixLQUFLQSxLQUFMLENBQVdKLEVBQVgsQ0FBY0ssUUFBMUMsRUFBb0QsS0FBS3FHLFVBQXpELENBQXBCO0FBQ0EsYUFBS0csVUFBTCxHQUFrQixJQUFJMUcsU0FBSixDQUFjLEtBQUtDLEtBQW5CLEVBQTBCLEtBQUtBLEtBQUwsQ0FBV0osRUFBWCxDQUFjSyxRQUF4QyxFQUFrRCxLQUFLcUcsVUFBdkQsQ0FBbEI7QUFDRCxPQWpERCxNQWlETztBQUNMLGFBQUtHLFVBQUwsR0FBa0IsSUFBSTFHLFNBQUosQ0FBYyxLQUFLQyxLQUFuQixFQUEwQixLQUFLQSxLQUFMLENBQVdKLEVBQVgsQ0FBY0ssUUFBeEMsQ0FBbEI7QUFDRDs7QUFFRCxVQUFJLEtBQUtrRSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IseUJBQWhCLENBQUosRUFDRSxLQUFLcEUsS0FBTCxDQUFXMEcsV0FBWCxDQUF1QixLQUFLMUcsS0FBTCxDQUFXMkcsTUFBWCxDQUFrQkMsZ0JBQXpDLEVBQTJELEtBQUtsQyxhQUFoRTtBQUNIOzs7Z0NBRVc7QUFBQSxzQkFDa0IsS0FBSzFFLEtBQUwsQ0FBV0osRUFEN0I7QUFBQSxVQUNGSyxRQURFLGFBQ0ZBLFFBREU7QUFBQSxVQUNRNEcsS0FEUixhQUNRQSxLQURSOztBQUdWOztBQUNBNUcsZUFBU2MsSUFBVCxHQUFnQixDQUFoQjtBQUNBZCxlQUFTcUMsTUFBVCxHQUFrQixDQUFsQjtBQUNBdUUsWUFBTWpFLE1BQU47O0FBRUEsV0FBS3NCLFVBQUwsQ0FBZ0I0QyxTQUFoQixDQUEwQixLQUFLOUcsS0FBL0I7O0FBRUEsVUFBSSxLQUFLdUUsWUFBVCxFQUF1QjtBQUNyQixhQUFLNkIsZUFBTCxDQUFxQlcsY0FBckIsQ0FBb0MsT0FBcEMsRUFBNkMsS0FBS3ZDLHNCQUFsRDtBQUNBLGFBQUs0QixlQUFMLENBQXFCWSxNQUFyQixDQUE0QixLQUFLWCxZQUFqQztBQUNBLGFBQUtELGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxhQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLGFBQUtFLFlBQUwsR0FBb0IsSUFBcEI7QUFDRDs7QUFFRCxXQUFLQyxVQUFMLEdBQWtCLElBQWxCOztBQUVBLFVBQUksS0FBS3RDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBSixFQUNFcEUsTUFBTStHLGNBQU4sQ0FBcUIvRyxNQUFNMkcsTUFBTixDQUFhQyxnQkFBbEMsRUFBb0QsS0FBS2xDLGFBQXpEO0FBQ0g7Ozs2QkFFUXVDLEssRUFBTztBQUNkLFVBQUksS0FBSzFDLFlBQVQsRUFBdUI7QUFDckIsYUFBSzZCLGVBQUwsQ0FBcUJjLHVCQUFyQixHQUErQyxJQUEvQztBQUNBLGFBQUtkLGVBQUwsQ0FBcUJwQixZQUFyQixHQUFvQ2lDLEtBQXBDOztBQUVBLGFBQUtaLFlBQUwsQ0FBa0JjLE1BQWxCO0FBQ0EsYUFBS2QsWUFBTCxDQUFrQnpELE1BQWxCO0FBQ0Q7QUFDRjs7OzZCQUVRd0UsTSxFQUFRQyxTLEVBQVc7QUFDMUIsV0FBS25ELFVBQUwsQ0FBZ0JvRCxRQUFoQixDQUF5QkQsU0FBekI7QUFDQTtBQUYwQix1QkFHRSxLQUFLckgsS0FBTCxDQUFXSixFQUhiO0FBQUEsVUFHbEJLLFFBSGtCLGNBR2xCQSxRQUhrQjtBQUFBLFVBR1I0RyxLQUhRLGNBR1JBLEtBSFE7OztBQUsxQjVHLGVBQVNjLElBQVQsR0FBZ0IsQ0FBaEI7QUFDQWQsZUFBU3FDLE1BQVQsR0FBa0IsQ0FBbEI7QUFDQXVFLFlBQU1qRSxNQUFOOztBQUVBLFVBQUksS0FBSzJCLFlBQVQsRUFBdUI7QUFDckIsWUFBTS9DLFdBQVcsS0FBS3hCLEtBQUwsQ0FBV3dCLFFBQTVCO0FBQ0EsWUFBTUgsa0JBQWtCLEtBQUtyQixLQUFMLENBQVdpRixLQUFYLEdBQW1CekQsUUFBM0M7O0FBRUEsYUFBSzRFLGVBQUwsQ0FBcUIvRSxlQUFyQixHQUF1Q0EsZUFBdkM7QUFDQSxhQUFLaUYsVUFBTCxDQUFnQnhGLFdBQWhCLENBQTRCVSxRQUE1QixHQUF1Q0EsUUFBdkM7O0FBRUEsYUFBSzZFLFlBQUwsQ0FBa0JjLE1BQWxCO0FBQ0EsYUFBS2QsWUFBTCxDQUFrQnpELE1BQWxCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7OzRCQUdRcEMsQyxFQUFHK0csUyxFQUFXO0FBQ3BCLFVBQU10SCxXQUFXLEtBQUtELEtBQUwsQ0FBV0osRUFBWCxDQUFjSyxRQUEvQjs7QUFFQSxjQUFRTyxFQUFFQyxJQUFWO0FBQ0UsYUFBSyxXQUFMO0FBQ0U7QUFDQTtBQUNBLGNBQUk4RyxVQUFVQyxPQUFWLENBQWtCLEtBQUt0RCxVQUFMLENBQWdCdUQsS0FBbEMsTUFBNkMsQ0FBQyxDQUFsRCxFQUFxRDtBQUNuRHhILHFCQUFTeUgsS0FBVCxHQUFpQixLQUFLakIsVUFBdEI7QUFDQSxtQkFBTyxLQUFQO0FBQ0Q7QUFDRDtBQUNGLGFBQUssU0FBTDtBQUNFLGNBQUl4RyxTQUFTeUgsS0FBVCxLQUFtQixLQUFLakIsVUFBNUIsRUFDRXhHLFNBQVN5SCxLQUFULEdBQWlCLElBQWpCO0FBQ0Y7QUFaSjs7QUFlQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OzJDQUd1QmxILEMsRUFBRztBQUN4QixVQUFNUCxXQUFXLEtBQUtELEtBQUwsQ0FBV0osRUFBWCxDQUFjSyxRQUEvQjs7QUFFQSxjQUFRTyxFQUFFQyxJQUFWO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsY0FBSSxLQUFLNkYsVUFBTCxDQUFnQnFCLFVBQWhCLENBQTJCbkgsRUFBRW9ILE1BQTdCLENBQUosRUFDRTNILFNBQVN5SCxLQUFULEdBQWlCLEtBQUtsQixZQUF0QjtBQUNGO0FBQ0YsYUFBSyxXQUFMO0FBQ0U7QUFDQSxjQUFJdkcsU0FBU3lILEtBQVQsS0FBbUIsS0FBS2xCLFlBQTVCLEVBQ0V2RyxTQUFTeUgsS0FBVCxDQUFlL0csV0FBZixDQUEyQkgsQ0FBM0I7QUFDRjtBQUNGLGFBQUssU0FBTDtBQUNFLGNBQUlQLFNBQVN5SCxLQUFULEtBQW1CLEtBQUtsQixZQUE1QixFQUNFdkcsU0FBU3lILEtBQVQsR0FBaUIsSUFBakI7QUFDRjtBQWJKO0FBZUQ7OztrQ0FFYUcsZSxFQUFpQjtBQUM3QixVQUFNQyxlQUFlLEtBQUs5SCxLQUFMLENBQVdKLEVBQVgsQ0FBY0ssUUFBbkM7QUFDQSxVQUFNOEgsWUFBWSxLQUFLL0gsS0FBTCxDQUFXSixFQUFYLENBQWNpSCxLQUFoQztBQUNBLFVBQU03RCxrQkFBa0I4RSxhQUFhaEgsV0FBckM7QUFDQSxVQUFNVSxXQUFXLEtBQUt4QixLQUFMLENBQVd3QixRQUE1Qjs7QUFFQTtBQUNBLFVBQUl3QixnQkFBZ0JqQyxJQUFoQixHQUF1QixDQUEzQixFQUE4QjtBQUM1QixZQUFJdUIsU0FBU1UsZ0JBQWdCVixNQUE3QjtBQUNBLFlBQU1JLGtCQUFrQk0sZ0JBQWdCTixlQUF4QztBQUNBLFlBQU1zRix1QkFBdUIsQ0FBRTFGLE1BQUYsR0FBWUksa0JBQWtCLENBQTNEO0FBQ0EsWUFBTXVGLHlCQUF5QnpHLFdBQVlrQixrQkFBa0IsQ0FBN0Q7O0FBRUEsWUFBSW1GLGtCQUFrQkcsb0JBQWxCLElBQTBDSCxrQkFBa0JJLHNCQUFoRSxFQUF3RjtBQUN0RixjQUFNaEYsS0FBSzRFLGtCQUFrQkcsb0JBQTdCO0FBQ0EsY0FBTXpGLEtBQUtTLGdCQUFnQnRCLFdBQWhCLENBQTRCYSxFQUE1QixDQUFYO0FBQ0FELG9CQUFVVyxFQUFWOztBQUVBRCwwQkFBZ0JWLE1BQWhCLEdBQXlCQSxNQUF6QjtBQUNBeUYsb0JBQVVuRixNQUFWOztBQUVBLGNBQUksS0FBSzJCLFlBQVQsRUFDRSxLQUFLK0IsVUFBTCxDQUFnQjFELE1BQWhCO0FBQ0g7QUFDRjtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7OztzQkFwTlU1QyxLLEVBQU87QUFDZiw2R0FBY0EsS0FBZDtBQUNBLFdBQUtrRSxVQUFMLENBQWdCbEUsS0FBaEIsR0FBd0IsS0FBS0EsS0FBN0I7QUFDRCxLO3dCQUVXO0FBQ1Y7QUFDRDs7O3NCQUVVa0ksTSxFQUFRO0FBQ2pCLDhHQUFlQSxNQUFmO0FBQ0EsV0FBS2hFLFVBQUwsQ0FBZ0JnRSxNQUFoQixHQUF5QixLQUFLQSxNQUE5QjtBQUNELEs7d0JBRVk7QUFDWDtBQUNEOzs7RUE3QmdCQyx3Qjs7a0JBb09KbkUsSSIsImZpbGUiOiJab29tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0IEdyaWRBeGlzIGZyb20gJy4vR3JpZEF4aXMnO1xuaW1wb3J0IFRpbWVBeGlzIGZyb20gJy4vVGltZUF4aXMnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5jb25zdCBzY2FsZXMgPSB1aS51dGlscy5zY2FsZXM7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgWm9vbVN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrLCB0aW1lbGluZSwgc2Nyb2xsQmFyID0gbnVsbCkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLnNjcm9sbEJhciA9IHNjcm9sbEJhcjtcblxuICAgIHRoaXMuX3BpeGVsVG9FeHBvbmVudCA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgYmxvY2suaGVpZ2h0XSlcbiAgICAgIC5yYW5nZShbMCwgMV0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmJsb2NrID0gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5pbml0aWFsWm9vbSA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQuem9vbTtcbiAgICB0aGlzLmluaXRpYWxZID0gZS55O1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIHByZXZlbnQgYW5ub3lpbmcgdGV4dCBzZWxlY3Rpb24gd2hlbiBkcmFnZ2luZ1xuICAgIGUub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gQG5vdGUgLSB3aGVyZSBkb2VzIHRoaXMgbWF4Wm9vbSB2YWx1ZSBjb21lcyBmcm9tID9cbiAgICBjb25zdCBtYXhab29tID0gNDQxMDAgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBtaW5ab29tID0gMTtcblxuICAgIGNvbnN0IHRyYWNrRHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuICAgIGNvbnN0IGV4cG9uZW50ID0gdGhpcy5fcGl4ZWxUb0V4cG9uZW50KGUueSAtIHRoaXMuaW5pdGlhbFkpO1xuICAgIGNvbnN0IHRhcmdldFpvb20gPSB0aGlzLmluaXRpYWxab29tICogTWF0aC5wb3coMiwgZXhwb25lbnQpO1xuXG4gICAgdGltZUNvbnRleHQuem9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRhcmdldFpvb20sIG1pblpvb20pLCBtYXhab29tKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBkZWx0YSA9IG5ld0NlbnRlclRpbWUgLSBsYXN0Q2VudGVyVGltZTtcblxuICAgIC8vIGNsYW1wIHpvb21lZCB3YXZlZm9ybSBpbiBzY3JlZW5cbiAgICBjb25zdCBuZXdPZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQgKyBkZWx0YSArIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KTtcbiAgICBjb25zdCBtYXhPZmZzZXQgPSAwO1xuICAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbiAtIHRyYWNrRHVyYXRpb247XG5cbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heChtaW5PZmZzZXQsIE1hdGgubWluKG1heE9mZnNldCwgbmV3T2Zmc2V0KSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbEJhcilcbiAgICAgIHRoaXMuc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHt9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgU2Nyb2xsU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IoYmxvY2ssIHRpbWVsaW5lLCBzY3JvbGxCYXIpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmJsb2NrID0gYmxvY2s7XG4gICAgdGhpcy5zY3JvbGxCYXIgPSBzY3JvbGxCYXI7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgY29uc3QgbWFpblRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCB0cmFja0R1cmF0aW9uID0gdGhpcy5ibG9jay5kdXJhdGlvbjtcbiAgICBjb25zdCBkdCA9IHRoaXMuc2Nyb2xsQmFyLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KTtcblxuICAgIC8vIG1hbmlwdWF0ZSBhbmQgY2xhbXAgb2Zmc2V0IG9mIHRoZSBtYWluIHRpbWVsaW5lXG4gICAgY29uc3QgbmV3T2Zmc2V0ID0gbWFpblRpbWVDb250ZXh0Lm9mZnNldCAtIGR0O1xuICAgIGNvbnN0IG1heE9mZnNldCA9IDA7XG4gICAgY29uc3QgbWluT2Zmc2V0ID0gbWFpblRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbiAtIHRyYWNrRHVyYXRpb247XG5cbiAgICBtYWluVGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgobWluT2Zmc2V0LCBNYXRoLm1pbihtYXhPZmZzZXQsIG5ld09mZnNldCkpO1xuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gICAgdGhpcy5zY3JvbGxCYXIudXBkYXRlKCk7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBheGlzVHlwZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ3RpbWUnLCAnZ3JpZCddLFxuICAgIGRlZmF1bHQ6ICd0aW1lJyxcbiAgfSxcbiAgc2Nyb2xsQmFyQ29udGFpbmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ0NTUyBTZWxlY3RvciBvciBET00gZWxlbWVudCB0aGF0IHNob3VsZCBjb250YWluIHRoZSBzY3JvbGwgYmFyJyxcbiAgICB9LFxuICB9LFxuICBzY3JvbGxCYXJIZWlnaHQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBzdGVwOiAxLFxuICAgIGRlZmF1bHQ6IDEwLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnaGVpZ2h0IG9mIHRoZSBzY3JvbGwtYmFyJ1xuICAgIH1cbiAgfSxcbiAgc2Nyb2xsQmFyQ29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnIzAwMDAwMCcsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgc2Nyb2xsLWJhcidcbiAgICB9XG4gIH0sXG4gIGNlbnRlcmVkQ3VycmVudFBvc2l0aW9uOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiBga2VlcCB3YXZlZm9ybSBjZW50ZXIgYXJvdW5kIHRoZSBibG9jaydzIGN1cnJlbnQgcG9zaXRpb25gLFxuICAgIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGFkZHMgem9vbSBmdW5jdGlvbm5hbGl0eSB0byB0aGUgYmxvY2suXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IG9wdGlvbnMuXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBbb3B0aW9ucy5zY3JvbGxCYXJDb250YWluZXI9bnVsbF0gLSBFbGVtZW50IHdoZXJlXG4gKiAgYW4gYWRkaXRpb25uYWwgc2Nyb2xsYmFyIHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5zY3JvbGxCYXJIZWlnaHQgLSBIZWlnaHQgb2YgdGhlIHNjcm9sbGJhci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5zY3JvbGxCYXJDb2xvcj0nIzAwMDAwMCddIC0gQ29sb3Igb2YgdGhlIHNjcm9sbGJhci5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2VudGVyZWRDdXJyZW50UG9zaXRpb249ZmFsc2VdIC0gU2Nyb2xsIHRvIGtlZXBcbiAqICB0aGUgYmxvY2sgY2VudGVyZWQgb24gY3VycmVudCBwb3NpdGlvbiB3aGlsZSBwbGF5aW5nLlxuICovXG5jbGFzcyBab29tIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmF4aXNNb2R1bGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2F4aXNUeXBlJykgPT09ICdncmlkJyA/XG4gICAgICBuZXcgR3JpZEF4aXMoKSA6IG5ldyBUaW1lQXhpcygpO1xuXG4gICAgdGhpcy5oYXNTY3JvbGxCYXIgPSBmYWxzZTtcblxuICAgIHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudCA9IHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VwZGF0ZU9mZnNldCA9IHRoaXMuX3VwZGF0ZU9mZnNldC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc2V0IGJsb2NrKGJsb2NrKSB7XG4gICAgc3VwZXIuYmxvY2sgPSBibG9jaztcbiAgICB0aGlzLmF4aXNNb2R1bGUuYmxvY2sgPSB0aGlzLmJsb2NrO1xuICB9XG5cbiAgZ2V0IGJsb2NrKCkge1xuICAgIHJldHVybiBzdXBlci5ibG9jaztcbiAgfVxuXG4gIHNldCB6SW5kZXgoekluZGV4KSB7XG4gICAgc3VwZXIuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuYXhpc01vZHVsZS56SW5kZXggPSB0aGlzLnpJbmRleDtcbiAgfVxuXG4gIGdldCB6SW5kZXgoKSB7XG4gICAgcmV0dXJuIHN1cGVyLnpJbmRleDtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgdGhpcy5heGlzTW9kdWxlLmluc3RhbGwoKTtcblxuICAgIGxldCAkY29udGFpbmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJDb250YWluZXInKTtcblxuICAgIGlmICgkY29udGFpbmVyICE9PSBudWxsKSB7XG4gICAgICBpZiAoISgkY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCkpXG4gICAgICAgICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuXG4gICAgICB0aGlzLmhhc1Njcm9sbEJhciA9IHRydWU7XG5cbiAgICAgIC8vIGNyZWF0ZSBhIG5ldyB0aW1lbGluZSB0byBob3N0IHRoZSBzY3JvbGwgYmFyXG4gICAgICBjb25zdCB2aXNpYmxlV2lkdGggPSB0aGlzLmJsb2NrLndpZHRoO1xuICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJIZWlnaHQnKTtcblxuICAgICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHZpc2libGVXaWR0aCArICdweCc7XG4gICAgICAkY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cbiAgICAgIC8vIGluaXQgd2l0aCBkdW1teSBwaXhlbCBwZXIgc2Vjb25kXG4gICAgICBjb25zdCBzY3JvbGxUaW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKDEsIHZpc2libGVXaWR0aCk7XG4gICAgICBjb25zdCBzY3JvbGxUcmFjayA9IG5ldyB1aS5jb3JlLlRyYWNrKCRjb250YWluZXIsIGhlaWdodCk7XG5cbiAgICAgIHNjcm9sbFRpbWVsaW5lLmFkZChzY3JvbGxUcmFjaywgJ3Njcm9sbCcpO1xuXG4gICAgICAvLyBkYXRhIG9mIHRoZSBzY3JvbGwgYmFyIGlzIHRoZSB0aW1lQ29udGV4dCBvZiB0aGUgbWFpbiB0aW1lbGluZVxuICAgICAgY29uc3QgbWFpblRpbWVDb250ZXh0ID0gdGhpcy5ibG9jay51aS50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICAgIGNvbnN0IHNjcm9sbEJhciA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBtYWluVGltZUNvbnRleHQsIHtcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IG5ldyB1aS5jb3JlLkxheWVyVGltZUNvbnRleHQoc2Nyb2xsVGltZWxpbmUudGltZUNvbnRleHQpXG4gICAgICBzY3JvbGxCYXIuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuXG4gICAgICBzY3JvbGxCYXIuY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLlNlZ21lbnQsIHtcbiAgICAgICAgeDogZCA9PiAtIGQub2Zmc2V0LFxuICAgICAgICB5OiBkID0+IDAsXG4gICAgICAgIHdpZHRoOiBkID0+IGQudmlzaWJsZUR1cmF0aW9uLFxuICAgICAgICBoZWlnaHQ6IGQgPT4gMSxcbiAgICAgICAgY29sb3I6IGQgPT4gdGhpcy5wYXJhbXMuZ2V0KCdzY3JvbGxCYXJDb2xvcicpLFxuICAgICAgfSwge1xuICAgICAgICBkaXNwbGF5SGFuZGxlcnM6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIHNjcm9sbFRyYWNrLmFkZChzY3JvbGxCYXIsICdzY3JvbGwnKTtcbiAgICAgIHNjcm9sbFRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpO1xuXG4gICAgICB0aGlzLl9zY3JvbGxUaW1lbGluZSA9IHNjcm9sbFRpbWVsaW5lO1xuICAgICAgdGhpcy5fc2Nyb2xsVHJhY2sgPSBzY3JvbGxUcmFjaztcbiAgICAgIHRoaXMuX3Njcm9sbEJhciA9IHNjcm9sbEJhcjtcbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLm9uKCdldmVudCcsIHRoaXMuX29uU2Nyb2xsQmFyTW91c2VFdmVudCk7XG5cbiAgICAgIHRoaXMuX3Njcm9sbFN0YXRlID0gbmV3IFNjcm9sbFN0YXRlKHRoaXMuYmxvY2ssIHRoaXMuYmxvY2sudWkudGltZWxpbmUsIHRoaXMuX3Njcm9sbEJhcik7XG4gICAgICB0aGlzLl96b29tU3RhdGUgPSBuZXcgWm9vbVN0YXRlKHRoaXMuYmxvY2ssIHRoaXMuYmxvY2sudWkudGltZWxpbmUsIHRoaXMuX3Njcm9sbEJhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3pvb21TdGF0ZSA9IG5ldyBab29tU3RhdGUodGhpcy5ibG9jaywgdGhpcy5ibG9jay51aS50aW1lbGluZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRDdXJyZW50UG9zaXRpb24nKSlcbiAgICAgIHRoaXMuYmxvY2suYWRkTGlzdGVuZXIodGhpcy5ibG9jay5FVkVOVFMuQ1VSUkVOVF9QT1NJVElPTiwgdGhpcy5fdXBkYXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICBjb25zdCB7IHRpbWVsaW5lLCB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIC8vIHJlc2V0IHpvb20gdmFsdWVcbiAgICB0aW1lbGluZS56b29tID0gMTtcbiAgICB0aW1lbGluZS5vZmZzZXQgPSAwO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5heGlzTW9kdWxlLnVuaW5zdGFsbCh0aGlzLmJsb2NrKTtcblxuICAgIGlmICh0aGlzLmhhc1Njcm9sbEJhcikge1xuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUucmVtb3ZlTGlzdGVuZXIoJ2V2ZW50JywgdGhpcy5fb25TY3JvbGxCYXJNb3VzZUV2ZW50KTtcbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnJlbW92ZSh0aGlzLl9zY3JvbGxUcmFjayk7XG4gICAgICB0aGlzLl9zY3JvbGxUaW1lbGluZSA9IG51bGw7XG4gICAgICB0aGlzLl9zY3JvbGxUcmFjayA9IG51bGw7XG4gICAgICB0aGlzLl9zY3JvbGxCYXIgPSBudWxsO1xuICAgICAgdGhpcy5fc2Nyb2xsU3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX3pvb21TdGF0ZSA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbicpKVxuICAgICAgYmxvY2sucmVtb3ZlTGlzdGVuZXIoYmxvY2suRVZFTlRTLkNVUlJFTlRfUE9TSVRJT04sIHRoaXMuX3VwZGF0ZU9mZnNldCk7XG4gIH1cblxuICBzZXRXaWR0aCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmhhc1Njcm9sbEJhcikge1xuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5fc2Nyb2xsVGltZWxpbmUudmlzaWJsZVdpZHRoID0gdmFsdWU7XG5cbiAgICAgIHRoaXMuX3Njcm9sbFRyYWNrLnJlbmRlcigpO1xuICAgICAgdGhpcy5fc2Nyb2xsVHJhY2sudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0VHJhY2soYnVmZmVyLCBtZXRhZGF0YXMpIHtcbiAgICB0aGlzLmF4aXNNb2R1bGUuc2V0VHJhY2sobWV0YWRhdGFzKTtcbiAgICAvLyByZXNldCB6b29tXG4gICAgY29uc3QgeyB0aW1lbGluZSwgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICB0aW1lbGluZS56b29tID0gMTtcbiAgICB0aW1lbGluZS5vZmZzZXQgPSAwO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgaWYgKHRoaXMuaGFzU2Nyb2xsQmFyKSB7XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuYmxvY2suZHVyYXRpb247XG4gICAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLmJsb2NrLndpZHRoIC8gZHVyYXRpb247XG5cbiAgICAgIHRoaXMuX3Njcm9sbFRpbWVsaW5lLnBpeGVsc1BlclNlY29uZCA9IHBpeGVsc1BlclNlY29uZDtcbiAgICAgIHRoaXMuX3Njcm9sbEJhci50aW1lQ29udGV4dC5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG4gICAgICB0aGlzLl9zY3JvbGxUcmFjay5yZW5kZXIoKTtcbiAgICAgIHRoaXMuX3Njcm9sbFRyYWNrLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudHMgYXJlIGZvcndhcmRlZCBieSB0aGUgQmFzZVBsYXllciwgb3JpZ2luYXRlIGZyb20gdGhlIG1haW4gdGltZWxpbmUuXG4gICAqL1xuICBvbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICAvLyBAdG9kbyAtIGNhbid0IHpvb20gaWZcbiAgICAgICAgLy8gYHBsYXlDb250cm9sLnJ1bm5pbmcgPT09IHRydWVgICYmIGBjZW50ZXJlZEN1cnJlbnRQb3NpdGlvbiA9PT0gdHJ1ZWBcbiAgICAgICAgaWYgKGhpdExheWVycy5pbmRleE9mKHRoaXMuYXhpc01vZHVsZS5sYXllcikgIT09IC0xKSB7XG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSB0aGlzLl96b29tU3RhdGU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fem9vbVN0YXRlKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzIGVtaXR0ZWQgYnkgdGhlIHNjcm9sbCB0aW1lbGluZS5cbiAgICovXG4gIF9vblNjcm9sbEJhck1vdXNlRXZlbnQoZSkge1xuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICBpZiAodGhpcy5fc2Nyb2xsQmFyLmhhc0VsZW1lbnQoZS50YXJnZXQpKVxuICAgICAgICAgIHRpbWVsaW5lLnN0YXRlID0gdGhpcy5fc2Nyb2xsU3RhdGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgLy8gZm9yd2FyZCBldmVudCBmcm9tIHNjcm9sbCB0aW1lbGluZSB0byBtYWluIHRpbWVsaW5lXG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmICh0aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fc2Nyb2xsU3RhdGUpXG4gICAgICAgICAgdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlT2Zmc2V0KGN1cnJlbnRQb3NpdGlvbikge1xuICAgIGNvbnN0IG1haW5UaW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG4gICAgY29uc3QgbWFpblRyYWNrID0gdGhpcy5ibG9jay51aS50cmFjaztcbiAgICBjb25zdCBtYWluVGltZUNvbnRleHQgPSBtYWluVGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmJsb2NrLmR1cmF0aW9uO1xuXG4gICAgLy8gem9vbSBjYW5ub3QgYmUgPCAxIChjZi4gWm9vbVN0YXRlKVxuICAgIGlmIChtYWluVGltZUNvbnRleHQuem9vbSA+IDEpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBtYWluVGltZUNvbnRleHQub2Zmc2V0O1xuICAgICAgY29uc3QgdmlzaWJsZUR1cmF0aW9uID0gbWFpblRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICAgIGNvbnN0IGNlbnRlclNjcmVlblBvc2l0aW9uID0gLSBvZmZzZXQgKyAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG4gICAgICBjb25zdCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uID0gZHVyYXRpb24gLSAodmlzaWJsZUR1cmF0aW9uIC8gMik7XG5cbiAgICAgIGlmIChjdXJyZW50UG9zaXRpb24gPiBjZW50ZXJTY3JlZW5Qb3NpdGlvbiAmJiBjdXJyZW50UG9zaXRpb24gPCBsYXN0SGFsZlNjcmVlblBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGR0ID0gY3VycmVudFBvc2l0aW9uIC0gY2VudGVyU2NyZWVuUG9zaXRpb247XG4gICAgICAgIGNvbnN0IGR4ID0gbWFpblRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKGR4KTtcbiAgICAgICAgb2Zmc2V0IC09IGR0O1xuXG4gICAgICAgIG1haW5UaW1lQ29udGV4dC5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG1haW5UcmFjay51cGRhdGUoKTtcblxuICAgICAgICBpZiAodGhpcy5oYXNTY3JvbGxCYXIpXG4gICAgICAgICAgdGhpcy5fc2Nyb2xsQmFyLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAdG9kbyAtIGluc3RhbGwgdGhlc2UgZGlyZWN0bHkgb24gdGhlIGJsb2NrID8gKi9cbiAgLy8gem9vbUluKCkge31cbiAgLy8gem9vbU91dCgpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFpvb207XG4iXX0=