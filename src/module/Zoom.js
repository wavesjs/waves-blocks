import AbstractModule from '../core/AbstractModule';
import GridAxis from './GridAxis';
import TimeAxis from './TimeAxis';
import * as ui from 'waves-ui';

const scales = ui.utils.scales;

/** @private */
class ZoomState extends ui.states.BaseState {
  constructor(block, timeline, scrollBar = null) {
    super(timeline);

    this.block = block;
    this.scrollBar = scrollBar;

    this._pixelToExponent = scales.linear()
      .domain([0, block.height])
      .range([0, 1]);
  }

  destroy() {
    this.block = null;
  }

  handleEvent(e) {
    switch(e.type) {
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

  onMouseDown(e) {
    this.initialZoom = this.timeline.timeContext.zoom;
    this.initialY = e.y;
  }

  onMouseMove(e) {
    // prevent annoying text selection when dragging
    e.originalEvent.preventDefault();

    // @note - where does this maxZoom value comes from ?
    const maxZoom = 44100 / this.timeline.timeContext.pixelsPerSecond;
    const minZoom = 1;

    const trackDuration = this.block.duration;
    const timeContext = this.timeline.timeContext;
    const lastCenterTime = timeContext.timeToPixel.invert(e.x);
    const exponent = this._pixelToExponent(e.y - this.initialY);
    const targetZoom = this.initialZoom * Math.pow(2, exponent);

    timeContext.zoom = Math.min(Math.max(targetZoom, minZoom), maxZoom);

    const newCenterTime = timeContext.timeToPixel.invert(e.x);
    const delta = newCenterTime - lastCenterTime;

    // clamp zoomed waveform in screen
    const newOffset = timeContext.offset + delta + timeContext.timeToPixel.invert(e.dx);
    const maxOffset = 0;
    const minOffset = timeContext.visibleDuration - trackDuration;

    timeContext.offset = Math.max(minOffset, Math.min(maxOffset, newOffset));

    this.timeline.tracks.update();

    if (this.scrollBar)
      this.scrollBar.update();
  }

  onMouseUp(e) {}
}

/** @private */
class ScrollState extends ui.states.BaseState {
  constructor(block, timeline, scrollBar) {
    super(timeline);

    this.block = block;
    this.scrollBar = scrollBar;
  }

  onMouseMove(e) {
    const mainTimeContext = this.timeline.timeContext;
    const trackDuration = this.block.duration;
    const dt = this.scrollBar.timeContext.timeToPixel.invert(e.dx);

    // manipuate and clamp offset of the main timeline
    const newOffset = mainTimeContext.offset - dt;
    const maxOffset = 0;
    const minOffset = mainTimeContext.visibleDuration - trackDuration;

    mainTimeContext.offset = Math.max(minOffset, Math.min(maxOffset, newOffset));

    this.timeline.tracks.update();
    this.scrollBar.update();
  }
}

/** @private */
const parameters = {
  axisType: {
    type: 'enum',
    list: ['time', 'grid'],
    default: 'time',
  },
  scrollBarContainer: {
    type: 'any',
    default: null,
    required: true,
    metas: {
      desc: 'CSS Selector or DOM element that should contain the scroll bar',
    },
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
      desc: `keep waveform center around the block's current position`,
    },
  },
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
class Zoom extends AbstractModule {
  constructor(options) {
    super(parameters, options);

    this.axisModule = this.params.get('axisType') === 'grid' ?
      new GridAxis() : new TimeAxis();

    this.hasScrollBar = false;

    this._onScrollBarMouseEvent = this._onScrollBarMouseEvent.bind(this);
    this._updateOffset = this._updateOffset.bind(this);
  }

  set block(block) {
    super.block = block;
    this.axisModule.block = this.block;
  }

  get block() {
    return super.block;
  }

  set zIndex(zIndex) {
    super.zIndex = zIndex;
    this.axisModule.zIndex = this.zIndex;
  }

  get zIndex() {
    return super.zIndex;
  }

  install() {
    this.axisModule.install();

    let $container = this.params.get('scrollBarContainer');

    if ($container !== null) {
      if (!($container instanceof Element))
        $container = document.querySelector($container);

      this.hasScrollBar = true;

      // create a new timeline to host the scroll bar
      const visibleWidth = this.block.width;
      const height = this.params.get('scrollBarHeight');

      $container.style.width = visibleWidth + 'px';
      $container.style.height = height + 'px';

      // init with dummy pixel per second
      const scrollTimeline = new ui.core.Timeline(1, visibleWidth);
      const scrollTrack = new ui.core.Track($container, height);

      scrollTimeline.add(scrollTrack, 'scroll');

      // data of the scroll bar is the timeContext of the main timeline
      const mainTimeContext = this.block.ui.timeline.timeContext;
      const scrollBar = new ui.core.Layer('entity', mainTimeContext, {
        height: height,
        yDomain: [0, 1],
      });

      const timeContext = new ui.core.LayerTimeContext(scrollTimeline.timeContext)
      scrollBar.setTimeContext(timeContext);

      scrollBar.configureShape(ui.shapes.Segment, {
        x: d => - d.offset,
        y: d => 0,
        width: d => d.visibleDuration,
        height: d => 1,
        color: d => this.params.get('scrollBarColor'),
      }, {
        displayHandlers: false,
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

    if (this.params.get('centeredCurrentPosition'))
      this.block.addListener(this.block.EVENTS.CURRENT_POSITION, this._updateOffset);
  }

  uninstall() {
    const { timeline, track } = this.block.ui;

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

    if (this.params.get('centeredCurrentPosition'))
      block.removeListener(block.EVENTS.CURRENT_POSITION, this._updateOffset);
  }

  setWidth(value) {
    if (this.hasScrollBar) {
      this._scrollTimeline.maintainVisibleDuration = true;
      this._scrollTimeline.visibleWidth = value;

      this._scrollTrack.render();
      this._scrollTrack.update();
    }
  }

  setTrack(buffer, metadatas) {
    this.axisModule.setTrack(metadatas);
    // reset zoom
    const { timeline, track } = this.block.ui;

    timeline.zoom = 1;
    timeline.offset = 0;
    track.update();

    if (this.hasScrollBar) {
      const duration = this.block.duration;
      const pixelsPerSecond = this.block.width / duration;

      this._scrollTimeline.pixelsPerSecond = pixelsPerSecond;
      this._scrollBar.timeContext.duration = duration;

      this._scrollTrack.render();
      this._scrollTrack.update();
    }
  }

  /**
   * Events are forwarded by the BasePlayer, originate from the main timeline.
   */
  onEvent(e, hitLayers) {
    const timeline = this.block.ui.timeline;

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
        if (timeline.state === this._zoomState)
          timeline.state = null;
        break;
    }

    return true;
  }

  /**
   * Events emitted by the scroll timeline.
   */
  _onScrollBarMouseEvent(e) {
    const timeline = this.block.ui.timeline;

    switch (e.type) {
      case 'mousedown':
        if (this._scrollBar.hasElement(e.target))
          timeline.state = this._scrollState;
        break;
      case 'mousemove':
        // forward event from scroll timeline to main timeline
        if (timeline.state === this._scrollState)
          timeline.state.onMouseMove(e);
        break;
      case 'mouseup':
        if (timeline.state === this._scrollState)
          timeline.state = null;
        break;
    }
  }

  _updateOffset(currentPosition) {
    const mainTimeline = this.block.ui.timeline;
    const mainTrack = this.block.ui.track;
    const mainTimeContext = mainTimeline.timeContext;
    const duration = this.block.duration;

    // zoom cannot be < 1 (cf. ZoomState)
    if (mainTimeContext.zoom > 1) {
      let offset = mainTimeContext.offset;
      const visibleDuration = mainTimeContext.visibleDuration;
      const centerScreenPosition = - offset + (visibleDuration / 2);
      const lastHalfScreenPosition = duration - (visibleDuration / 2);

      if (currentPosition > centerScreenPosition && currentPosition < lastHalfScreenPosition) {
        const dt = currentPosition - centerScreenPosition;
        const dx = mainTimeContext.timeToPixel(dx);
        offset -= dt;

        mainTimeContext.offset = offset;
        mainTrack.update();

        if (this.hasScrollBar)
          this._scrollBar.update();
      }
    }
  }

  /** @todo - install these directly on the block ? */
  // zoomIn() {}
  // zoomOut() {}
}

export default Zoom;
