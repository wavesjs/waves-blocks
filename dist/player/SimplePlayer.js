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

var _wavesAudio = require('waves-audio');

var audio = _interopRequireWildcard(_wavesAudio);

var _AbstractPlayer2 = require('../core/AbstractPlayer');

var _AbstractPlayer3 = _interopRequireDefault(_AbstractPlayer2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = audio.audioContext;

function decibelToLinear(val) {
  return Math.exp(0.11512925464970229 * val); // pow(10, val / 20)
};

var SimplePlayer = function (_AbstractPlayer) {
  (0, _inherits3.default)(SimplePlayer, _AbstractPlayer);

  function SimplePlayer(block) {
    (0, _classCallCheck3.default)(this, SimplePlayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimplePlayer.__proto__ || (0, _getPrototypeOf2.default)(SimplePlayer)).call(this, block));

    _this.gain = audioContext.createGain();
    _this.gain.connect(audioContext.destination);
    _this.gain.gain.value = 1;
    _this.gain.gain.setValueAtTime(1, audioContext.currentTime);

    _this.engine = new audio.PlayerEngine();
    _this.engine.connect(_this.gain);
    _this.playControl = new audio.PlayControl(_this.engine);
    return _this;
  }

  (0, _createClass3.default)(SimplePlayer, [{
    key: 'volume',
    value: function volume(db) {
      var gain = decibelToLinear(db);
      this.gain.gain.setValueAtTime(gain, audioContext.currentTime);
    }
  }, {
    key: 'setBuffer',
    value: function setBuffer(buffer) {
      this.playControl.stop();
      this.engine.buffer = buffer;
    }
  }, {
    key: 'start',
    value: function start() {
      this.playControl.start();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.playControl.pause();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.playControl.stop();
    }
  }, {
    key: 'seek',
    value: function seek(position) {
      this.playControl.seek(position);
    }
  }, {
    key: 'monitorPosition',
    value: function monitorPosition() {}
  }, {
    key: 'position',
    get: function get() {
      return this.playControl.currentPosition;
    }
  }, {
    key: 'duration',
    get: function get() {
      return this.engine.buffer ? this.engine.buffer.duration : 0;
    }
  }, {
    key: 'running',
    get: function get() {
      return this.playControl.running;
    }
  }]);
  return SimplePlayer;
}(_AbstractPlayer3.default);

exports.default = SimplePlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsiYXVkaW8iLCJhdWRpb0NvbnRleHQiLCJkZWNpYmVsVG9MaW5lYXIiLCJ2YWwiLCJNYXRoIiwiZXhwIiwiU2ltcGxlUGxheWVyIiwiYmxvY2siLCJnYWluIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsInZhbHVlIiwic2V0VmFsdWVBdFRpbWUiLCJjdXJyZW50VGltZSIsImVuZ2luZSIsIlBsYXllckVuZ2luZSIsInBsYXlDb250cm9sIiwiUGxheUNvbnRyb2wiLCJkYiIsImJ1ZmZlciIsInN0b3AiLCJzdGFydCIsInBhdXNlIiwicG9zaXRpb24iLCJzZWVrIiwiY3VycmVudFBvc2l0aW9uIiwiZHVyYXRpb24iLCJydW5uaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxLOztBQUNaOzs7Ozs7OztBQUVBLElBQU1DLGVBQWVELE1BQU1DLFlBQTNCOztBQUVBLFNBQVNDLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThCO0FBQzVCLFNBQU9DLEtBQUtDLEdBQUwsQ0FBUyxzQkFBc0JGLEdBQS9CLENBQVAsQ0FENEIsQ0FDZ0I7QUFDN0M7O0lBRUtHLFk7OztBQUNKLHdCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0pBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLElBQUwsR0FBWVAsYUFBYVEsVUFBYixFQUFaO0FBQ0EsVUFBS0QsSUFBTCxDQUFVRSxPQUFWLENBQWtCVCxhQUFhVSxXQUEvQjtBQUNBLFVBQUtILElBQUwsQ0FBVUEsSUFBVixDQUFlSSxLQUFmLEdBQXVCLENBQXZCO0FBQ0EsVUFBS0osSUFBTCxDQUFVQSxJQUFWLENBQWVLLGNBQWYsQ0FBOEIsQ0FBOUIsRUFBaUNaLGFBQWFhLFdBQTlDOztBQUVBLFVBQUtDLE1BQUwsR0FBYyxJQUFJZixNQUFNZ0IsWUFBVixFQUFkO0FBQ0EsVUFBS0QsTUFBTCxDQUFZTCxPQUFaLENBQW9CLE1BQUtGLElBQXpCO0FBQ0EsVUFBS1MsV0FBTCxHQUFtQixJQUFJakIsTUFBTWtCLFdBQVYsQ0FBc0IsTUFBS0gsTUFBM0IsQ0FBbkI7QUFWaUI7QUFXbEI7Ozs7MkJBY01JLEUsRUFBSTtBQUNULFVBQU1YLE9BQU9OLGdCQUFnQmlCLEVBQWhCLENBQWI7QUFDQSxXQUFLWCxJQUFMLENBQVVBLElBQVYsQ0FBZUssY0FBZixDQUE4QkwsSUFBOUIsRUFBb0NQLGFBQWFhLFdBQWpEO0FBQ0Q7Ozs4QkFFU00sTSxFQUFRO0FBQ2hCLFdBQUtILFdBQUwsQ0FBaUJJLElBQWpCO0FBQ0EsV0FBS04sTUFBTCxDQUFZSyxNQUFaLEdBQXFCQSxNQUFyQjtBQUNEOzs7NEJBRU87QUFDTixXQUFLSCxXQUFMLENBQWlCSyxLQUFqQjtBQUNEOzs7NEJBRU87QUFDTixXQUFLTCxXQUFMLENBQWlCTSxLQUFqQjtBQUNEOzs7MkJBRU07QUFDTCxXQUFLTixXQUFMLENBQWlCSSxJQUFqQjtBQUNEOzs7eUJBRUlHLFEsRUFBVTtBQUNiLFdBQUtQLFdBQUwsQ0FBaUJRLElBQWpCLENBQXNCRCxRQUF0QjtBQUNEOzs7c0NBRWlCLENBQUU7Ozt3QkF0Q0w7QUFDYixhQUFPLEtBQUtQLFdBQUwsQ0FBaUJTLGVBQXhCO0FBQ0Q7Ozt3QkFFYztBQUNiLGFBQU8sS0FBS1gsTUFBTCxDQUFZSyxNQUFaLEdBQXFCLEtBQUtMLE1BQUwsQ0FBWUssTUFBWixDQUFtQk8sUUFBeEMsR0FBbUQsQ0FBMUQ7QUFDRDs7O3dCQUVhO0FBQ1osYUFBTyxLQUFLVixXQUFMLENBQWlCVyxPQUF4QjtBQUNEOzs7OztrQkErQll0QixZIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgQWJzdHJhY3RQbGF5ZXIgZnJvbSAnLi4vY29yZS9BYnN0cmFjdFBsYXllcic7XG5cbmNvbnN0IGF1ZGlvQ29udGV4dCA9IGF1ZGlvLmF1ZGlvQ29udGV4dDtcblxuZnVuY3Rpb24gZGVjaWJlbFRvTGluZWFyKHZhbCkge1xuICByZXR1cm4gTWF0aC5leHAoMC4xMTUxMjkyNTQ2NDk3MDIyOSAqIHZhbCk7IC8vIHBvdygxMCwgdmFsIC8gMjApXG59O1xuXG5jbGFzcyBTaW1wbGVQbGF5ZXIgZXh0ZW5kcyBBYnN0cmFjdFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrKSB7XG4gICAgc3VwZXIoYmxvY2spO1xuXG4gICAgdGhpcy5nYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLmdhaW4uY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIHRoaXMuZ2Fpbi5nYWluLnZhbHVlID0gMTtcbiAgICB0aGlzLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgxLCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuXG4gICAgdGhpcy5lbmdpbmUgPSBuZXcgYXVkaW8uUGxheWVyRW5naW5lKCk7XG4gICAgdGhpcy5lbmdpbmUuY29ubmVjdCh0aGlzLmdhaW4pO1xuICAgIHRoaXMucGxheUNvbnRyb2wgPSBuZXcgYXVkaW8uUGxheUNvbnRyb2wodGhpcy5lbmdpbmUpO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXlDb250cm9sLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbmdpbmUuYnVmZmVyID8gdGhpcy5lbmdpbmUuYnVmZmVyLmR1cmF0aW9uIDogMDtcbiAgfVxuXG4gIGdldCBydW5uaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXlDb250cm9sLnJ1bm5pbmc7XG4gIH1cblxuICB2b2x1bWUoZGIpIHtcbiAgICBjb25zdCBnYWluID0gZGVjaWJlbFRvTGluZWFyKGRiKTtcbiAgICB0aGlzLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShnYWluLCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICB9XG5cbiAgc2V0QnVmZmVyKGJ1ZmZlcikge1xuICAgIHRoaXMucGxheUNvbnRyb2wuc3RvcCgpO1xuICAgIHRoaXMuZW5naW5lLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMucGxheUNvbnRyb2wuc3RhcnQoKTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMucGxheUNvbnRyb2wucGF1c2UoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5zdG9wKCk7XG4gIH1cblxuICBzZWVrKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5zZWVrKHBvc2l0aW9uKTtcbiAgfVxuXG4gIG1vbml0b3JQb3NpdGlvbigpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbXBsZVBsYXllcjtcbiJdfQ==