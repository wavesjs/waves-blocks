import * as audio from 'waves-audio';
import * as blocks from 'waves-blocks';
import * as loaders from 'waves-loaders';
import * as controllers from '@ircam/basic-controllers';

const audioContext = audio.audioContext;
const loader = new loaders.AudioBufferLoader();

async function init() {
  const buffer = await loader.load('./assets/audio/human-voice.wav');


  const block = new blocks.core.Block({
    player: blocks.player.SimplePlayer,
    container: '#container',
    sizing: 'manual',
    width: 1000,
    height: 100,
  });

  const waveform = new blocks.module.WaveformModule({ channels: 'all' });
  const segment = new blocks.module.SegmentModule();
  const cursor = new blocks.module.CursorModule();
  const marker = new blocks.module.MarkerModule();
  const zoom = new blocks.module.ZoomModule({ scrollBarContainer: '#scroll-bar' });

  block.add(waveform, 0);
  block.add(cursor, 1);
  block.add(segment, 2);
  block.add(zoom, 3);

  const defaultMetadata = { markers: [{ time: 0, duration: 4, }] };

  const scheduler = audio.getScheduler();
  const engine = new audio.GranularEngine();
  engine.connect(audioContext.destination);

  block.addListener(block.EVENTS.UPDATE, (data, metadata) => {
    const marker = metadata.markers[0];

    engine.buffer = buffer;
    engine.position = marker.time + marker.duration / 2;
    engine.positionVar = marker.duration / 2;
  });

  // init with default buffer and metadata
  block.setTrack(buffer, defaultMetadata);

  new controllers.SelectButtons({
    container: '#controllers',
    label: 'preview',
    options: ['start', 'pause', 'stop'],
    default: 'stop',
    callback: value => block[value](),
  });

  new controllers.SelectButtons({
    container: '#controllers',
    label: 'engine',
    options: ['start', 'stop'],
    default: 'stop',
    callback: value => {
      if (value === 'start')
        scheduler.add(engine);
      else
        scheduler.remove(engine);
    }
  });

  new controllers.Slider({
    container: '#controllers',
    label: 'Period',
    min: 0.001,
    max: 0.500,
    step: 0.001,
    default: 0.010,
    unit: 'sec',
    callback: value => engine.periodAbs = value,
  });

  new controllers.Slider({
    container: '#controllers',
    label: 'Duration',
    min: 0.010,
    max: 0.500,
    step: 0.001,
    default: 0.100,
    unit: 'sec',
    callback: value => engine.durationAbs = value,
  });

  new controllers.Slider({
    container: '#controllers',
    label: 'Resampling',
    min: -2400,
    max: 2400,
    step: 1,
    default: 0,
    unit: 'cent',
    callback: value => engine.resampling = value,
  });

  new controllers.Slider({
    container: '#controllers',
    label: 'ResamplingVar',
    min: 0,
    max: 1200,
    step: 1,
    default: 0,
    unit: 'cent',
    callback: value => engine.resamplingVar = value,
  });

  new controllers.DragAndDrop({
    container: '#controllers',
    audioContext: audioContext,
    callback: buffers => {
      // get only first buffer in the list
      const buffer = buffers[Object.keys(buffers)[0]]; // update global buffer

      block.setTrack(buffer, defaultMetadata);
      engine.buffer = buffer;
    }
  });
}

window.addEventListener('load', init);

