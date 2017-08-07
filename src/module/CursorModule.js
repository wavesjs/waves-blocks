import * as ui from 'waves-ui';
import AbstractModule from '../core/AbstractModule';

const definitions = {
  color: {
    type: 'string',
    default: 'red',
    constant: true,
    metas: {
      desc: 'color of the cursor'
    },
  },
  seek: {
    type: 'boolean',
    default: true,
    metas: {
      desc: 'seek interaction of the module',
    },
  },
};

/**
 * Seek state, only apply if no state previous decorator took precedence
 */
class SeekState extends ui.states.BaseState {
  constructor(block, timeline) {
    super(timeline);

    this.block = block;
  }

  handleEvent(e) {
    if (e.type === 'mousedown' || e.type === 'mousemove') {
      const { timeToPixel, offset } = this.timeline.timeContext;
      const time = timeToPixel.invert(e.x) - offset;
      this.block.seek(time);
    }
  }
}


class CursorModule extends AbstractModule {
  constructor(options) {
    super(definitions, options);

    this._data = { currentPosition: 0 };
    this._cursor = null;
    this._cursorSeekState = null;

    this._updateCursorPosition = this._updateCursorPosition.bind(this);
  }

  install(block) {
    const { timeline, track, timeContext } = block.ui;

    this._cursor = new ui.core.Layer('entity', this._data, {
      height: block.height,
    });

    this._cursor.setTimeContext(timeContext);
    this._cursor.configureShape(ui.shapes.Cursor, {
      x: d => d.currentPosition,
    }, {
      color: this.params.get('color'),
    });

    track.add(this._cursor);

    this._cursor.render();
    this._cursorSeekState = new SeekState(block, timeline);

    block.addListener(block.EVENTS.CURRENT_POSITION, this._updateCursorPosition);

    this._updateCursorPosition(block.position);

    this._block = block;
  }

  uninstall(block) {
    block.removeListener(block.EVENTS.CURRENT_POSITION, this._updateCursorPosition);
    block.ui.track.remove(this._cursor);
  }

  onEvent(e) {
    if (this.params.get('seek') === false)
      return true;

    const timeline = this._block.ui.timeline;

    switch (e.type) {
      case 'mousedown':
        timeline.state = this._cursorSeekState;
        return false;
        break;
      case 'mouseup':
        if (timeline.state === this._cursorSeekState)
          timeline.state = null;
        break;
    }

    return true;
  }

  _updateCursorPosition(position) {
    this._data.currentPosition = position;
    this._cursor.update();
  }
}

export default CursorModule;
