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
  }, {
    key: 'gain',
    set: function set(gain) {
      this.gain.gain.setValueAtTime(gain, audioContext.currentTime + 0.005);
    },
    get: function get() {
      return this.gain.gain.value;
    }
  }]);
  return SimplePlayer;
}(_AbstractPlayer3.default);

exports.default = SimplePlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpbXBsZVBsYXllci5qcyJdLCJuYW1lcyI6WyJhdWRpbyIsImF1ZGlvQ29udGV4dCIsIlNpbXBsZVBsYXllciIsImJsb2NrIiwiZ2FpbiIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJ2YWx1ZSIsInNldFZhbHVlQXRUaW1lIiwiY3VycmVudFRpbWUiLCJlbmdpbmUiLCJQbGF5ZXJFbmdpbmUiLCJwbGF5Q29udHJvbCIsIlBsYXlDb250cm9sIiwiYnVmZmVyIiwic3RvcCIsInN0YXJ0IiwicGF1c2UiLCJwb3NpdGlvbiIsInNlZWsiLCJjdXJyZW50UG9zaXRpb24iLCJkdXJhdGlvbiIsInJ1bm5pbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEs7O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsZUFBZUQsTUFBTUMsWUFBM0I7O0lBRU1DLFk7OztBQUNKLHdCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0pBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLElBQUwsR0FBWUgsYUFBYUksVUFBYixFQUFaO0FBQ0EsVUFBS0QsSUFBTCxDQUFVRSxPQUFWLENBQWtCTCxhQUFhTSxXQUEvQjtBQUNBLFVBQUtILElBQUwsQ0FBVUEsSUFBVixDQUFlSSxLQUFmLEdBQXVCLENBQXZCO0FBQ0EsVUFBS0osSUFBTCxDQUFVQSxJQUFWLENBQWVLLGNBQWYsQ0FBOEIsQ0FBOUIsRUFBaUNSLGFBQWFTLFdBQTlDOztBQUVBLFVBQUtDLE1BQUwsR0FBYyxJQUFJWCxNQUFNWSxZQUFWLEVBQWQ7QUFDQSxVQUFLRCxNQUFMLENBQVlMLE9BQVosQ0FBb0IsTUFBS0YsSUFBekI7QUFDQSxVQUFLUyxXQUFMLEdBQW1CLElBQUliLE1BQU1jLFdBQVYsQ0FBc0IsTUFBS0gsTUFBM0IsQ0FBbkI7QUFWaUI7QUFXbEI7Ozs7OEJBc0JTSSxNLEVBQVE7QUFDaEIsV0FBS0YsV0FBTCxDQUFpQkcsSUFBakI7QUFDQSxXQUFLTCxNQUFMLENBQVlJLE1BQVosR0FBcUJBLE1BQXJCO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUtGLFdBQUwsQ0FBaUJJLEtBQWpCO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUtKLFdBQUwsQ0FBaUJLLEtBQWpCO0FBQ0Q7OzsyQkFFTTtBQUNMLFdBQUtMLFdBQUwsQ0FBaUJHLElBQWpCO0FBQ0Q7Ozt5QkFFSUcsUSxFQUFVO0FBQ2IsV0FBS04sV0FBTCxDQUFpQk8sSUFBakIsQ0FBc0JELFFBQXRCO0FBQ0Q7OztzQ0FFaUIsQ0FBRTs7O3dCQXpDTDtBQUNiLGFBQU8sS0FBS04sV0FBTCxDQUFpQlEsZUFBeEI7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLVixNQUFMLENBQVlJLE1BQVosR0FBcUIsS0FBS0osTUFBTCxDQUFZSSxNQUFaLENBQW1CTyxRQUF4QyxHQUFtRCxDQUExRDtBQUNEOzs7d0JBRWE7QUFDWixhQUFPLEtBQUtULFdBQUwsQ0FBaUJVLE9BQXhCO0FBQ0Q7OztzQkFFUW5CLEksRUFBTTtBQUNiLFdBQUtBLElBQUwsQ0FBVUEsSUFBVixDQUFlSyxjQUFmLENBQThCTCxJQUE5QixFQUFvQ0gsYUFBYVMsV0FBYixHQUEyQixLQUEvRDtBQUNELEs7d0JBRVU7QUFDVCxhQUFPLEtBQUtOLElBQUwsQ0FBVUEsSUFBVixDQUFlSSxLQUF0QjtBQUNEOzs7OztrQkEwQllOLFkiLCJmaWxlIjoiU2ltcGxlUGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IEFic3RyYWN0UGxheWVyIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RQbGF5ZXInO1xuXG5jb25zdCBhdWRpb0NvbnRleHQgPSBhdWRpby5hdWRpb0NvbnRleHQ7XG5cbmNsYXNzIFNpbXBsZVBsYXllciBleHRlbmRzIEFic3RyYWN0UGxheWVyIHtcbiAgY29uc3RydWN0b3IoYmxvY2spIHtcbiAgICBzdXBlcihibG9jayk7XG5cbiAgICB0aGlzLmdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuZ2Fpbi5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgdGhpcy5nYWluLmdhaW4udmFsdWUgPSAxO1xuICAgIHRoaXMuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDEsIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG5cbiAgICB0aGlzLmVuZ2luZSA9IG5ldyBhdWRpby5QbGF5ZXJFbmdpbmUoKTtcbiAgICB0aGlzLmVuZ2luZS5jb25uZWN0KHRoaXMuZ2Fpbik7XG4gICAgdGhpcy5wbGF5Q29udHJvbCA9IG5ldyBhdWRpby5QbGF5Q29udHJvbCh0aGlzLmVuZ2luZSk7XG4gIH1cblxuICBnZXQgcG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheUNvbnRyb2wuY3VycmVudFBvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVuZ2luZS5idWZmZXIgPyB0aGlzLmVuZ2luZS5idWZmZXIuZHVyYXRpb24gOiAwO1xuICB9XG5cbiAgZ2V0IHJ1bm5pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheUNvbnRyb2wucnVubmluZztcbiAgfVxuXG4gIHNldCBnYWluKGdhaW4pIHtcbiAgICB0aGlzLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShnYWluLCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAwNSk7XG4gIH1cblxuICBnZXQgZ2FpbigpIHtcbiAgICByZXR1cm4gdGhpcy5nYWluLmdhaW4udmFsdWU7XG4gIH1cblxuICBzZXRCdWZmZXIoYnVmZmVyKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5zdG9wKCk7XG4gICAgdGhpcy5lbmdpbmUuYnVmZmVyID0gYnVmZmVyO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5zdGFydCgpO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5wYXVzZSgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnBsYXlDb250cm9sLnN0b3AoKTtcbiAgfVxuXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICB0aGlzLnBsYXlDb250cm9sLnNlZWsocG9zaXRpb24pO1xuICB9XG5cbiAgbW9uaXRvclBvc2l0aW9uKCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlUGxheWVyO1xuIl19