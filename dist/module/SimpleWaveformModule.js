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

var SimpleWaveform = function (_ui$shapes$BaseShape) {
  (0, _inherits3.default)(SimpleWaveform, _ui$shapes$BaseShape);

  function SimpleWaveform() {
    (0, _classCallCheck3.default)(this, SimpleWaveform);
    return (0, _possibleConstructorReturn3.default)(this, (SimpleWaveform.__proto__ || (0, _getPrototypeOf2.default)(SimpleWaveform)).apply(this, arguments));
  }

  (0, _createClass3.default)(SimpleWaveform, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'simple-waveform';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return {};
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        sampleRate: 44100,
        color: '#000000',
        opacity: 1
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) return this.$el;

      this.$el = document.createElementNS(this.ns, 'path');
      this.$el.setAttributeNS(null, 'fill', 'none');
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.setAttributeNS(null, 'fill', this.params.color);
      this.$el.style.opacity = this.params.opacity;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      // define nbr of samples per pixels
      var sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
      var nbrSamples = datum.length;
      var duration = nbrSamples / this.params.sampleRate;
      var width = renderingContext.timeToPixel(duration);
      var samplesPerPixel = nbrSamples / width;

      if (!samplesPerPixel || datum.length < samplesPerPixel) return;

      var minX = renderingContext.minX,
          maxX = renderingContext.maxX;

      var pixelToTime = renderingContext.timeToPixel.invert;
      var sampleRate = this.params.sampleRate;
      var blockSize = 5; // this.params.barWidth;
      var minMax = [];

      // get min/max per bar, clamped to the visible area
      for (var px = minX; px < maxX; px += blockSize) {
        var startTime = pixelToTime(px);
        var startSample = startTime * sampleRate;
        var extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);

        var min = Infinity;
        var max = -Infinity;

        for (var j = 0, l = extract.length; j < l; j++) {
          var sample = extract[j];
          if (sample < min) min = sample;
          if (sample > max) max = sample;
        }
        // disallow Infinity
        min = !isFinite(min) ? 0 : min;
        max = !isFinite(max) ? 0 : max;

        minMax.push([px, min, max]);
      }

      if (minMax.length) {
        var PIXEL = 0;
        var MIN = 1;
        var MAX = 2;

        var d = 'M';

        for (var i = 0, _l = minMax.length; i < _l; i++) {
          var _datum = minMax[i];
          var x = _datum[PIXEL];
          var y1 = Math.round(renderingContext.valueToPixel(_datum[MIN]));
          var y2 = Math.round(renderingContext.valueToPixel(_datum[MAX]));

          d += x + ',' + y1 + 'L' + x + ',' + y2 + 'L' + (x + blockSize - 2) + ',' + y2 + 'L' + (x + blockSize - 2) + ',' + y1 + 'L' + x + ',' + y1;

          if (i < _l - 1) d += 'M';
        }

        this.$el.setAttributeNS(null, 'd', d);
      }
    }
  }]);
  return SimpleWaveform;
}(ui.shapes.BaseShape);

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
 * Module that display the waveform of the audio buffer. In case non-mono
 * audio files, only the left channel is rendered. For more accurate
 * representation see WaveformModule.
 *
 * @param {Object} options - Override default parameters
 * @param {String} [options.color='steelblue'] - Color of the waveform
 */

var SimpleWaveformModule = function (_AbstractModule) {
  (0, _inherits3.default)(SimpleWaveformModule, _AbstractModule);

  function SimpleWaveformModule(options) {
    (0, _classCallCheck3.default)(this, SimpleWaveformModule);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (SimpleWaveformModule.__proto__ || (0, _getPrototypeOf2.default)(SimpleWaveformModule)).call(this, definitions, options));

    _this2._waveform = null;
    return _this2;
  }

  (0, _createClass3.default)(SimpleWaveformModule, [{
    key: 'install',
    value: function install() {
      var _block$ui = this.block.ui,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;


      this._waveform = new ui.core.Layer('entity', [], {
        height: this.block.height,
        yDomain: [-1, 1],
        zIndex: this.zIndex
      });

      this._waveform.setTimeContext(timeContext);
      this._waveform.configureShape(SimpleWaveform, {}, {
        color: this.params.get('color')
      });

      track.add(this._waveform);
    }
  }, {
    key: 'uninstall',
    value: function uninstall() {
      this.block.ui.track.remove(this._waveform);
    }
  }, {
    key: 'setTrack',
    value: function setTrack(buffer, metadata) {
      this._waveform.data = buffer.getChannelData(0);
      this._waveform.render(); // update bindings between data and shapes

      // hack to set the smaple rate properly
      var $item = this._waveform.$el.querySelector('.simple-waveform');
      var shape = this._waveform.getShapeFromItem($item);
      shape.params.sampleRate = buffer.sampleRate;
    }
  }]);
  return SimpleWaveformModule;
}(_AbstractModule3.default);

exports.default = SimpleWaveformModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJTaW1wbGVXYXZlZm9ybSIsInNhbXBsZVJhdGUiLCJjb2xvciIsIm9wYWNpdHkiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsInNldEF0dHJpYnV0ZU5TIiwicGFyYW1zIiwic3R5bGUiLCJkYXR1bSIsInNsaWNlTWV0aG9kIiwiRmxvYXQzMkFycmF5IiwibmJyU2FtcGxlcyIsImxlbmd0aCIsImR1cmF0aW9uIiwid2lkdGgiLCJ0aW1lVG9QaXhlbCIsInNhbXBsZXNQZXJQaXhlbCIsIm1pblgiLCJtYXhYIiwicGl4ZWxUb1RpbWUiLCJpbnZlcnQiLCJibG9ja1NpemUiLCJtaW5NYXgiLCJweCIsInN0YXJ0VGltZSIsInN0YXJ0U2FtcGxlIiwiZXh0cmFjdCIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwiaiIsImwiLCJzYW1wbGUiLCJpc0Zpbml0ZSIsInB1c2giLCJQSVhFTCIsIk1JTiIsIk1BWCIsImQiLCJpIiwieCIsInkxIiwiTWF0aCIsInJvdW5kIiwidmFsdWVUb1BpeGVsIiwieTIiLCJzaGFwZXMiLCJCYXNlU2hhcGUiLCJkZWZpbml0aW9ucyIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJTaW1wbGVXYXZlZm9ybU1vZHVsZSIsIm9wdGlvbnMiLCJfd2F2ZWZvcm0iLCJibG9jayIsInRyYWNrIiwidGltZUNvbnRleHQiLCJjb3JlIiwiTGF5ZXIiLCJoZWlnaHQiLCJ5RG9tYWluIiwiekluZGV4Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsImdldCIsImFkZCIsInJlbW92ZSIsImJ1ZmZlciIsIm1ldGFkYXRhIiwiZGF0YSIsImdldENoYW5uZWxEYXRhIiwicmVuZGVyIiwiJGl0ZW0iLCJxdWVyeVNlbGVjdG9yIiwic2hhcGUiLCJnZXRTaGFwZUZyb21JdGVtIl0sIm1hcHBpbmdzIjoi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LENBQXRCO0FBQ0EsV0FBS2pCLFNBQUwsQ0FBZWtCLE1BQWYsR0FGeUIsQ0FFQTs7QUFFekI7QUFDQSxVQUFNQyxRQUFRLEtBQUtuQixTQUFMLENBQWV2RCxHQUFmLENBQW1CMkUsYUFBbkIsQ0FBaUMsa0JBQWpDLENBQWQ7QUFDQSxVQUFNQyxRQUFRLEtBQUtyQixTQUFMLENBQWVzQixnQkFBZixDQUFnQ0gsS0FBaEMsQ0FBZDtBQUNBRSxZQUFNdkUsTUFBTixDQUFhVCxVQUFiLEdBQTBCeUUsT0FBT3pFLFVBQWpDO0FBQ0Q7Ozs7O2tCQUdZeUQsb0IiLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcblxuXG5jbGFzcyBTaW1wbGVXYXZlZm9ybSBleHRlbmRzIHVpLnNoYXBlcy5CYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2ltcGxlLXdhdmVmb3JtJyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHsgcmV0dXJuIHt9IH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZVJhdGU6IDQ0MTAwLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpXG4gICAgICByZXR1cm4gdGhpcy4kZWw7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgeyBtaW5YLCBtYXhYIH0gPSByZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IHBpeGVsVG9UaW1lID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQ7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gNTsgLy8gdGhpcy5wYXJhbXMuYmFyV2lkdGg7XG4gICAgY29uc3QgbWluTWF4ID0gW107XG5cbiAgICAvLyBnZXQgbWluL21heCBwZXIgYmFyLCBjbGFtcGVkIHRvIHRoZSB2aXNpYmxlIGFyZWFcbiAgICBmb3IgKGxldCBweCA9IG1pblg7IHB4IDwgbWF4WDsgcHggKz0gYmxvY2tTaXplKSB7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwaXhlbFRvVGltZShweCk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHNhbXBsZVJhdGU7XG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG5cbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZXh0cmFjdC5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIG1pbiA9IHNhbXBsZTtcbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgbWF4ID0gc2FtcGxlO1xuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9ICFpc0Zpbml0ZShtaW4pID8gMCA6IG1pbjtcbiAgICAgIG1heCA9ICFpc0Zpbml0ZShtYXgpID8gMCA6IG1heDtcblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGlmIChtaW5NYXgubGVuZ3RoKSB7XG4gICAgICBjb25zdCBQSVhFTCA9IDA7XG4gICAgICBjb25zdCBNSU4gICA9IDE7XG4gICAgICBjb25zdCBNQVggICA9IDI7XG5cbiAgICAgIGxldCBkID0gJ00nO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG1pbk1heC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0dW0gPSBtaW5NYXhbaV07XG4gICAgICAgIGNvbnN0IHggID0gZGF0dW1bUElYRUxdO1xuICAgICAgICBsZXQgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01JTl0pKTtcbiAgICAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNQVhdKSk7XG5cbiAgICAgICAgZCArPSBgJHt4fSwke3kxfUwke3h9LCR7eTJ9TCR7eCArIGJsb2NrU2l6ZSAtIDJ9LCR7eTJ9TCR7eCArIGJsb2NrU2l6ZSAtIDJ9LCR7eTF9TCR7eH0sJHt5MX1gO1xuXG4gICAgICAgIGlmIChpIDwgbCAtIDEpXG4gICAgICAgICAgZCArPSAnTSc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdzdGVlbGJsdWUnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIHdhdmVmb3JtJ1xuICAgIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGRpc3BsYXkgdGhlIHdhdmVmb3JtIG9mIHRoZSBhdWRpbyBidWZmZXIuIEluIGNhc2Ugbm9uLW1vbm9cbiAqIGF1ZGlvIGZpbGVzLCBvbmx5IHRoZSBsZWZ0IGNoYW5uZWwgaXMgcmVuZGVyZWQuIEZvciBtb3JlIGFjY3VyYXRlXG4gKiByZXByZXNlbnRhdGlvbiBzZWUgV2F2ZWZvcm1Nb2R1bGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nc3RlZWxibHVlJ10gLSBDb2xvciBvZiB0aGUgd2F2ZWZvcm1cbiAqL1xuY2xhc3MgU2ltcGxlV2F2ZWZvcm1Nb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG51bGw7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0gPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbLTEsIDFdLFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHRoaXMuX3dhdmVmb3JtLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl93YXZlZm9ybS5jb25maWd1cmVTaGFwZShTaW1wbGVXYXZlZm9ybSwge30sIHtcbiAgICAgIGNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyksXG4gICAgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fd2F2ZWZvcm0pO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIHRoaXMuYmxvY2sudWkudHJhY2sucmVtb3ZlKHRoaXMuX3dhdmVmb3JtKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl93YXZlZm9ybS5kYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgIHRoaXMuX3dhdmVmb3JtLnJlbmRlcigpOyAvLyB1cGRhdGUgYmluZGluZ3MgYmV0d2VlbiBkYXRhIGFuZCBzaGFwZXNcblxuICAgIC8vIGhhY2sgdG8gc2V0IHRoZSBzbWFwbGUgcmF0ZSBwcm9wZXJseVxuICAgIGNvbnN0ICRpdGVtID0gdGhpcy5fd2F2ZWZvcm0uJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zaW1wbGUtd2F2ZWZvcm0nKTtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX3dhdmVmb3JtLmdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pO1xuICAgIHNoYXBlLnBhcmFtcy5zYW1wbGVSYXRlID0gYnVmZmVyLnNhbXBsZVJhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlV2F2ZWZvcm1Nb2R1bGU7XG4iXX0=