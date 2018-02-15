import AbstractModule from '../core/AbstractModule';
import * as ui from 'waves-ui';

const parameters = {};


/**
 *
 *
 */
class GridAxisModule extends AbstractModule {
  constructor(options = {}) {
    super(parameters, options);
  }

  // for use in zoom for example
  get layer() {
    return this._layer;
  }

  install() {
    const { timeline, track } = this.block.ui;

    // dummy axis waiting for track config
    this._layer = new ui.axis.AxisLayer(ui.axis.gridAxisGenerator(1, '4/4'), {
      top: 0,
      height: 12,
      zIndex: this.zIndex,
    });

    // axis use timeline time context
    this._layer.setTimeContext(timeline.timeContext);
    this._layer.configureShape(ui.shapes.Ticks, {}, { color: '#909090' });

    track.add(this._layer);
  }

  uninstall() {
    const { track } = this.block.ui;
    track.remove(this._layer);
  }

  setTrack(buffer, metadata) {
    // as the signature and bpm may change between tracks,
    // we need to recreate generator
    const { bpm, signature } = metadata;
    const generator = ui.axis.gridAxisGenerator(bpm, signature);

    this._layer.generator = generator;
    this._layer.render();
    this._layer.update();
  }
}

export default GridAxisModule;
