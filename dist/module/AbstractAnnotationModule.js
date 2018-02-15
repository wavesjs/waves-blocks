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
            if (this._timeline.state === this._positionEditionState) this._positionEditionState.clear();

            this._timeline.state = this._labelEditionState;

            var clearLabelEdition = function clearLabelEdition(e) {
              if (_this4._labelEditionState.currentTarget !== e.target) {
                _this4._labelEditionState.updateLabel();
                _this4._timeline.state = null;

                _this4.block.createSnapshot();

                document.removeEventListener('mousedown', clearLabelEdition);
              }
            };

            document.addEventListener('mousedown', clearLabelEdition);
            return false;
          } else {
            this._createAnnotation(e.x);
            this.block.createSnapshot();
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
          // if (hasMoved)
          //   createSnapshot()
          // else
          //   seek()

          // something has probably moved... this can create dummy recordings
          // should be handled properly
          if (this._timeline.state === this._positionEditionState) this.block.createSnapshot();

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

      if (this._timeline.state === this._labelEditionState) return false;

      return true;
    }
  }]);
  return AbstractAnnotationModule;
}(_AbstractModule3.default);

exports.default = AbstractAnnotationModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJ1aSIsIkxhYmVsRWRpdGlvblN0YXRlIiwidGltZWxpbmUiLCJsYXllciIsImN1cnJlbnRUYXJnZXQiLCJlIiwidHlwZSIsIm9uRGJsQ2xpY2siLCJzaGFwZSIsImdldFNoYXBlRnJvbURPTUVsZW1lbnQiLCJ0YXJnZXQiLCIkbGFiZWwiLCJzZXRBdHRyaWJ1dGUiLCJmb2N1cyIsImN1cnJlbnRTaGFwZSIsInZhbHVlIiwiaW5uZXJIVE1MIiwiZGF0dW0iLCJnZXREYXR1bUZyb21ET01FbGVtZW50IiwicmVtb3ZlQXR0cmlidXRlIiwiYmx1ciIsImxhYmVsIiwic3RhdGVzIiwiQmFzZVN0YXRlIiwiUG9zaXRpb25FZGl0aW9uU3RhdGUiLCJjdXJyZW50SXRlbSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJnZXRJdGVtRnJvbURPTUVsZW1lbnQiLCJlZGl0IiwiZHgiLCJkeSIsInVwZGF0ZSIsIkFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSIsInBhcmFtZXRlcnMiLCJvcHRpb25zIiwiX2xheWVyIiwiX3RpbWVsaW5lIiwiYmxvY2siLCJfcG9zaXRpb25FZGl0aW9uU3RhdGUiLCJfbGFiZWxFZGl0aW9uU3RhdGUiLCJ0cmFjayIsInJlbW92ZSIsInJlbmRlciIsImJ1ZmZlciIsIm1ldGFkYXRhIiwiZGF0YSIsIm1hcmtlcnMiLCJwb3NpdGlvbiIsInRpbWVDb250ZXh0IiwidGltZVRvUGl4ZWwiLCJvZmZzZXQiLCJ0aW1lIiwiaW52ZXJ0IiwiY3JlYXRlTmV3QW5ub3RhdGlvbkRhdHVtIiwicHVzaCIsIiRpdGVtIiwiZ2V0RGF0dW1Gcm9tSXRlbSIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImhpdExheWVycyIsImhhc0VsZW1lbnQiLCJ0YWdOYW1lIiwic3RhdGUiLCJjbGVhciIsImNsZWFyTGFiZWxFZGl0aW9uIiwidXBkYXRlTGFiZWwiLCJjcmVhdGVTbmFwc2hvdCIsImRvY3VtZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJfY3JlYXRlQW5ub3RhdGlvbiIsIngiLCJjbGVhclBvc2l0aW9uRWRpdGlvbiIsIndoaWNoIiwiX2RlbGV0ZUFubm90YXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7SUFBWUEsRTs7Ozs7O0FBR1o7OztJQUdNQyxpQjs7O0FBQ0osNkJBQVlDLFFBQVosRUFBc0JDLEtBQXRCLEVBQTZCO0FBQUE7O0FBQUEsNEpBQ3JCRCxRQURxQjs7QUFHM0IsVUFBS0UsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFVBQUtELEtBQUwsR0FBYUEsS0FBYjtBQUoyQjtBQUs1Qjs7OztnQ0FFV0UsQyxFQUFHO0FBQ2IsY0FBUUEsRUFBRUMsSUFBVjtBQUNFLGFBQUssVUFBTDtBQUNFLGVBQUtDLFVBQUwsQ0FBZ0JGLENBQWhCO0FBQ0E7QUFISjtBQUtEOzs7K0JBRVVBLEMsRUFBRztBQUNaLFVBQU1HLFFBQVEsS0FBS0wsS0FBTCxDQUFXTSxzQkFBWCxDQUFrQ0osRUFBRUssTUFBcEMsQ0FBZDtBQUNBRixZQUFNRyxNQUFOLENBQWFDLFlBQWIsQ0FBMEIsaUJBQTFCLEVBQTZDLElBQTdDO0FBQ0FKLFlBQU1HLE1BQU4sQ0FBYUUsS0FBYjs7QUFFQSxXQUFLVCxhQUFMLEdBQXFCQyxFQUFFSyxNQUF2QjtBQUNBLFdBQUtJLFlBQUwsR0FBb0JOLEtBQXBCO0FBQ0Q7OztrQ0FFYTtBQUNaLFVBQU1PLFFBQVEsS0FBS0QsWUFBTCxDQUFrQkgsTUFBbEIsQ0FBeUJLLFNBQXZDO0FBQ0EsVUFBTVIsUUFBUSxLQUFLTCxLQUFMLENBQVdNLHNCQUFYLENBQWtDLEtBQUtMLGFBQXZDLENBQWQ7QUFDQSxVQUFNYSxRQUFRLEtBQUtkLEtBQUwsQ0FBV2Usc0JBQVgsQ0FBa0MsS0FBS2QsYUFBdkMsQ0FBZDtBQUNBSSxZQUFNRyxNQUFOLENBQWFRLGVBQWIsQ0FBNkIsaUJBQTdCO0FBQ0FYLFlBQU1HLE1BQU4sQ0FBYVMsSUFBYjs7QUFFQSxVQUFJSCxLQUFKLEVBQVc7QUFDVCxhQUFLSCxZQUFMLENBQWtCTyxLQUFsQixDQUF3QkosS0FBeEIsRUFBK0JGLEtBQS9CO0FBQ0EsYUFBS1gsYUFBTCxHQUFxQixJQUFyQjtBQUNEO0FBQ0Y7OztFQXBDNkJKLEdBQUdzQixNQUFILENBQVVDLFM7O0FBdUMxQzs7Ozs7SUFHTUMsb0I7OztBQUNKLGdDQUFZdEIsUUFBWixFQUFzQkMsS0FBdEIsRUFBNkI7QUFBQTs7QUFBQSxtS0FDckJELFFBRHFCOztBQUczQixXQUFLdUIsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUtyQixhQUFMLEdBQXFCLElBQXJCO0FBQ0EsV0FBS0QsS0FBTCxHQUFhQSxLQUFiO0FBTDJCO0FBTTVCOzs7OzRCQUVPO0FBQ04sV0FBS3NCLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxXQUFLckIsYUFBTCxHQUFxQixJQUFyQjtBQUNEOzs7Z0NBRVdDLEMsRUFBRztBQUNiLGNBQVFBLEVBQUVDLElBQVY7QUFDRSxhQUFLLFdBQUw7QUFDRSxlQUFLb0IsV0FBTCxDQUFpQnJCLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLc0IsV0FBTCxDQUFpQnRCLENBQWpCO0FBQ0E7QUFOSjtBQVFEOzs7Z0NBRVdBLEMsRUFBRztBQUNiLFdBQUtELGFBQUwsR0FBcUJDLEVBQUVLLE1BQXZCO0FBQ0EsV0FBS2UsV0FBTCxHQUFtQixLQUFLdEIsS0FBTCxDQUFXeUIscUJBQVgsQ0FBaUN2QixFQUFFSyxNQUFuQyxDQUFuQjtBQUNEOzs7Z0NBRVdMLEMsRUFBRztBQUNiLFdBQUtGLEtBQUwsQ0FBVzBCLElBQVgsQ0FBZ0IsS0FBS0osV0FBckIsRUFBa0NwQixFQUFFeUIsRUFBcEMsRUFBd0N6QixFQUFFMEIsRUFBMUMsRUFBOEMsS0FBSzNCLGFBQW5EO0FBQ0EsV0FBS0QsS0FBTCxDQUFXNkIsTUFBWCxDQUFrQixLQUFLUCxXQUF2QjtBQUNEOzs7RUFqQ2dDekIsR0FBR3NCLE1BQUgsQ0FBVUMsUzs7QUFvQzdDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCTVUsd0I7OztBQUNKLG9DQUFZQyxVQUFaLEVBQXdCQyxPQUF4QixFQUFpQztBQUFBOztBQUcvQjs7O0FBSCtCLDJLQUN6QkQsVUFEeUIsRUFDYkMsT0FEYTs7QUFNL0IsV0FBS0MsTUFBTCxHQUFjLElBQWQ7QUFOK0I7QUFPaEM7O0FBRUQ7Ozs7Ozs7OzhCQUlVO0FBQ1IsV0FBS0MsU0FBTCxHQUFpQixLQUFLQyxLQUFMLENBQVd0QyxFQUFYLENBQWNFLFFBQS9CO0FBQ0Q7OztnQ0FFV0MsSyxFQUFPO0FBQ2pCLFdBQUtvQyxxQkFBTCxHQUE2QixJQUFJZixvQkFBSixDQUF5QixLQUFLYSxTQUE5QixFQUF5Q2xDLEtBQXpDLENBQTdCO0FBQ0EsV0FBS3FDLGtCQUFMLEdBQTBCLElBQUl2QyxpQkFBSixDQUFzQixLQUFLb0MsU0FBM0IsRUFBc0NsQyxLQUF0QyxDQUExQjtBQUNEOzs7Z0NBRVc7QUFDVixXQUFLbUMsS0FBTCxDQUFXdEMsRUFBWCxDQUFjeUMsS0FBZCxDQUFvQkMsTUFBcEIsQ0FBMkIsS0FBS04sTUFBaEM7QUFDRDs7OzZCQUVRO0FBQ1AsV0FBS0EsTUFBTCxDQUFZTyxNQUFaO0FBQ0EsV0FBS1AsTUFBTCxDQUFZSixNQUFaO0FBQ0Q7Ozs2QkFFUVksTSxFQUFRQyxRLEVBQVU7QUFDekIsV0FBS1QsTUFBTCxDQUFZVSxJQUFaLEdBQW1CRCxTQUFTRSxPQUFULElBQW9CLEVBQXZDO0FBQ0Q7OztzQ0FFaUJDLFEsRUFBVTtBQUFBLGtDQUNNLEtBQUtYLFNBQUwsQ0FBZVksV0FEckI7QUFBQSxVQUNsQkMsV0FEa0IseUJBQ2xCQSxXQURrQjtBQUFBLFVBQ0xDLE1BREsseUJBQ0xBLE1BREs7O0FBRTFCLFVBQU1DLE9BQU9GLFlBQVlHLE1BQVosQ0FBbUJMLFFBQW5CLElBQStCRyxNQUE1QztBQUNBLFVBQU1sQyxRQUFRLEtBQUtxQyx3QkFBTCxDQUE4QkYsSUFBOUIsQ0FBZDs7QUFFQSxXQUFLaEIsTUFBTCxDQUFZVSxJQUFaLENBQWlCUyxJQUFqQixDQUFzQnRDLEtBQXRCO0FBQ0EsV0FBSzBCLE1BQUw7QUFDRDs7O3NDQUVpQmEsSyxFQUFPO0FBQ3ZCLFVBQU12QyxRQUFRLEtBQUttQixNQUFMLENBQVlxQixnQkFBWixDQUE2QkQsS0FBN0IsQ0FBZDtBQUNBLFVBQU1FLFFBQVEsS0FBS3RCLE1BQUwsQ0FBWVUsSUFBWixDQUFpQmEsT0FBakIsQ0FBeUIxQyxLQUF6QixDQUFkOztBQUVBLFdBQUttQixNQUFMLENBQVlVLElBQVosQ0FBaUJjLE1BQWpCLENBQXdCRixLQUF4QixFQUErQixDQUEvQjtBQUNBLFdBQUtmLE1BQUw7QUFDRDs7OzRCQUVPdEMsQyxFQUFHd0QsUyxFQUFXO0FBQUE7O0FBQ3BCLGNBQVF4RCxFQUFFQyxJQUFWO0FBQ0UsYUFBSyxVQUFMO0FBQ0UsY0FBSSxLQUFLOEIsTUFBTCxDQUFZMEIsVUFBWixDQUF1QnpELEVBQUVLLE1BQXpCLEtBQW9DTCxFQUFFSyxNQUFGLENBQVNxRCxPQUFULEtBQXFCLEtBQTdELEVBQW9FO0FBQ2xFLGdCQUFJLEtBQUsxQixTQUFMLENBQWUyQixLQUFmLEtBQXlCLEtBQUt6QixxQkFBbEMsRUFDRSxLQUFLQSxxQkFBTCxDQUEyQjBCLEtBQTNCOztBQUVGLGlCQUFLNUIsU0FBTCxDQUFlMkIsS0FBZixHQUF1QixLQUFLeEIsa0JBQTVCOztBQUVBLGdCQUFNMEIsb0JBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBQzdELENBQUQsRUFBTztBQUMvQixrQkFBSSxPQUFLbUMsa0JBQUwsQ0FBd0JwQyxhQUF4QixLQUEwQ0MsRUFBRUssTUFBaEQsRUFBd0Q7QUFDdEQsdUJBQUs4QixrQkFBTCxDQUF3QjJCLFdBQXhCO0FBQ0EsdUJBQUs5QixTQUFMLENBQWUyQixLQUFmLEdBQXVCLElBQXZCOztBQUVBLHVCQUFLMUIsS0FBTCxDQUFXOEIsY0FBWDs7QUFFQUMseUJBQVNDLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDSixpQkFBMUM7QUFDRDtBQUNGLGFBVEQ7O0FBV0FHLHFCQUFTRSxnQkFBVCxDQUEwQixXQUExQixFQUF1Q0wsaUJBQXZDO0FBQ0EsbUJBQU8sS0FBUDtBQUNELFdBbkJELE1BbUJPO0FBQ0wsaUJBQUtNLGlCQUFMLENBQXVCbkUsRUFBRW9FLENBQXpCO0FBQ0EsaUJBQUtuQyxLQUFMLENBQVc4QixjQUFYO0FBQ0Q7O0FBRUQ7O0FBRUYsYUFBSyxXQUFMO0FBQ0U7QUFDQSxjQUFJLEtBQUtoQyxNQUFMLENBQVkwQixVQUFaLENBQXVCekQsRUFBRUssTUFBekIsS0FBb0NMLEVBQUVLLE1BQUYsQ0FBU3FELE9BQVQsS0FBcUIsS0FBN0QsRUFDRSxPQUFPLEtBQVA7O0FBRUYsY0FBSSxLQUFLM0IsTUFBTCxDQUFZMEIsVUFBWixDQUF1QnpELEVBQUVLLE1BQXpCLENBQUosRUFBc0M7QUFDcEM7QUFDQTtBQUNBLGdCQUFNZ0UsdUJBQXVCLFNBQXZCQSxvQkFBdUIsQ0FBQ3JFLENBQUQsRUFBTztBQUNsQyxrQkFBSSxDQUFDLE9BQUsrQixNQUFMLENBQVkwQixVQUFaLENBQXVCekQsRUFBRUssTUFBekIsQ0FBTCxFQUF1QztBQUNyQyx1QkFBSzZCLHFCQUFMLENBQTJCMEIsS0FBM0I7QUFDQSx1QkFBSzVCLFNBQUwsQ0FBZTJCLEtBQWYsR0FBdUIsSUFBdkI7O0FBRUFLLHlCQUFTQyxtQkFBVCxDQUE2QixXQUE3QixFQUEwQ0ksb0JBQTFDO0FBQ0Q7QUFDRixhQVBEOztBQVNBLGlCQUFLckMsU0FBTCxDQUFlMkIsS0FBZixHQUF1QixLQUFLekIscUJBQTVCO0FBQ0E4QixxQkFBU0UsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUNHLG9CQUF2Qzs7QUFFQSxtQkFBTyxLQUFQO0FBQ0Q7O0FBRUQ7O0FBRUYsYUFBSyxTQUFMO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQUksS0FBS3JDLFNBQUwsQ0FBZTJCLEtBQWYsS0FBeUIsS0FBS3pCLHFCQUFsQyxFQUNFLEtBQUtELEtBQUwsQ0FBVzhCLGNBQVg7O0FBRUY7O0FBRUYsYUFBSyxTQUFMO0FBQ0U7QUFDQSxjQUFJL0QsRUFBRXNFLEtBQUYsS0FBWSxDQUFaLElBQWlCLEtBQUt0QyxTQUFMLENBQWUyQixLQUFmLElBQXdCLEtBQUt6QixxQkFBbEQsRUFBeUU7QUFDdkUsaUJBQUtxQyxpQkFBTCxDQUF1QixLQUFLckMscUJBQUwsQ0FBMkJkLFdBQWxEO0FBQ0EsaUJBQUthLEtBQUwsQ0FBVzhCLGNBQVg7O0FBRUEsaUJBQUs3QixxQkFBTCxDQUEyQmQsV0FBM0IsR0FBeUMsSUFBekM7QUFDQSxpQkFBS2MscUJBQUwsQ0FBMkJuQyxhQUEzQixHQUEyQyxJQUEzQzs7QUFFQSxtQkFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUE5RUo7O0FBaUZBLFVBQUksS0FBS2lDLFNBQUwsQ0FBZTJCLEtBQWYsS0FBeUIsS0FBS3hCLGtCQUFsQyxFQUNFLE9BQU8sS0FBUDs7QUFFRixhQUFPLElBQVA7QUFDRDs7Ozs7a0JBR1lQLHdCIiwiZmlsZSI6IkFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcbmltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcblxuXG4vKipcbiAqIFN0YXRlIHRvIGVkaXQgdGhlIGxhYmVsXG4gKi9cbmNsYXNzIExhYmVsRWRpdGlvblN0YXRlIGV4dGVuZHMgdWkuc3RhdGVzLkJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBsYXllcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgdGhpcy5sYXllciA9IGxheWVyO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdkYmxjbGljayc6XG4gICAgICAgIHRoaXMub25EYmxDbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25EYmxDbGljayhlKSB7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLmxheWVyLmdldFNoYXBlRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuICAgIHNoYXBlLiRsYWJlbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHNoYXBlLiRsYWJlbC5mb2N1cygpO1xuXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50U2hhcGUgPSBzaGFwZTtcbiAgfVxuXG4gIHVwZGF0ZUxhYmVsKCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jdXJyZW50U2hhcGUuJGxhYmVsLmlubmVySFRNTDtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMubGF5ZXIuZ2V0U2hhcGVGcm9tRE9NRWxlbWVudCh0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5sYXllci5nZXREYXR1bUZyb21ET01FbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgc2hhcGUuJGxhYmVsLnJlbW92ZUF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJyk7XG4gICAgc2hhcGUuJGxhYmVsLmJsdXIoKTtcblxuICAgIGlmIChkYXR1bSkge1xuICAgICAgdGhpcy5jdXJyZW50U2hhcGUubGFiZWwoZGF0dW0sIHZhbHVlKTtcbiAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU3RhdGUgdG8gZWRpdCB0aGUgcG9zaXRpb25cbiAqL1xuY2xhc3MgUG9zaXRpb25FZGl0aW9uU3RhdGUgZXh0ZW5kcyB1aS5zdGF0ZXMuQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIGxheWVyKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50SXRlbSA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVyID0gbGF5ZXI7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmN1cnJlbnRJdGVtID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgICB0aGlzLmN1cnJlbnRJdGVtID0gdGhpcy5sYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMubGF5ZXIuZWRpdCh0aGlzLmN1cnJlbnRJdGVtLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIHRoaXMubGF5ZXIudXBkYXRlKHRoaXMuY3VycmVudEl0ZW0pO1xuICB9XG59XG5cbi8qKlxuICogQWJzdHJhY3QgZm9yIGZ1bGx5IGVkaXRhYmxlIG1vZHVsZSB0aGF0IGRpc3BsYXkgYW5ub3RhdGlvbnMgYWNjcm9kaW5nIHRvIHRoZVxuICogZ2l2ZW4gdHJhY2sgY29uZmlnLlxuICogRGVyaXZlZCBtb2R1bGVzIHNob3VsZCBpbXBsZW1lbnQgdGhlIGBpbnN0YWxsYCBhbmQgYGNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bWBcbiAqIG1ldGhvZHMuXG4gKlxuICogVGhlIG1vZHVsZSBkZWZpbmVzIHRoZSBmb2xsb3dpbmcgaW50ZXJhY3Rpb25zOlxuICogLSBlZGl0IHRoZSBhbm5vdGF0aW9uIHBvc2l0aW9uIChgdGltZWApOiBtb3VzZSBkcmFnXG4gKiAtIGVkaXQgdGhlIGBsYWJlbGA6IGRvdWJsZSBjbGljayBvbiB0aGUgbGFiZWwgdG8gZWRpdCBpdFxuICogLSBjcmVhdGUgYSBuZXcgYW5ub3RhdGlvbjogZG91YmxlIGNsaWNrIHNvbWV3aGVyZSBpbiB0aGUgdGltZWxpbmVcbiAqIC0gZGVsZXRlIGEgYW5ub3RhdGlvbjoga2V5cGVzcyBzdXBwclxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIC8vIGRhdGEgZm9ybWF0XG4gKiBbXG4gKiAgIHsgdGltZTogMC4yMzAsIGxhYmVsOiAnbGFiZWwtMScgfSxcbiAqICAgeyB0aW1lOiAxLjQ4MCwgbGFiZWw6ICdsYWJlbC0yJyB9LFxuICogXVxuICogYGBgXG4gKi9cbmNsYXNzIEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycywgb3B0aW9ucykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGxheWVyIGNvbnRhaW5pbmcgdGhlIGFubm90YXRpb25zIGNyZWF0ZWQgaW4gdGhlIGluc3RhbGwgbWV0aG9kXG4gICAgICovXG4gICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIGRlcml2ZWQgY2xhc3Mgc2hvdWQgc2V0IHRoZVxuICAgKlxuICAgKi9cbiAgaW5zdGFsbCgpIHtcbiAgICB0aGlzLl90aW1lbGluZSA9IHRoaXMuYmxvY2sudWkudGltZWxpbmU7XG4gIH1cblxuICBwb3N0SW5zdGFsbChsYXllcikge1xuICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlID0gbmV3IFBvc2l0aW9uRWRpdGlvblN0YXRlKHRoaXMuX3RpbWVsaW5lLCBsYXllcik7XG4gICAgdGhpcy5fbGFiZWxFZGl0aW9uU3RhdGUgPSBuZXcgTGFiZWxFZGl0aW9uU3RhdGUodGhpcy5fdGltZWxpbmUsIGxheWVyKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICB0aGlzLmJsb2NrLnVpLnRyYWNrLnJlbW92ZSh0aGlzLl9sYXllcik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5fbGF5ZXIucmVuZGVyKCk7XG4gICAgdGhpcy5fbGF5ZXIudXBkYXRlKCk7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy5fbGF5ZXIuZGF0YSA9IG1ldGFkYXRhLm1hcmtlcnMgfHwgW107XG4gIH1cblxuICBfY3JlYXRlQW5ub3RhdGlvbihwb3NpdGlvbikge1xuICAgIGNvbnN0IHsgdGltZVRvUGl4ZWwsIG9mZnNldCB9ID0gdGhpcy5fdGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgdGltZSA9IHRpbWVUb1BpeGVsLmludmVydChwb3NpdGlvbikgLSBvZmZzZXQ7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLmNyZWF0ZU5ld0Fubm90YXRpb25EYXR1bSh0aW1lKTtcblxuICAgIHRoaXMuX2xheWVyLmRhdGEucHVzaChkYXR1bSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIF9kZWxldGVBbm5vdGF0aW9uKCRpdGVtKSB7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLl9sYXllci5nZXREYXR1bUZyb21JdGVtKCRpdGVtKTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xheWVyLmRhdGEuaW5kZXhPZihkYXR1bSk7XG5cbiAgICB0aGlzLl9sYXllci5kYXRhLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2RibGNsaWNrJzpcbiAgICAgICAgaWYgKHRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpICYmIGUudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSlcbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmNsZWFyKCk7XG5cbiAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlO1xuXG4gICAgICAgICAgY29uc3QgY2xlYXJMYWJlbEVkaXRpb24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlLmN1cnJlbnRUYXJnZXQgIT09IGUudGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlLnVwZGF0ZUxhYmVsKCk7XG4gICAgICAgICAgICAgIHRoaXMuX3RpbWVsaW5lLnN0YXRlID0gbnVsbDtcblxuICAgICAgICAgICAgICB0aGlzLmJsb2NrLmNyZWF0ZVNuYXBzaG90KCk7XG5cbiAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xlYXJMYWJlbEVkaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyTGFiZWxFZGl0aW9uKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY3JlYXRlQW5ub3RhdGlvbihlLngpO1xuICAgICAgICAgIHRoaXMuYmxvY2suY3JlYXRlU25hcHNob3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICAvLyBtYXliZSB3ZSB3YWl0IGZvciBhIGRibCBjbGljayBzbyBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uXG4gICAgICAgIGlmICh0aGlzLl9sYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSAmJiBlLnRhcmdldC50YWdOYW1lID09PSAnRElWJylcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpKSB7XG4gICAgICAgICAgLy8gY2xlYXIgY3VycmVudCB0YXJnZXQgYW5kIGN1cnJlbnQgaXRlbSBvbmx5IGlmIHRoZSB1c2VyIGNsaWNrc1xuICAgICAgICAgIC8vIHNvbWV3aGVyZSBlbHNlID0+IGFsbG93cyBmb3IgZGVsZXRpbmcgbWFya2Vyc1xuICAgICAgICAgIGNvbnN0IGNsZWFyUG9zaXRpb25FZGl0aW9uID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuY2xlYXIoKTtcbiAgICAgICAgICAgICAgdGhpcy5fdGltZWxpbmUuc3RhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyUG9zaXRpb25FZGl0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl90aW1lbGluZS5zdGF0ZSA9IHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlO1xuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsZWFyUG9zaXRpb25FZGl0aW9uKTtcblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgLy8gaWYgKGhhc01vdmVkKVxuICAgICAgICAvLyAgIGNyZWF0ZVNuYXBzaG90KClcbiAgICAgICAgLy8gZWxzZVxuICAgICAgICAvLyAgIHNlZWsoKVxuXG4gICAgICAgIC8vIHNvbWV0aGluZyBoYXMgcHJvYmFibHkgbW92ZWQuLi4gdGhpcyBjYW4gY3JlYXRlIGR1bW15IHJlY29yZGluZ3NcbiAgICAgICAgLy8gc2hvdWxkIGJlIGhhbmRsZWQgcHJvcGVybHlcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVsaW5lLnN0YXRlID09PSB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZSlcbiAgICAgICAgICB0aGlzLmJsb2NrLmNyZWF0ZVNuYXBzaG90KCk7XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICAvLyBkZWxldGVcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDggJiYgdGhpcy5fdGltZWxpbmUuc3RhdGUgPT0gdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUpIHtcbiAgICAgICAgICB0aGlzLl9kZWxldGVBbm5vdGF0aW9uKHRoaXMuX3Bvc2l0aW9uRWRpdGlvblN0YXRlLmN1cnJlbnRJdGVtKTtcbiAgICAgICAgICB0aGlzLmJsb2NrLmNyZWF0ZVNuYXBzaG90KCk7XG5cbiAgICAgICAgICB0aGlzLl9wb3NpdGlvbkVkaXRpb25TdGF0ZS5jdXJyZW50SXRlbSA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fcG9zaXRpb25FZGl0aW9uU3RhdGUuY3VycmVudFRhcmdldCA9IG51bGw7XG5cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fdGltZWxpbmUuc3RhdGUgPT09IHRoaXMuX2xhYmVsRWRpdGlvblN0YXRlKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlO1xuIl19