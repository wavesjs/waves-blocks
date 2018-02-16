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
    height: 150,
  });

  const waveform = new blocks.module.WaveformModule({ channels: 'all' });
  const segment = new blocks.module.SegmentModule();
  const marker = new blocks.module.MarkerModule();

  block.add(waveform, 0);

  let currentIndex = 0;

  // ------------------------------------------------------------
  // CONTROLS
  // ------------------------------------------------------------

  new controllers.SelectButtons({
    container: '#controllers',
    label: 'change track',
    options: data.map(d => d.title),
    default: data[currentIndex].title,
    callback: (title) => {
      // save current state of the edition
      data[currentIndex] = block.head();
      // update block with new track
      currentIndex = data.findIndex(d => d.title === title);
      block.setTrack(buffers[currentIndex], data[currentIndex]);
    }
  });

  new controllers.SelectButtons({
    container: '#controllers',
    label: 'segments / markers',
    options: ['segments', 'markers'],
    default: 'segments',
    callback: value => {
      if (value === 'segments') {
        block.remove(marker, 1);
        block.add(segment, 1);
      } else if (value === 'markers') {
        block.remove(segment, 1);
        block.add(marker, 1);
      }
    }
  });

  new controllers.TriggerButtons({
    container: '#controllers',
    label: 'undo / redo',
    options: ['undo', 'redo'],
    callback: value => {
      if (value === 'undo')
        block.undo();
      else if (value === 'redo')
        block.redo();
    },
  });

  // ------------------------------------------------------------
  // INITIALIZE
  // ------------------------------------------------------------

  block.add(segment, 1);

  block.addListener(block.EVENTS.UPDATE, (data, metadata) => {
    console.log(data, metadata);
    const $code = document.querySelector('#log-data');
    $code.textContent = JSON.stringify(metadata, null, 2);
  });

  block.setTrack(buffers[currentIndex], data[currentIndex]);
}

window.addEventListener('load', init);
