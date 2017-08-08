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
  }
};

/**
 * Module that display the waveform of the audio buffer.
 *
 * @param {Object} options - Override default parameters
 * @param {String} [options.color='steelblue'] - Color of the waveform
 */

var WaveformModule = function (_AbstractModule) {
  (0, _inherits3.default)(WaveformModule, _AbstractModule);

  function WaveformModule(options) {
    (0, _classCallCheck3.default)(this, WaveformModule);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WaveformModule.__proto__ || (0, _getPrototypeOf2.default)(WaveformModule)).call(this, definitions, options));

    _this._waveform = null;
    return _this;
  }

  (0, _createClass3.default)(WaveformModule, [{
    key: 'install',
    value: function install(block) {
      var _block$ui = block.ui,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;


      this._waveform = new ui.core.Layer('entity', [], {
        height: block.height,
        yDomain: [-1, 1]
      });

      this._waveform.setTimeContext(timeContext);
      this._waveform.configureShape(ui.shapes.Waveform, {}, {
        color: this.params.get('color')
      });

      track.add(this._waveform);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(block) {
      var track = block.ui.track;

      track.remove(this._waveform);
    }
  }, {
    key: 'setTrack',
    value: function setTrack(trackConfig, trackBuffer) {
      this._waveform.data = trackBuffer.getChannelData(0);
      this._waveform.render(); // update bindings between data and shapes

      // hack to set the smaple rate properly
      var $item = this._waveform.$el.querySelector('.waveform');
      var shape = this._waveform.getShapeFromItem($item);
      shape.params.sampleRate = trackBuffer.sampleRate;

      this._waveform.update();
    }
  }]);
  return WaveformModule;
}(_AbstractModule3.default);

exports.default = WaveformModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwiZGVmaW5pdGlvbnMiLCJjb2xvciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJXYXZlZm9ybU1vZHVsZSIsIm9wdGlvbnMiLCJfd2F2ZWZvcm0iLCJibG9jayIsInRyYWNrIiwidGltZUNvbnRleHQiLCJjb3JlIiwiTGF5ZXIiLCJoZWlnaHQiLCJ5RG9tYWluIiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInNoYXBlcyIsIldhdmVmb3JtIiwicGFyYW1zIiwiZ2V0IiwiYWRkIiwicmVtb3ZlIiwidHJhY2tDb25maWciLCJ0cmFja0J1ZmZlciIsImRhdGEiLCJnZXRDaGFubmVsRGF0YSIsInJlbmRlciIsIiRpdGVtIiwiJGVsIiwicXVlcnlTZWxlY3RvciIsInNoYXBlIiwiZ2V0U2hhcGVGcm9tSXRlbSIsInNhbXBsZVJhdGUiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLFFBREQ7QUFFTEMsYUFBUyxXQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPO0FBQ0xDLFlBQU07QUFERDtBQUpGO0FBRFcsQ0FBcEI7O0FBV0E7Ozs7Ozs7SUFNTUMsYzs7O0FBQ0osMEJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQSxzSkFDYlIsV0FEYSxFQUNBUSxPQURBOztBQUduQixVQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBSG1CO0FBSXBCOzs7OzRCQUVPQyxLLEVBQU87QUFBQSxzQkFDa0JBLE1BQU1YLEVBRHhCO0FBQUEsVUFDTFksS0FESyxhQUNMQSxLQURLO0FBQUEsVUFDRUMsV0FERixhQUNFQSxXQURGOzs7QUFHYixXQUFLSCxTQUFMLEdBQWlCLElBQUlWLEdBQUdjLElBQUgsQ0FBUUMsS0FBWixDQUFrQixRQUFsQixFQUE0QixFQUE1QixFQUFnQztBQUMvQ0MsZ0JBQVFMLE1BQU1LLE1BRGlDO0FBRS9DQyxpQkFBUyxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUw7QUFGc0MsT0FBaEMsQ0FBakI7O0FBS0EsV0FBS1AsU0FBTCxDQUFlUSxjQUFmLENBQThCTCxXQUE5QjtBQUNBLFdBQUtILFNBQUwsQ0FBZVMsY0FBZixDQUE4Qm5CLEdBQUdvQixNQUFILENBQVVDLFFBQXhDLEVBQWtELEVBQWxELEVBQXNEO0FBQ3BEbkIsZUFBTyxLQUFLb0IsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCO0FBRDZDLE9BQXREOztBQUlBWCxZQUFNWSxHQUFOLENBQVUsS0FBS2QsU0FBZjtBQUNEOzs7OEJBRVNDLEssRUFBTztBQUFBLFVBQ1BDLEtBRE8sR0FDR0QsTUFBTVgsRUFEVCxDQUNQWSxLQURPOztBQUVmQSxZQUFNYSxNQUFOLENBQWEsS0FBS2YsU0FBbEI7QUFDRDs7OzZCQUVRZ0IsVyxFQUFhQyxXLEVBQWE7QUFDakMsV0FBS2pCLFNBQUwsQ0FBZWtCLElBQWYsR0FBc0JELFlBQVlFLGNBQVosQ0FBMkIsQ0FBM0IsQ0FBdEI7QUFDQSxXQUFLbkIsU0FBTCxDQUFlb0IsTUFBZixHQUZpQyxDQUVSOztBQUV6QjtBQUNBLFVBQU1DLFFBQVEsS0FBS3JCLFNBQUwsQ0FBZXNCLEdBQWYsQ0FBbUJDLGFBQW5CLENBQWlDLFdBQWpDLENBQWQ7QUFDQSxVQUFNQyxRQUFRLEtBQUt4QixTQUFMLENBQWV5QixnQkFBZixDQUFnQ0osS0FBaEMsQ0FBZDtBQUNBRyxZQUFNWixNQUFOLENBQWFjLFVBQWIsR0FBMEJULFlBQVlTLFVBQXRDOztBQUVBLFdBQUsxQixTQUFMLENBQWUyQixNQUFmO0FBQ0Q7Ozs7O2tCQUdZN0IsYyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3N0ZWVsYmx1ZScsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgd2F2ZWZvcm0nXG4gICAgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgZGlzcGxheSB0aGUgd2F2ZWZvcm0gb2YgdGhlIGF1ZGlvIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdzdGVlbGJsdWUnXSAtIENvbG9yIG9mIHRoZSB3YXZlZm9ybVxuICovXG5jbGFzcyBXYXZlZm9ybU1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3dhdmVmb3JtID0gbnVsbDtcbiAgfVxuXG4gIGluc3RhbGwoYmxvY2spIHtcbiAgICBjb25zdCB7IHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gYmxvY2sudWk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBbXSwge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbLTEsIDFdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0uc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX3dhdmVmb3JtLmNvbmZpZ3VyZVNoYXBlKHVpLnNoYXBlcy5XYXZlZm9ybSwge30sIHtcbiAgICAgIGNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyksXG4gICAgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fd2F2ZWZvcm0pO1xuICB9XG5cbiAgdW5pbnN0YWxsKGJsb2NrKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gYmxvY2sudWk7XG4gICAgdHJhY2sucmVtb3ZlKHRoaXMuX3dhdmVmb3JtKTtcbiAgfVxuXG4gIHNldFRyYWNrKHRyYWNrQ29uZmlnLCB0cmFja0J1ZmZlcikge1xuICAgIHRoaXMuX3dhdmVmb3JtLmRhdGEgPSB0cmFja0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICB0aGlzLl93YXZlZm9ybS5yZW5kZXIoKTsgLy8gdXBkYXRlIGJpbmRpbmdzIGJldHdlZW4gZGF0YSBhbmQgc2hhcGVzXG5cbiAgICAvLyBoYWNrIHRvIHNldCB0aGUgc21hcGxlIHJhdGUgcHJvcGVybHlcbiAgICBjb25zdCAkaXRlbSA9IHRoaXMuX3dhdmVmb3JtLiRlbC5xdWVyeVNlbGVjdG9yKCcud2F2ZWZvcm0nKTtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX3dhdmVmb3JtLmdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pO1xuICAgIHNoYXBlLnBhcmFtcy5zYW1wbGVSYXRlID0gdHJhY2tCdWZmZXIuc2FtcGxlUmF0ZTtcblxuICAgIHRoaXMuX3dhdmVmb3JtLnVwZGF0ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdhdmVmb3JtTW9kdWxlO1xuIl19