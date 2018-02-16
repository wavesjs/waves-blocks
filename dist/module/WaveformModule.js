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

var WaveformModule = function (_AbstractModule) {
  (0, _inherits3.default)(WaveformModule, _AbstractModule);

  function WaveformModule(options) {
    (0, _classCallCheck3.default)(this, WaveformModule);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WaveformModule.__proto__ || (0, _getPrototypeOf2.default)(WaveformModule)).call(this, definitions, options));

    _this._waveforms = new _set2.default();
    return _this;
  }

  (0, _createClass3.default)(WaveformModule, [{
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
  return WaveformModule;
}(_AbstractModule3.default);

exports.default = WaveformModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJkZWZpbml0aW9ucyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsImNoYW5uZWxzIiwiV2F2ZWZvcm1Nb2R1bGUiLCJvcHRpb25zIiwiX3dhdmVmb3JtcyIsIl9jbGVhciIsImJ1ZmZlciIsIm1ldGFkYXRhcyIsInBhcmFtcyIsImdldCIsImJsb2NrIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsIm51bUNoYW5uZWxzIiwibnVtYmVyT2ZDaGFubmVscyIsImkiLCJwdXNoIiwiZm9yRWFjaCIsImNoYW5uZWwiLCJpbmRleCIsImRhdGEiLCJnZXRDaGFubmVsRGF0YSIsImVyciIsImxheWVySGVpZ2h0IiwiaGVpZ2h0IiwibGVuZ3RoIiwid2F2ZWZvcm0iLCJjb3JlIiwiTGF5ZXIiLCJ0b3AiLCJ5RG9tYWluIiwiekluZGV4Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIldhdmVmb3JtIiwic2FtcGxlUmF0ZSIsImFkZCIsInJlbW92ZSIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7Ozs7Ozs7QUFFQSxJQUFNQyxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sUUFERDtBQUVMQyxhQUFTLFdBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSkYsR0FEVztBQVNsQkMsWUFBVTtBQUNSTCxVQUFNLEtBREU7QUFFUkMsYUFBUyxDQUFDLENBQUQsQ0FGRDtBQUdSQyxjQUFVLElBSEY7QUFJUkMsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFKQztBQVRRLENBQXBCOztBQW1CQTs7Ozs7Ozs7O0lBUU1FLGM7OztBQUNKLDBCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsc0pBQ2JULFdBRGEsRUFDQVMsT0FEQTs7QUFHbkIsVUFBS0MsVUFBTCxHQUFrQixtQkFBbEI7QUFIbUI7QUFJcEI7Ozs7OEJBRVMsQ0FBRTs7O2dDQUVBO0FBQ1YsV0FBS0MsTUFBTDtBQUNEOzs7NkJBRVFDLE0sRUFBUUMsUyxFQUFXO0FBQUE7O0FBQzFCLFdBQUtGLE1BQUw7O0FBRUEsVUFBSUosV0FBVyxLQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsVUFBaEIsQ0FBZjtBQUgwQixzQkFJSyxLQUFLQyxLQUFMLENBQVdqQixFQUpoQjtBQUFBLFVBSWxCa0IsS0FKa0IsYUFJbEJBLEtBSmtCO0FBQUEsVUFJWEMsV0FKVyxhQUlYQSxXQUpXOzs7QUFNMUIsVUFBSVgsYUFBYSxLQUFqQixFQUF3QjtBQUN0QixZQUFNWSxjQUFjUCxPQUFPUSxnQkFBM0I7QUFDQWIsbUJBQVcsRUFBWDs7QUFFQSxhQUFLLElBQUljLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsV0FBcEIsRUFBaUNFLEdBQWpDO0FBQ0VkLG1CQUFTZSxJQUFULENBQWNELENBQWQ7QUFERjtBQUVEOztBQUVEZCxlQUFTZ0IsT0FBVCxDQUFpQixVQUFDQyxPQUFELEVBQVVDLEtBQVYsRUFBb0I7QUFDbkMsWUFBSUMsT0FBTyxJQUFYOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDRkEsaUJBQU9kLE9BQU9lLGNBQVAsQ0FBc0JILE9BQXRCLENBQVA7QUFDRCxTQUZELENBRUUsT0FBTUksR0FBTixFQUFXLENBQUU7O0FBRWYsWUFBSUYsU0FBUyxJQUFiLEVBQW1CO0FBQ2pCLGNBQU1HLGNBQWMsT0FBS2IsS0FBTCxDQUFXYyxNQUFYLEdBQW9CdkIsU0FBU3dCLE1BQWpEOztBQUVBLGNBQU1DLFdBQVcsSUFBSWpDLEdBQUdrQyxJQUFILENBQVFDLEtBQVosQ0FBa0IsUUFBbEIsRUFBNEJSLElBQTVCLEVBQWtDO0FBQ2pESSxvQkFBUUQsV0FEeUM7QUFFakRNLGlCQUFLTixjQUFjSixLQUY4QjtBQUdqRFcscUJBQVMsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBSHdDO0FBSWpEQyxvQkFBUSxPQUFLQTtBQUpvQyxXQUFsQyxDQUFqQjs7QUFPQUwsbUJBQVNNLGNBQVQsQ0FBd0JwQixXQUF4QjtBQUNBYyxtQkFBU08sY0FBVCxDQUF3QnhDLEdBQUd5QyxNQUFILENBQVVDLFFBQWxDLEVBQTRDLEVBQTVDLEVBQWdEO0FBQzlDeEMsbUJBQU8sT0FBS2EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBRHVDO0FBRTlDMkIsd0JBQVk5QixPQUFPOEI7QUFGMkIsV0FBaEQ7O0FBS0F6QixnQkFBTTBCLEdBQU4sQ0FBVVgsUUFBVjs7QUFFQSxpQkFBS3RCLFVBQUwsQ0FBZ0JpQyxHQUFoQixDQUFvQlgsUUFBcEI7QUFDRDtBQUNGLE9BOUJEO0FBK0JEOzs7NkJBRVE7QUFBQSxVQUNDZixLQURELEdBQ1csS0FBS0QsS0FBTCxDQUFXakIsRUFEdEIsQ0FDQ2tCLEtBREQ7O0FBRVAsV0FBS1AsVUFBTCxDQUFnQmEsT0FBaEIsQ0FBd0I7QUFBQSxlQUFZTixNQUFNMkIsTUFBTixDQUFhWixRQUFiLENBQVo7QUFBQSxPQUF4QjtBQUNBLFdBQUt0QixVQUFMLENBQWdCbUMsS0FBaEI7QUFDRDs7Ozs7a0JBR1lyQyxjIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdzdGVlbGJsdWUnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIHdhdmVmb3JtJ1xuICAgIH0sXG4gIH0sXG4gIGNoYW5uZWxzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogWzBdLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnYXJyYXkgb2YgdGhlIGNoYW5uZWxzIHRvIGRpc3BsYXkgKGRlZmF1bHRzIHRvIFswXSAtIGxlZnQgY2hhbm5lbCknXG4gICAgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgZGlzcGxheSB0aGUgd2F2ZWZvcm0gb2YgdGhlIGF1ZGlvIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdzdGVlbGJsdWUnXSAtIENvbG9yIG9mIHRoZSB3YXZlZm9ybVxuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IFtvcHRpb25zLmNoYW5uZWxzPVswXV0gLSBBcnJheSBkZXNjcmliaW5nIHRoZSBjaGFubmVscyB0byBkaXNwbGF5cyxcbiAqICAnYWxsJyB0byBkaXNwbGF5IGFsbCB0aGUgY2hhbm5lbHMuIEJ5IGRlZmF1bHQgZGlzcGxheSBvbmx5IHRoZSBsZWZ0IGNoYW5uZWwuXG4gKi9cbmNsYXNzIFdhdmVmb3JtTW9kdWxlIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm1zID0gbmV3IFNldCgpO1xuICB9XG5cbiAgaW5zdGFsbCgpIHt9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIHRoaXMuX2NsZWFyKCk7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhcykge1xuICAgIHRoaXMuX2NsZWFyKCk7XG5cbiAgICBsZXQgY2hhbm5lbHMgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWxzJyk7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICBpZiAoY2hhbm5lbHMgPT09ICdhbGwnKSB7XG4gICAgICBjb25zdCBudW1DaGFubmVscyA9IGJ1ZmZlci5udW1iZXJPZkNoYW5uZWxzO1xuICAgICAgY2hhbm5lbHMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1DaGFubmVsczsgaSsrKVxuICAgICAgICBjaGFubmVscy5wdXNoKGkpO1xuICAgIH1cblxuICAgIGNoYW5uZWxzLmZvckVhY2goKGNoYW5uZWwsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgZGF0YSA9IG51bGw7XG5cbiAgICAgIC8vIHByZXZlbnQgRE9NRXhjZXB0aW9uLCBzdWNoIGFzOlxuICAgICAgLy8gRmFpbGVkIHRvIGV4ZWN1dGUgJ2dldENoYW5uZWxEYXRhJyBvbiAnQXVkaW9CdWZmZXInOiBjaGFubmVsXG4gICAgICAvLyBpbmRleCAoMSkgZXhjZWVkcyBudW1iZXIgb2YgY2hhbm5lbHMgKDEpXG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuICAgICAgfSBjYXRjaChlcnIpIHt9O1xuXG4gICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBsYXllckhlaWdodCA9IHRoaXMuYmxvY2suaGVpZ2h0IC8gY2hhbm5lbHMubGVuZ3RoO1xuXG4gICAgICAgIGNvbnN0IHdhdmVmb3JtID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2VudGl0eScsIGRhdGEsIHtcbiAgICAgICAgICBoZWlnaHQ6IGxheWVySGVpZ2h0LFxuICAgICAgICAgIHRvcDogbGF5ZXJIZWlnaHQgKiBpbmRleCxcbiAgICAgICAgICB5RG9tYWluOiBbLTEsIDFdLFxuICAgICAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdhdmVmb3JtLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICAgICAgd2F2ZWZvcm0uY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLldhdmVmb3JtLCB7fSwge1xuICAgICAgICAgIGNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyksXG4gICAgICAgICAgc2FtcGxlUmF0ZTogYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRyYWNrLmFkZCh3YXZlZm9ybSk7XG5cbiAgICAgICAgdGhpcy5fd2F2ZWZvcm1zLmFkZCh3YXZlZm9ybSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfY2xlYXIoKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcbiAgICB0aGlzLl93YXZlZm9ybXMuZm9yRWFjaCh3YXZlZm9ybSA9PiB0cmFjay5yZW1vdmUod2F2ZWZvcm0pKTtcbiAgICB0aGlzLl93YXZlZm9ybXMuY2xlYXIoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXZlZm9ybU1vZHVsZTtcbiJdfQ==