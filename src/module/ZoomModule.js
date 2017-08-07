import AbstractModule from '../core/AbstractModule';
import GridAxisModule from './GridAxisModule';
import TimeAxisModule from './TimeAxisModule';
import * as ui from 'waves-ui';

const scales = ui.utils.scales;

class ZoomState extends ui.states.BaseState {
  constructor(block, timeline, scrollBar) {
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

    // define max/min zoom
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
    this.scrollBar.update();
  }

  onMouseUp(e) {}
}


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



const parameters = {
  scrollBarContainer: {
    type: 'any',
    default: '',
    metas: {
      desc: 'CSS Selector or DOM element that should contain the scroll bar',
    },
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
      desc: `keep waveform center around the block's current position`,
    },
  },
  // @todo - allow switching between time and grid axis
  // axis: {}
}

/**
 *
 */
class ZoomModule extends AbstractModule {
  constructor(options) {
    super(parameters, options);

    this.gridAxisModule = new GridAxisModule();

    this._onScrollMouseEvent = this._onScrollMouseEvent.bind(this);
    this._updateOffset = this._updateOffset.bind(this);
  }

  install(block) {
    this._block = block;

    // @todo
    this.gridAxisModule.install(block);

    let $container = this.params.get('scrollBarContainer');

    if (!($container instanceof Element))
      $container = document.querySelector($container);

    // create a new timeline to host the scroll bar
    const visibleWidth = this._block.width;
    const height = this.params.get('scrollBarHeight');

    $container.style.width = this._block.width + 'px';
    $container.style.height = height + 'px';

    // init with dummy pixel per second
    const scrollTimeline = new ui.core.Timeline(1, visibleWidth);
    const scrollTrack = new ui.core.Track($container, height);

    scrollTimeline.add(scrollTrack, 'scroll');

    // data of the scroll bar is the timeContext of the main timeline
    const mainTimeContext = this._block.ui.timeline.timeContext;
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
    }, {
      displayHandlers: false,
    });

    scrollTrack.add(scrollBar, 'scroll');
    scrollTrack.updateContainer();

    this._scrollTimeline = scrollTimeline;
    this._scrollTrack = scrollTrack;
    this._scrollBar = scrollBar;

    this._scrollTimeline.on('event', this._onScrollMouseEvent);

    // init states
    this._zoomState = new ZoomState(this._block, this._block.ui.timeline, this._scrollBar);
    this._scrollState = new ScrollState(this._block, this._block.ui.timeline, this._scrollBar);

    if (this.params.get('centeredCurrentPosition'))
      block.addListener(block.EVENTS.CURRENT_POSITION, this._updateOffset);
  }

  uninstall(block) {
    const { timeline, track } = block.ui;

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

    if (this.params.get('centeredCurrentPosition'))
      block.removeListener(block.EVENTS.CURRENT_POSITION, this._updateOffset);
  }

  setWidth(value) {
    this._scrollTimeline.maintainVisibleDuration = true;
    this._scrollTimeline.visibleWidth = value;

    this._scrollTrack.render();
    this._scrollTrack.update();
  }

  setTrack(trackConfig) {
    this.gridAxisModule.setTrack(trackConfig);
    // reset zoom
    const { timeline, track } = this._block.ui;

    timeline.zoom = 1;
    timeline.offset = 0;
    track.update();

    // reset scroll
    const duration = this._block.duration;
    const pixelsPerSecond = this._block.width / duration;

    this._scrollTimeline.pixelsPerSecond = pixelsPerSecond;
    this._scrollBar.timeContext.duration = duration;

    this._scrollTrack.render();
    this._scrollTrack.update();
  }

  /**
   * Events are forwarded by the BasePlayer, originate from the main timeline.
   */
  onEvent(e, hitLayers) {
    const timeline = this._block.ui.timeline;

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
        if (timeline.state === this._zoomState)
          timeline.state = null;
        break;
    }

    return true;
  }

  /**
   * Events emitted by the scroll timeline.
   */
  _onScrollMouseEvent(e) {
    const timeline = this._block.ui.timeline;

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
    const mainTimeline = this._block.ui.timeline;
    const mainTrack = this._block.ui.track;
    const mainTimeContext = mainTimeline.timeContext;
    const duration = this._block.duration;

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
        // update scroll bar
        this._scrollBar.update();
      }
    }
  }

  /** @todo - install these directly on the block ? */
  // zoomIn() {}
  // zoomOut() {}
}

export default ZoomModule;
