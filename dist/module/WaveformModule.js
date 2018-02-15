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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhdmVmb3JtTW9kdWxlLmpzIl0sIm5hbWVzIjpbInVpIiwiZGVmaW5pdGlvbnMiLCJjb2xvciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJjaGFubmVscyIsIldhdmVmb3JtTW9kdWxlIiwib3B0aW9ucyIsIl93YXZlZm9ybXMiLCJfY2xlYXIiLCJidWZmZXIiLCJtZXRhZGF0YXMiLCJwYXJhbXMiLCJnZXQiLCJibG9jayIsInRyYWNrIiwidGltZUNvbnRleHQiLCJudW1DaGFubmVscyIsIm51bWJlck9mQ2hhbm5lbHMiLCJpIiwicHVzaCIsImZvckVhY2giLCJjaGFubmVsIiwiaW5kZXgiLCJkYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJlcnIiLCJsYXllckhlaWdodCIsImhlaWdodCIsImxlbmd0aCIsIndhdmVmb3JtIiwiY29yZSIsIkxheWVyIiwidG9wIiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzaGFwZXMiLCJXYXZlZm9ybSIsInNhbXBsZVJhdGUiLCJhZGQiLCJyZW1vdmUiLCJjbGVhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLFFBREQ7QUFFTEMsYUFBUyxXQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUpGLEdBRFc7QUFTbEJDLFlBQVU7QUFDUkwsVUFBTSxLQURFO0FBRVJDLGFBQVMsQ0FBQyxDQUFELENBRkQ7QUFHUkMsY0FBVSxJQUhGO0FBSVJDLFdBQU87QUFDTEMsWUFBTTtBQUREO0FBSkM7QUFUUSxDQUFwQjs7QUFtQkE7Ozs7Ozs7OztJQVFNRSxjOzs7QUFDSiwwQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBLHNKQUNiVCxXQURhLEVBQ0FTLE9BREE7O0FBR25CLFVBQUtDLFVBQUwsR0FBa0IsbUJBQWxCO0FBSG1CO0FBSXBCOzs7OzhCQUVTLENBQUU7OztnQ0FFQTtBQUNWLFdBQUtDLE1BQUw7QUFDRDs7OzZCQUVRQyxNLEVBQVFDLFMsRUFBVztBQUFBOztBQUMxQixXQUFLRixNQUFMOztBQUVBLFVBQUlKLFdBQVcsS0FBS08sTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQWY7QUFIMEIsc0JBSUssS0FBS0MsS0FBTCxDQUFXakIsRUFKaEI7QUFBQSxVQUlsQmtCLEtBSmtCLGFBSWxCQSxLQUprQjtBQUFBLFVBSVhDLFdBSlcsYUFJWEEsV0FKVzs7O0FBTTFCLFVBQUlYLGFBQWEsS0FBakIsRUFBd0I7QUFDdEIsWUFBTVksY0FBY1AsT0FBT1EsZ0JBQTNCO0FBQ0FiLG1CQUFXLEVBQVg7O0FBRUEsYUFBSyxJQUFJYyxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLFdBQXBCLEVBQWlDRSxHQUFqQztBQUNFZCxtQkFBU2UsSUFBVCxDQUFjRCxDQUFkO0FBREY7QUFFRDs7QUFFRGQsZUFBU2dCLE9BQVQsQ0FBaUIsVUFBQ0MsT0FBRCxFQUFVQyxLQUFWLEVBQW9CO0FBQ25DLFlBQUlDLE9BQU8sSUFBWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0ZBLGlCQUFPZCxPQUFPZSxjQUFQLENBQXNCSCxPQUF0QixDQUFQO0FBQ0QsU0FGRCxDQUVFLE9BQU1JLEdBQU4sRUFBVyxDQUFFOztBQUVmLFlBQUlGLFNBQVMsSUFBYixFQUFtQjtBQUNqQixjQUFNRyxjQUFjLE9BQUtiLEtBQUwsQ0FBV2MsTUFBWCxHQUFvQnZCLFNBQVN3QixNQUFqRDs7QUFFQSxjQUFNQyxXQUFXLElBQUlqQyxHQUFHa0MsSUFBSCxDQUFRQyxLQUFaLENBQWtCLFFBQWxCLEVBQTRCUixJQUE1QixFQUFrQztBQUNqREksb0JBQVFELFdBRHlDO0FBRWpETSxpQkFBS04sY0FBY0osS0FGOEI7QUFHakRXLHFCQUFTLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQUh3QztBQUlqREMsb0JBQVEsT0FBS0E7QUFKb0MsV0FBbEMsQ0FBakI7O0FBT0FMLG1CQUFTTSxjQUFULENBQXdCcEIsV0FBeEI7QUFDQWMsbUJBQVNPLGNBQVQsQ0FBd0J4QyxHQUFHeUMsTUFBSCxDQUFVQyxRQUFsQyxFQUE0QyxFQUE1QyxFQUFnRDtBQUM5Q3hDLG1CQUFPLE9BQUthLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUR1QztBQUU5QzJCLHdCQUFZOUIsT0FBTzhCO0FBRjJCLFdBQWhEOztBQUtBekIsZ0JBQU0wQixHQUFOLENBQVVYLFFBQVY7O0FBRUEsaUJBQUt0QixVQUFMLENBQWdCaUMsR0FBaEIsQ0FBb0JYLFFBQXBCO0FBQ0Q7QUFDRixPQTlCRDtBQStCRDs7OzZCQUVRO0FBQUEsVUFDQ2YsS0FERCxHQUNXLEtBQUtELEtBQUwsQ0FBV2pCLEVBRHRCLENBQ0NrQixLQUREOztBQUVQLFdBQUtQLFVBQUwsQ0FBZ0JhLE9BQWhCLENBQXdCO0FBQUEsZUFBWU4sTUFBTTJCLE1BQU4sQ0FBYVosUUFBYixDQUFaO0FBQUEsT0FBeEI7QUFDQSxXQUFLdEIsVUFBTCxDQUFnQm1DLEtBQWhCO0FBQ0Q7Ozs7O2tCQUdZckMsYyIsImZpbGUiOiJXYXZlZm9ybU1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3N0ZWVsYmx1ZScsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgd2F2ZWZvcm0nXG4gICAgfSxcbiAgfSxcbiAgY2hhbm5lbHM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBbMF0sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdhcnJheSBvZiB0aGUgY2hhbm5lbHMgdG8gZGlzcGxheSAoZGVmYXVsdHMgdG8gWzBdIC0gbGVmdCBjaGFubmVsKSdcbiAgICB9LFxuICB9LFxufTtcblxuLyoqXG4gKiBNb2R1bGUgdGhhdCBkaXNwbGF5IHRoZSB3YXZlZm9ybSBvZiB0aGUgYXVkaW8gYnVmZmVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J3N0ZWVsYmx1ZSddIC0gQ29sb3Igb2YgdGhlIHdhdmVmb3JtXG4gKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gW29wdGlvbnMuY2hhbm5lbHM9WzBdXSAtIEFycmF5IGRlc2NyaWJpbmcgdGhlIGNoYW5uZWxzIHRvIGRpc3BsYXlzLFxuICogICdhbGwnIHRvIGRpc3BsYXkgYWxsIHRoZSBjaGFubmVscy4gQnkgZGVmYXVsdCBkaXNwbGF5IG9ubHkgdGhlIGxlZnQgY2hhbm5lbC5cbiAqL1xuY2xhc3MgV2F2ZWZvcm1Nb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl93YXZlZm9ybXMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBpbnN0YWxsKCkge31cblxuICB1bmluc3RhbGwoKSB7XG4gICAgdGhpcy5fY2xlYXIoKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGFzKSB7XG4gICAgdGhpcy5fY2xlYXIoKTtcblxuICAgIGxldCBjaGFubmVscyA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbHMnKTtcbiAgICBjb25zdCB7IHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gdGhpcy5ibG9jay51aTtcblxuICAgIGlmIChjaGFubmVscyA9PT0gJ2FsbCcpIHtcbiAgICAgIGNvbnN0IG51bUNoYW5uZWxzID0gYnVmZmVyLm51bWJlck9mQ2hhbm5lbHM7XG4gICAgICBjaGFubmVscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUNoYW5uZWxzOyBpKyspXG4gICAgICAgIGNoYW5uZWxzLnB1c2goaSk7XG4gICAgfVxuXG4gICAgY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBkYXRhID0gbnVsbDtcblxuICAgICAgLy8gcHJldmVudCBET01FeGNlcHRpb24sIHN1Y2ggYXM6XG4gICAgICAvLyBGYWlsZWQgdG8gZXhlY3V0ZSAnZ2V0Q2hhbm5lbERhdGEnIG9uICdBdWRpb0J1ZmZlcic6IGNoYW5uZWxcbiAgICAgIC8vIGluZGV4ICgxKSBleGNlZWRzIG51bWJlciBvZiBjaGFubmVscyAoMSlcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2hhbm5lbCk7XG4gICAgICB9IGNhdGNoKGVycikge307XG5cbiAgICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gdGhpcy5ibG9jay5oZWlnaHQgLyBjaGFubmVscy5sZW5ndGg7XG5cbiAgICAgICAgY29uc3Qgd2F2ZWZvcm0gPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgZGF0YSwge1xuICAgICAgICAgIGhlaWdodDogbGF5ZXJIZWlnaHQsXG4gICAgICAgICAgdG9wOiBsYXllckhlaWdodCAqIGluZGV4LFxuICAgICAgICAgIHlEb21haW46IFstMSwgMV0sXG4gICAgICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2F2ZWZvcm0uc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgICAgICB3YXZlZm9ybS5jb25maWd1cmVTaGFwZSh1aS5zaGFwZXMuV2F2ZWZvcm0sIHt9LCB7XG4gICAgICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmdldCgnY29sb3InKSxcbiAgICAgICAgICBzYW1wbGVSYXRlOiBidWZmZXIuc2FtcGxlUmF0ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdHJhY2suYWRkKHdhdmVmb3JtKTtcblxuICAgICAgICB0aGlzLl93YXZlZm9ybXMuYWRkKHdhdmVmb3JtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9jbGVhcigpIHtcbiAgICBjb25zdCB7IHRyYWNrIH0gPSB0aGlzLmJsb2NrLnVpO1xuICAgIHRoaXMuX3dhdmVmb3Jtcy5mb3JFYWNoKHdhdmVmb3JtID0+IHRyYWNrLnJlbW92ZSh3YXZlZm9ybSkpO1xuICAgIHRoaXMuX3dhdmVmb3Jtcy5jbGVhcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdhdmVmb3JtTW9kdWxlO1xuIl19