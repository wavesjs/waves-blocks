import * as ui from 'waves-ui';
import AbstractModule from '../core/AbstractModule';

// display signal from LFO vector stream like
class Multiline extends ui.shapes.BaseShape {
  getClassName() { return 'multiline' }

  _getAccessorList() {
    return {};
  }

  _getDefaults() {
    return {
      colors: ['steelblue', 'orange', 'yellow', 'green', 'purple', 'grey'],
      frameSize: 1,
    };
  }

  render(renderingContext) {
    this.$el = document.createElementNS(this.ns, 'g');

    this.$paths = [];
    const frameSize = this.params.frameSize;

    for (let i = 0; i < frameSize; i++) {
      const $path = document.createElementNS(this.ns, 'path');
      $path.setAttributeNS(null, 'stroke', this.params.colors[i]);
      $path.setAttributeNS(null, 'fill', 'none');

      this.$paths[i] = $path;
      this.$el.appendChild($path)
    }

    return this.$el;
  }

  // recenter on zero
  update(renderingContext, data) {
    const timeOffset = data[0].time;
    const numFrames = data.length;
    const frameSize = this.params.frameSize;

    for (let i = 0; i < frameSize; i++) {
      let path = 'M';

      for (let j = 0; j < numFrames; j++) {
        const frame = data[j];
        const x = renderingContext.timeToPixel(frame.time - timeOffset);
        const y = renderingContext.valueToPixel(frame.data[i]);
        path += `${x},${y}`;

        if (j < numFrames - 1)
          path += 'L';
      }

      this.$paths[i].setAttributeNS(null, 'd', path);
    }
  }
}

const definitions = {};

class BpfModule extends AbstractModule {
  constructor(options) {
    super(definitions, options);

    this._lines = null;
  }

  setTrack(buffer, metadata) {
    const block = this.block;
    const { track, timeContext } = block.ui;
    const recording = metadata.data;

    if (this._lines)
      track.remove(this._lines);

    const lines = new ui.core.Layer('entity', recording.frames, {
      height: block.height,
      yDomain: [0, 600],
    });

    lines.setTimeContext(timeContext)
    lines.configureShape(Multiline, {
      frameSize: recording.streamParams.frameSize,
    }, {});

    track.add(lines);

    this._lines = lines;
  }
}

export default BpfModule;
