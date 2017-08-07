import AbstractModule from '../core/AbstractModule';
import * as ui from 'waves-ui';

const parameters = {};


/**
 *
 *
 */
class TimeAxisModule extends AbstractModule {
  constructor(options = {}) {
    super(parameters, options);
  }

  // for use in zoom for example
  get layer() {
    return this._layer;
  }

  install(block) {
    const { timeline, track } = block.ui;

    // dummy axis waiting for track config
    this._layer = new ui.axis.AxisLayer(ui.axis.timeAxisGenerator(1, '4/4'), {
      top: 0,
      height: 12,
    });

    this._layer.setTimeContext(timeline.timeContext);
    this._layer.configureShape(ui.shapes.Ticks, {}, { color: 'steelblue' });

    track.add(this._layer);
  }

  uninstall(block) {
    const { track } = block.ui;
    track.remove(this._layer);
  }

  setTrack(trackConfig) {
    this._layer.render();
    this._layer.update();
  }
}

export default TimeAxisModule;
