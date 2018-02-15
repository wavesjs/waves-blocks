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
  channels: {
    type: 'any',
    default: [0],
    constant: true,
    metas: {
      desc: 'array of the channels to display (defaults to [0] - left channel)'
    },
  },
};

/**
 * Module that display the waveform of the audio buffer.
 *
 * @param {Object} options - Override default parameters
 * @param {String} [options.color='steelblue'] - Color of the waveform
 * @param {Array|String} [options.channels=[0]] - Array describing the channels to displays,
 *  'all' to display all the channels. By default display only the left channel.
 */
class WaveformModule extends AbstractModule {
  constructor(options) {
    super(definitions, options);

    this._waveforms = new Set();
  }

  install() {}

  uninstall() {
    this._clear();
  }

  setTrack(buffer, metadatas) {
    this._clear();

    let channels = this.params.get('channels');
    const { track, timeContext } = this.block.ui;

    if (channels === 'all') {
      const numChannels = buffer.numberOfChannels;
      channels = [];

      for (let i = 0; i < numChannels; i++)
        channels.push(i);
    }

    channels.forEach((channel, index) => {
      let data = null;

      // prevent DOMException, such as:
      // Failed to execute 'getChannelData' on 'AudioBuffer': channel
      // index (1) exceeds number of channels (1)
      try {
        data = buffer.getChannelData(channel);
      } catch(err) {};

      if (data !== null) {
        const layerHeight = this.block.height / channels.length;

        const waveform = new ui.core.Layer('entity', data, {
          height: layerHeight,
          top: layerHeight * index,
          yDomain: [-1, 1],
          zIndex: this.zIndex,
        });

        waveform.setTimeContext(timeContext);
        waveform.configureShape(ui.shapes.Waveform, {}, {
          color: this.params.get('color'),
          sampleRate: buffer.sampleRate,
        });

        track.add(waveform);

        this._waveforms.add(waveform);
      }
    });
  }

  _clear() {
    const { track } = this.block.ui;
    this._waveforms.forEach(waveform => track.remove(waveform));
    this._waveforms.clear();
  }
}

export default WaveformModule;
