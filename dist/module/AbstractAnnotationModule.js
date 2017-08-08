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
    _this2.layer = layer;
    return _this2;
  }

  (0, _createClass3.default)(PositionEditionState, [{
    key: 'clear',
    value: function clear() {
      this.currentItem = null;
      this.currentTarget = null;
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
    value: function install(block) {
      this._track = block.ui.track;
      this._timeline = block.ui.timeline;
      this._block = block;
    }
  }, {
    key: 'postInstall',
    value: function postInstall(layer) {
      this._positionEditionState = new PositionEditionState(this._timeline, layer);
      this._labelEditionState = new LabelEditionState(this._timeline, layer);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(block) {
      this._track.remove(this._layer);
    }
  }, {
    key: 'render',
    value: function render() {
      this._layer.render();
      this._layer.update();
    }
  }, {
    key: 'setTrack',
    value: function setTrack(trackConfig) {
      this._layer.data = trackConfig.markers || [];
      this.render();
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
            if (this._timeline.state === this._positionEditionState) this._positionEditionState.clear();

            this._timeline.state = this._labelEditionState;

            var clearLabelEdition = function clearLabelEdition(e) {
              if (_this4._labelEditionState.currentTarget !== e.target) {
                _this4._labelEditionState.updateLabel();
                _this4._timeline.state = null;

                _this4._block.createSnapshot();

                document.removeEventListener('mousedown', clearLabelEdition);
              }
            };

            document.addEventListener('mousedown', clearLabelEdition);
            return false;
          } else {
            this._createAnnotation(e.x);
            this._block.createSnapshot();
          }

          break;

        case 'mousedown':
          // maybe we wait for a dbl click so stop event propagation
          if (this._layer.hasElement(e.target) && e.target.tagName === 'DIV') return false;

          if (this._layer.hasElement(e.target)) {
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

        case 'mouseup':
          // something has probably moved... this can create dummy recordings
          // could be handled more properly
          if (this._timeline.state === this._positionEditionState) this._block.createSnapshot();

          break;

        case 'keydown':
          // delete
          if (e.which === 8 && this._timeline.state == this._positionEditionState) {
            this._deleteAnnotation(this._positionEditionState.currentItem);
            this._block.createSnapshot();

            this._positionEditionState.currentItem = null;
            this._positionEditionState.currentTarget = null;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwiTGFiZWxFZGl0aW9uU3RhdGUiLCJ0aW1lbGluZSIsImxheWVyIiwiY3VycmVudFRhcmdldCIsImUiLCJ0eXBlIiwib25EYmxDbGljayIsInNoYXBlIiwiZ2V0U2hhcGVGcm9tRE9NRWxlbWVudCIsInRhcmdldCIsIiRsYWJlbCIsInNldEF0dHJpYnV0ZSIsImZvY3VzIiwiY3VycmVudFNoYXBlIiwidmFsdWUiLCJpbm5lckhUTUwiLCJkYXR1bSIsImdldERhdHVtRnJvbURPTUVsZW1lbnQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJibHVyIiwibGFiZWwiLCJzdGF0ZXMiLCJCYXNlU3RhdGUiLCJQb3NpdGlvbkVkaXRpb25TdGF0ZSIsImN1cnJlbnRJdGVtIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsImdldEl0ZW1Gcm9tRE9NRWxlbWVudCIsImVkaXQiLCJkeCIsImR5IiwidXBkYXRlIiwiQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIiwicGFyYW1ldGVycyIsIm9wdGlvbnMiLCJfbGF5ZXIiLCJibG9jayIsIl90cmFjayIsInRyYWNrIiwiX3RpbWVsaW5lIiwiX2Jsb2NrIiwiX3Bvc2l0aW9uRWRpdGlvblN0YXRlIiwiX2xhYmVsRWRpdGlvblN0YXRlIiwicmVtb3ZlIiwicmVuZGVyIiwidHJhY2tDb25maWciLCJkYXRhIiwibWFya2VycyIsInBvc2l0aW9uIiwidGltZUNvbnRleHQiLCJ0aW1lVG9QaXhlbCIsIm9mZnNldCIsInRpbWUiLCJpbnZlcnQiLCJjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0iLCJwdXNoIiwiJGl0ZW0iLCJnZXREYXR1bUZyb21JdGVtIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiaGl0TGF5ZXJzIiwiaGFzRWxlbWVudCIsInRhZ05hbWUiLCJzdGF0ZSIsImNsZWFyIiwiY2xlYXJMYWJlbEVkaXRpb24iLCJ1cGRhdGVMYWJlbCIsImNyZWF0ZVNuYXBzaG90IiwiZG9jdW1lbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9jcmVhdGVBbm5vdGF0aW9uIiwieCIsImNsZWFyUG9zaXRpb25FZGl0aW9uIiwid2hpY2giLCJfZGVsZXRlQW5ub3RhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxFOzs7Ozs7QUFHWjs7O0lBR01DLGlCOzs7QUFDSiw2QkFBWUMsUUFBWixFQUFzQkMsS0FBdEIsRUFBNkI7QUFBQTs7QUFBQSw0SkFDckJELFFBRHFCOztBQUczQixVQUFLRSxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsVUFBS0QsS0FBTCxHQUFhQSxLQUFiO0FBSjJCO0FBSzVCOzs7O2dDQUVXRSxDLEVBQUc7QUFDYixjQUFRQSxFQUFFQyxJQUFWO0FBQ0UsYUFBSyxVQUFMO0FBQ0UsZUFBS0MsVUFBTCxDQUFnQkYsQ0FBaEI7QUFDQTtBQUhKO0FBS0Q7OzsrQkFFVUEsQyxFQUFHO0FBQ1osVUFBTUcsUUFBUSxLQUFLTCxLQUFMLENBQVdNLHNCQUFYLENBQWtDSixFQUFFSyxNQUFwQyxDQUFkO0FBQ0FGLFlBQU1HLE1BQU4sQ0FBYUMsWUFBYixDQUEwQixpQkFBMUIsRUFBNkMsSUFBN0M7QUFDQUosWUFBTUcsTUFBTixDQUFhRSxLQUFiOztBQUVBLFdBQUtULGFBQUwsR0FBcUJDLEVBQUVLLE1BQXZCO0FBQ0EsV0FBS0ksWUFBTCxHQUFvQk4sS0FBcEI7QUFDRDs7O2tDQUVhO0FBQ1osVUFBTU8sUUFBUSxLQUFLRCxZQUFMLENBQWtCSCxNQUFsQixDQUF5QkssU0FBdkM7QUFDQSxVQUFNUixRQUFRLEtBQUtMLEtBQUwsQ0FBV00sc0JBQVgsQ0FBa0MsS0FBS0wsYUFBdkMsQ0FBZDtBQUNBLFVBQU1hLFFBQVEsS0FBS2QsS0FBTCxDQUFXZSxzQkFBWCxDQUFrQyxLQUFLZCxhQUF2QyxDQUFkO0FBQ0FJLFlBQU1HLE1BQU4sQ0FBYVEsZUFBYixDQUE2QixpQkFBN0I7QUFDQVgsWUFBTUcs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NEIsY0FBWjs7QUFFRjs7QUFFRixhQUFLLFNBQUw7QUFDRTtBQUNBLGNBQUloRSxFQUFFdUUsS0FBRixLQUFZLENBQVosSUFBaUIsS0FBS3BDLFNBQUwsQ0FBZXlCLEtBQWYsSUFBd0IsS0FBS3ZCLHFCQUFsRCxFQUF5RTtBQUN2RSxpQkFBS21DLGlCQUFMLENBQXVCLEtBQUtuQyxxQkFBTCxDQUEyQmpCLFdBQWxEO0FBQ0EsaUJBQUtnQixNQUFMLENBQVk0QixjQUFaOztBQUVBLGlCQUFLM0IscUJBQUwsQ0FBMkJqQixXQUEzQixHQUF5QyxJQUF6QztBQUNBLGlCQUFLaUIscUJBQUwsQ0FBMkJ0QyxhQUEzQixHQUEyQyxJQUEzQzs7QUFFQSxtQkFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUF6RUo7O0FBNEVBLFVBQUksS0FBS29DLFNBQUwsQ0FBZXlCLEtBQWYsS0FBeUIsS0FBS3RCLGtCQUFsQyxFQUNFLE9BQU8sS0FBUDs7QUFFRixhQUFPLElBQVA7QUFDRDs7Ozs7a0JBR1lWLHdCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuXG5cbi8qKlxuICogU3RhdGUgdG8gZWRpdCB0aGUgbGFiZWxcbiAqL1xuY2xhc3MgTGFiZWxFZGl0aW9uU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIGxheWVyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVyID0gbGF5ZXI7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2RibGNsaWNrJzpcbiAgICAgICAgdGhpcy5vbkRibENsaWNrKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbkRibENsaWNrKGUpIHtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMubGF5ZXIuZ2V0U2hhcGVGcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG4gICAgc2hhcGUuJGxhYmVsLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSk7XG4gICAgc2hhcGUuJGxhYmVsLmZvY3VzKCk7XG5cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgICB0aGlzLmN1cnJlbnRTaGFwZSA9IHNoYXBlO1xuICB9XG5cbiAgdXBkYXRlTGFiZWwoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmN1cnJlbnRTaGFwZS4kbGFiZWwuaW5uZXJIVE1MO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5sYXllci5nZXRTaGFwZUZyb21ET01FbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLmxheWVyLmdldERhdHVtRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICBzaGFwZS4kbGFiZWwucmVtb3ZlQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKTtcbiAgICBzaGFwZS4kbGFiZWwuYmx1cigpO1xuXG4gICAgaWYgKGRhdHVtKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5sYWJlbChkYXR1bSwgdmFsdWUpO1xuICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTdGF0ZSB0byBlZGl0IHRoZSBwb3NpdGlvblxuICovXG5jbGFzcyBQb3NpdGlvbkVkaXRpb25TdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgbGF5ZXIpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRJdGVtID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXIgPSBsYXllcjtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuY3VycmVudEl0ZW0gPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudEl0ZW0gPSB0aGlzLmxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5sYXllci5lZGl0KHRoaXMuY3VycmVudEl0ZW0sIGUuZHgsIGUuZHksIHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgdGhpcy5sYXllci51cGRhdGUodGhpcy5jdXJyZW50SXRlbSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBYnN0cmFjdCBmb3IgZnVsbHkgZWRpdGFibGUgbW9kdWxlIHRoYXQgZGlzcGxheSBhbm5vdGF0aW9ucyBhY2Nyb2RpbmcgdG8gdGhlXG4gKiBnaXZlbiB0cmFjayBjb25maWcuXG4gKiBEZXJpdmVkIG1vZHVsZXMgc2hvdWxkIGltcGxlbWVudCB0aGUgYGluc3RhbGxgIGFuZCBgY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtYFxuICogbWV0aG9kcy5cbiAqXG4gKiBUaGUgbW9kdWxlIGRlZmluZXMgdGhlIGZvbGxvd2luZyBpbnRlcmFjdGlvbnM6XG4gKiAtIGVkaXQgdGhlIGFubm90YXRpb24gcG9zaXRpb24gKGB0aW1lYCk6IG1vdXNlIGRyYWdcbiAqIC0gZWRpdCB0aGUgYGxhYmVsYDogZG91YmxlIGNsaWNrIG9uIHRoZSBsYWJlbCB0byBlZGl0IGl0XG4gKiAtIGNyZWF0ZSBhIG5ldyBhbm5vdGF0aW9uOiBkb3VibGUgY2xpY2sgc29tZXdoZXJlIGluIHRoZSB0aW1lbGluZVxuICogLSBkZWxldGUgYSBhbm5vdGF0aW9uOiBrZXlwZXNzIHN1cHByXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogLy8gZGF0YSBmb3JtYXRcbiAqIFtcbiAqICAgeyB0aW1lOiAwLjIzMCwgbGFiZWw6ICdsYWJlbC0xJyB9LFxuICogICB7IHRpbWU6IDEuNDgwLCBsYWJlbDogJ2xhYmVsLTInIH0sXG4gKiBdXG4gKiBgYGBcbiAqL1xuY2xhc3MgQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbGF5ZXIgY29udGFpbmluZyB0aGUgYW5ub3RhdGlvbnMgY3JlYXRlZCBpbiB0aGUgaW5zdGFsbCBtZXRob2RcbiAgICAgKi9cbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogZGVyaXZlZCBjbGFzcyBzaG91ZCBzZXQgdGhlXG4gICAqXG4gICAqL1xuICBpbnN0YWxsKGJsb2NrKSB7XG4gICAgdGhpcy5fdHJhY2sgPSBibG9jay51aS50cmFjaztcbiAgICB0aGlzLl90aW1lbGluZSA9IGJsb2NrLnVpLnRpbWVsaW5lO1xuICAgIHRoaXMuX2Jsb2NrID0gYmxvY2s7XG4gIH1cblxuICBwb3N0SW5zdGFsbChsYXllcikge1xuICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlID0gbmV3IFBvc2l0aW9uRWRpdGlvblN0YXRlKHRoaXMuX3RpbWVsaW5lLCBsYXllcik7XG4gICAgdGhpcy5fbGFiZWxFZGl0aW9uU3RhdGUgPSBuZXcgTGFiZWxFZGl0aW9uU3RhdGUodGhpcy5fdGltZWxpbmUsIGxheWVyKTtcbiAgfVxuXG4gIHVuaW5zdGFsbChibG9jaykge1xuICAgIHRoaXMuX3RyYWNrLnJlbW92ZSh0aGlzLl9sYXllcik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5fbGF5ZXIucmVuZGVyKCk7XG4gICAgdGhpcy5fbGF5ZXIudXBkYXRlKCk7XG4gIH1cblxuICBzZXRUcmFjayh0cmFja0NvbmZpZykge1xuICAgIHRoaXMuX2xheWVyLmRhdGEgPSB0cmFja0NvbmZpZy5tYXJrZXJzIHx8IFtdO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfY3JlYXRlQW5ub3RhdGlvbihwb3NpdGlvbikge1xuICAgIGNvbnN0IHsgdGltZVRvUGl4ZWwsIG9mZnNldCB9ID0gdGhpcy5fdGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgdGltZSA9IHRpbWVUb1BpeGVsLmludmVydChwb3NpdGlvbikgLSBvZmZzZXQ7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLmNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bSh0aW1lKTtcblxuICAgIHRoaXMuX2xheWVyLmRhdGEucHVzaChkYXR1bSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIF9kZWxldGVBbm5vdGF0aW9uKCRpdGVtKSB7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLl9sYXllci5nZXREYXR1bUZyb21JdGVtKCRpdGVtKTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xheWVyLmRhdGEuaW5kZXhPZihkYXR1bSk7XG5cbiAgICB0aGlzLl9sYXllci5kYXRhLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2RibGNsaWNrJzpcbiAgICAgICAgaWYgKHRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpICYmIGUudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSlcbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmNsZWFyKCk7XG5cbiAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlO1xuXG4gICAgICAgICAgY29uc3QgY2xlYXJMYWJlbEVkaXRpb24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlLmN1cnJlbnRUYXJnZXQgIT09IGUudGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlLnVwZGF0ZUxhYmVsKCk7XG4gICAgICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID0gbnVsbDtcblxuICAgICAgICAgICAgICB0aGlzLl9ibG9jay5jcmVhdGVTbmFwc2hvdCgpO1xuXG4gICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyTGFiZWxFZGl0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbGVhckxhYmVsRWRpdGlvbik7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2NyZWF0ZUFubm90YXRpb24oZS54KTtcbiAgICAgICAgICB0aGlzLl9ibG9jay5jcmVhdGVTbmFwc2hvdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIC8vIG1heWJlIHdlIHdhaXQgZm9yIGEgZGJsIGNsaWNrIHNvIHN0b3AgZXZlbnQgcHJvcGFnYXRpb25cbiAgICAgICAgaWYgKHRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpICYmIGUudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5fbGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkpIHtcbiAgICAgICAgICAvLyBjbGVhciBjdXJyZW50IHRhcmdldCBhbmQgY3VycmVudCBpdGVtIG9ubHkgaWYgdGhlIHVzZXIgY2xpY2tzXG4gICAgICAgICAgLy8gc29tZXdoZXJlIGVsc2UgPT4gYWxsb3dzIGZvciBkZWxldGluZyBtYXJrZXJzXG4gICAgICAgICAgY29uc3QgY2xlYXJQb3NpdGlvbkVkaXRpb24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9sYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5jbGVhcigpO1xuICAgICAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xlYXJQb3NpdGlvbkVkaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGU7XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xlYXJQb3NpdGlvbkVkaXRpb24pO1xuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICAvLyBzb21ldGhpbmcgaGFzIHByb2JhYmx5IG1vdmVkLi4uIHRoaXMgY2FuIGNyZWF0ZSBkdW1teSByZWNvcmRpbmdzXG4gICAgICAgIC8vIGNvdWxkIGJlIGhhbmRsZWQgbW9yZSBwcm9wZXJseVxuICAgICAgICBpZiAodGhpcy5fdGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlKVxuICAgICAgICAgIHRoaXMuX2Jsb2NrLmNyZWF0ZVNuYXBzaG90KCk7XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICAvLyBkZWxldGVcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDggJiYgdGhpcy5fdGltZWxpbmUuc3RhdGUgPT0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUpIHtcbiAgICAgICAgICB0aGlzLl9kZWxldGVBbm5vdGF0aW9uKHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmN1cnJlbnRJdGVtKTtcbiAgICAgICAgICB0aGlzLl9ibG9jay5jcmVhdGVTbmFwc2hvdCgpO1xuXG4gICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuY3VycmVudEl0ZW0gPSBudWxsO1xuICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9sYWJlbEVkaXRpb25TdGF0ZSlcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZTtcbiJdfQ==