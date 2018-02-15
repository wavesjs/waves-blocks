import * as ui from 'waves-ui';
import AbstractModule from '../core/AbstractModule';


class SimpleWaveform extends ui.shapes.BaseShape {
  getClassName() { return 'simple-waveform' }

  _getAccessorList() { return {} }

  _getDefaults() {
    return {
      sampleRate: 44100,
      color: '#000000',
      opacity: 1,
    }
  }

  render(renderingContext) {
    if (this.$el)
      return this.$el;

    this.$el = document.createElementNS(this.ns, 'path');
    this.$el.setAttributeNS(null, 'fill', 'none');
    this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    this.$el.setAttributeNS(null, 'stroke', this.params.color);
    this.$el.setAttributeNS(null, 'fill', this.params.color);
    this.$el.style.opacity = this.params.opacity;

    return this.$el;
  }

  update(renderingContext, datum) {
    // define nbr of samples per pixels
    const sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
    const nbrSamples = datum.length;
    const duration = nbrSamples / this.params.sampleRate;
    const width = renderingContext.timeToPixel(duration);
    const samplesPerPixel = nbrSamples / width;

    if (!samplesPerPixel || datum.length < samplesPerPixel)
      return;

    const { minX, maxX } = renderingContext;
    const pixelToTime = renderingContext.timeToPixel.invert;
    const sampleRate = this.params.sampleRate;
    const blockSize = 5; // this.params.barWidth;
    const minMax = [];

    // get min/max per bar, clamped to the visible area
    for (let px = minX; px < maxX; px += blockSize) {
      const startTime = pixelToTime(px);
      const startSample = startTime * sampleRate;
      const extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);

      let min = Infinity;
      let max = -Infinity;

      for (let j = 0, l = extract.length; j < l; j++) {
        let sample = extract[j];
        if (sample < min) min = sample;
        if (sample > max) max = sample;
      }
      // disallow Infinity
      min = !isFinite(min) ? 0 : min;
      max = !isFinite(max) ? 0 : max;

      minMax.push([px, min, max]);
    }

    if (minMax.length) {
      const PIXEL = 0;
      const MIN   = 1;
      const MAX   = 2;

      let d = 'M';

      for (let i = 0, l = minMax.length; i < l; i++) {
        const datum = minMax[i];
        const x  = datum[PIXEL];
        let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));

        d += `${x},${y1}L${x},${y2}L${x + blockSize - 2},${y2}L${x + blockSize - 2},${y1}L${x},${y1}`;

        if (i < l - 1)
          d += 'M';
      }

      this.$el.setAttributeNS(null, 'd', d);
    }
  }
}

const definitions = {
  color: {
    type: 'string',
    default: 'steelblue',
    constant: true,
    metas: {
      desc: 'color of the waveform'
    },
  },
};

/**
 * Module that display the waveform of the audio buffer. In case non-mono
 * audio files, only the left channel is rendered. For more accurate
 * representation see WaveformModule.
 *
 * @param {Object} options - Override default parameters
 * @param {String} [options.color='steelblue'] - Color of the waveform
 */
class SimpleWaveformModule extends AbstractModule {
  constructor(options) {
    super(definitions, options);

    this._waveform = null;
  }

  install() {
    const { track, timeContext } = this.block.ui;

    this._waveform = new ui.core.Layer('entity', [], {
      height: this.block.height,
      yDomain: [-1, 1],
      zIndex: this.zIndex,
    });

    this._waveform.setTimeContext(timeContext);
    this._waveform.configureShape(SimpleWaveform, {}, {
      color: this.params.get('color'),
    });

    track.add(this._waveform);
  }

  uninstall() {
    this.block.ui.track.remove(this._waveform);
  }

  setTrack(buffer, metadata) {
    this._waveform.data = buffer.getChannelData(0);
    this._waveform.render(); // update bindings between data and shapes

    // hack to set the smaple rate properly
    const $item = this._waveform.$el.querySelector('.simple-waveform');
    const shape = this._waveform.getShapeFromItem($item);
    shape.params.sampleRate = buffer.sampleRate;
  }
}

export default SimpleWaveformModule;
