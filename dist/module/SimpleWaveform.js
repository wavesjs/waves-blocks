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

var SimpleWaveformShape = function (_ui$shapes$BaseShape) {
  (0, _inherits3.default)(SimpleWaveformShape, _ui$shapes$BaseShape);

  function SimpleWaveformShape() {
    (0, _classCallCheck3.default)(this, SimpleWaveformShape);
    return (0, _possibleConstructorReturn3.default)(this, (SimpleWaveformShape.__proto__ || (0, _getPrototypeOf2.default)(SimpleWaveformShape)).apply(this, arguments));
  }

  (0, _createClass3.default)(SimpleWaveformShape, [{
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
  return SimpleWaveformShape;
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

var SimpleWaveform = function (_AbstractModule) {
  (0, _inherits3.default)(SimpleWaveform, _AbstractModule);

  function SimpleWaveform(options) {
    (0, _classCallCheck3.default)(this, SimpleWaveform);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (SimpleWaveform.__proto__ || (0, _getPrototypeOf2.default)(SimpleWaveform)).call(this, definitions, options));

    _this2._waveform = null;
    return _this2;
  }

  (0, _createClass3.default)(SimpleWaveform, [{
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
      this._waveform.configureShape(SimpleWaveformShape, {}, {
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
  return SimpleWaveform;
}(_AbstractModule3.default);

exports.default = SimpleWaveform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJTaW1wbGVXYXZlZm9ybVNoYXBlIiwic2FtcGxlUmF0ZSIsImNvbG9yIiwib3BhY2l0eSIsIm92ZXJsYXkiLCJvdmVybGF5Q29sb3IiLCJvdmVybGF5T3BhY2l0eSIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJHBhdGgiLCJzZXRBdHRyaWJ1dGVOUyIsInBhcmFtcyIsInN0eWxlIiwiYXBwZW5kQ2hpbGQiLCIkb3ZlcmxheSIsImZpbGwiLCJmaWxsT3BhY2l0eSIsImRhdHVtIiwic2xpY2VNZXRob2QiLCJGbG9hdDMyQXJyYXkiLCJuYnJTYW1wbGVzIiwibGVuZ3RoIiwiZHVyYXRpb24iLCJ3aWR0aCIsInRpbWVUb1BpeGVsIiwic2FtcGxlc1BlclBpeGVsIiwibWluWCIsIm1heFgiLCJwaXhlbFRvVGltZSIsImludmVydCIsImJsb2NrU2l6ZSIsIm1pbk1heCIsInB4Iiwic3RhcnRUaW1lIiwic3RhcnRTYW1wbGUiLCJleHRyYWN0IiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJqIiwibCIsInNhbXBsZSIsImlzRmluaXRlIiwicHVzaCIsIlBJWEVMIiwiTUlOIiwiTUFYIiwiZCIsImkiLCJ4IiwieTEiLCJNYXRoIiwicm91bmQiLCJ2YWx1ZVRvUGl4ZWwiLCJ5MiIsInNldEF0dHJpYnV0ZSIsImhlaWdodCIsInNoYXBlcyIsIkJhc2VTaGFwZSIsImRlZmluaXRpb25zIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsIlNpbXBsZVdhdmVmb3JtIiwib3B0aW9ucyIsIl93YXZlZm9ybSIsImJsb2NrIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsImNvcmUiLCJMYXllciIsInlEb21haW4iLCJ6SW5kZXgiLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwiZ2V0IiwiYWRkIiwicmVtb3ZlIiwiYnVmZmVyIiwibWV0YWRhdGEiLCJkYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJyZW5kZXIiLCIkaXRlbSIsInF1ZXJ5U2VsZWN0b3IiLCJzaGFwZSIsImdldFNoYXBlRnJvbUl0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0lBR01DLG1COzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxpQkFBUDtBQUEwQjs7O3VDQUV4QjtBQUFFLGFBQU8sRUFBUDtBQUFXOzs7bUNBRWpCO0FBQ2IsYUFBTztBQUNMQyxvQkFBWSxLQURQO0FBRUxDLGVBQU8sU0FGRjtBQUdMQyxpQkFBUyxDQUhKO0FBSUxDLGlCQUFTLEtBSko7QUFLTEMsc0JBQWMsU0FMVDtBQU1MQyx3QkFBZ0I7QUFOWCxPQUFQO0FBUUQ7OzsyQkFFTUMsZ0IsRUFBa0I7QUFDdkIsVUFBSSxLQUFLQyxHQUFULEVBQ0UsT0FBTyxLQUFLQSxHQUFaOztBQUVGLFdBQUtBLEdBQUwsR0FBV0MsU0FBU0MsZUFBVCxDQUF5QixLQUFLQyxFQUE5QixFQUFrQyxHQUFsQyxDQUFYOztBQUVBLFdBQUtDLEtBQUwsR0FBYUgsU0FBU0MsZUFBVCxDQUF5QixLQUFLQyxFQUE5QixFQUFrQyxNQUFsQyxDQUFiO0FBQ0EsV0FBS0MsS0FBTCxDQUFXQyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLE1BQWhDLEVBQXdDLE1BQXhDO0FBQ0EsV0FBS0QsS0FBTCxDQUFXQyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLGlCQUFoQyxFQUFtRCxZQUFuRDtBQUNBLFdBQUtELEtBQUwsQ0FBV0MsY0FBWCxDQUEwQixJQUExQixFQUFnQyxRQUFoQyxFQUEwQyxLQUFLQyxNQUFMLENBQVlaLEtBQXREO0FBQ0EsV0FBS1UsS0FBTCxDQUFXQyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLE1BQWhDLEVBQXdDLEtBQUtDLE1BQUwsQ0FBWVosS0FBcEQ7QUFDQSxXQUFLVSxLQUFMLENBQVdHLEtBQVgsQ0FBaUJaLE9BQWpCLEdBQTJC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L0UsbUJBQTlCLEVBQW1ELEVBQW5ELEVBQXVEO0FBQ3JERSxlQUFPLEtBQUtZLE1BQUwsQ0FBWWtFLEdBQVosQ0FBZ0IsT0FBaEIsQ0FEOEM7QUFFckQ1RSxpQkFBUyxLQUFLVSxNQUFMLENBQVlrRSxHQUFaLENBQWdCLFNBQWhCLENBRjRDO0FBR3JEM0Usc0JBQWMsS0FBS1MsTUFBTCxDQUFZa0UsR0FBWixDQUFnQixjQUFoQixDQUh1QztBQUlyRDFFLHdCQUFnQixLQUFLUSxNQUFMLENBQVlrRSxHQUFaLENBQWdCLGdCQUFoQjtBQUpxQyxPQUF2RDs7QUFPQVIsWUFBTVMsR0FBTixDQUFVLEtBQUtYLFNBQWY7QUFDRDs7O2dDQUVXO0FBQ1YsV0FBS0MsS0FBTCxDQUFXeEUsRUFBWCxDQUFjeUUsS0FBZCxDQUFvQlUsTUFBcEIsQ0FBMkIsS0FBS1osU0FBaEM7QUFDRDs7OzZCQUVRYSxNLEVBQVFDLFEsRUFBVTtBQUN6QixXQUFLZCxTQUFMLENBQWVlLElBQWYsR0FBc0JGLE9BQU9HLGNBQVAsQ0FBc0IsQ0FBdEIsQ0FBdEI7QUFDQSxXQUFLaEIsU0FBTCxDQUFlaUIsTUFBZixHQUZ5QixDQUVBOztBQUV6QjtBQUNBLFVBQU1DLFFBQVEsS0FBS2xCLFNBQUwsQ0FBZTlELEdBQWYsQ0FBbUJpRixhQUFuQixDQUFpQyxrQkFBakMsQ0FBZDtBQUNBLFVBQU1DLFFBQVEsS0FBS3BCLFNBQUwsQ0FBZXFCLGdCQUFmLENBQWdDSCxLQUFoQyxDQUFkO0FBQ0FFLFlBQU01RSxNQUFOLENBQWFiLFVBQWIsR0FBMEJrRixPQUFPbEYsVUFBakM7QUFDRDs7Ozs7a0JBR1ltRSxjIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cblxuY2xhc3MgU2ltcGxlV2F2ZWZvcm1TaGFwZSBleHRlbmRzIHVpLnNoYXBlcy5CYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2ltcGxlLXdhdmVmb3JtJyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHsgcmV0dXJuIHt9IH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZVJhdGU6IDQ0MTAwLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBvdmVybGF5OiBmYWxzZSxcbiAgICAgIG92ZXJsYXlDb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3ZlcmxheU9wYWNpdHk6IDAuNCxcbiAgICB9XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbClcbiAgICAgIHJldHVybiB0aGlzLiRlbDtcblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG5cbiAgICB0aGlzLiRwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICB0aGlzLiRwYXRoLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcGF0aCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMub3ZlcmxheSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy4kb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgdGhpcy4kb3ZlcmxheS5zdHlsZS5maWxsID0gdGhpcy5wYXJhbXMub3ZlcmxheUNvbG9yO1xuICAgICAgdGhpcy4kb3ZlcmxheS5zdHlsZS5maWxsT3BhY2l0eSA9IHRoaXMucGFyYW1zLm92ZXJsYXlPcGFjaXR5O1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRvdmVybGF5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICAvLyBkZWZpbmUgbmJyIG9mIHNhbXBsZXMgcGVyIHBpeGVsc1xuICAgIGNvbnN0IHNsaWNlTWV0aG9kID0gZGF0dW0gaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgPyAnc3ViYXJyYXknIDogJ3NsaWNlJztcbiAgICBjb25zdCBuYnJTYW1wbGVzID0gZGF0dW0ubGVuZ3RoO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbmJyU2FtcGxlcyAvIHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGR1cmF0aW9uKTtcbiAgICBjb25zdCBzYW1wbGVzUGVyUGl4ZWwgPSBuYnJTYW1wbGVzIC8gd2lkdGg7XG5cbiAgICBpZiAoIXNhbXBsZXNQZXJQaXhlbCB8fCBkYXR1bS5sZW5ndGggPCBzYW1wbGVzUGVyUGl4ZWwpXG4gICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7IG1pblgsIG1heFggfSA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgcGl4ZWxUb1RpbWUgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydDtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBibG9ja1NpemUgPSAzOyAvLyB0aGlzLnBhcmFtcy5iYXJXaWR0aDtcbiAgICBjb25zdCBtaW5NYXggPSBbXTtcblxuICAgIC8vIGdldCBtaW4vbWF4IHBlciBiYXIsIGNsYW1wZWQgdG8gdGhlIHZpc2libGUgYXJlYVxuICAgIGZvciAobGV0IHB4ID0gbWluWDsgcHggPCBtYXhYOyBweCArPSBibG9ja1NpemUpIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHBpeGVsVG9UaW1lKHB4KTtcbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gc3RhcnRUaW1lICogc2FtcGxlUmF0ZTtcbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcblxuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBleHRyYWN0Lmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICBsZXQgc2FtcGxlID0gZXh0cmFjdFtqXTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgbWluID0gc2FtcGxlO1xuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSBtYXggPSBzYW1wbGU7XG4gICAgICB9XG4gICAgICAvLyBkaXNhbGxvdyBJbmZpbml0eVxuICAgICAgbWluID0gIWlzRmluaXRlKG1pbikgPyAwIDogbWluO1xuICAgICAgbWF4ID0gIWlzRmluaXRlKG1heCkgPyAwIDogbWF4O1xuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgaWYgKG1pbk1heC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IFBJWEVMID0gMDtcbiAgICAgIGNvbnN0IE1JTiAgID0gMTtcbiAgICAgIGNvbnN0IE1BWCAgID0gMjtcblxuICAgICAgbGV0IGQgPSAnTSc7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbWluTWF4Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCBkYXR1bSA9IG1pbk1heFtpXTtcbiAgICAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcblxuICAgICAgICBkICs9IGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1MJHt4ICsgYmxvY2tTaXplIC0gMn0sJHt5Mn1MJHt4ICsgYmxvY2tTaXplIC0gMn0sJHt5MX1MJHt4fSwke3kxfWA7XG5cbiAgICAgICAgaWYgKGkgPCBsIC0gMSlcbiAgICAgICAgICBkICs9ICdNJztcbiAgICAgIH1cblxuICAgICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5vdmVybGF5KSB7XG4gICAgICB0aGlzLiRvdmVybGF5LnNldEF0dHJpYnV0ZSgneCcsIDApO1xuICAgICAgdGhpcy4kb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3knLCAwKTtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgICAgdGhpcy4kb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0IC8gMik7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdzdGVlbGJsdWUnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIHdhdmVmb3JtJ1xuICAgIH0sXG4gIH0sXG4gIG92ZXJsYXk6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdEZWZpbmUgaWYgYW4gb3ZlcmxheSBzaG91bGQgYmUgZGlzcGxheWVkIG9uIHRoZSBib3R0b20gb2YgdGhlIHdhdmVmb3JtJyxcbiAgICB9LFxuICB9LFxuICBvdmVybGF5Q29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnIzAwMDAwMCcsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDb2xvciBvZiB0aGUgb3ZlcmxheScsXG4gICAgfSxcbiAgfSxcbiAgb3ZlcmxheU9wYWNpdHk6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuNCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ09wYWNpdHkgb2YgdGhlIG92ZXJsYXknLFxuICAgIH0sXG4gIH1cbn07XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgZGlzcGxheSB0aGUgd2F2ZWZvcm0gb2YgdGhlIGF1ZGlvIGJ1ZmZlci4gSW4gY2FzZSBub24tbW9ub1xuICogYXVkaW8gZmlsZXMsIG9ubHkgdGhlIGxlZnQgY2hhbm5lbCBpcyByZW5kZXJlZC4gRm9yIG1vcmUgYWNjdXJhdGVcbiAqIHJlcHJlc2VudGF0aW9uIHNlZSBXYXZlZm9ybU1vZHVsZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdzdGVlbGJsdWUnXSAtIENvbG9yIG9mIHRoZSB3YXZlZm9ybVxuICovXG5jbGFzcyBTaW1wbGVXYXZlZm9ybSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3dhdmVmb3JtID0gbnVsbDtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBbXSwge1xuICAgICAgaGVpZ2h0OiB0aGlzLmJsb2NrLmhlaWdodCxcbiAgICAgIHlEb21haW46IFstMSwgMV0sXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0uc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX3dhdmVmb3JtLmNvbmZpZ3VyZVNoYXBlKFNpbXBsZVdhdmVmb3JtU2hhcGUsIHt9LCB7XG4gICAgICBjb2xvcjogdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpLFxuICAgICAgb3ZlcmxheTogdGhpcy5wYXJhbXMuZ2V0KCdvdmVybGF5JyksXG4gICAgICBvdmVybGF5Q29sb3I6IHRoaXMucGFyYW1zLmdldCgnb3ZlcmxheUNvbG9yJyksXG4gICAgICBvdmVybGF5T3BhY2l0eTogdGhpcy5wYXJhbXMuZ2V0KCdvdmVybGF5T3BhY2l0eScpLFxuICAgIH0pO1xuXG4gICAgdHJhY2suYWRkKHRoaXMuX3dhdmVmb3JtKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICB0aGlzLmJsb2NrLnVpLnRyYWNrLnJlbW92ZSh0aGlzLl93YXZlZm9ybSk7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy5fd2F2ZWZvcm0uZGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICB0aGlzLl93YXZlZm9ybS5yZW5kZXIoKTsgLy8gdXBkYXRlIGJpbmRpbmdzIGJldHdlZW4gZGF0YSBhbmQgc2hhcGVzXG5cbiAgICAvLyBoYWNrIHRvIHNldCB0aGUgc21hcGxlIHJhdGUgcHJvcGVybHlcbiAgICBjb25zdCAkaXRlbSA9IHRoaXMuX3dhdmVmb3JtLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2ltcGxlLXdhdmVmb3JtJyk7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl93YXZlZm9ybS5nZXRTaGFwZUZyb21JdGVtKCRpdGVtKTtcbiAgICBzaGFwZS5wYXJhbXMuc2FtcGxlUmF0ZSA9IGJ1ZmZlci5zYW1wbGVSYXRlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbXBsZVdhdmVmb3JtO1xuIl19