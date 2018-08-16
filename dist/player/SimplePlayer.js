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

    _this.volume = audioContext.createGain();
    _this.volume.connect(audioContext.destination);
    _this.volume.gain.value = 1;
    _this.volume.gain.setValueAtTime(1, audioContext.currentTime);

    _this.engine = new audio.PlayerEngine();
    _this.engine.connect(_this.volume);
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
      this.volume.gain.setValueAtTime(gain, audioContext.currentTime + 0.005);
    },
    get: function get() {
      return this.volume.gain.value;
    }
  }]);
  return SimplePlayer;
}(_AbstractPlayer3.default);

exports.default = SimplePlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpbXBsZVBsYXllci5qcyJdLCJuYW1lcyI6WyJhdWRpbyIsImF1ZGlvQ29udGV4dCIsIlNpbXBsZVBsYXllciIsImJsb2NrIiwidm9sdW1lIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImdhaW4iLCJ2YWx1ZSIsInNldFZhbHVlQXRUaW1lIiwiY3VycmVudFRpbWUiLCJlbmdpbmUiLCJQbGF5ZXJFbmdpbmUiLCJwbGF5Q29udHJvbCIsIlBsYXlDb250cm9sIiwiYnVmZmVyIiwic3RvcCIsInN0YXJ0IiwicGF1c2UiLCJwb3NpdGlvbiIsInNlZWsiLCJjdXJyZW50UG9zaXRpb24iLCJkdXJhdGlvbiIsInJ1bm5pbmciLCJBYnN0cmFjdFBsYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsSzs7QUFDWjs7Ozs7Ozs7QUFFQSxJQUFNQyxlQUFlRCxNQUFNQyxZQUEzQjs7SUFFTUMsWTs7O0FBQ0osd0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxrSkFDWEEsS0FEVzs7QUFHakIsVUFBS0MsTUFBTCxHQUFjSCxhQUFhSSxVQUFiLEVBQWQ7QUFDQSxVQUFLRCxNQUFMLENBQVlFLE9BQVosQ0FBb0JMLGFBQWFNLFdBQWpDO0FBQ0EsVUFBS0gsTUFBTCxDQUFZSSxJQUFaLENBQWlCQyxLQUFqQixHQUF5QixDQUF6QjtBQUNBLFVBQUtMLE1BQUwsQ0FBWUksSUFBWixDQUFpQkUsY0FBakIsQ0FBZ0MsQ0FBaEMsRUFBbUNULGFBQWFVLFdBQWhEOztBQUVBLFVBQUtDLE1BQUwsR0FBYyxJQUFJWixNQUFNYSxZQUFWLEVBQWQ7QUFDQSxVQUFLRCxNQUFMLENBQVlOLE9BQVosQ0FBb0IsTUFBS0YsTUFBekI7QUFDQSxVQUFLVSxXQUFMLEdBQW1CLElBQUlkLE1BQU1lLFdBQVYsQ0FBc0IsTUFBS0gsTUFBM0IsQ0FBbkI7QUFWaUI7QUFXbEI7Ozs7OEJBc0JTSSxNLEVBQVE7QUFDaEIsV0FBS0YsV0FBTCxDQUFpQkcsSUFBakI7QUFDQSxXQUFLTCxNQUFMLENBQVlJLE1BQVosR0FBcUJBLE1BQXJCO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUtGLFdBQUwsQ0FBaUJJLEtBQWpCO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUtKLFdBQUwsQ0FBaUJLLEtBQWpCO0FBQ0Q7OzsyQkFFTTtBQUNMLFdBQUtMLFdBQUwsQ0FBaUJHLElBQWpCO0FBQ0Q7Ozt5QkFFSUcsUSxFQUFVO0FBQ2IsV0FBS04sV0FBTCxDQUFpQk8sSUFBakIsQ0FBc0JELFFBQXRCO0FBQ0Q7OztzQ0FFaUIsQ0FBRTs7O3dCQXpDTDtBQUNiLGFBQU8sS0FBS04sV0FBTCxDQUFpQlEsZUFBeEI7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLVixNQUFMLENBQVlJLE1BQVosR0FBcUIsS0FBS0osTUFBTCxDQUFZSSxNQUFaLENBQW1CTyxRQUF4QyxHQUFtRCxDQUExRDtBQUNEOzs7d0JBRWE7QUFDWixhQUFPLEtBQUtULFdBQUwsQ0FBaUJVLE9BQXhCO0FBQ0Q7OztzQkFFUWhCLEksRUFBTTtBQUNiLFdBQUtKLE1BQUwsQ0FBWUksSUFBWixDQUFpQkUsY0FBakIsQ0FBZ0NGLElBQWhDLEVBQXNDUCxhQUFhVSxXQUFiLEdBQTJCLEtBQWpFO0FBQ0QsSzt3QkFFVTtBQUNULGFBQU8sS0FBS1AsTUFBTCxDQUFZSSxJQUFaLENBQWlCQyxLQUF4QjtBQUNEOzs7RUFoQ3dCZ0Isd0I7O2tCQTBEWnZCLFkiLCJmaWxlIjoiU2ltcGxlUGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IEFic3RyYWN0UGxheWVyIGZyb20gJy4uL2NvcmUvQWJzdHJhY3RQbGF5ZXInO1xuXG5jb25zdCBhdWRpb0NvbnRleHQgPSBhdWRpby5hdWRpb0NvbnRleHQ7XG5cbmNsYXNzIFNpbXBsZVBsYXllciBleHRlbmRzIEFic3RyYWN0UGxheWVyIHtcbiAgY29uc3RydWN0b3IoYmxvY2spIHtcbiAgICBzdXBlcihibG9jayk7XG5cbiAgICB0aGlzLnZvbHVtZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy52b2x1bWUuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIHRoaXMudm9sdW1lLmdhaW4udmFsdWUgPSAxO1xuICAgIHRoaXMudm9sdW1lLmdhaW4uc2V0VmFsdWVBdFRpbWUoMSwgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcblxuICAgIHRoaXMuZW5naW5lID0gbmV3IGF1ZGlvLlBsYXllckVuZ2luZSgpO1xuICAgIHRoaXMuZW5naW5lLmNvbm5lY3QodGhpcy52b2x1bWUpO1xuICAgIHRoaXMucGxheUNvbnRyb2wgPSBuZXcgYXVkaW8uUGxheUNvbnRyb2wodGhpcy5lbmdpbmUpO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXlDb250cm9sLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbmdpbmUuYnVmZmVyID8gdGhpcy5lbmdpbmUuYnVmZmVyLmR1cmF0aW9uIDogMDtcbiAgfVxuXG4gIGdldCBydW5uaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnBsYXlDb250cm9sLnJ1bm5pbmc7XG4gIH1cblxuICBzZXQgZ2FpbihnYWluKSB7XG4gICAgdGhpcy52b2x1bWUuZ2Fpbi5zZXRWYWx1ZUF0VGltZShnYWluLCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAwNSk7XG4gIH1cblxuICBnZXQgZ2FpbigpIHtcbiAgICByZXR1cm4gdGhpcy52b2x1bWUuZ2Fpbi52YWx1ZTtcbiAgfVxuXG4gIHNldEJ1ZmZlcihidWZmZXIpIHtcbiAgICB0aGlzLnBsYXlDb250cm9sLnN0b3AoKTtcbiAgICB0aGlzLmVuZ2luZS5idWZmZXIgPSBidWZmZXI7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLnBsYXlDb250cm9sLnN0YXJ0KCk7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnBsYXlDb250cm9sLnBhdXNlKCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMucGxheUNvbnRyb2wuc3RvcCgpO1xuICB9XG5cbiAgc2Vlayhwb3NpdGlvbikge1xuICAgIHRoaXMucGxheUNvbnRyb2wuc2Vlayhwb3NpdGlvbik7XG4gIH1cblxuICBtb25pdG9yUG9zaXRpb24oKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVQbGF5ZXI7XG4iXX0=