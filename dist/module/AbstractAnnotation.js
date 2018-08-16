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


var AbstractAnnotation = function (_AbstractModule) {
  (0, _inherits3.default)(AbstractAnnotation, _AbstractModule);

  function AbstractAnnotation(parameters, options) {
    (0, _classCallCheck3.default)(this, AbstractAnnotation);

    /**
     * The layer containing the annotations created in the install method
     */
    var _this3 = (0, _possibleConstructorReturn3.default)(this, (AbstractAnnotation.__proto__ || (0, _getPrototypeOf2.default)(AbstractAnnotation)).call(this, parameters, options));

    _this3._layer = null;
    return _this3;
  }

  /**
   * derived class shoud set the
   *
   */


  (0, _createClass3.default)(AbstractAnnotation, [{
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
  return AbstractAnnotation;
}(_AbstractModule3.default);

exports.default = AbstractAnnotation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFic3RyYWN0QW5ub3RhdGlvbi5qcyJdLCJuYW1lcyI6WyJ1aSIsIkxhYmVsRWRpdGlvblN0YXRlIiwidGltZWxpbmUiLCJsYXllciIsImN1cnJlbnRUYXJnZXQiLCJlIiwidHlwZSIsIm9uRGJsQ2xpY2siLCJzaGFwZSIsImdldFNoYXBlRnJvbURPTUVsZW1lbnQiLCJ0YXJnZXQiLCIkbGFiZWwiLCJzZXRBdHRyaWJ1dGUiLCJmb2N1cyIsImN1cnJlbnRTaGFwZSIsInZhbHVlIiwiaW5uZXJIVE1MIiwiZGF0dW0iLCJnZXREYXR1bUZyb21ET01FbGVtZW50IiwicmVtb3ZlQXR0cmlidXRlIiwiYmx1ciIsImxhYmVsIiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiUG9zaXRpb25FZGl0aW9uU3RhdGUiLCJjdXJyZW50SXRlbSIsImhhc01vdmVkIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsImdldEl0ZW1Gcm9tRE9NRWxlbWVudCIsImVkaXQiLCJkeCIsImR5IiwidXBkYXRlIiwiQWJzdHJhY3RBbm5vdGF0aW9uIiwicGFyYW1ldGVycyIsIm9wdGlvbnMiLCJfbGF5ZXIiLCJfdGltZWxpbmUiLCJibG9jayIsIl9wb3NpdGlvbkVkaXRpb25TdGF0ZSIsIl9sYWJlbEVkaXRpb25TdGF0ZSIsInRyYWNrIiwicmVtb3ZlIiwicmVuZGVyIiwiYnVmZmVyIiwibWV0YWRhdGEiLCJkYXRhIiwibWFya2VycyIsInBvc2l0aW9uIiwidGltZUNvbnRleHQiLCJ0aW1lVG9QaXhlbCIsIm9mZnNldCIsInRpbWUiLCJpbnZlcnQiLCJjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0iLCJwdXNoIiwiJGl0ZW0iLCJnZXREYXR1bUZyb21JdGVtIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiaGl0TGF5ZXJzIiwiaGFzRWxlbWVudCIsInRhZ05hbWUiLCIkdGFyZ2V0Iiwic3RhdGUiLCJjbGVhciIsInByZXZDb250ZW50IiwidGV4dENvbnRlbnQiLCJjbGVhckxhYmVsRWRpdGlvbiIsInVwZGF0ZUxhYmVsIiwic25hcCIsImRvY3VtZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJfY3JlYXRlQW5ub3RhdGlvbiIsIngiLCJjbGVhclBvc2l0aW9uRWRpdGlvbiIsIndoaWNoIiwiX2RlbGV0ZUFubm90YXRpb24iLCJBYnN0cmFjdE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFHWjs7O0lBR01DLGlCOzs7QUFDSiw2QkFBWUMsUUFBWixFQUFzQkMsS0FBdEIsRUFBNkI7QUFBQTs7QUFBQSw0SkFDckJELFFBRHFCOztBQUczQixVQUFLRSxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsVUFBS0QsS0FBTCxHQUFhQSxLQUFiO0FBSjJCO0FBSzVCOzs7O2dDQUVXRSxDLEVBQUc7QUFDYixjQUFRQSxFQUFFQyxJQUFWO0FBQ0UsYUFBSyxVQUFMO0FBQ0UsZUFBS0MsVUFBTCxDQUFnQkYsQ0FBaEI7QUFDQTtBQUhKO0FBS0Q7OzsrQkFFVUEsQyxFQUFHO0FBQ1osVUFBTUcsUUFBUSxLQUFLTCxLQUFMLENBQVdNLHNCQUFYLENBQWtDSixFQUFFSyxNQUFwQyxDQUFkO0FBQ0FGLFlBQU1HLE1BQU4sQ0FBYUMsWUFBYixDQUEwQixpQkFBMUIsRUFBNkMsSUFBN0M7QUFDQUosWUFBTUcsTUFBTixDQUFhRSxLQUFiOztBQUVBLFdBQUtULGFBQUwsR0FBcUJDLEVBQUVLLE1BQXZCO0FBQ0EsV0FBS0ksWUFBTCxHQUFvQk4sS0FBcEI7QUFDRDs7O2tDQUVhO0FBQ1osVUFBTU8sUUFBUSxLQUFLRCxZQUFMLENBQWtCSCxNQUFsQixDQUF5QkssU0FBdkM7QUFDQSxVQUFNUixRQUFRLEtBQUtMLEtBQUwsQ0FBV00sc0JBQVgsQ0FBa0MsS0FBS0wsYUFBdkMsQ0FBZDtBQUNBLFVBQU1hLFFBQVEsS0FBS2QsS0FBTCxDQUFXZSxzQkFBWCxDQUFrQyxLQUFLZCxhQUF2QyxDQUFkO0FB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QUE1QjtBQUNBaUMscUJBQVNFLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDRyxvQkFBdkM7O0FBRUEsbUJBQU8sS0FBUDtBQUNEOztBQUVEOztBQUVGLGFBQUssV0FBTDtBQUNFLGNBQUksS0FBS3hDLFNBQUwsQ0FBZTRCLEtBQWYsS0FBeUIsS0FBSzFCLHFCQUFsQyxFQUNFLEtBQUtBLHFCQUFMLENBQTJCZCxRQUEzQixHQUFzQyxJQUF0QztBQUNGOztBQUVGLGFBQUssU0FBTDtBQUNFLGNBQ0UsS0FBS1ksU0FBTCxDQUFlNEIsS0FBZixLQUF5QixLQUFLMUIscUJBQTlCLElBQ0EsS0FBS0EscUJBQUwsQ0FBMkJkLFFBQTNCLEtBQXdDLElBRjFDLEVBR0U7QUFDQSxpQkFBS2MscUJBQUwsQ0FBMkJkLFFBQTNCLEdBQXNDLEtBQXRDO0FBQ0EsaUJBQUthLEtBQUwsQ0FBV2lDLElBQVg7QUFDRDs7QUFFRDs7QUFFRixhQUFLLFNBQUw7QUFDRTtBQUNBLGNBQUluRSxFQUFFMEUsS0FBRixLQUFZLENBQVosSUFBaUIsS0FBS3pDLFNBQUwsQ0FBZTRCLEtBQWYsSUFBd0IsS0FBSzFCLHFCQUFsRCxFQUF5RTtBQUN2RSxpQkFBS3dDLGlCQUFMLENBQXVCLEtBQUt4QyxxQkFBTCxDQUEyQmYsV0FBbEQ7QUFDQSxpQkFBS2UscUJBQUwsQ0FBMkIyQixLQUEzQjs7QUFFQSxpQkFBSzVCLEtBQUwsQ0FBV2lDLElBQVg7QUFDQSxtQkFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUFuRko7O0FBc0ZBLFVBQUksS0FBS2xDLFNBQUwsQ0FBZTRCLEtBQWYsS0FBeUIsS0FBS3pCLGtCQUFsQyxFQUNFLE9BQU8sS0FBUDs7QUFFRixhQUFPLElBQVA7QUFDRDs7O0VBaEo4QndDLHdCOztrQkFtSmxCL0Msa0IiLCJmaWxlIjoiQWJzdHJhY3RBbm5vdGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5cbi8qKlxuICogU3RhdGUgdG8gZWRpdCB0aGUgbGFiZWxcbiAqL1xuY2xhc3MgTGFiZWxFZGl0aW9uU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIGxheWVyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVyID0gbGF5ZXI7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2RibGNsaWNrJzpcbiAgICAgICAgdGhpcy5vbkRibENsaWNrKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbkRibENsaWNrKGUpIHtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMubGF5ZXIuZ2V0U2hhcGVGcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG4gICAgc2hhcGUuJGxhYmVsLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSk7XG4gICAgc2hhcGUuJGxhYmVsLmZvY3VzKCk7XG5cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgICB0aGlzLmN1cnJlbnRTaGFwZSA9IHNoYXBlO1xuICB9XG5cbiAgdXBkYXRlTGFiZWwoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmN1cnJlbnRTaGFwZS4kbGFiZWwuaW5uZXJIVE1MO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5sYXllci5nZXRTaGFwZUZyb21ET01FbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLmxheWVyLmdldERhdHVtRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICBzaGFwZS4kbGFiZWwucmVtb3ZlQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKTtcbiAgICBzaGFwZS4kbGFiZWwuYmx1cigpO1xuXG4gICAgaWYgKGRhdHVtKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5sYWJlbChkYXR1bSwgdmFsdWUpO1xuICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTdGF0ZSB0byBlZGl0IHRoZSBwb3NpdGlvblxuICovXG5jbGFzcyBQb3NpdGlvbkVkaXRpb25TdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgbGF5ZXIpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRJdGVtID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuaGFzTW92ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmxheWVyID0gbGF5ZXI7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmN1cnJlbnRJdGVtID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuaGFzTW92ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50SXRlbSA9IHRoaXMubGF5ZXIuZ2V0SXRlbUZyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICB0aGlzLmxheWVyLmVkaXQodGhpcy5jdXJyZW50SXRlbSwgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICB0aGlzLmxheWVyLnVwZGF0ZSh0aGlzLmN1cnJlbnRJdGVtKTtcbiAgfVxufVxuXG4vKipcbiAqIEFic3RyYWN0IGZvciBmdWxseSBlZGl0YWJsZSBtb2R1bGUgdGhhdCBkaXNwbGF5IGFubm90YXRpb25zIGFjY3JvZGluZyB0byB0aGVcbiAqIGdpdmVuIHRyYWNrIGNvbmZpZy5cbiAqIERlcml2ZWQgbW9kdWxlcyBzaG91bGQgaW1wbGVtZW50IHRoZSBgaW5zdGFsbGAgYW5kIGBjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW1gXG4gKiBtZXRob2RzLlxuICpcbiAqIFRoZSBtb2R1bGUgZGVmaW5lcyB0aGUgZm9sbG93aW5nIGludGVyYWN0aW9uczpcbiAqIC0gZWRpdCB0aGUgYW5ub3RhdGlvbiBwb3NpdGlvbiAoYHRpbWVgKTogbW91c2UgZHJhZ1xuICogLSBlZGl0IHRoZSBgbGFiZWxgOiBkb3VibGUgY2xpY2sgb24gdGhlIGxhYmVsIHRvIGVkaXQgaXRcbiAqIC0gY3JlYXRlIGEgbmV3IGFubm90YXRpb246IGRvdWJsZSBjbGljayBzb21ld2hlcmUgaW4gdGhlIHRpbWVsaW5lXG4gKiAtIGRlbGV0ZSBhIGFubm90YXRpb246IGtleXBlc3Mgc3VwcHJcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiAvLyBkYXRhIGZvcm1hdFxuICogW1xuICogICB7IHRpbWU6IDAuMjMwLCBsYWJlbDogJ2xhYmVsLTEnIH0sXG4gKiAgIHsgdGltZTogMS40ODAsIGxhYmVsOiAnbGFiZWwtMicgfSxcbiAqIF1cbiAqIGBgYFxuICovXG5jbGFzcyBBYnN0cmFjdEFubm90YXRpb24gZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsYXllciBjb250YWluaW5nIHRoZSBhbm5vdGF0aW9ucyBjcmVhdGVkIGluIHRoZSBpbnN0YWxsIG1ldGhvZFxuICAgICAqL1xuICAgIHRoaXMuX2xheWVyID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBkZXJpdmVkIGNsYXNzIHNob3VkIHNldCB0aGVcbiAgICpcbiAgICovXG4gIGluc3RhbGwoKSB7XG4gICAgdGhpcy5fdGltZWxpbmUgPSB0aGlzLmJsb2NrLnVpLnRpbWVsaW5lO1xuICB9XG5cbiAgcG9zdEluc3RhbGwobGF5ZXIpIHtcbiAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSA9IG5ldyBQb3NpdGlvbkVkaXRpb25TdGF0ZSh0aGlzLl90aW1lbGluZSwgbGF5ZXIpO1xuICAgIHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlID0gbmV3IExhYmVsRWRpdGlvblN0YXRlKHRoaXMuX3RpbWVsaW5lLCBsYXllcik7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgdGhpcy5ibG9jay51aS50cmFjay5yZW1vdmUodGhpcy5fbGF5ZXIpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuX2xheWVyLnJlbmRlcigpO1xuICAgIHRoaXMuX2xheWVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgc2V0VHJhY2soYnVmZmVyLCBtZXRhZGF0YSkge1xuICAgIHRoaXMuX2xheWVyLmRhdGEgPSBtZXRhZGF0YS5tYXJrZXJzIHx8IFtdO1xuICB9XG5cbiAgX2NyZWF0ZUFubm90YXRpb24ocG9zaXRpb24pIHtcbiAgICBjb25zdCB7IHRpbWVUb1BpeGVsLCBvZmZzZXQgfSA9IHRoaXMuX3RpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHRpbWUgPSB0aW1lVG9QaXhlbC5pbnZlcnQocG9zaXRpb24pIC0gb2Zmc2V0O1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5jcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0odGltZSk7XG5cbiAgICB0aGlzLl9sYXllci5kYXRhLnB1c2goZGF0dW0pO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfZGVsZXRlQW5ub3RhdGlvbigkaXRlbSkge1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fbGF5ZXIuZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSk7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9sYXllci5kYXRhLmluZGV4T2YoZGF0dW0pO1xuXG4gICAgdGhpcy5fbGF5ZXIuZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBvbkV2ZW50KGUsIGhpdExheWVycykge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdkYmxjbGljayc6XG4gICAgICAgIGlmICh0aGlzLl9sYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSAmJiBlLnRhcmdldC50YWdOYW1lID09PSAnRElWJykge1xuICAgICAgICAgIGNvbnN0ICR0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgICAgICAgIGlmICh0aGlzLl90aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUpXG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5jbGVhcigpO1xuXG4gICAgICAgICAgY29uc3QgcHJldkNvbnRlbnQgPSAkdGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID0gdGhpcy5fbGFiZWxFZGl0aW9uU3RhdGU7XG5cbiAgICAgICAgICBjb25zdCBjbGVhckxhYmVsRWRpdGlvbiA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGFiZWxFZGl0aW9uU3RhdGUuY3VycmVudFRhcmdldCAhPT0gZS50YXJnZXQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbGFiZWxFZGl0aW9uU3RhdGUudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgICAgICAgdGhpcy5fdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgIGlmICgkdGFyZ2V0LnRleHRDb250ZW50ICE9PSBwcmV2Q29udGVudClcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrLnNuYXAoKTtcblxuICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbGVhckxhYmVsRWRpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xlYXJMYWJlbEVkaXRpb24pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jcmVhdGVBbm5vdGF0aW9uKGUueCk7XG4gICAgICAgICAgdGhpcy5ibG9jay5zbmFwKCk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgLy8gbWF5YmUgd2Ugd2FpdCBmb3IgYSBkYmwgY2xpY2sgc28gc3RvcCBldmVudCBwcm9wYWdhdGlvblxuICAgICAgICBpZiAodGhpcy5fbGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkgJiYgZS50YXJnZXQudGFnTmFtZSA9PT0gJ0RJVicpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLl9sYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSAmJiBlLnRhcmdldC50YWdOYW1lICE9PSAnRElWJykge1xuICAgICAgICAgIC8vIGNsZWFyIGN1cnJlbnQgdGFyZ2V0IGFuZCBjdXJyZW50IGl0ZW0gb25seSBpZiB0aGUgdXNlciBjbGlja3NcbiAgICAgICAgICAvLyBzb21ld2hlcmUgZWxzZSA9PiBhbGxvd3MgZm9yIGRlbGV0aW5nIG1hcmtlcnNcbiAgICAgICAgICBjb25zdCBjbGVhclBvc2l0aW9uRWRpdGlvbiA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmNsZWFyKCk7XG4gICAgICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID0gbnVsbDtcblxuICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbGVhclBvc2l0aW9uRWRpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fdGltZWxpbmUuc3RhdGUgPSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZTtcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbGVhclBvc2l0aW9uRWRpdGlvbik7XG5cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSlcbiAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5oYXNNb3ZlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSAmJlxuICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmhhc01vdmVkID09PSB0cnVlXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmhhc01vdmVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5ibG9jay5zbmFwKCk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIC8vIGRlbGV0ZVxuICAgICAgICBpZiAoZS53aGljaCA9PT0gOCAmJiB0aGlzLl90aW1lbGluZS5zdGF0ZSA9PSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSkge1xuICAgICAgICAgIHRoaXMuX2RlbGV0ZUFubm90YXRpb24odGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuY3VycmVudEl0ZW0pO1xuICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmNsZWFyKCk7XG5cbiAgICAgICAgICB0aGlzLmJsb2NrLnNuYXAoKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fdGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RBbm5vdGF0aW9uO1xuIl19