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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImF1ZGlvIiwiYXVkaW9Db250ZXh0IiwiZGVjaWJlbFRvTGluZWFyIiwidmFsIiwiTWF0aCIsImV4cCIsIlNpbXBsZVBsYXllciIsImJsb2NrIiwiZ2FpbiIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJ2YWx1ZSIsInNldFZhbHVlQXRUaW1lIiwiY3VycmVudFRpbWUiLCJlbmdpbmUiLCJQbGF5ZXJFbmdpbmUiLCJwbGF5Q29udHJvbCIsIlBsYXlDb250cm9sIiwiZGIiLCJidWZmZXIiLCJzdG9wIiwic3RhcnQiLCJwYXVzZSIsInBvc2l0aW9uIiwic2VlayIsImN1cnJlbnRQb3NpdGlvbiIsImR1cmF0aW9uIiwicnVubmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsSzs7QUFDWjs7Ozs7Ozs7QUFFQSxJQUFNQyxlQUFlRCxNQUFNQyxZQUEzQjs7QUFFQSxTQUFTQyxlQUFULENBQXlCQyxHQUF6QixFQUE4QjtBQUM1QixTQUFPQyxLQUFLQyxHQUFMLENBQVMsc0JBQXNCRixHQUEvQixDQUFQLENBRDRCLENBQ2dCO0FBQzdDOztJQUVLRyxZOzs7QUFDSix3QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLGtKQUNYQSxLQURXOztBQUdqQixVQUFLQyxJQUFMLEdBQVlQLGFBQWFRLFVBQWIsRUFBWjtBQUNBLFVBQUtELElBQUwsQ0FBVUUsT0FBVixDQUFrQlQsYUFBYVUsV0FBL0I7QUFDQSxVQUFLSCxJQUFMLENBQVVBLElBQVYsQ0FBZUksS0FBZixHQUF1QixDQUF2QjtBQUNBLFVBQUtKLElBQUwsQ0FBVUEsSUFBVixDQUFlSyxjQUFmLENBQThCLENBQTlCLEVBQWlDWixhQUFhYSxXQUE5Qzs7QUFFQSxVQUFLQyxNQUFMLEdBQWMsSUFBSWYsTUFBTWdCLFlBQVYsRUFBZDtBQUNBLFVBQUtELE1BQUwsQ0FBWUwsT0FBWixDQUFvQixNQUFLRixJQUF6QjtBQUNBLFVBQUtTLFdBQUwsR0FBbUIsSUFBSWpCLE1BQU1rQixXQUFWLENBQXNCLE1BQUtILE1BQTNCLENBQW5CO0FBVmlCO0FBV2xCOzs7OzJCQWNNSSxFLEVBQUk7QUFDVCxVQUFNWCxPQUFPTixnQkFBZ0JpQixFQUFoQixDQUFiO0FBQ0EsV0FBS1gsSUFBTCxDQUFVQSxJQUFWLENBQWVLLGNBQWYsQ0FBOEJMLElBQTlCLEVBQW9DUCxhQUFhYSxXQUFqRDtBQUNEOzs7OEJBRVNNLE0sRUFBUTtBQUNoQixXQUFLSCxXQUFMLENBQWlCSSxJQUFqQjtBQUNBLFdBQUtOLE1BQUwsQ0FBWUssTUFBWixHQUFxQkEsTUFBckI7QUFDRDs7OzRCQUVPO0FBQ04sV0FBS0gsV0FBTCxDQUFpQkssS0FBakI7QUFDRDs7OzRCQUVPO0FBQ04sV0FBS0wsV0FBTCxDQUFpQk0sS0FBakI7QUFDRDs7OzJCQUVNO0FBQ0wsV0FBS04sV0FBTCxDQUFpQkksSUFBakI7QUFDRDs7O3lCQUVJRyxRLEVBQVU7QUFDYixXQUFLUCxXQUFMLENBQWlCUSxJQUFqQixDQUFzQkQsUUFBdEI7QUFDRDs7O3NDQUVpQixDQUFFOzs7d0JBdENMO0FBQ2IsYUFBTyxLQUFLUCxXQUFMLENBQWlCUyxlQUF4QjtBQUNEOzs7d0JBRWM7QUFDYixhQUFPLEtBQUtYLE1BQUwsQ0FBWUssTUFBWixHQUFxQixLQUFLTCxNQUFMLENBQVlLLE1BQVosQ0FBbUJPLFFBQXhDLEdBQW1ELENBQTFEO0FBQ0Q7Ozt3QkFFYTtBQUNaLGFBQU8sS0FBS1YsV0FBTCxDQUFpQlcsT0FBeEI7QUFDRDs7Ozs7a0JBK0JZdEIsWSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBBYnN0cmFjdFBsYXllciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0UGxheWVyJztcblxuY29uc3QgYXVkaW9Db250ZXh0ID0gYXVkaW8uYXVkaW9Db250ZXh0O1xuXG5mdW5jdGlvbiBkZWNpYmVsVG9MaW5lYXIodmFsKSB7XG4gIHJldHVybiBNYXRoLmV4cCgwLjExNTEyOTI1NDY0OTcwMjI5ICogdmFsKTsgLy8gcG93KDEwLCB2YWwgLyAyMClcbn07XG5cbmNsYXNzIFNpbXBsZVBsYXllciBleHRlbmRzIEFic3RyYWN0UGxheWVyIHtcbiAgY29uc3RydWN0b3IoYmxvY2spIHtcbiAgICBzdXBlcihibG9jayk7XG5cbiAgICB0aGlzLmdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuZ2Fpbi5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgdGhpcy5nYWluLmdhaW4udmFsdWUgPSAxO1xuICAgIHRoaXMuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDEsIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG5cbiAgICB0aGlzLmVuZ2luZSA9IG5ldyBhdWRpby5QbGF5ZXJFbmdpbmUoKTtcbiAgICB0aGlzLmVuZ2luZS5jb25uZWN0KHRoaXMuZ2Fpbik7XG4gICAgdGhpcy5wbGF5Q29udHJvbCA9IG5ldyBhdWRpby5QbGF5Q29udHJvbCh0aGlzLmVuZ2luZSk7XG4gIH1cblxuICBnZXQgcG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheUNvbnRyb2wuY3VycmVudFBvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVuZ2luZS5idWZmZXIgPyB0aGlzLmVuZ2luZS5idWZmZXIuZHVyYXRpb24gOiAwO1xuICB9XG5cbiAgZ2V0IHJ1bm5pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMucGxheUNvbnRyb2wucnVubmluZztcbiAgfVxuXG4gIHZvbHVtZShkYikge1xuICAgIGNvbnN0IGdhaW4gPSBkZWNpYmVsVG9MaW5lYXIoZGIpO1xuICAgIHRoaXMuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKGdhaW4sIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gIH1cblxuICBzZXRCdWZmZXIoYnVmZmVyKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5zdG9wKCk7XG4gICAgdGhpcy5lbmdpbmUuYnVmZmVyID0gYnVmZmVyO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5zdGFydCgpO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5wbGF5Q29udHJvbC5wYXVzZSgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnBsYXlDb250cm9sLnN0b3AoKTtcbiAgfVxuXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICB0aGlzLnBsYXlDb250cm9sLnNlZWsocG9zaXRpb24pO1xuICB9XG5cbiAgbW9uaXRvclBvc2l0aW9uKCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlUGxheWVyO1xuIl19