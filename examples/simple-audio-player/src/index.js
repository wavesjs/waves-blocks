import * as blocks from 'waves-blocks';
import * as loaders from 'waves-loaders';
import * as controllers from '@ircam/basic-controllers';
import metadata from './metadata.js';

async function init() {
  const loader = new loaders.AudioBufferLoader();
  const buffers = await loader.load(metadata.map(d => d.buffer));

  const block = new blocks.core.Block({
    player: blocks.player.SimplePlayer,
    container: '#container',
    sizing: 'manual',
    width: 1000,
    height: 100,
  });

  const waveform = new blocks.module.Waveform({ channels: 'all' });
  const cursor = new blocks.module.Cursor();
  const zoom = new blocks.module.Zoom({ scrollBarContainer: '#scroll-bar' });

  block.add(waveform, 0);
  block.add(cursor, 1);
  block.add(zoom, 2);

  let defaultTrackIndex = 0;
  let currentBuffer = buffers[defaultTrackIndex];

  // ------------------------------------------------------------
  // CONTROLS
  // ------------------------------------------------------------

  const $labelControl = new controllers.Text({
    container: '#controllers',
    label: 'label',
    default: metadata[defaultTrackIndex].title,
    readonly: true,
  });

  new controllers.SelectButtons({
    container: '#controllers',
    label: 'change track',
    options: metadata.map(d => d.title),
    default: metadata[defaultTrackIndex].title,
    callback: (title) => {
      const index = metadata.findIndex(d => d.title === title);
      block.setTrack(buffers[index], metadata[index]);

      $labelControl.value = metadata[index].title;
      currentBuffer = buffers[index];
    }
  });

  const $timeControl = new controllers.Text({
    container: '#controllers',
    label: 'current time',
    default: '',
  });

  const $transportControl = new controllers.SelectButtons({
    container: '#controllers',
    label: 'transport',
    options: ['start', 'pause', 'stop'],
    default: 'stop',
    callback: (state) => block[state](),
  });

  new controllers.Slider({
    container: '#controllers',
    label: 'volume',
    min: -80,
    max: 6,
    step: 1,
    default: 0,
    size: 'large',
    callback: db => block.volume(db),
  });

  new controllers.Slider({
    container: '#controllers',
    label: 'width',
    min: 200,
    max: 1000,
    step: 1,
    default: 1000,
    size: 'large',
    callback: val => block.width = val,
  });

  new controllers.Slider({
    container: '#controllers',
    label: 'height',
    min: 100,
    max: 400,
    step: 1,
    default: 100,
    size: 'large',
    callback: val => block.height = val,
  });

  // ------------------------------------------------------------
  // ADD LISTENERS AND INITIALIZE
  // ------------------------------------------------------------

  block.addListener(block.EVENTS.STOP, () => $transportControl.value = 'stop');
  block.addListener(block.EVENTS.CURRENT_POSITION, currentPosition => {
    $timeControl.value = `${currentPosition.toFixed(3)} / ${currentBuffer.duration.toFixed(3)}`
  });

  block.setTrack(buffers[defaultTrackIndex], metadata[defaultTrackIndex]);
}

window.addEventListener('load', init);
