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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJ1aSIsIkxhYmVsRWRpdGlvblN0YXRlIiwidGltZWxpbmUiLCJsYXllciIsImN1cnJlbnRUYXJnZXQiLCJlIiwidHlwZSIsIm9uRGJsQ2xpY2siLCJzaGFwZSIsImdldFNoYXBlRnJvbURPTUVsZW1lbnQiLCJ0YXJnZXQiLCIkbGFiZWwiLCJzZXRBdHRyaWJ1dGUiLCJmb2N1cyIsImN1cnJlbnRTaGFwZSIsInZhbHVlIiwiaW5uZXJIVE1MIiwiZGF0dW0iLCJnZXREYXR1bUZyb21ET01FbGVtZW50IiwicmVtb3ZlQXR0cmlidXRlIiwiYmx1ciIsImxhYmVsIiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiUG9zaXRpb25FZGl0aW9uU3RhdGUiLCJjdXJyZW50SXRlbSIsImhhc01vdmVkIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsImdldEl0ZW1Gcm9tRE9NRWxlbWVudCIsImVkaXQiLCJkeCIsImR5IiwidXBkYXRlIiwiQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIiwicGFyYW1ldGVycyIsIm9wdGlvbnMiLCJfbGF5ZXIiLCJfdGltZWxpbmUiLCJibG9jayIsIl9wb3NpdGlvbkVkaXRpb25TdGF0ZSIsIl9sYWJlbEVkaXRpb25TdGF0ZSIsInRyYWNrIiwicmVtb3ZlIiwicmVuZGVyIiwiYnVmZmVyIiwibWV0YWRhdGEiLCJkYXRhIiwibWFya2VycyIsInBvc2l0aW9uIiwidGltZUNvbnRleHQiLCJ0aW1lVG9QaXhlbCIsIm9mZnNldCIsInRpbWUiLCJpbnZlcnQiLCJjcmVhdGVOZXdBbm5vdGF0aW9uRGF0dW0iLCJwdXNoIiwiJGl0ZW0iLCJnZXREYXR1bUZyb21JdGVtIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiaGl0TGF5ZXJzIiwiaGFzRWxlbWVudCIsInRhZ05hbWUiLCIkdGFyZ2V0Iiwic3RhdGUiLCJjbGVhciIsInByZXZDb250ZW50IiwidGV4dENvbnRlbnQiLCJjbGVhckxhYmVsRWRpdGlvbiIsInVwZGF0ZUxhYmVsIiwic25hcCIsImRvY3VtZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJfY3JlYXRlQW5ub3RhdGlvbiIsIngiLCJjbGVhclBvc2l0aW9uRWRpdGlvbiIsIndoaWNoIiwiX2RlbGV0ZUFubm90YXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7SUFBWUEsRTs7Ozs7O0FBR1o7OztJQUdNQyxpQjs7O0FBQ0osNkJBQVlDLFFBQVosRUFBc0JDLEtBQXRCLEVBQTZCO0FBQUE7O0FBQUEsNEpBQ3JCRCxRQURxQjs7QUFHM0IsVUFBS0UsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFVBQUtELEtBQUwsR0FBYUEsS0FBYjtBQUoyQjtBQUs1Qjs7OztnQ0FFV0UsQyxFQUFHO0FBQ2IsY0FBUUEsRUFBRUMsSUFBVjtBQUNFLGFBQUssVUFBTDtBQUNFLGVBQUtDLFVBQUwsQ0FBZ0JGLENBQWhCO0FBQ0E7QUFISjtBQUtEOzs7K0JBRVVBLEMsRUFBRztBQUNaLFVBQU1HLFFBQVEsS0FBS0wsS0FBTCxDQUFXTSxzQkFBWCxDQUFrQ0osRUFBRUssTUFBcEMsQ0FBZDtBQUNBRixZQUFNRyxNQUFOLENBQWFDLFlBQWIsQ0FBMEIsaUJBQTFCLEVBQTZDLElBQTdDO0FBQ0FKLFlBQU1HLE1BQU4sQ0FBYUUsS0FBYjs7QUFFQSxXQUFLVCxhQUFMLEdBQXFCQyxFQUFFSyxNQUF2QjtBQUNBLFdBQUtJLFlBQUwsR0FBb0JOLEtBQXBCO0FBQ0Q7OztrQ0FFYTtBQUNaLFVBQU1PLFFBQVEsS0FBS0QsWUFBTCxDQUFrQkgsTUFBbEIsQ0FBeUJLLFNBQXZDO0FBQ0EsVUFBTVIsUUFBUSxLQUFLTCxLQUFMLENBQVdNLHNCQUFYLENBQWtDLEtBQUtMLGFBQXZDLENBQWQ7QUFDQSxVQUFNYSxRQUFRLEtBQUtkLEtBQUwsQ0FBV2Usc0JBQVgsQ0FBa0MsS0FBS2QsYUFBdkMsQ0FBZDtBQUNBSSxZ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QUFDQWlDLHFCQUFTRSxnQkFBVCxDQUEwQixXQUExQixFQUF1Q0csb0JBQXZDOztBQUVBLG1CQUFPLEtBQVA7QUFDRDs7QUFFRDs7QUFFRixhQUFLLFdBQUw7QUFDRSxjQUFJLEtBQUt4QyxTQUFMLENBQWU0QixLQUFmLEtBQXlCLEtBQUsxQixxQkFBbEMsRUFDRSxLQUFLQSxxQkFBTCxDQUEyQmQsUUFBM0IsR0FBc0MsSUFBdEM7QUFDRjs7QUFFRixhQUFLLFNBQUw7QUFDRSxjQUNFLEtBQUtZLFNBQUwsQ0FBZTRCLEtBQWYsS0FBeUIsS0FBSzFCLHFCQUE5QixJQUNBLEtBQUtBLHFCQUFMLENBQTJCZCxRQUEzQixLQUF3QyxJQUYxQyxFQUdFO0FBQ0EsaUJBQUtjLHFCQUFMLENBQTJCZCxRQUEzQixHQUFzQyxLQUF0QztBQUNBLGlCQUFLYSxLQUFMLENBQVdpQyxJQUFYO0FBQ0Q7O0FBRUQ7O0FBRUYsYUFBSyxTQUFMO0FBQ0U7QUFDQSxjQUFJbkUsRUFBRTBFLEtBQUYsS0FBWSxDQUFaLElBQWlCLEtBQUt6QyxTQUFMLENBQWU0QixLQUFmLElBQXdCLEtBQUsxQixxQkFBbEQsRUFBeUU7QUFDdkUsaUJBQUt3QyxpQkFBTCxDQUF1QixLQUFLeEMscUJBQUwsQ0FBMkJmLFdBQWxEO0FBQ0EsaUJBQUtlLHFCQUFMLENBQTJCMkIsS0FBM0I7O0FBRUEsaUJBQUs1QixLQUFMLENBQVdpQyxJQUFYO0FBQ0EsbUJBQU8sS0FBUDtBQUNEOztBQUVEO0FBbkZKOztBQXNGQSxVQUFJLEtBQUtsQyxTQUFMLENBQWU0QixLQUFmLEtBQXlCLEtBQUt6QixrQkFBbEMsRUFDRSxPQUFPLEtBQVA7O0FBRUYsYUFBTyxJQUFQO0FBQ0Q7Ozs7O2tCQUdZUCx3QiIsImZpbGUiOiJBYnN0cmFjdEFubm90YXRpb25Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5cblxuLyoqXG4gKiBTdGF0ZSB0byBlZGl0IHRoZSBsYWJlbFxuICovXG5jbGFzcyBMYWJlbEVkaXRpb25TdGF0ZSBleHRlbmRzIHVpLnN0YXRlcy5CYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgbGF5ZXIpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXIgPSBsYXllcjtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnZGJsY2xpY2snOlxuICAgICAgICB0aGlzLm9uRGJsQ2xpY2soZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uRGJsQ2xpY2soZSkge1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5sYXllci5nZXRTaGFwZUZyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcbiAgICBzaGFwZS4kbGFiZWwuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCB0cnVlKTtcbiAgICBzaGFwZS4kbGFiZWwuZm9jdXMoKTtcblxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudFNoYXBlID0gc2hhcGU7XG4gIH1cblxuICB1cGRhdGVMYWJlbCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY3VycmVudFNoYXBlLiRsYWJlbC5pbm5lckhUTUw7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLmxheWVyLmdldFNoYXBlRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICBjb25zdCBkYXR1bSA9IHRoaXMubGF5ZXIuZ2V0RGF0dW1Gcm9tRE9NRWxlbWVudCh0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIHNoYXBlLiRsYWJlbC5yZW1vdmVBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpO1xuICAgIHNoYXBlLiRsYWJlbC5ibHVyKCk7XG5cbiAgICBpZiAoZGF0dW0pIHtcbiAgICAgIHRoaXMuY3VycmVudFNoYXBlLmxhYmVsKGRhdHVtLCB2YWx1ZSk7XG4gICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFN0YXRlIHRvIGVkaXQgdGhlIHBvc2l0aW9uXG4gKi9cbmNsYXNzIFBvc2l0aW9uRWRpdGlvblN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBsYXllcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudEl0ZW0gPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgdGhpcy5oYXNNb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMubGF5ZXIgPSBsYXllcjtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuY3VycmVudEl0ZW0gPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgdGhpcy5oYXNNb3ZlZCA9IGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgICB0aGlzLmN1cnJlbnRJdGVtID0gdGhpcy5sYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMubGF5ZXIuZWRpdCh0aGlzLmN1cnJlbnRJdGVtLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIHRoaXMubGF5ZXIudXBkYXRlKHRoaXMuY3VycmVudEl0ZW0pO1xuICB9XG59XG5cbi8qKlxuICogQWJzdHJhY3QgZm9yIGZ1bGx5IGVkaXRhYmxlIG1vZHVsZSB0aGF0IGRpc3BsYXkgYW5ub3RhdGlvbnMgYWNjcm9kaW5nIHRvIHRoZVxuICogZ2l2ZW4gdHJhY2sgY29uZmlnLlxuICogRGVyaXZlZCBtb2R1bGVzIHNob3VsZCBpbXBsZW1lbnQgdGhlIGBpbnN0YWxsYCBhbmQgYGNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bWBcbiAqIG1ldGhvZHMuXG4gKlxuICogVGhlIG1vZHVsZSBkZWZpbmVzIHRoZSBmb2xsb3dpbmcgaW50ZXJhY3Rpb25zOlxuICogLSBlZGl0IHRoZSBhbm5vdGF0aW9uIHBvc2l0aW9uIChgdGltZWApOiBtb3VzZSBkcmFnXG4gKiAtIGVkaXQgdGhlIGBsYWJlbGA6IGRvdWJsZSBjbGljayBvbiB0aGUgbGFiZWwgdG8gZWRpdCBpdFxuICogLSBjcmVhdGUgYSBuZXcgYW5ub3RhdGlvbjogZG91YmxlIGNsaWNrIHNvbWV3aGVyZSBpbiB0aGUgdGltZWxpbmVcbiAqIC0gZGVsZXRlIGEgYW5ub3RhdGlvbjoga2V5cGVzcyBzdXBwclxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIC8vIGRhdGEgZm9ybWF0XG4gKiBbXG4gKiAgIHsgdGltZTogMC4yMzAsIGxhYmVsOiAnbGFiZWwtMScgfSxcbiAqICAgeyB0aW1lOiAxLjQ4MCwgbGFiZWw6ICdsYWJlbC0yJyB9LFxuICogXVxuICogYGBgXG4gKi9cbmNsYXNzIEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycywgb3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGxheWVyIGNvbnRhaW5pbmcgdGhlIGFubm90YXRpb25zIGNyZWF0ZWQgaW4gdGhlIGluc3RhbGwgbWV0aG9kXG4gICAgICovXG4gICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIGRlcml2ZWQgY2xhc3Mgc2hvdWQgc2V0IHRoZVxuICAgKlxuICAgKi9cbiAgaW5zdGFsbCgpIHtcbiAgICB0aGlzLl90aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG4gIH1cblxuICBwb3N0SW5zdGFsbChsYXllcikge1xuICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlID0gbmV3IFBvc2l0aW9uRWRpdGlvblN0YXRlKHRoaXMuX3RpbWVsaW5lLCBsYXllcik7XG4gICAgdGhpcy5fbGFiZWxFZGl0aW9uU3RhdGUgPSBuZXcgTGFiZWxFZGl0aW9uU3RhdGUodGhpcy5fdGltZWxpbmUsIGxheWVyKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICB0aGlzLmJsb2NrLnVpLnRyYWNrLnJlbW92ZSh0aGlzLl9sYXllcik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5fbGF5ZXIucmVuZGVyKCk7XG4gICAgdGhpcy5fbGF5ZXIudXBkYXRlKCk7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy5fbGF5ZXIuZGF0YSA9IG1ldGFkYXRhLm1hcmtlcnMgfHwgW107XG4gIH1cblxuICBfY3JlYXRlQW5ub3RhdGlvbihwb3NpdGlvbikge1xuICAgIGNvbnN0IHsgdGltZVRvUGl4ZWwsIG9mZnNldCB9ID0gdGhpcy5fdGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgdGltZSA9IHRpbWVUb1BpeGVsLmludmVydChwb3NpdGlvbikgLSBvZmZzZXQ7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLmNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bSh0aW1lKTtcblxuICAgIHRoaXMuX2xheWVyLmRhdGEucHVzaChkYXR1bSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIF9kZWxldGVBbm5vdGF0aW9uKCRpdGVtKSB7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLl9sYXllci5nZXREYXR1bUZyb21JdGVtKCRpdGVtKTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xheWVyLmRhdGEuaW5kZXhPZihkYXR1bSk7XG5cbiAgICB0aGlzLl9sYXllci5kYXRhLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2RibGNsaWNrJzpcbiAgICAgICAgaWYgKHRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpICYmIGUudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKSB7XG4gICAgICAgICAgY29uc3QgJHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgICAgICAgaWYgKHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSlcbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmNsZWFyKCk7XG5cbiAgICAgICAgICBjb25zdCBwcmV2Q29udGVudCA9ICR0YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICAgICAgdGhpcy5fdGltZWxpbmUuc3RhdGUgPSB0aGlzLl9sYWJlbEVkaXRpb25TdGF0ZTtcblxuICAgICAgICAgIGNvbnN0IGNsZWFyTGFiZWxFZGl0aW9uID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYWJlbEVkaXRpb25TdGF0ZS5jdXJyZW50VGFyZ2V0ICE9PSBlLnRhcmdldCkge1xuICAgICAgICAgICAgICB0aGlzLl9sYWJlbEVkaXRpb25TdGF0ZS51cGRhdGVMYWJlbCgpO1xuICAgICAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgaWYgKCR0YXJnZXQudGV4dENvbnRlbnQgIT09IHByZXZDb250ZW50KVxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2suc25hcCgpO1xuXG4gICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyTGFiZWxFZGl0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbGVhckxhYmVsRWRpdGlvbik7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2NyZWF0ZUFubm90YXRpb24oZS54KTtcbiAgICAgICAgICB0aGlzLmJsb2NrLnNuYXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICAvLyBtYXliZSB3ZSB3YWl0IGZvciBhIGRibCBjbGljayBzbyBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uXG4gICAgICAgIGlmICh0aGlzLl9sYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSAmJiBlLnRhcmdldC50YWdOYW1lID09PSAnRElWJylcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpICYmIGUudGFyZ2V0LnRhZ05hbWUgIT09ICdESVYnKSB7XG4gICAgICAgICAgLy8gY2xlYXIgY3VycmVudCB0YXJnZXQgYW5kIGN1cnJlbnQgaXRlbSBvbmx5IGlmIHRoZSB1c2VyIGNsaWNrc1xuICAgICAgICAgIC8vIHNvbWV3aGVyZSBlbHNlID0+IGFsbG93cyBmb3IgZGVsZXRpbmcgbWFya2Vyc1xuICAgICAgICAgIGNvbnN0IGNsZWFyUG9zaXRpb25FZGl0aW9uID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuY2xlYXIoKTtcbiAgICAgICAgICAgICAgdGhpcy5fdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyUG9zaXRpb25FZGl0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlO1xuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyUG9zaXRpb25FZGl0aW9uKTtcblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICBpZiAodGhpcy5fdGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlKVxuICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmhhc01vdmVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5fdGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlICYmXG4gICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuaGFzTW92ZWQgPT09IHRydWVcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuaGFzTW92ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmJsb2NrLnNuYXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgLy8gZGVsZXRlXG4gICAgICAgIGlmIChlLndoaWNoID09PSA4ICYmIHRoaXMuX3RpbWVsaW5lLnN0YXRlID09IHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fZGVsZXRlQW5ub3RhdGlvbih0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5jdXJyZW50SXRlbSk7XG4gICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuY2xlYXIoKTtcblxuICAgICAgICAgIHRoaXMuYmxvY2suc25hcCgpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl90aW1lbGluZS5zdGF0ZSA9PT0gdGhpcy5fbGFiZWxFZGl0aW9uU3RhdGUpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBYnN0cmFjdEFubm90YXRpb25Nb2R1bGU7XG4iXX0=