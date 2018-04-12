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

// display signal from LFO vector stream like
var Multiline = function (_ui$shapes$BaseShape) {
  (0, _inherits3.default)(Multiline, _ui$shapes$BaseShape);

  function Multiline() {
    (0, _classCallCheck3.default)(this, Multiline);
    return (0, _possibleConstructorReturn3.default)(this, (Multiline.__proto__ || (0, _getPrototypeOf2.default)(Multiline)).apply(this, arguments));
  }

  (0, _createClass3.default)(Multiline, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'multiline';
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
        colors: ['steelblue', 'orange', 'yellow', 'green', 'purple', 'grey'],
        frameSize: 1
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = document.createElementNS(this.ns, 'g');

      this.$paths = [];
      var frameSize = this.params.frameSize;

      for (var i = 0; i < frameSize; i++) {
        var $path = document.createElementNS(this.ns, 'path');
        $path.setAttributeNS(null, 'stroke', this.params.colors[i]);
        $path.setAttributeNS(null, 'fill', 'none');

        this.$paths[i] = $path;
        this.$el.appendChild($path);
      }

      return this.$el;
    }

    // recenter on zero

  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var timeOffset = data[0].time;
      var numFrames = data.length;
      var frameSize = this.params.frameSize;

      for (var i = 0; i < frameSize; i++) {
        var path = 'M';

        for (var j = 0; j < numFrames; j++) {
          var frame = data[j];
          var x = renderingContext.timeToPixel(frame.time - timeOffset);
          var y = renderingContext.valueToPixel(frame.data[i]);
          path += x + ',' + y;

          if (j < numFrames - 1) path += 'L';
        }

        this.$paths[i].setAttributeNS(null, 'd', path);
      }
    }
  }]);
  return Multiline;
}(ui.shapes.BaseShape);

var definitions = {};

/**
 * @fixme
 */

var Bpf = function (_AbstractModule) {
  (0, _inherits3.default)(Bpf, _AbstractModule);

  function Bpf(options) {
    (0, _classCallCheck3.default)(this, Bpf);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Bpf.__proto__ || (0, _getPrototypeOf2.default)(Bpf)).call(this, definitions, options));

    _this2._lines = null;
    return _this2;
  }

  (0, _createClass3.default)(Bpf, [{
    key: 'setTrack',
    value: function setTrack(buffer, metadata) {
      var block = this.block;
      var _block$ui = block.ui,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;

      var recording = metadata.data;

      if (this._lines) track.remove(this._lines);

      var lines = new ui.core.Layer('entity', recording.frames, {
        height: block.height,
        yDomain: [0, 600]
      });

      lines.setTimeContext(timeContext);
      lines.configureShape(Multiline, {
        frameSize: recording.streamParams.frameSize
      }, {});

      track.add(lines);

      this._lines = lines;
    }
  }]);
  return Bpf;
}(_AbstractModule3.default);

exports.default = Bpf;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJNdWx0aWxpbmUiLCJjb2xvcnMiLCJmcmFtZVNpemUiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsIiRwYXRocyIsInBhcmFtcyIsImkiLCIkcGF0aCIsInNldEF0dHJpYnV0ZU5TIiwiYXBwZW5kQ2hpbGQiLCJkYXRhIiwidGltZU9mZnNldCIsInRpbWUiLCJudW1GcmFtZXMiLCJsZW5ndGgiLCJwYXRoIiwiaiIsImZyYW1lIiwieCIsInRpbWVUb1BpeGVsIiwieSIsInZhbHVlVG9QaXhlbCIsInNoYXBlcyIsIkJhc2VTaGFwZSIsImRlZmluaXRpb25zIiwiQnBmIiwib3B0aW9ucyIsIl9saW5lcyIsImJ1ZmZlciIsIm1ldGFkYXRhIiwiYmxvY2siLCJ0cmFjayIsInRpbWVDb250ZXh0IiwicmVjb3JkaW5nIiwicmVtb3ZlIiwibGluZXMiLCJjb3JlIiwiTGF5ZXIiLCJmcmFtZXMiLCJoZWlnaHQiLCJ5RG9tYWluIiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInN0cmVhbVBhcmFtcyIsImFkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7Ozs7Ozs7QUFFQTtJQUNNQyxTOzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxXQUFQO0FBQW9COzs7dUNBRWxCO0FBQ2pCLGFBQU8sRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLGdCQUFRLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsUUFBeEIsRUFBa0MsT0FBbEMsRUFBMkMsUUFBM0MsRUFBcUQsTUFBckQsQ0FESDtBQUVMQyxtQkFBVztBQUZOLE9BQVA7QUFJRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsR0FB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QUFWOztBQUVBLFdBQUtSLE1BQUwsR0FBY1EsS0FBZDtBQUNEOzs7OztrQkFHWVYsRyIsImZpbGUiOiJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG4vLyBkaXNwbGF5IHNpZ25hbCBmcm9tIExGTyB2ZWN0b3Igc3RyZWFtIGxpa2VcbmNsYXNzIE11bHRpbGluZSBleHRlbmRzIHVpLnNoYXBlcy5CYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbXVsdGlsaW5lJyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yczogWydzdGVlbGJsdWUnLCAnb3JhbmdlJywgJ3llbGxvdycsICdncmVlbicsICdwdXJwbGUnLCAnZ3JleSddLFxuICAgICAgZnJhbWVTaXplOiAxLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG5cbiAgICB0aGlzLiRwYXRocyA9IFtdO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0ICRwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICAkcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3JzW2ldKTtcbiAgICAgICRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcblxuICAgICAgdGhpcy4kcGF0aHNbaV0gPSAkcGF0aDtcbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRwYXRoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8vIHJlY2VudGVyIG9uIHplcm9cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBjb25zdCB0aW1lT2Zmc2V0ID0gZGF0YVswXS50aW1lO1xuICAgIGNvbnN0IG51bUZyYW1lcyA9IGRhdGEubGVuZ3RoO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGxldCBwYXRoID0gJ00nO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUZyYW1lczsgaisrKSB7XG4gICAgICAgIGNvbnN0IGZyYW1lID0gZGF0YVtqXTtcbiAgICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZnJhbWUudGltZSAtIHRpbWVPZmZzZXQpO1xuICAgICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZnJhbWUuZGF0YVtpXSk7XG4gICAgICAgIHBhdGggKz0gYCR7eH0sJHt5fWA7XG5cbiAgICAgICAgaWYgKGogPCBudW1GcmFtZXMgLSAxKVxuICAgICAgICAgIHBhdGggKz0gJ0wnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRwYXRoc1tpXS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHBhdGgpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHt9O1xuXG4vKipcbiAqIEBmaXhtZVxuICovXG5jbGFzcyBCcGYgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9saW5lcyA9IG51bGw7XG4gIH1cblxuICBzZXRUcmFjayhidWZmZXIsIG1ldGFkYXRhKSB7XG4gICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2NrO1xuICAgIGNvbnN0IHsgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSBibG9jay51aTtcbiAgICBjb25zdCByZWNvcmRpbmcgPSBtZXRhZGF0YS5kYXRhO1xuXG4gICAgaWYgKHRoaXMuX2xpbmVzKVxuICAgICAgdHJhY2sucmVtb3ZlKHRoaXMuX2xpbmVzKTtcblxuICAgIGNvbnN0IGxpbmVzID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2VudGl0eScsIHJlY29yZGluZy5mcmFtZXMsIHtcbiAgICAgIGhlaWdodDogYmxvY2suaGVpZ2h0LFxuICAgICAgeURvbWFpbjogWzAsIDYwMF0sXG4gICAgfSk7XG5cbiAgICBsaW5lcy5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dClcbiAgICBsaW5lcy5jb25maWd1cmVTaGFwZShNdWx0aWxpbmUsIHtcbiAgICAgIGZyYW1lU2l6ZTogcmVjb3JkaW5nLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUsXG4gICAgfSwge30pO1xuXG4gICAgdHJhY2suYWRkKGxpbmVzKTtcblxuICAgIHRoaXMuX2xpbmVzID0gbGluZXM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnBmO1xuIl19