import AbstractModule from '../core/AbstractModule';
import * as ui from 'waves-ui';


/**
 * State to edit the label
 */
class LabelEditionState extends ui.states.BaseState {
  constructor(timeline, layer) {
    super(timeline);

    this.currentTarget = null;
    this.layer = layer;
  }

  handleEvent(e) {
    switch (e.type) {
      case 'dblclick':
        this.onDblClick(e);
        break;
    }
  }

  onDblClick(e) {
    const shape = this.layer.getShapeFromDOMElement(e.target);
    shape.$label.setAttribute('contenteditable', true);
    shape.$label.focus();

    this.currentTarget = e.target;
    this.currentShape = shape;
  }

  updateLabel() {
    const value = this.currentShape.$label.innerHTML;
    const shape = this.layer.getShapeFromDOMElement(this.currentTarget);
    const datum = this.layer.getDatumFromDOMElement(this.currentTarget);
    shape.$label.removeAttribute('contenteditable');
    shape.$label.blur();

    if (datum) {
      this.currentShape.label(datum, value);
      this.currentTarget = null;
    }
  }
}

/**
 * State to edit the position
 */
class PositionEditionState extends ui.states.BaseState {
  constructor(timeline, layer) {
    super(timeline);

    this.currentItem = null;
    this.currentTarget = null;
    this.layer = layer;
  }

  clear() {
    this.currentItem = null;
    this.currentTarget = null;
  }

  handleEvent(e) {
    switch (e.type) {
      case 'mousedown':
        this.onMouseDown(e);
        break;
      case 'mousemove':
        this.onMouseMove(e);
        break;
    }
  }

  onMouseDown(e) {
    this.currentTarget = e.target;
    this.currentItem = this.layer.getItemFromDOMElement(e.target);
  }

  onMouseMove(e) {
    this.layer.edit(this.currentItem, e.dx, e.dy, this.currentTarget);
    this.layer.update(this.currentItem);
  }
}

/**
 * Abstract for fully editable module that display annotations accroding to the
 * given track config.
 * Derived modules should implement the `install` and `createNewAnnotationDatum`
 * methods.
 *
 * The module defines the following interactions:
 * - edit the annotation position (`time`): mouse drag
 * - edit the `label`: double click on the label to edit it
 * - create a new annotation: double click somewhere in the timeline
 * - delete a annotation: keypess suppr
 *
 * @example
 * ```
 * // data format
 * [
 *   { time: 0.230, label: 'label-1' },
 *   { time: 1.480, label: 'label-2' },
 * ]
 * ```
 */
class AbstractAnnotationModule extends AbstractModule {
  constructor(parameters, options) {
    super(parameters, options);

    /**
     * The layer containing the annotations created in the install method
     */
    this._layer = null;
  }

  /**
   * derived class shoud set the
   *
   */
  install() {
    this._timeline = this.block.ui.timeline;
  }

  postInstall(layer) {
    this._positionEditionState = new PositionEditionState(this._timeline, layer);
    this._labelEditionState = new LabelEditionState(this._timeline, layer);
  }

  uninstall() {
    this.block.ui.track.remove(this._layer);
  }

  render() {
    this._layer.render();
    this._layer.update();
  }

  setTrack(buffer, metadata) {
    this._layer.data = metadata.markers || [];
  }

  _createAnnotation(position) {
    const { timeToPixel, offset } = this._timeline.timeContext;
    const time = timeToPixel.invert(position) - offset;
    const datum = this.createNewAnnotationDatum(time);

    this._layer.data.push(datum);
    this.render();
  }

  _deleteAnnotation($item) {
    const datum = this._layer.getDatumFromItem($item);
    const index = this._layer.data.indexOf(datum);

    this._layer.data.splice(index, 1);
    this.render();
  }

  onEvent(e, hitLayers) {
    switch (e.type) {
      case 'dblclick':
        if (this._layer.hasElement(e.target) && e.target.tagName === 'DIV') {
          if (this._timeline.state === this._positionEditionState)
            this._positionEditionState.clear();

          this._timeline.state = this._labelEditionState;

          const clearLabelEdition = (e) => {
            if (this._labelEditionState.currentTarget !== e.target) {
              this._labelEditionState.updateLabel();
              this._timeline.state = null;

              this.block.createSnapshot();

              document.removeEventListener('mousedown', clearLabelEdition);
            }
          }

          document.addEventListener('mousedown', clearLabelEdition);
          return false;
        } else {
          this._createAnnotation(e.x);
          this.block.createSnapshot();
        }

        break;

      case 'mousedown':
        // maybe we wait for a dbl click so stop event propagation
        if (this._layer.hasElement(e.target) && e.target.tagName === 'DIV')
          return false;

        if (this._layer.hasElement(e.target)) {
          // clear current target and current item only if the user clicks
          // somewhere else => allows for deleting markers
          const clearPositionEdition = (e) => {
            if (!this._layer.hasElement(e.target)) {
              this._positionEditionState.clear();
              this._timeline.state = null;

              document.removeEventListener('mousedown', clearPositionEdition);
            }
          }

          this._timeline.state = this._positionEditionState;
          document.addEventListener('mousedown', clearPositionEdition);

          return false;
        }

        break;

      case 'mouseup':
        // if (hasMoved)
        //   createSnapshot()
        // else
        //   seek()

        // something has probably moved... this can create dummy recordings
        // should be handled properly
        if (this._timeline.state === this._positionEditionState)
          this.block.createSnapshot();

        break;

      case 'keydown':
        // delete
        if (e.which === 8 && this._timeline.state == this._positionEditionState) {
          this._deleteAnnotation(this._positionEditionState.currentItem);
          this.block.createSnapshot();

          this._positionEditionState.currentItem = null;
          this._positionEditionState.currentTarget = null;

          return false;
        }

        break;
    }

    if (this._timeline.state === this._labelEditionState)
      return false;

    return true;
  }
}

export default AbstractAnnotationModule;
