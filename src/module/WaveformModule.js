import * as ui from 'waves-ui';
import AbstractModule from '../core/AbstractModule';

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
 * Module that display the waveform of the audio buffer.
 *
 * @param {Object} options - Override default parameters
 * @param {String} [options.color='steelblue'] - Color of the waveform
 */
class WaveformModule extends AbstractModule {
  constructor(options) {
    super(definitions, options);

    this._waveform = null;
  }

  install(block) {
    const { track, timeContext } = block.ui;

    this._waveform = new ui.core.Layer('entity', [], {
      height: block.height,
      yDomain: [-1, 1],
    });

    this._waveform.setTimeContext(timeContext);
    this._waveform.configureShape(ui.shapes.Waveform, {}, {
      color: this.params.get('color'),
    });

    track.add(this._waveform);
  }

  uninstall(block) {
    const { track } = block.ui;
    track.remove(this._waveform);
  }

  setTrack(trackConfig, trackBuffer) {
    this._waveform.data = trackBuffer.getChannelData(0);
    this._waveform.render(); // update bindings between data and shapes

    // hack to set the smaple rate properly
    const $item = this._waveform.$el.querySelector('.waveform');
    const shape = this._waveform.getShapeFromItem($item);
    shape.params.sampleRate = trackBuffer.sampleRate;

    this._waveform.update();
  }
}

export default WaveformModule;
