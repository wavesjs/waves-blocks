import AbstractAnnotation from './AbstractAnnotation';
import * as ui from 'waves-ui';

/** @private */
const parameters = {
  color: {
    type: 'string',
    default: 'green',
    constant: true,
  }
};

/**
 * Fully editable module that display markers accroding to the given track config.
 *
 * Markers should be defined in the `markers` entry of the track configuration.
 * A marker is defined by a `time`, `label` and an optionnal `color`.
 *
 * @example
 * ```
 * [
 *   { time: 0.230, label: 'label-1' },
 *   { time: 1.480, label: 'label-2' },
 * ]
 * ```
 *
 * The module defines the following interactions:
 * - edit the marker position (`time`): mouse drag
 * - edit the `label`: double click on the label to edit it
 * - create a new marker: double click somewhere in the timeline
 * - delete a marker: keypess suppr
 *
 * @param {Object} options - Override default parameters
 * @param {String} color - Default color of the markers.
 */
class Marker extends AbstractAnnotation {
  constructor(options) {
    super(parameters, options);
  }

  // return a new annotation datum
  // @note - should be modified if the data format changes
  createNewAnnotationDatum(time) {
    return {
      time: time,
      label: 'label',
    };
  }

  install() {
    super.install();

    const { timeContext, track } = this.block.ui;

    const markers = new ui.core.Layer('collection', [], {
      height: this.block.height,
      zIndex: this.zIndex,
    });

    markers.setTimeContext(timeContext);
    markers.configureShape(ui.shapes.Marker, {
      x: (d, v = null) => {
        if (v !== null)
          d.time = Math.min(v, timeContext.duration);

        return d.time;
      },
      label: (d, v = null) => {
        if (v !== null)
          d.label = v;

        return d.label;
      },
      color: (d) => (d.color || this.params.get('color')),
    }, {
      handlerWidth: 7,
      handlerHeight: 10,
      displayHandlers: true,
      displayLabels: true,
      opacity: 1,
    });

    markers.setBehavior(new ui.behaviors.MarkerBehavior());

    track.add(markers);

    this._layer = markers;
    this.postInstall(this._layer);
  }
}

export default Marker;
