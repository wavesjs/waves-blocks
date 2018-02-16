import * as blocks from 'waves-blocks';
import * as loaders from 'waves-loaders';
import * as controllers from '@ircam/basic-controllers';
import data from './data.js';

async function init() {
  const loader = new loaders.AudioBufferLoader();
  const buffers = await loader.load(data.map(d => d.buffer));

  const block = new blocks.core.Block({
    player: blocks.player.SimplePlayer,
    container: '#container',
    sizing: 'manual',
    width: 1000,
    height: 100,
  });

  const waveform = new blocks.module.WaveformModule({ channels: 'all' });
  const simpleWaveform = new blocks.module.SimpleWaveformModule();
  const cursor = new blocks.module.CursorModule();
  const marker = new blocks.module.MarkerModule();
  const segment = new blocks.module.SegmentModule();
  const zoom = new blocks.module.ZoomModule({ scrollBarContainer: '#scroll-bar' });

  const modules = {
    waveform,
    simpleWaveform,
    cursor,
    marker,
    segment,
    zoom,
  };

  let currentIndex = 0;
  let currentBuffer = buffers[currentIndex];

  // ------------------------------------------------------------
  // CONTROLS
  // ------------------------------------------------------------

  const $labelControl = new controllers.Text({
    container: '#controllers',
    label: 'label',
    default: data[currentIndex].title,
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
    options: data.map(d => d.title),
    default: data[currentIndex].title,
    callback: (title) => {
      const index = data.findIndex(d => d.title === title);
      block.setTrack(buffers[index], data[index]);

      $labelControl.value = data[index].title;
      currentBuffer = buffers[index];
      currentIndex = index;
    }
  });


  for (let name in modules) {
    const module = modules[name];

    new controllers.Toggle({
      container: '#controllers',
      label: name,
      default: false,
      callback: value => {
        const method = value ? 'add' : 'remove';
        block[method](module);
      }
    });
  }

  new controllers.TriggerButtons({
    container: '#controllers',
    label: 'log data',
    options: ['now'],
    callback: () => {
      const $log = document.querySelector('#log-data');
      $log.innerHTML = JSON.stringify(data[currentIndex], null, 2);
    },
  });

  // ------------------------------------------------------------
  // ADD LISTENERS AND INITIALIZE
  // ------------------------------------------------------------

  block.addListener(block.EVENTS.STOP, () => $transportControl.value = 'stop');
  block.setTrack(buffers[currentIndex], data[currentIndex]);
}


window.addEventListener('load', init);
