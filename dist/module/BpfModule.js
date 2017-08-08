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
      // console.log(data);
      var timeOffset = data[0].time;
      var numFrames = data.length;
      // const numFrames = 10;
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

        // console.log(path);

        this.$paths[i].setAttributeNS(null, 'd', path);
      }
    }
  }]);
  return Multiline;
}(ui.shapes.BaseShape);

var definitions = {};

var BpfModule = function (_AbstractModule) {
  (0, _inherits3.default)(BpfModule, _AbstractModule);

  function BpfModule(options) {
    (0, _classCallCheck3.default)(this, BpfModule);
    return (0, _possibleConstructorReturn3.default)(this, (BpfModule.__proto__ || (0, _getPrototypeOf2.default)(BpfModule)).call(this, definitions, options));
  }

  (0, _createClass3.default)(BpfModule, [{
    key: 'install',
    value: function install(block) {
      this._block = block;
    }
  }, {
    key: 'uninstall',
    value: function uninstall(block) {}
  }, {
    key: 'setTrack',
    value: function setTrack(trackConfig) {
      var block = this._block;
      var _block$ui = block.ui,
          track = _block$ui.track,
          timeContext = _block$ui.timeContext;

      var recording = trackConfig.data;

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
      lines.render();
      lines.update();

      this._lines = lines;
    }
  }]);
  return BpfModule;
}(_AbstractModule3.default);

exports.default = BpfModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInVpIiwiTXVsdGlsaW5lIiwiY29sb3JzIiwiZnJhbWVTaXplIiwicmVuZGVyaW5nQ29udGV4dCIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwibnMiLCIkcGF0aHMiLCJwYXJhbXMiLCJpIiwiJHBhdGgiLCJzZXRBdHRyaWJ1dGVOUyIsImFwcGVuZENoaWxkIiwiZGF0YSIsInRpbWVPZmZzZXQiLCJ0aW1lIiwibnVtRnJhbWVzIiwibGVuZ3RoIiwicGF0aCIsImoiLCJmcmFtZSIsIngiLCJ0aW1lVG9QaXhlbCIsInkiLCJ2YWx1ZVRvUGl4ZWwiLCJzaGFwZXMiLCJCYXNlU2hhcGUiLCJkZWZpbml0aW9ucyIsIkJwZk1vZHVsZSIsIm9wdGlvbnMiLCJibG9jayIsIl9ibG9jayIsInRyYWNrQ29uZmlnIiwidHJhY2siLCJ0aW1lQ29udGV4dCIsInJlY29yZGluZyIsIl9saW5lcyIsInJlbW92ZSIsImxpbmVzIiwiY29yZSIsIkxheWVyIiwiZnJhbWVzIiwiaGVpZ2h0IiwieURvbWFpbiIsInNldFRpbWVDb250ZXh0IiwiY29uZmlndXJlU2hhcGUiLCJzdHJlYW1QYXJhbXMiLCJhZGQiLCJyZW5kZXIiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUE7SUFDTUMsUzs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8sV0FBUDtBQUFvQjs7O3VDQUVsQjtBQUNqQixhQUFPLEVBQVA7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTztBQUNMQyxnQkFBUSxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQXdCLFFBQXhCLEVBQWtDLE9BQWxDLEVBQTJDLFFBQTNDLEVBQXFELE1BQXJELENBREg7QUFFTEMsbUJBQVc7QUFGTixPQUFQO0FBSUQ7OzsyQkFFTUMsZ0IsRUFBa0I7QUFDdkIsV0FBS0MsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENB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QVYsQ0FBdUI3QztBQURKLE9BQWhDLEVBRUcsRUFGSDs7QUFJQWdDLFlBQU1jLEdBQU4sQ0FBVVQsS0FBVjtBQUNBQSxZQUFNVSxNQUFOO0FBQ0FWLFlBQU1XLE1BQU47O0FBRUEsV0FBS2IsTUFBTCxHQUFjRSxLQUFkO0FBQ0Q7Ozs7O2tCQUdZVixTIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWkgZnJvbSAnd2F2ZXMtdWknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RNb2R1bGUnO1xuXG4vLyBkaXNwbGF5IHNpZ25hbCBmcm9tIExGTyB2ZWN0b3Igc3RyZWFtIGxpa2VcbmNsYXNzIE11bHRpbGluZSBleHRlbmRzIHVpLnNoYXBlcy5CYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbXVsdGlsaW5lJyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yczogWydzdGVlbGJsdWUnLCAnb3JhbmdlJywgJ3llbGxvdycsICdncmVlbicsICdwdXJwbGUnLCAnZ3JleSddLFxuICAgICAgZnJhbWVTaXplOiAxLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG5cbiAgICB0aGlzLiRwYXRocyA9IFtdO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0ICRwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICAkcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3JzW2ldKTtcbiAgICAgICRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcblxuICAgICAgdGhpcy4kcGF0aHNbaV0gPSAkcGF0aDtcbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRwYXRoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8vIHJlY2VudGVyIG9uIHplcm9cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBjb25zdCB0aW1lT2Zmc2V0ID0gZGF0YVswXS50aW1lO1xuICAgIGNvbnN0IG51bUZyYW1lcyA9IGRhdGEubGVuZ3RoO1xuICAgIC8vIGNvbnN0IG51bUZyYW1lcyA9IDEwO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGxldCBwYXRoID0gJ00nO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUZyYW1lczsgaisrKSB7XG4gICAgICAgIGNvbnN0IGZyYW1lID0gZGF0YVtqXTtcbiAgICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZnJhbWUudGltZSAtIHRpbWVPZmZzZXQpO1xuICAgICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZnJhbWUuZGF0YVtpXSk7XG4gICAgICAgIHBhdGggKz0gYCR7eH0sJHt5fWA7XG5cbiAgICAgICAgaWYgKGogPCBudW1GcmFtZXMgLSAxKVxuICAgICAgICAgIHBhdGggKz0gJ0wnO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zb2xlLmxvZyhwYXRoKTtcblxuICAgICAgdGhpcy4kcGF0aHNbaV0uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBwYXRoKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7fTtcblxuY2xhc3MgQnBmTW9kdWxlIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgaW5zdGFsbChibG9jaykge1xuICAgIHRoaXMuX2Jsb2NrID0gYmxvY2s7XG4gIH1cblxuICB1bmluc3RhbGwoYmxvY2spIHtcblxuICB9XG5cbiAgc2V0VHJhY2sodHJhY2tDb25maWcpIHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuX2Jsb2NrO1xuICAgIGNvbnN0IHsgdHJhY2ssIHRpbWVDb250ZXh0IH0gPSBibG9jay51aTtcbiAgICBjb25zdCByZWNvcmRpbmcgPSB0cmFja0NvbmZpZy5kYXRhO1xuXG4gICAgaWYgKHRoaXMuX2xpbmVzKVxuICAgICAgdHJhY2sucmVtb3ZlKHRoaXMuX2xpbmVzKTtcblxuICAgIGNvbnN0IGxpbmVzID0gbmV3IHVpLmNvcmUuTGF5ZXIoJ2VudGl0eScsIHJlY29yZGluZy5mcmFtZXMsIHtcbiAgICAgIGhlaWdodDogYmxvY2suaGVpZ2h0LFxuICAgICAgeURvbWFpbjogWzAsIDYwMF0sXG4gICAgfSk7XG5cbiAgICBsaW5lcy5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dClcbiAgICBsaW5lcy5jb25maWd1cmVTaGFwZShNdWx0aWxpbmUsIHtcbiAgICAgIGZyYW1lU2l6ZTogcmVjb3JkaW5nLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUsXG4gICAgfSwge30pO1xuXG4gICAgdHJhY2suYWRkKGxpbmVzKTtcbiAgICBsaW5lcy5yZW5kZXIoKTtcbiAgICBsaW5lcy51cGRhdGUoKTtcblxuICAgIHRoaXMuX2xpbmVzID0gbGluZXM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnBmTW9kdWxlO1xuIl19