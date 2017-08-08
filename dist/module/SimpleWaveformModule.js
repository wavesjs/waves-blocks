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

      // compute/draw visible area only
      // @TODO refactor this ununderstandable mess
      var minX = Math.max(-renderingContext.offsetX, 0);
      var trackDecay = renderingContext.trackOffsetX + renderingContext.startX;

      if (trackDecay < 0) minX = -trackDecay;

      var maxX = minX;
      maxX += renderingContext.width - minX < renderingContext.visibleWidth ? renderingContext.width : renderingContext.visibleWidth;

      // get min/max per pixels, clamped to the visible area
      var invert = renderingContext.timeToPixel.invert;
      var sampleRate = this.params.sampleRate;
      var minMax = [];

      var blockSize = 5;

      for (var px = minX; px < maxX; px += blockSize) {
        var startTime = invert(px);
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

        // rendering...
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
 * Module that display the waveform of the audio buffer.
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
    value: function install(block) {
      var _block$ui = block.ui,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;


      this._waveform = new ui.core.Layer('entity', [], {
        height: block.height,
        yDomain: [-1, 1]
      });

      this._waveform.setTimeContext(timeContext);
      this._waveform.configureShape(SimpleWaveform, {}, {
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
      var $item = this._waveform.$el.querySelector('.simple-waveform');
      var shape = this._waveform.getShapeFromItem($item);
      shape.params.sampleRate = trackBuffer.sampleRate;

      this._waveform.update();
    }
  }]);
  return SimpleWaveformModule;
}(_AbstractModule3.default);

exports.default = SimpleWaveformModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwiU2ltcGxlV2F2ZWZvcm0iLCJzYW1wbGVSYXRlIiwiY29sb3IiLCJvcGFjaXR5IiwicmVuZGVyaW5nQ29udGV4dCIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwibnMiLCJzZXRBdHRyaWJ1dGVOUyIsInBhcmFtcyIsInN0eWxlIiwiZGF0dW0iLCJzbGljZU1ldGhvZCIsIkZsb2F0MzJBcnJheSIsIm5iclNhbXBsZXMiLCJsZW5ndGgiLCJkdXJhdGlvbiIsIndpZHRoIiwidGltZVRvUGl4ZWwiLCJzYW1wbGVzUGVyUGl4ZWwiLCJtaW5YIiwiTWF0aCIsIm1heCIsIm9mZnNldFgiLCJ0cmFja0RlY2F5IiwidHJhY2tPZmZzZXRYIiwic3RhcnRYIiwibWF4WCIsInZpc2libGVXaWR0aCIsImludmVydCIsIm1pbk1heCIsImJsb2NrU2l6ZSIsInB4Iiwic3RhcnRUaW1lIiwic3RhcnRTYW1wbGUiLCJleHRyYWN0IiwibWluIiwiSW5maW5pdHkiLCJqIiwibCIsInNhbXBsZSIsImlzRmluaXRlIiwicHVzaCIsIlBJWEVMIiwiTUlOIiwiTUFYIiwiZCIsImkiLCJ4IiwieTEiLCJyb3VuZCIsInZhbHVlVG9QaXhlbCIsInkyIiwic2hhcGVzIiwiQmFzZVNoYXBlIiwiZGVmaW5pdGlvbnMiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibWV0YXMiLCJkZXNjIiwiU2ltcGxlV2F2ZWZvcm1Nb2R1bGUiLCJvcHRpb25zIiwiX3dhdmVmb3JtIiwiYmxvY2siLCJ0cmFjayIsInRpbWVDb250ZXh0IiwiY29yZSIsIkxheWVyIiwiaGVpZ2h0IiwieURvbWFpbiIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJnZXQiLCJhZGQiLCJyZW1vdmUiLCJ0cmFja0NvbmZpZyIsInRyYWNrQnVmZmVyIiwiZGF0YSIsImdldENoYW5uZWxEYXRhIiwicmVuZGVyIiwiJGl0ZW0iLCJxdWVyeVNlbGVj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QVlnRSxHQUFaLENBQWdCLE9BQWhCO0FBRHlDLE9BQWxEOztBQUlBUixZQUFNUyxHQUFOLENBQVUsS0FBS1gsU0FBZjtBQUNEOzs7OEJBRVNDLEssRUFBTztBQUFBLFVBQ1BDLEtBRE8sR0FDR0QsTUFBTWxFLEVBRFQsQ0FDUG1FLEtBRE87O0FBRWZBLFlBQU1VLE1BQU4sQ0FBYSxLQUFLWixTQUFsQjtBQUNEOzs7NkJBRVFhLFcsRUFBYUMsVyxFQUFhO0FBQ2pDLFdBQUtkLFNBQUwsQ0FBZWUsSUFBZixHQUFzQkQsWUFBWUUsY0FBWixDQUEyQixDQUEzQixDQUF0QjtBQUNBLFdBQUtoQixTQUFMLENBQWVpQixNQUFmLEdBRmlDLENBRVI7O0FBRXpCO0FBQ0EsVUFBTUMsUUFBUSxLQUFLbEIsU0FBTCxDQUFlM0QsR0FBZixDQUFtQjhFLGFBQW5CLENBQWlDLGtCQUFqQyxDQUFkO0FBQ0EsVUFBTUMsUUFBUSxLQUFLcEIsU0FBTCxDQUFlcUIsZ0JBQWYsQ0FBZ0NILEtBQWhDLENBQWQ7QUFDQUUsWUFBTTFFLE1BQU4sQ0FBYVQsVUFBYixHQUEwQjZFLFlBQVk3RSxVQUF0Qzs7QUFFQSxXQUFLK0QsU0FBTCxDQUFlc0IsTUFBZjtBQUNEOzs7OztrQkFHWXhCLG9CIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG5cbmNsYXNzIFNpbXBsZVdhdmVmb3JtIGV4dGVuZHMgdWkuc2hhcGVzLkJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaW1wbGUtd2F2ZWZvcm0nIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge30gfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICB9XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbClcbiAgICAgIHJldHVybiB0aGlzLiRlbDtcblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICAvLyBkZWZpbmUgbmJyIG9mIHNhbXBsZXMgcGVyIHBpeGVsc1xuICAgIGNvbnN0IHNsaWNlTWV0aG9kID0gZGF0dW0gaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgPyAnc3ViYXJyYXknIDogJ3NsaWNlJztcbiAgICBjb25zdCBuYnJTYW1wbGVzID0gZGF0dW0ubGVuZ3RoO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbmJyU2FtcGxlcyAvIHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGR1cmF0aW9uKTtcbiAgICBjb25zdCBzYW1wbGVzUGVyUGl4ZWwgPSBuYnJTYW1wbGVzIC8gd2lkdGg7XG5cbiAgICBpZiAoIXNhbXBsZXNQZXJQaXhlbCB8fCBkYXR1bS5sZW5ndGggPCBzYW1wbGVzUGVyUGl4ZWwpXG4gICAgICByZXR1cm47XG5cbiAgICAvLyBjb21wdXRlL2RyYXcgdmlzaWJsZSBhcmVhIG9ubHlcbiAgICAvLyBAVE9ETyByZWZhY3RvciB0aGlzIHVudW5kZXJzdGFuZGFibGUgbWVzc1xuICAgIGxldCBtaW5YID0gTWF0aC5tYXgoLXJlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCwgMCk7XG4gICAgbGV0IHRyYWNrRGVjYXkgPSByZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCArIHJlbmRlcmluZ0NvbnRleHQuc3RhcnRYO1xuXG4gICAgaWYgKHRyYWNrRGVjYXkgPCAwKVxuICAgICAgbWluWCA9IC10cmFja0RlY2F5O1xuXG4gICAgbGV0IG1heFggPSBtaW5YO1xuICAgIG1heFggKz0gKHJlbmRlcmluZ0NvbnRleHQud2lkdGggLSBtaW5YIDwgcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpID9cbiAgICAgIHJlbmRlcmluZ0NvbnRleHQud2lkdGggOiByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcblxuICAgIC8vIGdldCBtaW4vbWF4IHBlciBwaXhlbHMsIGNsYW1wZWQgdG8gdGhlIHZpc2libGUgYXJlYVxuICAgIGNvbnN0IGludmVydCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0O1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IG1pbk1heCA9IFtdO1xuXG4gICAgY29uc3QgYmxvY2tTaXplID0gNTtcblxuICAgIGZvciAobGV0IHB4ID0gbWluWDsgcHggPCBtYXhYOyBweCArPSBibG9ja1NpemUpIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IGludmVydChweCk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHNhbXBsZVJhdGU7XG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG5cbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZXh0cmFjdC5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIG1pbiA9IHNhbXBsZTtcbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgbWF4ID0gc2FtcGxlO1xuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9ICFpc0Zpbml0ZShtaW4pID8gMCA6IG1pbjtcbiAgICAgIG1heCA9ICFpc0Zpbml0ZShtYXgpID8gMCA6IG1heDtcblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGlmIChtaW5NYXgubGVuZ3RoKSB7XG4gICAgICBjb25zdCBQSVhFTCA9IDA7XG4gICAgICBjb25zdCBNSU4gICA9IDE7XG4gICAgICBjb25zdCBNQVggICA9IDI7XG5cbiAgICAgIC8vIHJlbmRlcmluZy4uLlxuICAgICAgbGV0IGQgPSAnTSc7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbWluTWF4Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCBkYXR1bSA9IG1pbk1heFtpXTtcbiAgICAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcblxuICAgICAgICBkICs9IGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1MJHt4ICsgYmxvY2tTaXplIC0gMn0sJHt5Mn1MJHt4ICsgYmxvY2tTaXplIC0gMn0sJHt5MX1MJHt4fSwke3kxfWA7XG5cbiAgICAgICAgaWYgKGkgPCBsIC0gMSlcbiAgICAgICAgICBkICs9ICdNJztcbiAgICAgIH1cblxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ3N0ZWVsYmx1ZScsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbWV0YXM6IHtcbiAgICAgIGRlc2M6ICdjb2xvciBvZiB0aGUgd2F2ZWZvcm0nXG4gICAgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgZGlzcGxheSB0aGUgd2F2ZWZvcm0gb2YgdGhlIGF1ZGlvIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdzdGVlbGJsdWUnXSAtIENvbG9yIG9mIHRoZSB3YXZlZm9ybVxuICovXG5jbGFzcyBTaW1wbGVXYXZlZm9ybU1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3dhdmVmb3JtID0gbnVsbDtcbiAgfVxuXG4gIGluc3RhbGwoYmxvY2spIHtcbiAgICBjb25zdCB7IHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gYmxvY2sudWk7XG5cbiAgICB0aGlzLl93YXZlZm9ybSA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCBbXSwge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbLTEsIDFdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fd2F2ZWZvcm0uc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIHRoaXMuX3dhdmVmb3JtLmNvbmZpZ3VyZVNoYXBlKFNpbXBsZVdhdmVmb3JtLCB7fSwge1xuICAgICAgY29sb3I6IHRoaXMucGFyYW1zLmdldCgnY29sb3InKSxcbiAgICB9KTtcblxuICAgIHRyYWNrLmFkZCh0aGlzLl93YXZlZm9ybSk7XG4gIH1cblxuICB1bmluc3RhbGwoYmxvY2spIHtcbiAgICBjb25zdCB7IHRyYWNrIH0gPSBibG9jay51aTtcbiAgICB0cmFjay5yZW1vdmUodGhpcy5fd2F2ZWZvcm0pO1xuICB9XG5cbiAgc2V0VHJhY2sodHJhY2tDb25maWcsIHRyYWNrQnVmZmVyKSB7XG4gICAgdGhpcy5fd2F2ZWZvcm0uZGF0YSA9IHRyYWNrQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgIHRoaXMuX3dhdmVmb3JtLnJlbmRlcigpOyAvLyB1cGRhdGUgYmluZGluZ3MgYmV0d2VlbiBkYXRhIGFuZCBzaGFwZXNcblxuICAgIC8vIGhhY2sgdG8gc2V0IHRoZSBzbWFwbGUgcmF0ZSBwcm9wZXJseVxuICAgIGNvbnN0ICRpdGVtID0gdGhpcy5fd2F2ZWZvcm0uJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zaW1wbGUtd2F2ZWZvcm0nKTtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX3dhdmVmb3JtLmdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pO1xuICAgIHNoYXBlLnBhcmFtcy5zYW1wbGVSYXRlID0gdHJhY2tCdWZmZXIuc2FtcGxlUmF0ZTtcblxuICAgIHRoaXMuX3dhdmVmb3JtLnVwZGF0ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbXBsZVdhdmVmb3JtTW9kdWxlO1xuIl19