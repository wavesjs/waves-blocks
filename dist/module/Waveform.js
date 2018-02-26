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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhdmVmb3JtLmpzIl0sIm5hbWVzIjpbInVpIiwiZGVmaW5pdGlvbnMiLCJjb2xvciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJjaGFubmVscyIsIldhdmVmb3JtIiwib3B0aW9ucyIsIl93YXZlZm9ybXMiLCJfY2xlYXIiLCJidWZmZXIiLCJtZXRhZGF0YXMiLCJwYXJhbXMiLCJnZXQiLCJibG9jayIsInRyYWNrIiwidGltZUNvbnRleHQiLCJudW1DaGFubmVscyIsIm51bWJlck9mQ2hhbm5lbHMiLCJpIiwicHVzaCIsImZvckVhY2giLCJjaGFubmVsIiwiaW5kZXgiLCJkYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJlcnIiLCJsYXllckhlaWdodCIsImhlaWdodCIsImxlbmd0aCIsIndhdmVmb3JtIiwiY29yZSIsIkxheWVyIiwidG9wIiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJzYW1wbGVSYXRlIiwiYWRkIiwicmVtb3ZlIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxFOztBQUNaOzs7Ozs7OztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxRQUREO0FBRUxDLGFBQVMsV0FGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFKRixHQURXO0FBU2xCQyxZQUFVO0FBQ1JMLFVBQU0sS0FERTtBQUVSQyxhQUFTLENBQUMsQ0FBRCxDQUZEO0FBR1JDLGNBQVUsSUFIRjtBQUlSQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUpDO0FBVFEsQ0FBcEI7O0FBbUJBOzs7Ozs7Ozs7SUFRTUUsUTs7O0FBQ0osb0JBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQSwwSUFDYlQsV0FEYSxFQUNBUyxPQURBOztBQUduQixVQUFLQyxVQUFMLEdBQWtCLG1CQUFsQjtBQUhtQjtBQUlwQjs7Ozs4QkFFUyxDQUFFOzs7Z0NBRUE7QUFDVixXQUFLQyxNQUFMO0FBQ0Q7Ozs2QkFFUUMsTSxFQUFRQyxTLEVBQVc7QUFBQTs7QUFDMUIsV0FBS0YsTUFBTDs7QUFFQSxVQUFJSixXQUFXLEtBQUtPLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixDQUFmO0FBSDBCLHNCQUlLLEtBQUtDLEtBQUwsQ0FBV2pCLEVBSmhCO0FBQUEsVUFJbEJrQixLQUprQixhQUlsQkEsS0FKa0I7QUFBQSxVQUlYQyxXQUpXLGFBSVhBLFdBSlc7OztBQU0xQixVQUFJWCxhQUFhLEtBQWpCLEVBQXdCO0FBQ3RCLFlBQU1ZLGNBQWNQLE9BQU9RLGdCQUEzQjtBQUNBYixtQkFBVyxFQUFYOztBQUVBLGFBQUssSUFBSWMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixXQUFwQixFQUFpQ0UsR0FBakM7QUFDRWQsbUJBQVNlLElBQVQsQ0FBY0QsQ0FBZDtBQURGO0FBRUQ7O0FBRURkLGVBQVNnQixPQUFULENBQWlCLFVBQUNDLE9BQUQsRUFBVUMsS0FBVixFQUFvQjtBQUNuQyxZQUFJQyxPQUFPLElBQVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNGQSxpQkFBT2QsT0FBT2UsY0FBUCxDQUFzQkgsT0FBdEIsQ0FBUDtBQUNELFNBRkQsQ0FFRSxPQUFNSSxHQUFOLEVBQVcsQ0FBRTs7QUFFZixZQUFJRixTQUFTLElBQWIsRUFBbUI7QUFDakIsY0FBTUcsY0FBYyxPQUFLYixLQUFMLENBQVdjLE1BQVgsR0FBb0J2QixTQUFTd0IsTUFBakQ7O0FBRUEsY0FBTUMsV0FBVyxJQUFJakMsR0FBR2tDLElBQUgsQ0FBUUMsS0FBWixDQUFrQixRQUFsQixFQUE0QlIsSUFBNUIsRUFBa0M7QUFDakRJLG9CQUFRRCxXQUR5QztBQUVqRE0saUJBQUtOLGNBQWNKLEtBRjhCO0FBR2pEVyxxQkFBUyxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUwsQ0FId0M7QUFJakRDLG9CQUFRLE9BQUtBO0FBSm9DLFdBQWxDLENBQWpCOztBQU9BTCxtQkFBU00sY0FBVCxDQUF3QnBCLFdBQXhCO0FBQ0FjLG1CQUFTTyxjQUFULENBQXdCeEMsR0FBR3lDLE1BQUgsQ0FBVWhDLFFBQWxDLEVBQTRDLEVBQTVDLEVBQWdEO0FBQzlDUCxtQkFBTyxPQUFLYSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FEdUM7QUFFOUMwQix3QkFBWTdCLE9BQU82QjtBQUYyQixXQUFoRDs7QUFLQXhCLGdCQUFNeUIsR0FBTixDQUFVVixRQUFWOztBQUVBLGlCQUFLdEIsVUFBTCxDQUFnQmdDLEdBQWhCLENBQW9CVixRQUFwQjtBQUNEO0FBQ0YsT0E5QkQ7QUErQkQ7Ozs2QkFFUTtBQUFBLFVBQ0NmLEtBREQsR0FDVyxLQUFLRCxLQUFMLENBQVdqQixFQUR0QixDQUNDa0IsS0FERDs7QUFFUCxXQUFLUCxVQUFMLENBQWdCYSxPQUFoQixDQUF3QjtBQUFBLGVBQVlOLE1BQU0wQixNQUFOLENBQWFYLFFBQWIsQ0FBWjtBQUFBLE9BQXhCO0FBQ0EsV0FBS3RCLFVBQUwsQ0FBZ0JrQyxLQUFoQjtBQUNEOzs7OztrQkFHWXBDLFEiLCJmaWxlIjoiV2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdzdGVlbGJsdWUnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIHdhdmVmb3JtJ1xuICAgIH0sXG4gIH0sXG4gIGNoYW5uZWxzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogWzBdLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnYXJyYXkgb2YgdGhlIGNoYW5uZWxzIHRvIGRpc3BsYXkgKGRlZmF1bHRzIHRvIFswXSAtIGxlZnQgY2hhbm5lbCknXG4gICAgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgZGlzcGxheSB0aGUgd2F2ZWZvcm0gb2YgdGhlIGF1ZGlvIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdzdGVlbGJsdWUnXSAtIENvbG9yIG9mIHRoZSB3YXZlZm9ybVxuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IFtvcHRpb25zLmNoYW5uZWxzPVswXV0gLSBBcnJheSBkZXNjcmliaW5nIHRoZSBjaGFubmVscyB0byBkaXNwbGF5cyxcbiAqICAnYWxsJyB0byBkaXNwbGF5IGFsbCB0aGUgY2hhbm5lbHMuIEJ5IGRlZmF1bHQgZGlzcGxheSBvbmx5IHRoZSBsZWZ0IGNoYW5uZWwuXG4gKi9cbmNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm1zID0gbmV3IFNldCgpO1xuICB9XG5cbiAgaW5zdGFsbCgpIHt9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIHRoaXMuX2NsZWFyKCk7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhcykge1xuICAgIHRoaXMuX2NsZWFyKCk7XG5cbiAgICBsZXQgY2hhbm5lbHMgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWxzJyk7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICBpZiAoY2hhbm5lbHMgPT09ICdhbGwnKSB7XG4gICAgICBjb25zdCBudW1DaGFubmVscyA9IGJ1ZmZlci5udW1iZXJPZkNoYW5uZWxzO1xuICAgICAgY2hhbm5lbHMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1DaGFubmVsczsgaSsrKVxuICAgICAgICBjaGFubmVscy5wdXNoKGkpO1xuICAgIH1cblxuICAgIGNoYW5uZWxzLmZvckVhY2goKGNoYW5uZWwsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgZGF0YSA9IG51bGw7XG5cbiAgICAgIC8vIHByZXZlbnQgRE9NRXhjZXB0aW9uLCBzdWNoIGFzOlxuICAgICAgLy8gRmFpbGVkIHRvIGV4ZWN1dGUgJ2dldENoYW5uZWxEYXRhJyBvbiAnQXVkaW9CdWZmZXInOiBjaGFubmVsXG4gICAgICAvLyBpbmRleCAoMSkgZXhjZWVkcyBudW1iZXIgb2YgY2hhbm5lbHMgKDEpXG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuICAgICAgfSBjYXRjaChlcnIpIHt9O1xuXG4gICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBsYXllckhlaWdodCA9IHRoaXMuYmxvY2suaGVpZ2h0IC8gY2hhbm5lbHMubGVuZ3RoO1xuXG4gICAgICAgIGNvbnN0IHdhdmVmb3JtID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2VudGl0eScsIGRhdGEsIHtcbiAgICAgICAgICBoZWlnaHQ6IGxheWVySGVpZ2h0LFxuICAgICAgICAgIHRvcDogbGF5ZXJIZWlnaHQgKiBpbmRleCxcbiAgICAgICAgICB5RG9tYWluOiBbLTEsIDFdLFxuICAgICAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdhdmVmb3JtLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICAgICAgd2F2ZWZvcm0uY29uZmlndXJlU2hhcGUodWkuc2hhcGVzLldhdmVmb3JtLCB7fSwge1xuICAgICAgICAgIGNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyksXG4gICAgICAgICAgc2FtcGxlUmF0ZTogYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRyYWNrLmFkZCh3YXZlZm9ybSk7XG5cbiAgICAgICAgdGhpcy5fd2F2ZWZvcm1zLmFkZCh3YXZlZm9ybSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfY2xlYXIoKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gdGhpcy5ibG9jay51aTtcbiAgICB0aGlzLl93YXZlZm9ybXMuZm9yRWFjaCh3YXZlZm9ybSA9PiB0cmFjay5yZW1vdmUod2F2ZWZvcm0pKTtcbiAgICB0aGlzLl93YXZlZm9ybXMuY2xlYXIoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXZlZm9ybTtcbiJdfQ==