import * as blocks from 'waves-blocks';
import * as loaders from 'waves-loaders';
import * as controllers from '@ircam/basic-controllers';
import metadata from './metadata.js';
import beats from './metadata-beats.js';

async function init() {
  const loader = new loaders.AudioBufferLoader();
  const buffers = await loader.load(metadata.map(d => d.buffer));

  for (let i = 0; i < metadata.length; i++)
    metadata[i].beats = beats.filter(b => b.time < buffers[i].duration);

  const block = new blocks.core.Block({
    player: blocks.player.SimplePlayer,
    container: '#container',
    sizing: 'manual',
    width: 1000,
    height: 100,
  });

  const waveform = new blocks.module.Waveform({ channels: 'all' });
  const simpleWaveform = new blocks.module.SimpleWaveform();
  const cursor = new blocks.module.Cursor();
  const marker = new blocks.module.Marker();
  const segment = new blocks.module.Segment();
  const beatGrid = new blocks.module.BeatGrid();
  const simpleZoom = new blocks.module.Zoom();
  const scrollBarZoom = new blocks.module.Zoom({ scrollBarContainer: '#scroll-bar' });

  const modules = {
    waveform,
    simpleWaveform,
    cursor,
    marker,
    segment,
    beatGrid,
    simpleZoom,
    scrollBarZoom,
  };


  block.add(waveform, 0);
  block.add(simpleZoom, 1);

  let currentIndex = 0;
  let currentBuffer = buffers[currentIndex];

  // ------------------------------------------------------------
  // CONTROLS
  // ------------------------------------------------------------

  const $labelControl = new controllers.Text({
    container: '#controllers',
    label: 'label',
    default: metadata[currentIndex].title,
    readonly: true,
  });

  const $transportControl = new controllers.SelectButtons({
    container: '#controllers',
    label: 'transport',
    options: ['start', 'pause', 'stop'],
    default: 'stop',
    callback: (state) => block[state](),
  });

  new controllers.SelectButtons({
    container: '#controllers',
    label: 'change track',
    options: metadata.map(d => d.title),
    default: metadata[currentIndex].title,
    callback: (title) => {
      const index = metadata.findIndex(d => d.title === title);
      block.setTrack(buffers[index], metadata[index]);

      $labelControl.value = metadata[index].title;
      currentBuffer = buffers[index];
      currentIndex = index;
    }
  });

  const names = Object.keys(modules);

  for (let name in modules) {
    const module = modules[name];

    new controllers.Toggle({
      container: '#controllers',
      label: name,
      default: false,
      callback: value => {
        const method = value ? 'add' : 'remove';
        const zIndex = names.indexOf(name);
        block[method](module, zIndex);
      }
    });
  }

  new controllers.TriggerButtons({
    container: '#controllers',
    label: 'log metadata',
    options: ['now'],
    callback: () => {
      const $log = document.querySelector('#log-metadata');
      $log.innerHTML = JSON.stringify(metadata[currentIndex], null, 2);
    },
  });

  new controllers.TriggerButtons({
    container: '#controllers',
    label: 'beatGrid shift',
    options: [-0.01, 0.01],
    callback: value => beatGrid.shift(value),
  });

  // ------------------------------------------------------------
  // ADD LISTENERS AND INITIALIZE
  // ------------------------------------------------------------

  block.addListener(block.EVENTS.STOP, () => $transportControl.value = 'stop');
  block.setTrack(buffers[currentIndex], metadata[currentIndex]);
}


window.addEventListener('load', init);
