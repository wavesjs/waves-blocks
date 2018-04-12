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

/** @private */
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
 * @param {String} [options.overlay=false] - Display an overlay of the bottom
 *  section of the waveform.
 * @param {String} [options.overlayColor='#000000'] - Color of the overlay.
 * @param {String} [options.overlayOpacity=0.4] - Opacity of the overlay.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJTaW1wbGVXYXZlZm9ybVNoYXBlIiwic2FtcGxlUmF0ZSIsImNvbG9yIiwib3BhY2l0eSIsIm92ZXJsYXkiLCJvdmVybGF5Q29sb3IiLCJvdmVybGF5T3BhY2l0eSIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJHBhdGgiLCJzZXRBdHRyaWJ1dGVOUyIsInBhcmFtcyIsInN0eWxlIiwiYXBwZW5kQ2hpbGQiLCIkb3ZlcmxheSIsImZpbGwiLCJmaWxsT3BhY2l0eSIsImRhdHVtIiwic2xpY2VNZXRob2QiLCJGbG9hdDMyQXJyYXkiLCJuYnJTYW1wbGVzIiwibGVuZ3RoIiwiZHVyYXRpb24iLCJ3aWR0aCIsInRpbWVUb1BpeGVsIiwic2FtcGxlc1BlclBpeGVsIiwibWluWCIsIm1heFgiLCJwaXhlbFRvVGltZSIsImludmVydCIsImJsb2NrU2l6ZSIsIm1pbk1heCIsInB4Iiwic3RhcnRUaW1lIiwic3RhcnRTYW1wbGUiLCJleHRyYWN0IiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJqIiwibCIsInNhbXBsZSIsImlzRmluaXRlIiwicHVzaCIsIlBJWEVMIiwiTUlOIiwiTUFYIiwiZCIsImkiLCJ4IiwieTEiLCJNYXRoIiwicm91bmQiLCJ2YWx1ZVRvUGl4ZWwiLCJ5MiIsInNldEF0dHJpYnV0ZSIsImhlaWdodCIsInNoYXBlcyIsIkJhc2VTaGFwZSIsImRlZmluaXRpb25zIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm1ldGFzIiwiZGVzYyIsIlNpbXBsZVdhdmVmb3JtIiwib3B0aW9ucyIsIl93YXZlZm9ybSIsImJsb2NrIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsImNvcmUiLCJMYXllciIsInlEb21haW4iLCJ6SW5kZXgiLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwiZ2V0IiwiYWRkIiwicmVtb3ZlIiwiYnVmZmVyIiwibWV0YWRhdGEiLCJkYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJyZW5kZXIiLCIkaXRlbSIsInF1ZXJ5U2VsZWN0b3IiLCJzaGFwZSIsImdldFNoYXBlRnJvbUl0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUE7SUFDTUMsbUI7Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLGlCQUFQO0FBQTBCOzs7dUNBRXhCO0FBQUUsYUFBTyxFQUFQO0FBQVc7OzttQ0FFakI7QUFDYixhQUFPO0FBQ0xDLG9CQUFZLEtBRFA7QUFFTEMsZUFBTyxTQUZGO0FBR0xDLGlCQUFTLENBSEo7QUFJTEMsaUJBQVMsS0FKSjtBQUtMQyxzQkFBYyxTQUxUO0FBTUxDLHdCQUFnQjtBQU5YLE9BQVA7QUFRRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixVQUFJLEtBQUtDLEdBQVQsRUFDRSxPQUFPLEtBQUtBLEdBQVo7O0FBRUYsV0FBS0EsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLEdBQWxDLENBQVg7O0FBRUEsV0FBS0MsS0FBTCxHQUFhSCxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLE1BQWxDLENBQWI7QUFDQSxXQUFLQyxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEMsRUFBd0MsTUFBeEM7QUFDQSxXQUFLRCxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsaUJBQWhDLEVBQW1ELFlBQW5EO0FBQ0EsV0FBS0QsS0FBTCxDQUFXQyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLFFBQWhDLEVBQTBDLEtBQUtDLE1BQUwsQ0FBWVosS0FBdEQ7QUFDQSxXQUFLVSxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEMsRUFBd0MsS0FBS0MsTUFBTCxDQUFZWixLQUFwRDtBQUNBLFdBQUtVLEtBQUwsQ0FBV0csS0FBWCxDQUFpQlosT0FBakIs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Q0FBZVMsY0FBZixDQUE4Qi9FLG1CQUE5QixFQUFtRCxFQUFuRCxFQUF1RDtBQUNyREUsZUFBTyxLQUFLWSxNQUFMLENBQVlrRSxHQUFaLENBQWdCLE9BQWhCLENBRDhDO0FBRXJENUUsaUJBQVMsS0FBS1UsTUFBTCxDQUFZa0UsR0FBWixDQUFnQixTQUFoQixDQUY0QztBQUdyRDNFLHNCQUFjLEtBQUtTLE1BQUwsQ0FBWWtFLEdBQVosQ0FBZ0IsY0FBaEIsQ0FIdUM7QUFJckQxRSx3QkFBZ0IsS0FBS1EsTUFBTCxDQUFZa0UsR0FBWixDQUFnQixnQkFBaEI7QUFKcUMsT0FBdkQ7O0FBT0FSLFlBQU1TLEdBQU4sQ0FBVSxLQUFLWCxTQUFmO0FBQ0Q7OztnQ0FFVztBQUNWLFdBQUtDLEtBQUwsQ0FBV3hFLEVBQVgsQ0FBY3lFLEtBQWQsQ0FBb0JVLE1BQXBCLENBQTJCLEtBQUtaLFNBQWhDO0FBQ0Q7Ozs2QkFFUWEsTSxFQUFRQyxRLEVBQVU7QUFDekIsV0FBS2QsU0FBTCxDQUFlZSxJQUFmLEdBQXNCRixPQUFPRyxjQUFQLENBQXNCLENBQXRCLENBQXRCO0FBQ0EsV0FBS2hCLFNBQUwsQ0FBZWlCLE1BQWYsR0FGeUIsQ0FFQTs7QUFFekI7QUFDQSxVQUFNQyxRQUFRLEtBQUtsQixTQUFMLENBQWU5RCxHQUFmLENBQW1CaUYsYUFBbkIsQ0FBaUMsa0JBQWpDLENBQWQ7QUFDQSxVQUFNQyxRQUFRLEtBQUtwQixTQUFMLENBQWVxQixnQkFBZixDQUFnQ0gsS0FBaEMsQ0FBZDtBQUNBRSxZQUFNNUUsTUFBTixDQUFhYixVQUFiLEdBQTBCa0YsT0FBT2xGLFVBQWpDO0FBQ0Q7Ozs7O2tCQUdZbUUsYyIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIFNpbXBsZVdhdmVmb3JtU2hhcGUgZXh0ZW5kcyB1aS5zaGFwZXMuQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NpbXBsZS13YXZlZm9ybScgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7IHJldHVybiB7fSB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgb3ZlcmxheTogZmFsc2UsXG4gICAgICBvdmVybGF5Q29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG92ZXJsYXlPcGFjaXR5OiAwLjQsXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpXG4gICAgICByZXR1cm4gdGhpcy4kZWw7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHBhdGgpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLm92ZXJsYXkgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuJG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc3R5bGUuZmlsbCA9IHRoaXMucGFyYW1zLm92ZXJsYXlDb2xvcjtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc3R5bGUuZmlsbE9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vdmVybGF5T3BhY2l0eTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kb3ZlcmxheSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgeyBtaW5YLCBtYXhYIH0gPSByZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IHBpeGVsVG9UaW1lID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQ7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gMzsgLy8gdGhpcy5wYXJhbXMuYmFyV2lkdGg7XG4gICAgY29uc3QgbWluTWF4ID0gW107XG5cbiAgICAvLyBnZXQgbWluL21heCBwZXIgYmFyLCBjbGFtcGVkIHRvIHRoZSB2aXNpYmxlIGFyZWFcbiAgICBmb3IgKGxldCBweCA9IG1pblg7IHB4IDwgbWF4WDsgcHggKz0gYmxvY2tTaXplKSB7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwaXhlbFRvVGltZShweCk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHNhbXBsZVJhdGU7XG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG5cbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZXh0cmFjdC5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIG1pbiA9IHNhbXBsZTtcbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgbWF4ID0gc2FtcGxlO1xuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9ICFpc0Zpbml0ZShtaW4pID8gMCA6IG1pbjtcbiAgICAgIG1heCA9ICFpc0Zpbml0ZShtYXgpID8gMCA6IG1heDtcblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGlmIChtaW5NYXgubGVuZ3RoKSB7XG4gICAgICBjb25zdCBQSVhFTCA9IDA7XG4gICAgICBjb25zdCBNSU4gICA9IDE7XG4gICAgICBjb25zdCBNQVggICA9IDI7XG5cbiAgICAgIGxldCBkID0gJ00nO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG1pbk1heC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0dW0gPSBtaW5NYXhbaV07XG4gICAgICAgIGNvbnN0IHggID0gZGF0dW1bUElYRUxdO1xuICAgICAgICBsZXQgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01JTl0pKTtcbiAgICAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNQVhdKSk7XG5cbiAgICAgICAgZCArPSBgJHt4fSwke3kxfUwke3h9LCR7eTJ9TCR7eCArIGJsb2NrU2l6ZSAtIDJ9LCR7eTJ9TCR7eCArIGJsb2NrU2l6ZSAtIDJ9LCR7eTF9TCR7eH0sJHt5MX1gO1xuXG4gICAgICAgIGlmIChpIDwgbCAtIDEpXG4gICAgICAgICAgZCArPSAnTSc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMub3ZlcmxheSkge1xuICAgICAgdGhpcy4kb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3gnLCAwKTtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc2V0QXR0cmlidXRlKCd5JywgMCk7XG4gICAgICB0aGlzLiRvdmVybGF5LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCByZW5kZXJpbmdDb250ZXh0LndpZHRoKTtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCAvIDIpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdzdGVlbGJsdWUnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnY29sb3Igb2YgdGhlIHdhdmVmb3JtJ1xuICAgIH0sXG4gIH0sXG4gIG92ZXJsYXk6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdEZWZpbmUgaWYgYW4gb3ZlcmxheSBzaG91bGQgYmUgZGlzcGxheWVkIG9uIHRoZSBib3R0b20gb2YgdGhlIHdhdmVmb3JtJyxcbiAgICB9LFxuICB9LFxuICBvdmVybGF5Q29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnIzAwMDAwMCcsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdDb2xvciBvZiB0aGUgb3ZlcmxheScsXG4gICAgfSxcbiAgfSxcbiAgb3ZlcmxheU9wYWNpdHk6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuNCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ09wYWNpdHkgb2YgdGhlIG92ZXJsYXknLFxuICAgIH0sXG4gIH1cbn07XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgZGlzcGxheSB0aGUgd2F2ZWZvcm0gb2YgdGhlIGF1ZGlvIGJ1ZmZlci4gSW4gY2FzZSBub24tbW9ub1xuICogYXVkaW8gZmlsZXMsIG9ubHkgdGhlIGxlZnQgY2hhbm5lbCBpcyByZW5kZXJlZC4gRm9yIG1vcmUgYWNjdXJhdGVcbiAqIHJlcHJlc2VudGF0aW9uIHNlZSBXYXZlZm9ybU1vZHVsZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdzdGVlbGJsdWUnXSAtIENvbG9yIG9mIHRoZSB3YXZlZm9ybVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm92ZXJsYXk9ZmFsc2VdIC0gRGlzcGxheSBhbiBvdmVybGF5IG9mIHRoZSBib3R0b21cbiAqICBzZWN0aW9uIG9mIHRoZSB3YXZlZm9ybS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5vdmVybGF5Q29sb3I9JyMwMDAwMDAnXSAtIENvbG9yIG9mIHRoZSBvdmVybGF5LlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm92ZXJsYXlPcGFjaXR5PTAuNF0gLSBPcGFjaXR5IG9mIHRoZSBvdmVybGF5LlxuICovXG5jbGFzcyBTaW1wbGVXYXZlZm9ybSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3dhdmVmb3JtID0gbnVsbDtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBbXSwge1xuICAgICAgaGVpZ2h0OiB0aGlzLmJsb2NrLmhlaWdodCxcbiAgICAgIHlEb21haW46IFstMSwgMV0sXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0uc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX3dhdmVmb3JtLmNvbmZpZ3VyZVNoYXBlKFNpbXBsZVdhdmVmb3JtU2hhcGUsIHt9LCB7XG4gICAgICBjb2xvcjogdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpLFxuICAgICAgb3ZlcmxheTogdGhpcy5wYXJhbXMuZ2V0KCdvdmVybGF5JyksXG4gICAgICBvdmVybGF5Q29sb3I6IHRoaXMucGFyYW1zLmdldCgnb3ZlcmxheUNvbG9yJyksXG4gICAgICBvdmVybGF5T3BhY2l0eTogdGhpcy5wYXJhbXMuZ2V0KCdvdmVybGF5T3BhY2l0eScpLFxuICAgIH0pO1xuXG4gICAgdHJhY2suYWRkKHRoaXMuX3dhdmVmb3JtKTtcbiAgfVxuXG4gIHVuaW5zdGFsbCgpIHtcbiAgICB0aGlzLmJsb2NrLnVpLnRyYWNrLnJlbW92ZSh0aGlzLl93YXZlZm9ybSk7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy5fd2F2ZWZvcm0uZGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICB0aGlzLl93YXZlZm9ybS5yZW5kZXIoKTsgLy8gdXBkYXRlIGJpbmRpbmdzIGJldHdlZW4gZGF0YSBhbmQgc2hhcGVzXG5cbiAgICAvLyBoYWNrIHRvIHNldCB0aGUgc21hcGxlIHJhdGUgcHJvcGVybHlcbiAgICBjb25zdCAkaXRlbSA9IHRoaXMuX3dhdmVmb3JtLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2ltcGxlLXdhdmVmb3JtJyk7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl93YXZlZm9ybS5nZXRTaGFwZUZyb21JdGVtKCRpdGVtKTtcbiAgICBzaGFwZS5wYXJhbXMuc2FtcGxlUmF0ZSA9IGJ1ZmZlci5zYW1wbGVSYXRlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbXBsZVdhdmVmb3JtO1xuIl19