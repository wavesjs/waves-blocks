import * as ui from 'waves-ui';
import AbstractModule from '../core/AbstractModule';

const definitions = {
  downbeatColor: {
    type: 'string',
    default: 'red',
    metas: {
      desc: 'Color of a downbeat (`measure === true`)',
    }
  },
  upbeatColor: {
    type: 'string',
    default: 'orange',
    metas: {
      desc: 'Color of an upbeat (`measure === false`)',
    }
  },
};

class BeatGrid extends AbstractModule {
  constructor(options) {
    super(definitions, options);
  }

  install() {
    const { track, timeContext } = this.block.ui;

    this._beats = new ui.core.Layer('collection', [], {
      height: this.block.height,
      zIndex: this.zIndex,
    });

    const downbeatColor = this.params.get('downbeatColor');
    const upbeatColor = this.params.get('upbeatColor');

    this._beats.setTimeContext(timeContext);
    this._beats.configureShape(ui.shapes.Marker, {
      x: (d, v = null) => {
        if (v !== null)
          d.time = v;

        return d.time;
      },
      color: (d, v = null) => {
        return d.measure === true ? downbeatColor : upbeatColor;
      },
    }, {
      displayHandlers: false,
      displayLabels: false,
    });

    track.add(this._beats);
  }

  uninstall() {
    const { track } = this.block.ui;
    track.remove(this._beats);
  }

  setTrack(data, metadata) {
    if (!metadata.beats)
      throw new Error('Invalid metadata for module BeatGrid, should contain a `beats` property');

    this._beats.data = metadata.beats;
  }

  /**
   * shift the beats with certain dt
   */
  shift(dt) {
    const { beats } = this.block.metadata;

    for (let i = 0; i < beats.length; i++)
      beats[i].time += dt;

    this._beats.update();
    this.block.snap();
  }
}

export default BeatGrid;
