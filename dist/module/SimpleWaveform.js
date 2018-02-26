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
        opacity: 1,
        overlay: false,
        overlayColor: '#000000',
        overlayOpacity: 0.4
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) return this.$el;

      this.$el = document.createElementNS(this.ns, 'g');

      this.$path = document.createElementNS(this.ns, 'path');
      this.$path.setAttributeNS(null, 'fill', 'none');
      this.$path.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$path.setAttributeNS(null, 'stroke', this.params.color);
      this.$path.setAttributeNS(null, 'fill', this.params.color);
      this.$path.style.opacity = this.params.opacity;

      this.$el.appendChild(this.$path);

      if (this.params.overlay === true) {
        this.$overlay = document.createElementNS(this.ns, 'rect');
        this.$overlay.style.fill = this.params.overlayColor;
        this.$overlay.style.fillOpacity = this.params.overlayOpacity;

        this.$el.appendChild(this.$overlay);
      }

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
      var blockSize = 3; // this.params.barWidth;
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

        this.$path.setAttributeNS(null, 'd', d);
      }

      if (this.params.overlay) {
        this.$overlay.setAttribute('x', 0);
        this.$overlay.setAttribute('y', 0);
        this.$overlay.setAttribute('width', renderingContext.width);
        this.$overlay.setAttribute('height', renderingContext.height / 2);
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
  },
  overlay: {
    type: 'boolean',
    default: false,
    constant: true,
    metas: {
      desc: 'Define if an overlay should be displayed on the bottom of the waveform'
    }
  },
  overlayColor: {
    type: 'string',
    default: '#000000',
    constant: true,
    metas: {
      desc: 'Color of the overlay'
    }
  },
  overlayOpacity: {
    type: 'float',
    default: 0.4,
    constant: true,
    metas: {
      desc: 'Opacity of the overlay'
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
        color: this.params.get('color'),
        overlay: this.params.get('overlay'),
        overlayColor: this.params.get('overlayColor'),
        overlayOpacity: this.params.get('overlayOpacity')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpbXBsZVdhdmVmb3JtLmpzIl0sIm5hbWVzIjpbInVpIiwiU2ltcGxlV2F2ZWZvcm0iLCJzYW1wbGVSYXRlIiwiY29sb3IiLCJvcGFjaXR5Iiwib3ZlcmxheSIsIm92ZXJsYXlDb2xvciIsIm92ZXJsYXlPcGFjaXR5IiwicmVuZGVyaW5nQ29udGV4dCIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwibnMiLCIkcGF0aCIsInNldEF0dHJpYnV0ZU5TIiwicGFyYW1zIiwic3R5bGUiLCJhcHBlbmRDaGlsZCIsIiRvdmVybGF5IiwiZmlsbCIsImZpbGxPcGFjaXR5IiwiZGF0dW0iLCJzbGljZU1ldGhvZCIsIkZsb2F0MzJBcnJheSIsIm5iclNhbXBsZXMiLCJsZW5ndGgiLCJkdXJhdGlvbiIsIndpZHRoIiwidGltZVRvUGl4ZWwiLCJzYW1wbGVzUGVyUGl4ZWwiLCJtaW5YIiwibWF4WCIsInBpeGVsVG9UaW1lIiwiaW52ZXJ0IiwiYmxvY2tTaXplIiwibWluTWF4IiwicHgiLCJzdGFydFRpbWUiLCJzdGFydFNhbXBsZSIsImV4dHJhY3QiLCJtaW4iLCJJbmZpbml0eSIsIm1heCIsImoiLCJsIiwic2FtcGxlIiwiaXNGaW5pdGUiLCJwdXNoIiwiUElYRUwiLCJNSU4iLCJNQVgiLCJkIiwiaSIsIngiLCJ5MSIsIk1hdGgiLCJyb3VuZCIsInZhbHVlVG9QaXhlbCIsInkyIiwic2V0QXR0cmlidXRlIiwiaGVpZ2h0Iiwic2hhcGVzIiwiQmFzZVNoYXBlIiwiZGVmaW5pdGlvbnMiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwiU2ltcGxlV2F2ZWZvcm1Nb2R1bGUiLCJvcHRpb25zIiwiX3dhdmVmb3JtIiwiYmxvY2siLCJ0cmFjayIsInRpbWVDb250ZXh0IiwiY29yZSIsIkxheWVyIiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJnZXQiLCJhZGQiLCJyZW1vdmUiLCJidWZmZXIiLCJtZXRhZGF0YSIsImRhdGEiLCJnZXRDaGFubmVsRGF0YSIsInJlbmRlciIsIiRpdGVtIiwicXVlcnlTZWxlY3RvciIsInNoYXBlIiwiZ2V0U2hhcGVGcm9tSXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7Ozs7Ozs7SUFHTUMsYzs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8saUJBQVA7QUFBMEI7Ozt1Q0FFeEI7QUFBRSxhQUFPLEVBQVA7QUFBVzs7O21DQUVqQjtBQUNiLGFBQU87QUFDTEMsb0JBQVksS0FEUDtBQUVMQyxlQUFPLFNBRkY7QUFHTEMsaUJBQVMsQ0FISjtBQUlMQyxpQkFBUyxLQUpKO0FBS0xDLHNCQUFjLFNBTFQ7QUFNTEMsd0JBQWdCO0FBTlgsT0FBUDtBQVFEOzs7MkJBRU1DLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBS0MsR0FBVCxFQUNFLE9BQU8sS0FBS0EsR0FBWjs7QUFFRixXQUFLQSxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsR0FBbEMsQ0FBWDs7QUFFQSxXQUFLQyxLQUFMLEdBQWFILFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsTUFBbEMsQ0FBYjtBQUNBLFdBQUtDLEtBQUwsQ0FBV0MsY0FBWCxDQUEwQixJQUExQixFQUFnQyxNQUFoQyxFQUF3QyxNQUF4QztBQUNBLFdBQUtELEtBQUwsQ0FBV0MsY0FBWCxDQUEwQixJQUExQixFQUFnQyxpQkFBaEMsRUFBbUQsWUFBbkQ7QUFDQSxXQUFLRCxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsUUFBaEMsRUFBMEMsS0FBS0MsTUFBTCxDQUFZWixLQUF0RDtBQUNBLFdBQUtVLEtBQUwsQ0FBV0MsY0FBWCxDQUEwQixJQUExQixFQUFnQyxNQUFoQyxFQUF3QyxLQUFLQyxNQUFMLENBQVlaLEtBQXBEO0FBQ0EsV0FBS1UsS0FBTCxDQUFXRyxLQUFYLENBQWlCWixPQUFq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QWYsQ0FBOEIvRSxjQUE5QixFQUE4QyxFQUE5QyxFQUFrRDtBQUNoREUsZUFBTyxLQUFLWSxNQUFMLENBQVlrRSxHQUFaLENBQWdCLE9BQWhCLENBRHlDO0FBRWhENUUsaUJBQVMsS0FBS1UsTUFBTCxDQUFZa0UsR0FBWixDQUFnQixTQUFoQixDQUZ1QztBQUdoRDNFLHNCQUFjLEtBQUtTLE1BQUwsQ0FBWWtFLEdBQVosQ0FBZ0IsY0FBaEIsQ0FIa0M7QUFJaEQxRSx3QkFBZ0IsS0FBS1EsTUFBTCxDQUFZa0UsR0FBWixDQUFnQixnQkFBaEI7QUFKZ0MsT0FBbEQ7O0FBT0FSLFlBQU1TLEdBQU4sQ0FBVSxLQUFLWCxTQUFmO0FBQ0Q7OztnQ0FFVztBQUNWLFdBQUtDLEtBQUwsQ0FBV3hFLEVBQVgsQ0FBY3lFLEtBQWQsQ0FBb0JVLE1BQXBCLENBQTJCLEtBQUtaLFNBQWhDO0FBQ0Q7Ozs2QkFFUWEsTSxFQUFRQyxRLEVBQVU7QUFDekIsV0FBS2QsU0FBTCxDQUFlZSxJQUFmLEdBQXNCRixPQUFPRyxjQUFQLENBQXNCLENBQXRCLENBQXRCO0FBQ0EsV0FBS2hCLFNBQUwsQ0FBZWlCLE1BQWYsR0FGeUIsQ0FFQTs7QUFFekI7QUFDQSxVQUFNQyxRQUFRLEtBQUtsQixTQUFMLENBQWU5RCxHQUFmLENBQW1CaUYsYUFBbkIsQ0FBaUMsa0JBQWpDLENBQWQ7QUFDQSxVQUFNQyxRQUFRLEtBQUtwQixTQUFMLENBQWVxQixnQkFBZixDQUFnQ0gsS0FBaEMsQ0FBZDtBQUNBRSxZQUFNNUUsTUFBTixDQUFhYixVQUFiLEdBQTBCa0YsT0FBT2xGLFVBQWpDO0FBQ0Q7Ozs7O2tCQUdZbUUsb0IiLCJmaWxlIjoiU2ltcGxlV2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cblxuY2xhc3MgU2ltcGxlV2F2ZWZvcm0gZXh0ZW5kcyB1aS5zaGFwZXMuQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NpbXBsZS13YXZlZm9ybScgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7IHJldHVybiB7fSB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgb3ZlcmxheTogZmFsc2UsXG4gICAgICBvdmVybGF5Q29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG92ZXJsYXlPcGFjaXR5OiAwLjQsXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpXG4gICAgICByZXR1cm4gdGhpcy4kZWw7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHBhdGgpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLm92ZXJsYXkgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuJG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc3R5bGUuZmlsbCA9IHRoaXMucGFyYW1zLm92ZXJsYXlDb2xvcjtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc3R5bGUuZmlsbE9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vdmVybGF5T3BhY2l0eTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kb3ZlcmxheSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgeyBtaW5YLCBtYXhYIH0gPSByZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IHBpeGVsVG9UaW1lID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQ7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gMzsgLy8gdGhpcy5wYXJhbXMuYmFyV2lkdGg7XG4gICAgY29uc3QgbWluTWF4ID0gW107XG5cbiAgICAvLyBnZXQgbWluL21heCBwZXIgYmFyLCBjbGFtcGVkIHRvIHRoZSB2aXNpYmxlIGFyZWFcbiAgICBmb3IgKGxldCBweCA9IG1pblg7IHB4IDwgbWF4WDsgcHggKz0gYmxvY2tTaXplKSB7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwaXhlbFRvVGltZShweCk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHNhbXBsZVJhdGU7XG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG5cbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZXh0cmFjdC5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIG1pbiA9IHNhbXBsZTtcbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgbWF4ID0gc2FtcGxlO1xuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9ICFpc0Zpbml0ZShtaW4pID8gMCA6IG1pbjtcbiAgICAgIG1heCA9ICFpc0Zpbml0ZShtYXgpID8gMCA6IG1heDtcblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGlmIChtaW5NYXgubGVuZ3RoKSB7XG4gICAgICBjb25zdCBQSVhFTCA9IDA7XG4gICAgICBjb25zdCBNSU4gICA9IDE7XG4gICAgICBjb25zdCBNQVggICA9IDI7XG5cbiAgICAgIGxldCBkID0gJ00nO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG1pbk1heC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0dW0gPSBtaW5NYXhbaV07XG4gICAgICAgIGNvbnN0IHggID0gZGF0dW1bUElYRUxdO1xuICAgICAgICBsZXQgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01JTl0pKTtcbiAgICAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNQVhdKSk7XG5cbiAgICAgICAgZCArPSBgJHt4fSwke3kxfUwke3h9LCR7eTJ9TCR7eCArIGJsb2NrU2l6ZSAtIDJ9LCR7eTJ9TCR7eCArIGJsb2NrU2l6ZSAtIDJ9LCR7eTF9TCR7eH0sJHt5MX1gO1xuXG4gICAgICAgIGlmIChpIDwgbCAtIDEpXG4gICAgICAgICAgZCArPSAnTSc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMub3ZlcmxheSkge1xuICAgICAgdGhpcy4kb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3gnLCAwKTtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc2V0QXR0cmlidXRlKCd5JywgMCk7XG4gICAgICB0aGlzLiRvdmVybGF5LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCByZW5kZXJpbmdDb250ZXh0LndpZHRoKTtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCAvIDIpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnc3RlZWxibHVlJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2NvbG9yIG9mIHRoZSB3YXZlZm9ybSdcbiAgICB9LFxuICB9LFxuICBvdmVybGF5OiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnRGVmaW5lIGlmIGFuIG92ZXJsYXkgc2hvdWxkIGJlIGRpc3BsYXllZCBvbiB0aGUgYm90dG9tIG9mIHRoZSB3YXZlZm9ybScsXG4gICAgfSxcbiAgfSxcbiAgb3ZlcmxheUNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJyMwMDAwMDAnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ29sb3Igb2YgdGhlIG92ZXJsYXknLFxuICAgIH0sXG4gIH0sXG4gIG92ZXJsYXlPcGFjaXR5OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjQsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdPcGFjaXR5IG9mIHRoZSBvdmVybGF5JyxcbiAgICB9LFxuICB9XG59O1xuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGRpc3BsYXkgdGhlIHdhdmVmb3JtIG9mIHRoZSBhdWRpbyBidWZmZXIuIEluIGNhc2Ugbm9uLW1vbm9cbiAqIGF1ZGlvIGZpbGVzLCBvbmx5IHRoZSBsZWZ0IGNoYW5uZWwgaXMgcmVuZGVyZWQuIEZvciBtb3JlIGFjY3VyYXRlXG4gKiByZXByZXNlbnRhdGlvbiBzZWUgV2F2ZWZvcm1Nb2R1bGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nc3RlZWxibHVlJ10gLSBDb2xvciBvZiB0aGUgd2F2ZWZvcm1cbiAqL1xuY2xhc3MgU2ltcGxlV2F2ZWZvcm1Nb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG51bGw7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0gPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbLTEsIDFdLFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHRoaXMuX3dhdmVmb3JtLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl93YXZlZm9ybS5jb25maWd1cmVTaGFwZShTaW1wbGVXYXZlZm9ybSwge30sIHtcbiAgICAgIGNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyksXG4gICAgICBvdmVybGF5OiB0aGlzLnBhcmFtcy5nZXQoJ292ZXJsYXknKSxcbiAgICAgIG92ZXJsYXlDb2xvcjogdGhpcy5wYXJhbXMuZ2V0KCdvdmVybGF5Q29sb3InKSxcbiAgICAgIG92ZXJsYXlPcGFjaXR5OiB0aGlzLnBhcmFtcy5nZXQoJ292ZXJsYXlPcGFjaXR5JyksXG4gICAgfSk7XG5cbiAgICB0cmFjay5hZGQodGhpcy5fd2F2ZWZvcm0pO1xuICB9XG5cbiAgdW5pbnN0YWxsKCkge1xuICAgIHRoaXMuYmxvY2sudWkudHJhY2sucmVtb3ZlKHRoaXMuX3dhdmVmb3JtKTtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLl93YXZlZm9ybS5kYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgIHRoaXMuX3dhdmVmb3JtLnJlbmRlcigpOyAvLyB1cGRhdGUgYmluZGluZ3MgYmV0d2VlbiBkYXRhIGFuZCBzaGFwZXNcblxuICAgIC8vIGhhY2sgdG8gc2V0IHRoZSBzbWFwbGUgcmF0ZSBwcm9wZXJseVxuICAgIGNvbnN0ICRpdGVtID0gdGhpcy5fd2F2ZWZvcm0uJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zaW1wbGUtd2F2ZWZvcm0nKTtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX3dhdmVmb3JtLmdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pO1xuICAgIHNoYXBlLnBhcmFtcy5zYW1wbGVSYXRlID0gYnVmZmVyLnNhbXBsZVJhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlV2F2ZWZvcm1Nb2R1bGU7XG4iXX0=