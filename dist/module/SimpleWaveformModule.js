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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpbXBsZVdhdmVmb3JtTW9kdWxlLmpzIl0sIm5hbWVzIjpbInVpIiwiU2ltcGxlV2F2ZWZvcm0iLCJzYW1wbGVSYXRlIiwiY29sb3IiLCJvcGFjaXR5IiwicmVuZGVyaW5nQ29udGV4dCIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwibnMiLCJzZXRBdHRyaWJ1dGVOUyIsInBhcmFtcyIsInN0eWxlIiwiZGF0dW0iLCJzbGljZU1ldGhvZCIsIkZsb2F0MzJBcnJheSIsIm5iclNhbXBsZXMiLCJsZW5ndGgiLCJkdXJhdGlvbiIsIndpZHRoIiwidGltZVRvUGl4ZWwiLCJzYW1wbGVzUGVyUGl4ZWwiLCJtaW5YIiwibWF4WCIsInBpeGVsVG9UaW1lIiwiaW52ZXJ0IiwiYmxvY2tTaXplIiwibWluTWF4IiwicHgiLCJzdGFydFRpbWUiLCJzdGFydFNhbXBsZSIsImV4dHJhY3QiLCJtaW4iLCJJbmZpbml0eSIsIm1heCIsImoiLCJsIiwic2FtcGxlIiwiaXNGaW5pdGUiLCJwdXNoIiwiUElYRUwiLCJNSU4iLCJNQVgiLCJkIiwiaSIsIngiLCJ5MSIsIk1hdGgiLCJyb3VuZCIsInZhbHVlVG9QaXhlbCIsInkyIiwic2hhcGVzIiwiQmFzZVNoYXBlIiwiZGVmaW5pdGlvbnMiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwiU2ltcGxlV2F2ZWZvcm1Nb2R1bGUiLCJvcHRpb25zIiwiX3dhdmVmb3JtIiwiYmxvY2siLCJ0cmFjayIsInRpbWVDb250ZXh0IiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwieURvbWFpbiIsInpJbmRleCIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJnZXQiLCJhZGQiLCJyZW1vdmUiLCJidWZmZXIiLCJtZXRhZGF0YSIsImRhdGEiLCJnZXRDaGFubmVsRGF0YSIsInJlbmRlciIsIiRpdGVtIiwicXVlcnlTZWxlY3RvciIsInNoYXBlIiwiZ2V0U2hhcGVGcm9tSXRlbSJd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UCxDQUFzQixDQUF0QixDQUF0QjtBQUNBLFdBQUtqQixTQUFMLENBQWVrQixNQUFmLEdBRnlCLENBRUE7O0FBRXpCO0FBQ0EsVUFBTUMsUUFBUSxLQUFLbkIsU0FBTCxDQUFldkQsR0FBZixDQUFtQjJFLGFBQW5CLENBQWlDLGtCQUFqQyxDQUFkO0FBQ0EsVUFBTUMsUUFBUSxLQUFLckIsU0FBTCxDQUFlc0IsZ0JBQWYsQ0FBZ0NILEtBQWhDLENBQWQ7QUFDQUUsWUFBTXZFLE1BQU4sQ0FBYVQsVUFBYixHQUEwQnlFLE9BQU96RSxVQUFqQztBQUNEOzs7OztrQkFHWXlELG9CIiwiZmlsZSI6IlNpbXBsZVdhdmVmb3JtTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG5cbmNsYXNzIFNpbXBsZVdhdmVmb3JtIGV4dGVuZHMgdWkuc2hhcGVzLkJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaW1wbGUtd2F2ZWZvcm0nIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge30gfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICB9XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbClcbiAgICAgIHJldHVybiB0aGlzLiRlbDtcblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICAvLyBkZWZpbmUgbmJyIG9mIHNhbXBsZXMgcGVyIHBpeGVsc1xuICAgIGNvbnN0IHNsaWNlTWV0aG9kID0gZGF0dW0gaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgPyAnc3ViYXJyYXknIDogJ3NsaWNlJztcbiAgICBjb25zdCBuYnJTYW1wbGVzID0gZGF0dW0ubGVuZ3RoO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbmJyU2FtcGxlcyAvIHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGR1cmF0aW9uKTtcbiAgICBjb25zdCBzYW1wbGVzUGVyUGl4ZWwgPSBuYnJTYW1wbGVzIC8gd2lkdGg7XG5cbiAgICBpZiAoIXNhbXBsZXNQZXJQaXhlbCB8fCBkYXR1bS5sZW5ndGggPCBzYW1wbGVzUGVyUGl4ZWwpXG4gICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7IG1pblgsIG1heFggfSA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgcGl4ZWxUb1RpbWUgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydDtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBibG9ja1NpemUgPSA1OyAvLyB0aGlzLnBhcmFtcy5iYXJXaWR0aDtcbiAgICBjb25zdCBtaW5NYXggPSBbXTtcblxuICAgIC8vIGdldCBtaW4vbWF4IHBlciBiYXIsIGNsYW1wZWQgdG8gdGhlIHZpc2libGUgYXJlYVxuICAgIGZvciAobGV0IHB4ID0gbWluWDsgcHggPCBtYXhYOyBweCArPSBibG9ja1NpemUpIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHBpeGVsVG9UaW1lKHB4KTtcbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gc3RhcnRUaW1lICogc2FtcGxlUmF0ZTtcbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcblxuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBleHRyYWN0Lmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICBsZXQgc2FtcGxlID0gZXh0cmFjdFtqXTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgbWluID0gc2FtcGxlO1xuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSBtYXggPSBzYW1wbGU7XG4gICAgICB9XG4gICAgICAvLyBkaXNhbGxvdyBJbmZpbml0eVxuICAgICAgbWluID0gIWlzRmluaXRlKG1pbikgPyAwIDogbWluO1xuICAgICAgbWF4ID0gIWlzRmluaXRlKG1heCkgPyAwIDogbWF4O1xuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgaWYgKG1pbk1heC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IFBJWEVMID0gMDtcbiAgICAgIGNvbnN0IE1JTiAgID0gMTtcbiAgICAgIGNvbnN0IE1BWCAgID0gMjtcblxuICAgICAgbGV0IGQgPSAnTSc7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbWluTWF4Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCBkYXR1bSA9IG1pbk1heFtpXTtcbiAgICAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcblxuICAgICAgICBkICs9IGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1MJHt4ICsgYmxvY2tTaXplIC0gMn0sJHt5Mn1MJHt4ICsgYmxvY2tTaXplIC0gMn0sJHt5MX1MJHt4fSwke3kxfWA7XG5cbiAgICAgICAgaWYgKGkgPCBsIC0gMSlcbiAgICAgICAgICBkICs9ICdNJztcbiAgICAgIH1cblxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3N0ZWVsYmx1ZScsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgd2F2ZWZvcm0nXG4gICAgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgZGlzcGxheSB0aGUgd2F2ZWZvcm0gb2YgdGhlIGF1ZGlvIGJ1ZmZlci4gSW4gY2FzZSBub24tbW9ub1xuICogYXVkaW8gZmlsZXMsIG9ubHkgdGhlIGxlZnQgY2hhbm5lbCBpcyByZW5kZXJlZC4gRm9yIG1vcmUgYWNjdXJhdGVcbiAqIHJlcHJlc2VudGF0aW9uIHNlZSBXYXZlZm9ybU1vZHVsZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdzdGVlbGJsdWUnXSAtIENvbG9yIG9mIHRoZSB3YXZlZm9ybVxuICovXG5jbGFzcyBTaW1wbGVXYXZlZm9ybU1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3dhdmVmb3JtID0gbnVsbDtcbiAgfVxuXG4gIGluc3RhbGwoKSB7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IHRoaXMuYmxvY2sudWk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBbXSwge1xuICAgICAgaGVpZ2h0OiB0aGlzLmJsb2NrLmhlaWdodCxcbiAgICAgIHlEb21haW46IFstMSwgMV0sXG4gICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgIH0pO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0uc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX3dhdmVmb3JtLmNvbmZpZ3VyZVNoYXBlKFNpbXBsZVdhdmVmb3JtLCB7fSwge1xuICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmdldCgnY29sb3InKSxcbiAgICB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl93YXZlZm9ybSk7XG4gIH1cblxuICB1bmluc3RhbGwoKSB7XG4gICAgdGhpcy5ibG9jay51aS50cmFjay5yZW1vdmUodGhpcy5fd2F2ZWZvcm0pO1xuICB9XG5cbiAgc2V0VHJhY2soYnVmZmVyLCBtZXRhZGF0YSkge1xuICAgIHRoaXMuX3dhdmVmb3JtLmRhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgdGhpcy5fd2F2ZWZvcm0ucmVuZGVyKCk7IC8vIHVwZGF0ZSBiaW5kaW5ncyBiZXR3ZWVuIGRhdGEgYW5kIHNoYXBlc1xuXG4gICAgLy8gaGFjayB0byBzZXQgdGhlIHNtYXBsZSByYXRlIHByb3Blcmx5XG4gICAgY29uc3QgJGl0ZW0gPSB0aGlzLl93YXZlZm9ybS4kZWwucXVlcnlTZWxlY3RvcignLnNpbXBsZS13YXZlZm9ybScpO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fd2F2ZWZvcm0uZ2V0U2hhcGVGcm9tSXRlbSgkaXRlbSk7XG4gICAgc2hhcGUucGFyYW1zLnNhbXBsZVJhdGUgPSBidWZmZXIuc2FtcGxlUmF0ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVXYXZlZm9ybU1vZHVsZTtcbiJdfQ==