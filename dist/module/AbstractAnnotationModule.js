'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractModule2 = require('../core/AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * State to edit the label
 */
var LabelEditionState = function (_ui$states$BaseState) {
  (0, _inherits3.default)(LabelEditionState, _ui$states$BaseState);

  function LabelEditionState(timeline, layer) {
    (0, _classCallCheck3.default)(this, LabelEditionState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (LabelEditionState.__proto__ || (0, _getPrototypeOf2.default)(LabelEditionState)).call(this, timeline));

    _this.currentTarget = null;
    _this.layer = layer;
    return _this;
  }

  (0, _createClass3.default)(LabelEditionState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'dblclick':
          this.onDblClick(e);
          break;
      }
    }
  }, {
    key: 'onDblClick',
    value: function onDblClick(e) {
      var shape = this.layer.getShapeFromDOMElement(e.target);
      shape.$label.setAttribute('contenteditable', true);
      shape.$label.focus();

      this.currentTarget = e.target;
      this.currentShape = shape;
    }
  }, {
    key: 'updateLabel',
    value: function updateLabel() {
      var value = this.currentShape.$label.innerHTML;
      var shape = this.layer.getShapeFromDOMElement(this.currentTarget);
      var datum = this.layer.getDatumFromDOMElement(this.currentTarget);
      shape.$label.removeAttribute('contenteditable');
      shape.$label.blur();

      if (datum) {
        this.currentShape.label(datum, value);
        this.currentTarget = null;
      }
    }
  }]);
  return LabelEditionState;
}(ui.states.BaseState);

/**
 * State to edit the position
 */


var PositionEditionState = function (_ui$states$BaseState2) {
  (0, _inherits3.default)(PositionEditionState, _ui$states$BaseState2);

  function PositionEditionState(timeline, layer) {
    (0, _classCallCheck3.default)(this, PositionEditionState);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (PositionEditionState.__proto__ || (0, _getPrototypeOf2.default)(PositionEditionState)).call(this, timeline));

    _this2.currentItem = null;
    _this2.currentTarget = null;
    _this2.hasMoved = false;
    _this2.layer = layer;
    return _this2;
  }

  (0, _createClass3.default)(PositionEditionState, [{
    key: 'clear',
    value: function clear() {
      this.currentItem = null;
      this.currentTarget = null;
      this.hasMoved = false;
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.currentTarget = e.target;
      this.currentItem = this.layer.getItemFromDOMElement(e.target);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      this.layer.edit(this.currentItem, e.dx, e.dy, this.currentTarget);
      this.layer.update(this.currentItem);
    }
  }]);
  return PositionEditionState;
}(ui.states.BaseState);

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


var AbstractAnnotationModule = function (_AbstractModule) {
  (0, _inherits3.default)(AbstractAnnotationModule, _AbstractModule);

  function AbstractAnnotationModule(parameters, options) {
    (0, _classCallCheck3.default)(this, AbstractAnnotationModule);

    /**
     * The layer containing the annotations created in the install method
     */
    var _this3 = (0, _possibleConstructorReturn3.default)(this, (AbstractAnnotationModule.__proto__ || (0, _getPrototypeOf2.default)(AbstractAnnotationModule)).call(this, parameters, options));

    _this3._layer = null;
    return _this3;
  }

  /**
   * derived class shoud set the
   *
   */


  (0, _createClass3.default)(AbstractAnnotationModule, [{
    key: 'install',
    value: function install() {
      this._timeline = this.block.ui.timeline;
    }
  }, {
    key: 'postInstall',
    value: function postInstall(layer) {
      this._positionEditionState = new PositionEditionState(this._timeline, layer);
      this._labelEditionState = new LabelEditionState(this._timeline, layer);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      this.block.ui.track.remove(this._layer);
    }
  }, {
    key: 'render',
    value: function render() {
      this._layer.render();
      this._layer.update();
    }
  }, {
    key: 'setTrack',
    value: function setTrack(buffer, metadata) {
      this._layer.data = metadata.markers || [];
    }
  }, {
    key: '_createAnnotation',
    value: function _createAnnotation(position) {
      var _timeline$timeContext = this._timeline.timeContext,
          timeToPixel = _timeline$timeContext.timeToPixel,
          offset = _timeline$timeContext.offset;

      var time = timeToPixel.invert(position) - offset;
      var datum = this.createNewAnnotationDatum(time);

      this._layer.data.push(datum);
      this.render();
    }
  }, {
    key: '_deleteAnnotation',
    value: function _deleteAnnotation($item) {
      var datum = this._layer.getDatumFromItem($item);
      var index = this._layer.data.indexOf(datum);

      this._layer.data.splice(index, 1);
      this.render();
    }
  }, {
    key: 'onEvent',
    value: function onEvent(e, hitLayers) {
      var _this4 = this;

      switch (e.type) {
        case 'dblclick':
          if (this._layer.hasElement(e.target) && e.target.tagName === 'DIV') {
            var $target = e.target;

            if (this._timeline.state === this._positionEditionState) this._positionEditionState.clear();

            var prevContent = $target.textContent;
            this._timeline.state = this._labelEditionState;

            var clearLabelEdition = function clearLabelEdition(e) {
              if (_this4._labelEditionState.currentTarget !== e.target) {
                _this4._labelEditionState.updateLabel();
                _this4._timeline.state = null;

                if ($target.textContent !== prevContent) _this4.block.snap();

                document.removeEventListener('mousedown', clearLabelEdition);
              }
            };

            document.addEventListener('mousedown', clearLabelEdition);
            return false;
          } else {
            this._createAnnotation(e.x);
            this.block.snap();
          }

          break;

        case 'mousedown':
          // maybe we wait for a dbl click so stop event propagation
          if (this._layer.hasElement(e.target) && e.target.tagName === 'DIV') return false;

          if (this._layer.hasElement(e.target) && e.target.tagName !== 'DIV') {
            // clear current target and current item only if the user clicks
            // somewhere else => allows for deleting markers
            var clearPositionEdition = function clearPositionEdition(e) {
              if (!_this4._layer.hasElement(e.target)) {
                _this4._positionEditionState.clear();
                _this4._timeline.state = null;

                document.removeEventListener('mousedown', clearPositionEdition);
              }
            };

            this._timeline.state = this._positionEditionState;
            document.addEventListener('mousedown', clearPositionEdition);

            return false;
          }

          break;

        case 'mousemove':
          if (this._timeline.state === this._positionEditionState) this._positionEditionState.hasMoved = true;
          break;

        case 'mouseup':
          if (this._timeline.state === this._positionEditionState && this._positionEditionState.hasMoved === true) {
            this._positionEditionState.hasMoved = false;
            this.block.snap();
          }

          break;

        case 'keydown':
          // delete
          if (e.which === 8 && this._timeline.state == this._positionEditionState) {
            this._deleteAnnotation(this._positionEditionState.currentItem);
            this._positionEditionState.clear();

            this.block.snap();
            return false;
          }

          break;
      }

      if (this._timeline.state === this._labelEditionState) return false;

      return true;
    }
  }]);
  return AbstractAnnotationModule;
}(_AbstractModule3.default);

exports.default = AbstractAnnotationModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJMYWJlbEVkaXRpb25TdGF0ZSIsInRpbWVsaW5lIiwibGF5ZXIiLCJjdXJyZW50VGFyZ2V0IiwiZSIsInR5cGUiLCJvbkRibENsaWNrIiwic2hhcGUiLCJnZXRTaGFwZUZyb21ET01FbGVtZW50IiwidGFyZ2V0IiwiJGxhYmVsIiwic2V0QXR0cmlidXRlIiwiZm9jdXMiLCJjdXJyZW50U2hhcGUiLCJ2YWx1ZSIsImlubmVySFRNTCIsImRhdHVtIiwiZ2V0RGF0dW1Gcm9tRE9NRWxlbWVudCIsInJlbW92ZUF0dHJpYnV0ZSIsImJsdXIiLCJsYWJlbCIsInN0YXRlcyIsIkJhc2VTdGF0ZSIsIlBvc2l0aW9uRWRpdGlvblN0YXRlIiwiY3VycmVudEl0ZW0iLCJoYXNNb3ZlZCIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJnZXRJdGVtRnJvbURPTUVsZW1lbnQiLCJlZGl0IiwiZHgiLCJkeSIsInVwZGF0ZSIsIkFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSIsInBhcmFtZXRlcnMiLCJvcHRpb25zIiwiX2xheWVyIiwiX3RpbWVsaW5lIiwiYmxvY2siLCJfcG9zaXRpb25FZGl0aW9uU3RhdGUiLCJfbGFiZWxFZGl0aW9uU3RhdGUiLCJ0cmFjayIsInJlbW92ZSIsInJlbmRlciIsImJ1ZmZlciIsIm1ldGFkYXRhIiwiZGF0YSIsIm1hcmtlcnMiLCJwb3NpdGlvbiIsInRpbWVDb250ZXh0IiwidGltZVRvUGl4ZWwiLCJvZmZzZXQiLCJ0aW1lIiwiaW52ZXJ0IiwiY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtIiwicHVzaCIsIiRpdGVtIiwiZ2V0RGF0dW1Gcm9tSXRlbSIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImhpdExheWVycyIsImhhc0VsZW1lbnQiLCJ0YWdOYW1lIiwiJHRhcmdldCIsInN0YXRlIiwiY2xlYXIiLCJwcmV2Q29udGVudCIsInRleHRDb250ZW50IiwiY2xlYXJMYWJlbEVkaXRpb24iLCJ1cGRhdGVMYWJlbCIsInNuYXAiLCJkb2N1bWVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiX2NyZWF0ZUFubm90YXRpb24iLCJ4IiwiY2xlYXJQb3NpdGlvbkVkaXRpb24iLCJ3aGljaCIsIl9kZWxldGVBbm5vdGF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQVlBLEU7Ozs7OztBQUdaOzs7SUFHTUMsaUI7OztBQUNKLDZCQUFZQyxRQUFaLEVBQXNCQyxLQUF0QixFQUE2QjtBQUFBOztBQUFBLDRKQUNyQkQsUUFEcUI7O0FBRzNCLFVBQUtFLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxVQUFLRCxLQUFMLEdBQWFBLEtBQWI7QUFKMkI7QUFLNUI7Ozs7Z0NBRVdFLEMsRUFBRztBQUNiLGNBQVFBLEVBQUVDLElBQVY7QUFDRSxhQUFLLFVBQUw7QUFDRSxlQUFLQyxVQUFMLENBQWdCRixDQUFoQjtBQUNBO0FBSEo7QUFLRDs7OytCQUVVQSxDLEVBQUc7QUFDWixVQUFNRyxRQUFRLEtBQUtMLEtBQUwsQ0FBV00sc0JBQVgsQ0FBa0NKLEVBQUVLLE1BQXBDLENBQWQ7QUFDQUYsWUFBTUcsTUFBTixDQUFhQyxZQUFiLENBQTBCLGlCQUExQixFQUE2QyxJQUE3QztBQUNBSixZQUFNRyxNQUFOLENBQWFFLEtBQWI7O0FBRUEsV0FBS1QsYUFBTCxHQUFxQkMsRUFBRUssTUFBdkI7QUFDQSxXQUFLSSxZQUFMLEdBQW9CTixLQUFwQjtBQUNEOzs7a0NBRWE7QUFDWixVQUFNTyxRQUFRLEtBQUtELFlBQUwsQ0FBa0JILE1BQWxCLENBQXlCSyxTQUF2QztBQUNBLFVBQU1SLFFBQVEsS0FBS0wsS0FBTCxDQUFXTSxzQkFBWCxDQUFrQyxLQUFLTCxhQUF2QyxDQUFkO0FBQ0EsVUFBTWEsUUFBUSxLQUFLZCxLQUFMLENBQVdlLHNCQUFYLENBQWtDLEtBQUtkLGFBQXZDLENBQWQ7QUFDQUksWUFBTUcsTUFBTixDQUFhUSxl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QVQsQ0FBMEIsV0FBMUIsRUFBdUNHLG9CQUF2Qzs7QUFFQSxtQkFBTyxLQUFQO0FBQ0Q7O0FBRUQ7O0FBRUYsYUFBSyxXQUFMO0FBQ0UsY0FBSSxLQUFLeEMsU0FBTCxDQUFlNEIsS0FBZixLQUF5QixLQUFLMUIscUJBQWxDLEVBQ0UsS0FBS0EscUJBQUwsQ0FBMkJkLFFBQTNCLEdBQXNDLElBQXRDO0FBQ0Y7O0FBRUYsYUFBSyxTQUFMO0FBQ0UsY0FDRSxLQUFLWSxTQUFMLENBQWU0QixLQUFmLEtBQXlCLEtBQUsxQixxQkFBOUIsSUFDQSxLQUFLQSxxQkFBTCxDQUEyQmQsUUFBM0IsS0FBd0MsSUFGMUMsRUFHRTtBQUNBLGlCQUFLYyxxQkFBTCxDQUEyQmQsUUFBM0IsR0FBc0MsS0FBdEM7QUFDQSxpQkFBS2EsS0FBTCxDQUFXaUMsSUFBWDtBQUNEOztBQUVEOztBQUVGLGFBQUssU0FBTDtBQUNFO0FBQ0EsY0FBSW5FLEVBQUUwRSxLQUFGLEtBQVksQ0FBWixJQUFpQixLQUFLekMsU0FBTCxDQUFlNEIsS0FBZixJQUF3QixLQUFLMUIscUJBQWxELEVBQXlFO0FBQ3ZFLGlCQUFLd0MsaUJBQUwsQ0FBdUIsS0FBS3hDLHFCQUFMLENBQTJCZixXQUFsRDtBQUNBLGlCQUFLZSxxQkFBTCxDQUEyQjJCLEtBQTNCOztBQUVBLGlCQUFLNUIsS0FBTCxDQUFXaUMsSUFBWDtBQUNBLG1CQUFPLEtBQVA7QUFDRDs7QUFFRDtBQW5GSjs7QUFzRkEsVUFBSSxLQUFLbEMsU0FBTCxDQUFlNEIsS0FBZixLQUF5QixLQUFLekIsa0JBQWxDLEVBQ0UsT0FBTyxLQUFQOztBQUVGLGFBQU8sSUFBUDtBQUNEOzs7OztrQkFHWVAsd0IiLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcbmltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcblxuXG4vKipcbiAqIFN0YXRlIHRvIGVkaXQgdGhlIGxhYmVsXG4gKi9cbmNsYXNzIExhYmVsRWRpdGlvblN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBsYXllcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgdGhpcy5sYXllciA9IGxheWVyO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdkYmxjbGljayc6XG4gICAgICAgIHRoaXMub25EYmxDbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25EYmxDbGljayhlKSB7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLmxheWVyLmdldFNoYXBlRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuICAgIHNoYXBlLiRsYWJlbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHNoYXBlLiRsYWJlbC5mb2N1cygpO1xuXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50U2hhcGUgPSBzaGFwZTtcbiAgfVxuXG4gIHVwZGF0ZUxhYmVsKCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jdXJyZW50U2hhcGUuJGxhYmVsLmlubmVySFRNTDtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMubGF5ZXIuZ2V0U2hhcGVGcm9tRE9NRWxlbWVudCh0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5sYXllci5nZXREYXR1bUZyb21ET01FbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgc2hhcGUuJGxhYmVsLnJlbW92ZUF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJyk7XG4gICAgc2hhcGUuJGxhYmVsLmJsdXIoKTtcblxuICAgIGlmIChkYXR1bSkge1xuICAgICAgdGhpcy5jdXJyZW50U2hhcGUubGFiZWwoZGF0dW0sIHZhbHVlKTtcbiAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU3RhdGUgdG8gZWRpdCB0aGUgcG9zaXRpb25cbiAqL1xuY2xhc3MgUG9zaXRpb25FZGl0aW9uU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIGxheWVyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50SXRlbSA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmhhc01vdmVkID0gZmFsc2U7XG4gICAgdGhpcy5sYXllciA9IGxheWVyO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5jdXJyZW50SXRlbSA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmhhc01vdmVkID0gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudEl0ZW0gPSB0aGlzLmxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5sYXllci5lZGl0KHRoaXMuY3VycmVudEl0ZW0sIGUuZHgsIGUuZHksIHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgdGhpcy5sYXllci51cGRhdGUodGhpcy5jdXJyZW50SXRlbSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBYnN0cmFjdCBmb3IgZnVsbHkgZWRpdGFibGUgbW9kdWxlIHRoYXQgZGlzcGxheSBhbm5vdGF0aW9ucyBhY2Nyb2RpbmcgdG8gdGhlXG4gKiBnaXZlbiB0cmFjayBjb25maWcuXG4gKiBEZXJpdmVkIG1vZHVsZXMgc2hvdWxkIGltcGxlbWVudCB0aGUgYGluc3RhbGxgIGFuZCBgY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtYFxuICogbWV0aG9kcy5cbiAqXG4gKiBUaGUgbW9kdWxlIGRlZmluZXMgdGhlIGZvbGxvd2luZyBpbnRlcmFjdGlvbnM6XG4gKiAtIGVkaXQgdGhlIGFubm90YXRpb24gcG9zaXRpb24gKGB0aW1lYCk6IG1vdXNlIGRyYWdcbiAqIC0gZWRpdCB0aGUgYGxhYmVsYDogZG91YmxlIGNsaWNrIG9uIHRoZSBsYWJlbCB0byBlZGl0IGl0XG4gKiAtIGNyZWF0ZSBhIG5ldyBhbm5vdGF0aW9uOiBkb3VibGUgY2xpY2sgc29tZXdoZXJlIGluIHRoZSB0aW1lbGluZVxuICogLSBkZWxldGUgYSBhbm5vdGF0aW9uOiBrZXlwZXNzIHN1cHByXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogLy8gZGF0YSBmb3JtYXRcbiAqIFtcbiAqICAgeyB0aW1lOiAwLjIzMCwgbGFiZWw6ICdsYWJlbC0xJyB9LFxuICogICB7IHRpbWU6IDEuNDgwLCBsYWJlbDogJ2xhYmVsLTInIH0sXG4gKiBdXG4gKiBgYGBcbiAqL1xuY2xhc3MgQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbGF5ZXIgY29udGFpbmluZyB0aGUgYW5ub3RhdGlvbnMgY3JlYXRlZCBpbiB0aGUgaW5zdGFsbCBtZXRob2RcbiAgICAgKi9cbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogZGVyaXZlZCBjbGFzcyBzaG91ZCBzZXQgdGhlXG4gICAqXG4gICAqL1xuICBpbnN0YWxsKCkge1xuICAgIHRoaXMuX3RpbWVsaW5lID0gdGhpcy5ibG9jay51aS50aW1lbGluZTtcbiAgfVxuXG4gIHBvc3RJbnN0YWxsKGxheWVyKSB7XG4gICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUgPSBuZXcgUG9zaXRpb25FZGl0aW9uU3RhdGUodGhpcy5fdGltZWxpbmUsIGxheWVyKTtcbiAgICB0aGlzLl9sYWJlbEVkaXRpb25TdGF0ZSA9IG5ldyBMYWJlbEVkaXRpb25TdGF0ZSh0aGlzLl90aW1lbGluZSwgbGF5ZXIpO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIHRoaXMuYmxvY2sudWkudHJhY2sucmVtb3ZlKHRoaXMuX2xheWVyKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLl9sYXllci5yZW5kZXIoKTtcbiAgICB0aGlzLl9sYXllci51cGRhdGUoKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl9sYXllci5kYXRhID0gbWV0YWRhdGEubWFya2VycyB8fCBbXTtcbiAgfVxuXG4gIF9jcmVhdGVBbm5vdGF0aW9uKHBvc2l0aW9uKSB7XG4gICAgY29uc3QgeyB0aW1lVG9QaXhlbCwgb2Zmc2V0IH0gPSB0aGlzLl90aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCB0aW1lID0gdGltZVRvUGl4ZWwuaW52ZXJ0KHBvc2l0aW9uKSAtIG9mZnNldDtcbiAgICBjb25zdCBkYXR1bSA9IHRoaXMuY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtKHRpbWUpO1xuXG4gICAgdGhpcy5fbGF5ZXIuZGF0YS5wdXNoKGRhdHVtKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgX2RlbGV0ZUFubm90YXRpb24oJGl0ZW0pIHtcbiAgICBjb25zdCBkYXR1bSA9IHRoaXMuX2xheWVyLmdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGF5ZXIuZGF0YS5pbmRleE9mKGRhdHVtKTtcblxuICAgIHRoaXMuX2xheWVyLmRhdGEuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgb25FdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnZGJsY2xpY2snOlxuICAgICAgICBpZiAodGhpcy5fbGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkgJiYgZS50YXJnZXQudGFnTmFtZSA9PT0gJ0RJVicpIHtcbiAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgICBpZiAodGhpcy5fdGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlKVxuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuY2xlYXIoKTtcblxuICAgICAgICAgIGNvbnN0IHByZXZDb250ZW50ID0gJHRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlO1xuXG4gICAgICAgICAgY29uc3QgY2xlYXJMYWJlbEVkaXRpb24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlLmN1cnJlbnRUYXJnZXQgIT09IGUudGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlLnVwZGF0ZUxhYmVsKCk7XG4gICAgICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID0gbnVsbDtcblxuICAgICAgICAgICAgICBpZiAoJHRhcmdldC50ZXh0Q29udGVudCAhPT0gcHJldkNvbnRlbnQpXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9jay5zbmFwKCk7XG5cbiAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xlYXJMYWJlbEVkaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyTGFiZWxFZGl0aW9uKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY3JlYXRlQW5ub3RhdGlvbihlLngpO1xuICAgICAgICAgIHRoaXMuYmxvY2suc25hcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIC8vIG1heWJlIHdlIHdhaXQgZm9yIGEgZGJsIGNsaWNrIHNvIHN0b3AgZXZlbnQgcHJvcGFnYXRpb25cbiAgICAgICAgaWYgKHRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpICYmIGUudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5fbGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkgJiYgZS50YXJnZXQudGFnTmFtZSAhPT0gJ0RJVicpIHtcbiAgICAgICAgICAvLyBjbGVhciBjdXJyZW50IHRhcmdldCBhbmQgY3VycmVudCBpdGVtIG9ubHkgaWYgdGhlIHVzZXIgY2xpY2tzXG4gICAgICAgICAgLy8gc29tZXdoZXJlIGVsc2UgPT4gYWxsb3dzIGZvciBkZWxldGluZyBtYXJrZXJzXG4gICAgICAgICAgY29uc3QgY2xlYXJQb3NpdGlvbkVkaXRpb24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9sYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5jbGVhcigpO1xuICAgICAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xlYXJQb3NpdGlvbkVkaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGU7XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xlYXJQb3NpdGlvbkVkaXRpb24pO1xuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIGlmICh0aGlzLl90aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUpXG4gICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUgJiZcbiAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5oYXNNb3ZlZCA9PT0gdHJ1ZVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5oYXNNb3ZlZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuYmxvY2suc25hcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICAvLyBkZWxldGVcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDggJiYgdGhpcy5fdGltZWxpbmUuc3RhdGUgPT0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUpIHtcbiAgICAgICAgICB0aGlzLl9kZWxldGVBbm5vdGF0aW9uKHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmN1cnJlbnRJdGVtKTtcbiAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5jbGVhcigpO1xuXG4gICAgICAgICAgdGhpcy5ibG9jay5zbmFwKCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9sYWJlbEVkaXRpb25TdGF0ZSlcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZTtcbiJdfQ==