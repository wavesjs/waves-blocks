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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJkZWZpbml0aW9ucyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsImNoYW5uZWxzIiwiV2F2ZWZvcm0iLCJvcHRpb25zIiwiX3dhdmVmb3JtcyIsIl9jbGVhciIsImJ1ZmZlciIsIm1ldGFkYXRhcyIsInBhcmFtcyIsImdldCIsImJsb2NrIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsIm51bUNoYW5uZWxzIiwibnVtYmVyT2ZDaGFubmVscyIsImkiLCJwdXNoIiwiZm9yRWFjaCIsImNoYW5uZWwiLCJpbmRleCIsImRhdGEiLCJnZXRDaGFubmVsRGF0YSIsImVyciIsImxheWVySGVpZ2h0IiwiaGVpZ2h0IiwibGVuZ3RoIiwid2F2ZWZvcm0iLCJjb3JlIiwiTGF5ZXIiLCJ0b3AiLCJ5RG9tYWluIiwiekluZGV4Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsInNhbXBsZVJhdGUiLCJhZGQiLCJyZW1vdmUiLCJjbGVhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLFFBREQ7QUFFTEMsYUFBUyxXQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUpGLEdBRFc7QUFTbEJDLFlBQVU7QUFDUkwsVUFBTSxLQURFO0FBRVJDLGFBQVMsQ0FBQyxDQUFELENBRkQ7QUFHUkMsY0FBVSxJQUhGO0FBSVJDLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSkM7QUFUUSxDQUFwQjs7QUFtQkE7Ozs7Ozs7OztJQVFNRSxROzs7QUFDSixvQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBLDBJQUNiVCxXQURhLEVBQ0FTLE9BREE7O0FBR25CLFVBQUtDLFVBQUwsR0FBa0IsbUJBQWxCO0FBSG1CO0FBSXBCOzs7OzhCQUVTLENBQUU7OztnQ0FFQTtBQUNWLFdBQUtDLE1BQUw7QUFDRDs7OzZCQUVRQyxNLEVBQVFDLFMsRUFBVztBQUFBOztBQUMxQixXQUFLRixNQUFMOztBQUVBLFVBQUlKLFdBQVcsS0FBS08sTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQWY7QUFIMEIsc0JBSUssS0FBS0MsS0FBTCxDQUFXakIsRUFKaEI7QUFBQSxVQUlsQmtCLEtBSmtCLGFBSWxCQSxLQUprQjtBQUFBLFVBSVhDLFdBSlcsYUFJWEEsV0FKVzs7O0FBTTFCLFVBQUlYLGFBQWEsS0FBakIsRUFBd0I7QUFDdEIsWUFBTVksY0FBY1AsT0FBT1EsZ0JBQTNCO0FBQ0FiLG1CQUFXLEVBQVg7O0FBRUEsYUFBSyxJQUFJYyxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLFdBQXBCLEVBQWlDRSxHQUFqQztBQUNFZCxtQkFBU2UsSUFBVCxDQUFjRCxDQUFkO0FBREY7QUFFRDs7QUFFRGQsZUFBU2dCLE9BQVQsQ0FBaUIsVUFBQ0MsT0FBRCxFQUFVQyxLQUFWLEVBQW9CO0FBQ25DLFlBQUlDLE9BQU8sSUFBWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0ZBLGlCQUFPZCxPQUFPZSxjQUFQLENBQXNCSCxPQUF0QixDQUFQO0FBQ0QsU0FGRCxDQUVFLE9BQU1JLEdBQU4sRUFBVyxDQUFFOztBQUVmLFlBQUlGLFNBQVMsSUFBYixFQUFtQjtBQUNqQixjQUFNRyxjQUFjLE9BQUtiLEtBQUwsQ0FBV2MsTUFBWCxHQUFvQnZCLFNBQVN3QixNQUFqRDs7QUFFQSxjQUFNQyxXQUFXLElBQUlqQyxHQUFHa0MsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFFBQWxCLEVBQTRCUixJQUE1QixFQUFrQztBQUNqREksb0JBQVFELFdBRHlDO0FBRWpETSxpQkFBS04sY0FBY0osS0FGOEI7QUFHakRXLHFCQUFTLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQUh3QztBQUlqREMsb0JBQVEsT0FBS0E7QUFKb0MsV0FBbEMsQ0FBakI7O0FBT0FMLG1CQUFTTSxjQUFULENBQXdCcEIsV0FBeEI7QUFDQWMsbUJBQVNPLGNBQVQsQ0FBd0J4QyxHQUFHeUMsTUFBSCxDQUFVaEMsUUFBbEMsRUFBNEMsRUFBNUMsRUFBZ0Q7QUFDOUNQLG1CQUFPLE9BQUthLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUR1QztBQUU5QzBCLHdCQUFZN0IsT0FBTzZCO0FBRjJCLFdBQWhEOztBQUtBeEIsZ0JBQU15QixHQUFOLENBQVVWLFFBQVY7O0FBRUEsaUJBQUt0QixVQUFMLENBQWdCZ0MsR0FBaEIsQ0FBb0JWLFFBQXBCO0FBQ0Q7QUFDRixPQTlCRDtBQStCRDs7OzZCQUVRO0FBQUEsVUFDQ2YsS0FERCxHQUNXLEtBQUtELEtBQUwsQ0FBV2pCLEVBRHRCLENBQ0NrQixLQUREOztBQUVQLFdBQUtQLFVBQUwsQ0FBZ0JhLE9BQWhCLENBQXdCO0FBQUEsZUFBWU4sTUFBTTBCLE1BQU4sQ0FBYVgsUUFBYixDQUFaO0FBQUEsT0FBeEI7QUFDQSxXQUFLdEIsVUFBTCxDQUFnQmtDLEtBQWhCO0FBQ0Q7Ozs7O2tCQUdZcEMsUSIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnc3RlZWxibHVlJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2NvbG9yIG9mIHRoZSB3YXZlZm9ybSdcbiAgICB9LFxuICB9LFxuICBjaGFubmVsczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IFswXSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2FycmF5IG9mIHRoZSBjaGFubmVscyB0byBkaXNwbGF5IChkZWZhdWx0cyB0byBbMF0gLSBsZWZ0IGNoYW5uZWwpJ1xuICAgIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGRpc3BsYXkgdGhlIHdhdmVmb3JtIG9mIHRoZSBhdWRpbyBidWZmZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nc3RlZWxibHVlJ10gLSBDb2xvciBvZiB0aGUgd2F2ZWZvcm1cbiAqIEBwYXJhbSB7QXJyYXl8U3RyaW5nfSBbb3B0aW9ucy5jaGFubmVscz1bMF1dIC0gQXJyYXkgZGVzY3JpYmluZyB0aGUgY2hhbm5lbHMgdG8gZGlzcGxheXMsXG4gKiAgJ2FsbCcgdG8gZGlzcGxheSBhbGwgdGhlIGNoYW5uZWxzLiBCeSBkZWZhdWx0IGRpc3BsYXkgb25seSB0aGUgbGVmdCBjaGFubmVsLlxuICovXG5jbGFzcyBXYXZlZm9ybSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3dhdmVmb3JtcyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIGluc3RhbGwoKSB7fVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICB0aGlzLl9jbGVhcigpO1xuICB9XG5cbiAgc2V0VHJhY2soYnVmZmVyLCBtZXRhZGF0YXMpIHtcbiAgICB0aGlzLl9jbGVhcigpO1xuXG4gICAgbGV0IGNoYW5uZWxzID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVscycpO1xuICAgIGNvbnN0IHsgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgaWYgKGNoYW5uZWxzID09PSAnYWxsJykge1xuICAgICAgY29uc3QgbnVtQ2hhbm5lbHMgPSBidWZmZXIubnVtYmVyT2ZDaGFubmVscztcbiAgICAgIGNoYW5uZWxzID0gW107XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ2hhbm5lbHM7IGkrKylcbiAgICAgICAgY2hhbm5lbHMucHVzaChpKTtcbiAgICB9XG5cbiAgICBjaGFubmVscy5mb3JFYWNoKChjaGFubmVsLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGRhdGEgPSBudWxsO1xuXG4gICAgICAvLyBwcmV2ZW50IERPTUV4Y2VwdGlvbiwgc3VjaCBhczpcbiAgICAgIC8vIEZhaWxlZCB0byBleGVjdXRlICdnZXRDaGFubmVsRGF0YScgb24gJ0F1ZGlvQnVmZmVyJzogY2hhbm5lbFxuICAgICAgLy8gaW5kZXggKDEpIGV4Y2VlZHMgbnVtYmVyIG9mIGNoYW5uZWxzICgxKVxuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YShjaGFubmVsKTtcbiAgICAgIH0gY2F0Y2goZXJyKSB7fTtcblxuICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbGF5ZXJIZWlnaHQgPSB0aGlzLmJsb2NrLmhlaWdodCAvIGNoYW5uZWxzLmxlbmd0aDtcblxuICAgICAgICBjb25zdCB3YXZlZm9ybSA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBkYXRhLCB7XG4gICAgICAgICAgaGVpZ2h0OiBsYXllckhlaWdodCxcbiAgICAgICAgICB0b3A6IGxheWVySGVpZ2h0ICogaW5kZXgsXG4gICAgICAgICAgeURvbWFpbjogWy0xLCAxXSxcbiAgICAgICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgICAgICB9KTtcblxuICAgICAgICB3YXZlZm9ybS5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgICAgIHdhdmVmb3JtLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5XYXZlZm9ybSwge30sIHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpLFxuICAgICAgICAgIHNhbXBsZVJhdGU6IGJ1ZmZlci5zYW1wbGVSYXRlLFxuICAgICAgICB9KTtcblxuICAgICAgICB0cmFjay5hZGQod2F2ZWZvcm0pO1xuXG4gICAgICAgIHRoaXMuX3dhdmVmb3Jtcy5hZGQod2F2ZWZvcm0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2NsZWFyKCkge1xuICAgIGNvbnN0IHsgdHJhY2sgfSA9IHRoaXMuYmxvY2sudWk7XG4gICAgdGhpcy5fd2F2ZWZvcm1zLmZvckVhY2god2F2ZWZvcm0gPT4gdHJhY2sucmVtb3ZlKHdhdmVmb3JtKSk7XG4gICAgdGhpcy5fd2F2ZWZvcm1zLmNsZWFyKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2F2ZWZvcm07XG4iXX0=