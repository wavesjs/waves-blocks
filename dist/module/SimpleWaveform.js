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

      // hack to set the smaple rate properly
      var $item = this._waveform.$el.querySelector('.simple-waveform');
      var shape = this._waveform.getShapeFromItem($item);
      shape.params.sampleRate = buffer.sampleRate;

      this._waveform.render(); // update bindings between data and shapes
    }
  }]);
  return SimpleWaveform;
}(_AbstractModule3.default);

exports.default = SimpleWaveform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpbXBsZVdhdmVmb3JtLmpzIl0sIm5hbWVzIjpbInVpIiwiU2ltcGxlV2F2ZWZvcm1TaGFwZSIsInNhbXBsZVJhdGUiLCJjb2xvciIsIm9wYWNpdHkiLCJvdmVybGF5Iiwib3ZlcmxheUNvbG9yIiwib3ZlcmxheU9wYWNpdHkiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsIiRwYXRoIiwic2V0QXR0cmlidXRlTlMiLCJwYXJhbXMiLCJzdHlsZSIsImFwcGVuZENoaWxkIiwiJG92ZXJsYXkiLCJmaWxsIiwiZmlsbE9wYWNpdHkiLCJkYXR1bSIsInNsaWNlTWV0aG9kIiwiRmxvYXQzMkFycmF5IiwibmJyU2FtcGxlcyIsImxlbmd0aCIsImR1cmF0aW9uIiwid2lkdGgiLCJ0aW1lVG9QaXhlbCIsInNhbXBsZXNQZXJQaXhlbCIsIm1pblgiLCJtYXhYIiwicGl4ZWxUb1RpbWUiLCJpbnZlcnQiLCJibG9ja1NpemUiLCJtaW5NYXgiLCJweCIsInN0YXJ0VGltZSIsInN0YXJ0U2FtcGxlIiwiZXh0cmFjdCIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwiaiIsImwiLCJzYW1wbGUiLCJpc0Zpbml0ZSIsInB1c2giLCJQSVhFTCIsIk1JTiIsIk1BWCIsImQiLCJpIiwieCIsInkxIiwiTWF0aCIsInJvdW5kIiwidmFsdWVUb1BpeGVsIiwieTIiLCJzZXRBdHRyaWJ1dGUiLCJoZWlnaHQiLCJzaGFwZXMiLCJCYXNlU2hhcGUiLCJkZWZpbml0aW9ucyIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJtZXRhcyIsImRlc2MiLCJTaW1wbGVXYXZlZm9ybSIsIm9wdGlvbnMiLCJfd2F2ZWZvcm0iLCJibG9jayIsInRyYWNrIiwidGltZUNvbnRleHQiLCJjb3JlIiwiTGF5ZXIiLCJ5RG9tYWluIiwiekluZGV4Iiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsImdldCIsImFkZCIsInJlbW92ZSIsImJ1ZmZlciIsIm1ldGFkYXRhIiwiZGF0YSIsImdldENoYW5uZWxEYXRhIiwiJGl0ZW0iLCJxdWVyeVNlbGVjdG9yIiwic2hhcGUiLCJnZXRTaGFwZUZyb21JdGVtIiwicmVuZGVyIiwiQWJzdHJhY3RNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUE7SUFDTUMsbUI7Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLGlCQUFQO0FBQTBCOzs7dUNBRXhCO0FBQUUsYUFBTyxFQUFQO0FBQVc7OzttQ0FFakI7QUFDYixhQUFPO0FBQ0xDLG9CQUFZLEtBRFA7QUFFTEMsZUFBTyxTQUZGO0FBR0xDLGlCQUFTLENBSEo7QUFJTEMsaUJBQVMsS0FKSjtBQUtMQyxzQkFBYyxTQUxUO0FBTUxDLHdCQUFnQjtBQU5YLE9BQVA7QUFRRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixVQUFJLEtBQUtDLEdBQVQsRUFDRSxPQUFPLEtBQUtBLEdBQVo7O0FBRUYsV0FBS0EsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLEdBQWxDLENBQVg7O0FBRUEsV0FBS0MsS0FBTCxHQUFhSCxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLE1BQWxDLENBQWI7QUFDQSxXQUFLQyxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEMsRUFBd0MsTUFBeEM7QUFDQSxXQUFLRCxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsaUJBQWhDLEVBQW1ELFlBQW5EO0FBQ0EsV0FBS0QsS0FBTCxDQUFXQyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLFFBQWhDLEVBQTBDLEtBQUtDLE1BQUwsQ0FBWVosS0FBdEQ7QUFDQSxXQUFLVSxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEMsRUFBd0MsS0FBS0MsTUFBTCxDQUFZWixLQUFwRDtBQUNBLFdBQUtVLEtBQUws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TCxXQUE5QjtBQUNBLFdBQUtILFNBQUwsQ0FBZVMsY0FBZixDQUE4Qi9FLG1CQUE5QixFQUFtRCxFQUFuRCxFQUF1RDtBQUNyREUsZUFBTyxLQUFLWSxNQUFMLENBQVlrRSxHQUFaLENBQWdCLE9BQWhCLENBRDhDO0FBRXJENUUsaUJBQVMsS0FBS1UsTUFBTCxDQUFZa0UsR0FBWixDQUFnQixTQUFoQixDQUY0QztBQUdyRDNFLHNCQUFjLEtBQUtTLE1BQUwsQ0FBWWtFLEdBQVosQ0FBZ0IsY0FBaEIsQ0FIdUM7QUFJckQxRSx3QkFBZ0IsS0FBS1EsTUFBTCxDQUFZa0UsR0FBWixDQUFnQixnQkFBaEI7QUFKcUMsT0FBdkQ7O0FBT0FSLFlBQU1TLEdBQU4sQ0FBVSxLQUFLWCxTQUFmO0FBQ0Q7OztnQ0FFVztBQUNWLFdBQUtDLEtBQUwsQ0FBV3hFLEVBQVgsQ0FBY3lFLEtBQWQsQ0FBb0JVLE1BQXBCLENBQTJCLEtBQUtaLFNBQWhDO0FBQ0Q7Ozs2QkFFUWEsTSxFQUFRQyxRLEVBQVU7QUFDekIsV0FBS2QsU0FBTCxDQUFlZSxJQUFmLEdBQXNCRixPQUFPRyxjQUFQLENBQXNCLENBQXRCLENBQXRCOztBQUVBO0FBQ0EsVUFBTUMsUUFBUSxLQUFLakIsU0FBTCxDQUFlOUQsR0FBZixDQUFtQmdGLGFBQW5CLENBQWlDLGtCQUFqQyxDQUFkO0FBQ0EsVUFBTUMsUUFBUSxLQUFLbkIsU0FBTCxDQUFlb0IsZ0JBQWYsQ0FBZ0NILEtBQWhDLENBQWQ7QUFDQUUsWUFBTTNFLE1BQU4sQ0FBYWIsVUFBYixHQUEwQmtGLE9BQU9sRixVQUFqQzs7QUFFQSxXQUFLcUUsU0FBTCxDQUFlcUIsTUFBZixHQVJ5QixDQVFBO0FBQzFCOzs7RUF4QzBCQyx3Qjs7a0JBMkNkeEIsYyIsImZpbGUiOiJTaW1wbGVXYXZlZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBTaW1wbGVXYXZlZm9ybVNoYXBlIGV4dGVuZHMgdWkuc2hhcGVzLkJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaW1wbGUtd2F2ZWZvcm0nIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge30gfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgICAgb3ZlcmxheUNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvdmVybGF5T3BhY2l0eTogMC40LFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKVxuICAgICAgcmV0dXJuIHRoaXMuJGVsO1xuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcblxuICAgIHRoaXMuJHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJHBhdGguc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRwYXRoKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5vdmVybGF5ID09PSB0cnVlKSB7XG4gICAgICB0aGlzLiRvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICB0aGlzLiRvdmVybGF5LnN0eWxlLmZpbGwgPSB0aGlzLnBhcmFtcy5vdmVybGF5Q29sb3I7XG4gICAgICB0aGlzLiRvdmVybGF5LnN0eWxlLmZpbGxPcGFjaXR5ID0gdGhpcy5wYXJhbXMub3ZlcmxheU9wYWNpdHk7XG5cbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG92ZXJsYXkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIC8vIGRlZmluZSBuYnIgb2Ygc2FtcGxlcyBwZXIgcGl4ZWxzXG4gICAgY29uc3Qgc2xpY2VNZXRob2QgPSBkYXR1bSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSA/ICdzdWJhcnJheScgOiAnc2xpY2UnO1xuICAgIGNvbnN0IG5iclNhbXBsZXMgPSBkYXR1bS5sZW5ndGg7XG4gICAgY29uc3QgZHVyYXRpb24gPSBuYnJTYW1wbGVzIC8gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZHVyYXRpb24pO1xuICAgIGNvbnN0IHNhbXBsZXNQZXJQaXhlbCA9IG5iclNhbXBsZXMgLyB3aWR0aDtcblxuICAgIGlmICghc2FtcGxlc1BlclBpeGVsIHx8IGRhdHVtLmxlbmd0aCA8IHNhbXBsZXNQZXJQaXhlbClcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHsgbWluWCwgbWF4WCB9ID0gcmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBwaXhlbFRvVGltZSA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0O1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IDM7IC8vIHRoaXMucGFyYW1zLmJhcldpZHRoO1xuICAgIGNvbnN0IG1pbk1heCA9IFtdO1xuXG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIGJhciwgY2xhbXBlZCB0byB0aGUgdmlzaWJsZSBhcmVhXG4gICAgZm9yIChsZXQgcHggPSBtaW5YOyBweCA8IG1heFg7IHB4ICs9IGJsb2NrU2l6ZSkge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcGl4ZWxUb1RpbWUocHgpO1xuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBzdGFydFRpbWUgKiBzYW1wbGVSYXRlO1xuICAgICAgY29uc3QgZXh0cmFjdCA9IGRhdHVtW3NsaWNlTWV0aG9kXShzdGFydFNhbXBsZSwgc3RhcnRTYW1wbGUgKyBzYW1wbGVzUGVyUGl4ZWwpO1xuXG4gICAgICBsZXQgbWluID0gSW5maW5pdHk7XG4gICAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGV4dHJhY3QubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBleHRyYWN0W2pdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSBtaW4gPSBzYW1wbGU7XG4gICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIG1heCA9IHNhbXBsZTtcbiAgICAgIH1cbiAgICAgIC8vIGRpc2FsbG93IEluZmluaXR5XG4gICAgICBtaW4gPSAhaXNGaW5pdGUobWluKSA/IDAgOiBtaW47XG4gICAgICBtYXggPSAhaXNGaW5pdGUobWF4KSA/IDAgOiBtYXg7XG5cbiAgICAgIG1pbk1heC5wdXNoKFtweCwgbWluLCBtYXhdKTtcbiAgICB9XG5cbiAgICBpZiAobWluTWF4Lmxlbmd0aCkge1xuICAgICAgY29uc3QgUElYRUwgPSAwO1xuICAgICAgY29uc3QgTUlOICAgPSAxO1xuICAgICAgY29uc3QgTUFYICAgPSAyO1xuXG4gICAgICBsZXQgZCA9ICdNJztcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBtaW5NYXgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdHVtID0gbWluTWF4W2ldO1xuICAgICAgICBjb25zdCB4ICA9IGRhdHVtW1BJWEVMXTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuXG4gICAgICAgIGQgKz0gYCR7eH0sJHt5MX1MJHt4fSwke3kyfUwke3ggKyBibG9ja1NpemUgLSAyfSwke3kyfUwke3ggKyBibG9ja1NpemUgLSAyfSwke3kxfUwke3h9LCR7eTF9YDtcblxuICAgICAgICBpZiAoaSA8IGwgLSAxKVxuICAgICAgICAgIGQgKz0gJ00nO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLm92ZXJsYXkpIHtcbiAgICAgIHRoaXMuJG92ZXJsYXkuc2V0QXR0cmlidXRlKCd4JywgMCk7XG4gICAgICB0aGlzLiRvdmVybGF5LnNldEF0dHJpYnV0ZSgneScsIDApO1xuICAgICAgdGhpcy4kb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgcmVuZGVyaW5nQ29udGV4dC53aWR0aCk7XG4gICAgICB0aGlzLiRvdmVybGF5LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgLyAyKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnc3RlZWxibHVlJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBtZXRhczoge1xuICAgICAgZGVzYzogJ2NvbG9yIG9mIHRoZSB3YXZlZm9ybSdcbiAgICB9LFxuICB9LFxuICBvdmVybGF5OiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnRGVmaW5lIGlmIGFuIG92ZXJsYXkgc2hvdWxkIGJlIGRpc3BsYXllZCBvbiB0aGUgYm90dG9tIG9mIHRoZSB3YXZlZm9ybScsXG4gICAgfSxcbiAgfSxcbiAgb3ZlcmxheUNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJyMwMDAwMDAnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG1ldGFzOiB7XG4gICAgICBkZXNjOiAnQ29sb3Igb2YgdGhlIG92ZXJsYXknLFxuICAgIH0sXG4gIH0sXG4gIG92ZXJsYXlPcGFjaXR5OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjQsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdPcGFjaXR5IG9mIHRoZSBvdmVybGF5JyxcbiAgICB9LFxuICB9XG59O1xuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGRpc3BsYXkgdGhlIHdhdmVmb3JtIG9mIHRoZSBhdWRpbyBidWZmZXIuIEluIGNhc2Ugbm9uLW1vbm9cbiAqIGF1ZGlvIGZpbGVzLCBvbmx5IHRoZSBsZWZ0IGNoYW5uZWwgaXMgcmVuZGVyZWQuIEZvciBtb3JlIGFjY3VyYXRlXG4gKiByZXByZXNlbnRhdGlvbiBzZWUgV2F2ZWZvcm1Nb2R1bGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nc3RlZWxibHVlJ10gLSBDb2xvciBvZiB0aGUgd2F2ZWZvcm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5vdmVybGF5PWZhbHNlXSAtIERpc3BsYXkgYW4gb3ZlcmxheSBvZiB0aGUgYm90dG9tXG4gKiAgc2VjdGlvbiBvZiB0aGUgd2F2ZWZvcm0uXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMub3ZlcmxheUNvbG9yPScjMDAwMDAwJ10gLSBDb2xvciBvZiB0aGUgb3ZlcmxheS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5vdmVybGF5T3BhY2l0eT0wLjRdIC0gT3BhY2l0eSBvZiB0aGUgb3ZlcmxheS5cbiAqL1xuY2xhc3MgU2ltcGxlV2F2ZWZvcm0gZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG51bGw7XG4gIH1cblxuICBpbnN0YWxsKCkge1xuICAgIGNvbnN0IHsgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSB0aGlzLmJsb2NrLnVpO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0gPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgW10sIHtcbiAgICAgIGhlaWdodDogdGhpcy5ibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbLTEsIDFdLFxuICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcbiAgICB9KTtcblxuICAgIHRoaXMuX3dhdmVmb3JtLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB0aGlzLl93YXZlZm9ybS5jb25maWd1cmVTaGFwZShTaW1wbGVXYXZlZm9ybVNoYXBlLCB7fSwge1xuICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmdldCgnY29sb3InKSxcbiAgICAgIG92ZXJsYXk6IHRoaXMucGFyYW1zLmdldCgnb3ZlcmxheScpLFxuICAgICAgb3ZlcmxheUNvbG9yOiB0aGlzLnBhcmFtcy5nZXQoJ292ZXJsYXlDb2xvcicpLFxuICAgICAgb3ZlcmxheU9wYWNpdHk6IHRoaXMucGFyYW1zLmdldCgnb3ZlcmxheU9wYWNpdHknKSxcbiAgICB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl93YXZlZm9ybSk7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgdGhpcy5ibG9jay51aS50cmFjay5yZW1vdmUodGhpcy5fd2F2ZWZvcm0pO1xuICB9XG5cbiAgc2V0VHJhY2soYnVmZmVyLCBtZXRhZGF0YSkge1xuICAgIHRoaXMuX3dhdmVmb3JtLmRhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cbiAgICAvLyBoYWNrIHRvIHNldCB0aGUgc21hcGxlIHJhdGUgcHJvcGVybHlcbiAgICBjb25zdCAkaXRlbSA9IHRoaXMuX3dhdmVmb3JtLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2ltcGxlLXdhdmVmb3JtJyk7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl93YXZlZm9ybS5nZXRTaGFwZUZyb21JdGVtKCRpdGVtKTtcbiAgICBzaGFwZS5wYXJhbXMuc2FtcGxlUmF0ZSA9IGJ1ZmZlci5zYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0ucmVuZGVyKCk7IC8vIHVwZGF0ZSBiaW5kaW5ncyBiZXR3ZWVuIGRhdGEgYW5kIHNoYXBlc1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbXBsZVdhdmVmb3JtO1xuIl19