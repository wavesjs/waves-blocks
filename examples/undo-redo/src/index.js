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
    options: metadata.map(d => d.title),
    default: metadata[currentIndex].title,
    callback: (title) => {
      // save current state of the edition
      metadata[currentIndex] = block.head();
      // update block with new track
      currentIndex = metadata.findIndex(d => d.title === title);
      block.setTrack(buffers[currentIndex], metadata[currentIndex]);
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

  // display metametadata state at each new snapshot
  const $logData = document.querySelector('#log-metadata');

  block.addListener(block.EVENTS.UPDATE, (data, metadata) => {
    $logData.textContent = JSON.stringify(metadata, null, 2);
  });

  // init first track in the list
  block.setTrack(buffers[currentIndex], metadata[currentIndex]);
}

window.addEventListener('load', init);
