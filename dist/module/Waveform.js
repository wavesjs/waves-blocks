'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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

var _wavesUi = require('waves-ui');

var ui = _interopRequireWildcard(_wavesUi);

var _AbstractModule2 = require('../core/AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @private */
var definitions = {
  color: {
    type: 'string',
    default: 'steelblue',
    constant: true,
    metas: {
      desc: 'color of the waveform'
    }
  },
  channels: {
    type: 'any',
    default: [0],
    constant: true,
    metas: {
      desc: 'array of the channels to display (defaults to [0] - left channel)'
    }
  }
};

/**
 * Module that display the waveform of the audio buffer.
 *
 * @param {Object} options - Override default parameters
 * @param {String} [options.color='steelblue'] - Color of the waveform
 * @param {Array|String} [options.channels=[0]] - Array describing the channels to displays,
 *  'all' to display all the channels. By default display only the left channel.
 */

var Waveform = function (_AbstractModule) {
  (0, _inherits3.default)(Waveform, _AbstractModule);

  function Waveform(options) {
    (0, _classCallCheck3.default)(this, Waveform);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Waveform.__proto__ || (0, _getPrototypeOf2.default)(Waveform)).call(this, definitions, options));

    _this._waveforms = new _set2.default();
    return _this;
  }

  (0, _createClass3.default)(Waveform, [{
    key: 'install',
    value: function install() {}
  }, {
    key: 'uninstall',
    value: function uninstall() {
      this._clear();
    }
  }, {
    key: 'setTrack',
    value: function setTrack(buffer, metadatas) {
      var _this2 = this;

      this._clear();

      var channels = this.params.get('channels');
      var _block$ui = this.block.ui,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;


      if (channels === 'all') {
        var numChannels = buffer.numberOfChannels;
        channels = [];

        for (var i = 0; i < numChannels; i++) {
          channels.push(i);
        }
      }

      channels.forEach(function (channel, index) {
        var data = null;

        // prevent DOMException, such as:
        // Failed to execute 'getChannelData' on 'AudioBuffer': channel
        // index (1) exceeds number of channels (1)
        try {
          data = buffer.getChannelData(channel);
        } catch (err) {};

        if (data !== null) {
          var layerHeight = _this2.block.height / channels.length;

          var waveform = new ui.core.Layer('entity', data, {
            height: layerHeight,
            top: layerHeight * index,
            yDomain: [-1, 1],
            zIndex: _this2.zIndex
          });

          waveform.setTimeContext(timeContext);
          waveform.configureShape(ui.shapes.Waveform, {}, {
            color: _this2.params.get('color'),
            sampleRate: buffer.sampleRate
          });

          track.add(waveform);

          _this2._waveforms.add(waveform);
        }
      });
    }
  }, {
    key: '_clear',
    value: function _clear() {
      var track = this.block.ui.track;

      this._waveforms.forEach(function (waveform) {
        return track.remove(waveform);
      });
      this._waveforms.clear();
    }
  }]);
  return Waveform;
}(_AbstractModule3.default);

exports.default = Waveform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJkZWZpbml0aW9ucyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsImNoYW5uZWxzIiwiV2F2ZWZvcm0iLCJvcHRpb25zIiwiX3dhdmVmb3JtcyIsIl9jbGVhciIsImJ1ZmZlciIsIm1ldGFkYXRhcyIsInBhcmFtcyIsImdldCIsImJsb2NrIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsIm51bUNoYW5uZWxzIiwibnVtYmVyT2ZDaGFubmVscyIsImkiLCJwdXNoIiwiZm9yRWFjaCIsImNoYW5uZWwiLCJpbmRleCIsImRhdGEiLCJnZXRDaGFubmVsRGF0YSIsImVyciIsImxheWVySGVpZ2h0IiwiaGVpZ2h0IiwibGVuZ3RoIiwid2F2ZWZvcm0iLCJjb3JlIiwiTGF5ZXIiLCJ0b3AiLCJ5RG9tYWluIiwiekluZGV4Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsInNhbXBsZVJhdGUiLCJhZGQiLCJyZW1vdmUiLCJjbGVhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFNQyxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sUUFERDtBQUVMQyxhQUFTLFdBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSkYsR0FEVztBQVNsQkMsWUFBVTtBQUNSTCxVQUFNLEtBREU7QUFFUkMsYUFBUyxDQUFDLENBQUQsQ0FGRDtBQUdSQyxjQUFVLElBSEY7QUFJUkMsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFKQztBQVRRLENBQXBCOztBQW1CQTs7Ozs7Ozs7O0lBUU1FLFE7OztBQUNKLG9CQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsMElBQ2JULFdBRGEsRUFDQVMsT0FEQTs7QUFHbkIsVUFBS0MsVUFBTCxHQUFrQixtQkFBbEI7QUFIbUI7QUFJcEI7Ozs7OEJBRVMsQ0FBRTs7O2dDQUVBO0FBQ1YsV0FBS0MsTUFBTDtBQUNEOzs7NkJBRVFDLE0sRUFBUUMsUyxFQUFXO0FBQUE7O0FBQzFCLFdBQUtGLE1BQUw7O0FBRUEsVUFBSUosV0FBVyxLQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsVUFBaEIsQ0FBZjtBQUgwQixzQkFJSyxLQUFLQyxLQUFMLENBQVdqQixFQUpoQjtBQUFBLFVBSWxCa0IsS0FKa0IsYUFJbEJBLEtBSmtCO0FBQUEsVUFJWEMsV0FKVyxhQUlYQSxXQUpXOzs7QUFNMUIsVUFBSVgsYUFBYSxLQUFqQixFQUF3QjtBQUN0QixZQUFNWSxjQUFjUCxPQUFPUSxnQkFBM0I7QUFDQWIsbUJBQVcsRUFBWDs7QUFFQSxhQUFLLElBQUljLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsV0FBcEIsRUFBaUNFLEdBQWpDO0FBQ0VkLG1CQUFTZSxJQUFULENBQWNELENBQWQ7QUFERjtBQUVEOztBQUVEZCxlQUFTZ0IsT0FBVCxDQUFpQixVQUFDQyxPQUFELEVBQVVDLEtBQVYsRUFBb0I7QUFDbkMsWUFBSUMsT0FBTyxJQUFYOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDRkEsaUJBQU9kLE9BQU9lLGNBQVAsQ0FBc0JILE9BQXRCLENBQVA7QUFDRCxTQUZELENBRUUsT0FBTUksR0FBTixFQUFXLENBQUU7O0FBRWYsWUFBSUYsU0FBUyxJQUFiLEVBQW1CO0FBQ2pCLGNBQU1HLGNBQWMsT0FBS2IsS0FBTCxDQUFXYyxNQUFYLEdBQW9CdkIsU0FBU3dCLE1BQWpEOztBQUVBLGNBQU1DLFdBQVcsSUFBSWpDLEdBQUdrQyxJQUFILENBQVFDLEtBQVosQ0FBa0IsUUFBbEIsRUFBNEJSLElBQTVCLEVBQWtDO0FBQ2pESSxvQkFBUUQsV0FEeUM7QUFFakRNLGlCQUFLTixjQUFjSixLQUY4QjtBQUdqRFcscUJBQVMsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBSHdDO0FBSWpEQyxvQkFBUSxPQUFLQTtBQUpvQyxXQUFsQyxDQUFqQjs7QUFPQUwsbUJBQVNNLGNBQVQsQ0FBd0JwQixXQUF4QjtBQUNBYyxtQkFBU08sY0FBVCxDQUF3QnhDLEdBQUd5QyxNQUFILENBQVVoQyxRQUFsQyxFQUE0QyxFQUE1QyxFQUFnRDtBQUM5Q1AsbUJBQU8sT0FBS2EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBRHVDO0FBRTlDMEIsd0JBQVk3QixPQUFPNkI7QUFGMkIsV0FBaEQ7O0FBS0F4QixnQkFBTXlCLEdBQU4sQ0FBVVYsUUFBVjs7QUFFQSxpQkFBS3RCLFVBQUwsQ0FBZ0JnQyxHQUFoQixDQUFvQlYsUUFBcEI7QUFDRDtBQUNGLE9BOUJEO0FBK0JEOzs7NkJBRVE7QUFBQSxVQUNDZixLQURELEdBQ1csS0FBS0QsS0FBTCxDQUFXakIsRUFEdEIsQ0FDQ2tCLEtBREQ7O0FBRVAsV0FBS1AsVUFBTCxDQUFnQmEsT0FBaEIsQ0FBd0I7QUFBQSxlQUFZTixNQUFNMEIsTUFBTixDQUFhWCxRQUFiLENBQVo7QUFBQSxPQUF4QjtBQUNBLFdBQUt0QixVQUFMLENBQWdCa0MsS0FBaEI7QUFDRDs7Ozs7a0JBR1lwQyxRIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3N0ZWVsYmx1ZScsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgd2F2ZWZvcm0nXG4gICAgfSxcbiAgfSxcbiAgY2hhbm5lbHM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBbMF0sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdhcnJheSBvZiB0aGUgY2hhbm5lbHMgdG8gZGlzcGxheSAoZGVmYXVsdHMgdG8gWzBdIC0gbGVmdCBjaGFubmVsKSdcbiAgICB9LFxuICB9LFxufTtcblxuLyoqXG4gKiBNb2R1bGUgdGhhdCBkaXNwbGF5IHRoZSB3YXZlZm9ybSBvZiB0aGUgYXVkaW8gYnVmZmVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J3N0ZWVsYmx1ZSddIC0gQ29sb3Igb2YgdGhlIHdhdmVmb3JtXG4gKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gW29wdGlvbnMuY2hhbm5lbHM9WzBdXSAtIEFycmF5IGRlc2NyaWJpbmcgdGhlIGNoYW5uZWxzIHRvIGRpc3BsYXlzLFxuICogICdhbGwnIHRvIGRpc3BsYXkgYWxsIHRoZSBjaGFubmVscy4gQnkgZGVmYXVsdCBkaXNwbGF5IG9ubHkgdGhlIGxlZnQgY2hhbm5lbC5cbiAqL1xuY2xhc3MgV2F2ZWZvcm0gZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl93YXZlZm9ybXMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBpbnN0YWxsKCkge31cblxuICB1bmluc3RhbGwoKSB7XG4gICAgdGhpcy5fY2xlYXIoKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGFzKSB7XG4gICAgdGhpcy5fY2xlYXIoKTtcblxuICAgIGxldCBjaGFubmVscyA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbHMnKTtcbiAgICBjb25zdCB7IHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIGlmIChjaGFubmVscyA9PT0gJ2FsbCcpIHtcbiAgICAgIGNvbnN0IG51bUNoYW5uZWxzID0gYnVmZmVyLm51bWJlck9mQ2hhbm5lbHM7XG4gICAgICBjaGFubmVscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUNoYW5uZWxzOyBpKyspXG4gICAgICAgIGNoYW5uZWxzLnB1c2goaSk7XG4gICAgfVxuXG4gICAgY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBkYXRhID0gbnVsbDtcblxuICAgICAgLy8gcHJldmVudCBET01FeGNlcHRpb24sIHN1Y2ggYXM6XG4gICAgICAvLyBGYWlsZWQgdG8gZXhlY3V0ZSAnZ2V0Q2hhbm5lbERhdGEnIG9uICdBdWRpb0J1ZmZlcic6IGNoYW5uZWxcbiAgICAgIC8vIGluZGV4ICgxKSBleGNlZWRzIG51bWJlciBvZiBjaGFubmVscyAoMSlcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2hhbm5lbCk7XG4gICAgICB9IGNhdGNoKGVycikge307XG5cbiAgICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gdGhpcy5ibG9jay5oZWlnaHQgLyBjaGFubmVscy5sZW5ndGg7XG5cbiAgICAgICAgY29uc3Qgd2F2ZWZvcm0gPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgZGF0YSwge1xuICAgICAgICAgIGhlaWdodDogbGF5ZXJIZWlnaHQsXG4gICAgICAgICAgdG9wOiBsYXllckhlaWdodCAqIGluZGV4LFxuICAgICAgICAgIHlEb21haW46IFstMSwgMV0sXG4gICAgICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2F2ZWZvcm0uc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgICAgICB3YXZlZm9ybS5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuV2F2ZWZvcm0sIHt9LCB7XG4gICAgICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmdldCgnY29sb3InKSxcbiAgICAgICAgICBzYW1wbGVSYXRlOiBidWZmZXIuc2FtcGxlUmF0ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdHJhY2suYWRkKHdhdmVmb3JtKTtcblxuICAgICAgICB0aGlzLl93YXZlZm9ybXMuYWRkKHdhdmVmb3JtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9jbGVhcigpIHtcbiAgICBjb25zdCB7IHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuICAgIHRoaXMuX3dhdmVmb3Jtcy5mb3JFYWNoKHdhdmVmb3JtID0+IHRyYWNrLnJlbW92ZSh3YXZlZm9ybSkpO1xuICAgIHRoaXMuX3dhdmVmb3Jtcy5jbGVhcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdhdmVmb3JtO1xuIl19