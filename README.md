# waves-blocks

> High-level audio and graphical components. The library is a high-level, user-friendly API built on top of [https://github.com/wavesjs/waves-ui](https://github.com/wavesjs/waves-ui) and [https://github.com/wavesjs/waves-audio](https://github.com/wavesjs/waves-audio)

The library exposes an audio player (the `block`) which can be dynamically decorated with graphical components (the `modules`) to add functionnalities such as `waveform` display, `zoom` capabilities, `cursor`, `markers`, `segments` and so on.

**Documentation:** []()

## Install

```
npm install --save --save-exact waves-blocks
```

## Usage

```js
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

block.setTrack(buffer, {});
```

## Available Modules


## License

BSD-3-Clause

## Acknowledgements

