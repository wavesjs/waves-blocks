'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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

var _common = require('waves-lfo/common');

var lfo = _interopRequireWildcard(_common);

var _AbstractPlayer2 = require('../core/AbstractPlayer');

var _AbstractPlayer3 = _interopRequireDefault(_AbstractPlayer2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataPlayer = function (_AbstractPlayer) {
  (0, _inherits3.default)(DataPlayer, _AbstractPlayer);

  function DataPlayer(block) {
    (0, _classCallCheck3.default)(this, DataPlayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DataPlayer.__proto__ || (0, _getPrototypeOf2.default)(DataPlayer)).call(this, block));

    _this._running = false;

    _this._listeners = new _set2.default();

    _this._emit = _this._emit.bind(_this);
    _this._ended = _this._ended.bind(_this);

    _this.dataReader = new lfo.source.DataReader();
    _this.bridge = new lfo.sink.Bridge({
      processFrame: _this._emit,
      finalizeStream: _this._ended
    });
    _this.dataReader.connect(_this.bridge);
    return _this;
  }

  (0, _createClass3.default)(DataPlayer, [{
    key: 'setTrack',
    value: function setTrack(trackConfig) {
      this.dataReader.params.set('source', trackConfig.data);
      this.dataReader.initStream(); // we know everthing is synchronous in the chain
      this.dataReader.initialized = true;
    }
  }, {
    key: 'start',
    value: function start() {
      if (this._running === false) {
        this._running = true;
        this.dataReader.start();
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._running = false;
      this.dataReader.stop();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this._running = false;
      this.dataReader.pause();
    }
  }, {
    key: 'seek',
    value: function seek(position) {
      var realPosition = position + this.dataReader.sourceStartTime;
      this.dataReader.seek(position);
    }

    // player specific

  }, {
    key: 'addListener',
    value: function addListener(listener) {
      this._listeners.add(listener);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(listener) {
      this._listeners.remove(listener);
    }
  }, {
    key: '_emit',
    value: function _emit(data) {
      this._listeners.forEach(function (listener) {
        return listener(data);
      });
    }
  }, {
    key: '_ended',
    value: function _ended() {
      this.block.ended(this.position);
    }
  }, {
    key: 'position',
    get: function get() {
      // index / numFrames * duration
      var frameIndex = this.dataReader._frameIndex;
      var numFrames = this.dataReader._numFrames;
      var duration = this.duration;

      var position = frameIndex / numFrames * duration;
      // if for some reason setTrack has not been called yet
      // (aka some module, like cursor, asking for a position too early)
      if (isNaN(position)) position = 0;

      return position;
    }
  }, {
    key: 'duration',
    get: function get() {
      return this.dataReader.sourceEndTime - this.dataReader.sourceStartTime;
    }
  }, {
    key: 'running',
    get: function get() {
      return this._running;
    }
  }]);
  return DataPlayer;
}(_AbstractPlayer3.default);

exports.default = DataPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsibGZvIiwiRGF0YVBsYXllciIsImJsb2NrIiwiX3J1bm5pbmciLCJfbGlzdGVuZXJzIiwiX2VtaXQiLCJiaW5kIiwiX2VuZGVkIiwiZGF0YVJlYWRlciIsInNvdXJjZSIsIkRhdGFSZWFkZXIiLCJicmlkZ2UiLCJzaW5rIiwiQnJpZGdlIiwicHJvY2Vzc0ZyYW1lIiwiZmluYWxpemVTdHJlYW0iLCJjb25uZWN0IiwidHJhY2tDb25maWciLCJwYXJhbXMiLCJzZXQiLCJkYXRhIiwiaW5pdFN0cmVhbSIsImluaXRpYWxpemVkIiwic3RhcnQiLCJzdG9wIiwicGF1c2UiLCJwb3NpdGlvbiIsInJlYWxQb3NpdGlvbiIsInNvdXJjZVN0YXJ0VGltZSIsInNlZWsiLCJsaXN0ZW5lciIsImFkZCIsInJlbW92ZSIsImZvckVhY2giLCJlbmRlZCIsImZyYW1lSW5kZXgiLCJfZnJhbWVJbmRleCIsIm51bUZyYW1lcyIsIl9udW1GcmFtZXMiLCJkdXJhdGlvbiIsImlzTmFOIiwic291cmNlRW5kVGltZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEc7O0FBQ1o7Ozs7Ozs7O0lBR01DLFU7OztBQUNKLHNCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOElBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7O0FBRUEsVUFBS0MsVUFBTCxHQUFrQixtQkFBbEI7O0FBRUEsVUFBS0MsS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0MsSUFBWCxPQUFiO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLE1BQUtBLE1BQUwsQ0FBWUQsSUFBWixPQUFkOztBQUVBLFVBQUtFLFVBQUwsR0FBa0IsSUFBSVIsSUFBSVMsTUFBSixDQUFXQyxVQUFmLEVBQWxCO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLElBQUlYLElBQUlZLElBQUosQ0FBU0MsTUFBYixDQUFvQjtBQUNoQ0Msb0JBQWMsTUFBS1QsS0FEYTtBQUVoQ1Usc0JBQWdCLE1BQUtSO0FBRlcsS0FBcEIsQ0FBZDtBQUlBLFVBQUtDLFVBQUwsQ0FBZ0JRLE9BQWhCLENBQXdCLE1BQUtMLE1BQTdCO0FBZmlCO0FBZ0JsQjs7Ozs2QkF5QlFNLFcsRUFBYTtBQUNwQixXQUFLVCxVQUFMLENBQWdCVSxNQUFoQixDQUF1QkMsR0FBdkIsQ0FBMkIsUUFBM0IsRUFBcUNGLFlBQVlHLElBQWpEO0FBQ0EsV0FBS1osVUFBTCxDQUFnQmEsVUFBaEIsR0FGb0IsQ0FFVTtBQUM5QixXQUFLYixVQUFMLENBQWdCYyxXQUFoQixHQUE4QixJQUE5QjtBQUNEOzs7NEJBRU87QUFDTixVQUFJLEtBQUtuQixRQUFMLEtBQWtCLEtBQXRCLEVBQTZCO0FBQzNCLGFBQUtBLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxhQUFLSyxVQUFMLENBQWdCZSxLQUFoQjtBQUNEO0FBQ0Y7OzsyQkFFTTtBQUNMLFdBQUtwQixRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsV0FBS0ssVUFBTCxDQUFnQmdCLElBQWhCO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUtyQixRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsV0FBS0ssVUFBTCxDQUFnQmlCLEtBQWhCO0FBQ0Q7Ozt5QkFFSUMsUSxFQUFVO0FBQ2IsVUFBTUMsZUFBZUQsV0FBVyxLQUFLbEIsVUFBTCxDQUFnQm9CLGVBQWhEO0FBQ0EsV0FBS3BCLFVBQUwsQ0FBZ0JxQixJQUFoQixDQUFxQkgsUUFBckI7QUFDRDs7QUFFRDs7OztnQ0FDWUksUSxFQUFVO0FBQ3BCLFdBQUsxQixVQUFMLENBQWdCMkIsR0FBaEIsQ0FBb0JELFFBQXBCO0FBQ0Q7OzttQ0FFY0EsUSxFQUFVO0FBQ3ZCLFdBQUsxQixVQUFMLENBQWdCNEIsTUFBaEIsQ0FBdUJGLFFBQXZCO0FBQ0Q7OzswQkFFS1YsSSxFQUFNO0FBQ1YsV0FBS2hCLFVBQUwsQ0FBZ0I2QixPQUFoQixDQUF3QjtBQUFBLGVBQVlILFNBQVNWLElBQVQsQ0FBWjtBQUFBLE9BQXhCO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUtsQixLQUFMLENBQVdnQyxLQUFYLENBQWlCLEtBQUtSLFFBQXRCO0FBQ0Q7Ozt3QkFsRWM7QUFDYjtBQUNBLFVBQU1TLGFBQWEsS0FBSzNCLFVBQUwsQ0FBZ0I0QixXQUFuQztBQUNBLFVBQU1DLFlBQVksS0FBSzdCLFVBQUwsQ0FBZ0I4QixVQUFsQztBQUNBLFVBQU1DLFdBQVcsS0FBS0EsUUFBdEI7O0FBRUEsVUFBSWIsV0FBV1MsYUFBYUUsU0FBYixHQUF5QkUsUUFBeEM7QUFDQTtBQUNBO0FBQ0EsVUFBSUMsTUFBTWQsUUFBTixDQUFKLEVBQ0VBLFdBQVcsQ0FBWDs7QUFFRixhQUFPQSxRQUFQO0FBQ0Q7Ozt3QkFFYztBQUNiLGFBQU8sS0FBS2xCLFVBQUwsQ0FBZ0JpQyxhQUFoQixHQUFnQyxLQUFLakMsVUFBTCxDQUFnQm9CLGVBQXZEO0FBQ0Q7Ozt3QkFFYTtBQUNaLGFBQU8sS0FBS3pCLFFBQVo7QUFDRDs7Ozs7a0JBZ0RZRixVIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG5pbXBvcnQgQWJzdHJhY3RQbGF5ZXIgZnJvbSAnLi4vY29yZS9BYnN0cmFjdFBsYXllcic7XG5cblxuY2xhc3MgRGF0YVBsYXllciBleHRlbmRzIEFic3RyYWN0UGxheWVyIHtcbiAgY29uc3RydWN0b3IoYmxvY2spIHtcbiAgICBzdXBlcihibG9jayk7XG5cbiAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG5cbiAgICB0aGlzLl9lbWl0ID0gdGhpcy5fZW1pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2VuZGVkID0gdGhpcy5fZW5kZWQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZGF0YVJlYWRlciA9IG5ldyBsZm8uc291cmNlLkRhdGFSZWFkZXIoKTtcbiAgICB0aGlzLmJyaWRnZSA9IG5ldyBsZm8uc2luay5CcmlkZ2Uoe1xuICAgICAgcHJvY2Vzc0ZyYW1lOiB0aGlzLl9lbWl0LFxuICAgICAgZmluYWxpemVTdHJlYW06IHRoaXMuX2VuZGVkLFxuICAgIH0pO1xuICAgIHRoaXMuZGF0YVJlYWRlci5jb25uZWN0KHRoaXMuYnJpZGdlKTtcbiAgfVxuXG4gIGdldCBwb3NpdGlvbigpIHtcbiAgICAvLyBpbmRleCAvIG51bUZyYW1lcyAqIGR1cmF0aW9uXG4gICAgY29uc3QgZnJhbWVJbmRleCA9IHRoaXMuZGF0YVJlYWRlci5fZnJhbWVJbmRleDtcbiAgICBjb25zdCBudW1GcmFtZXMgPSB0aGlzLmRhdGFSZWFkZXIuX251bUZyYW1lcztcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cbiAgICBsZXQgcG9zaXRpb24gPSBmcmFtZUluZGV4IC8gbnVtRnJhbWVzICogZHVyYXRpb247XG4gICAgLy8gaWYgZm9yIHNvbWUgcmVhc29uIHNldFRyYWNrIGhhcyBub3QgYmVlbiBjYWxsZWQgeWV0XG4gICAgLy8gKGFrYSBzb21lIG1vZHVsZSwgbGlrZSBjdXJzb3IsIGFza2luZyBmb3IgYSBwb3NpdGlvbiB0b28gZWFybHkpXG4gICAgaWYgKGlzTmFOKHBvc2l0aW9uKSlcbiAgICAgIHBvc2l0aW9uID0gMDtcblxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhUmVhZGVyLnNvdXJjZUVuZFRpbWUgLSB0aGlzLmRhdGFSZWFkZXIuc291cmNlU3RhcnRUaW1lO1xuICB9XG5cbiAgZ2V0IHJ1bm5pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3J1bm5pbmc7XG4gIH1cblxuICBzZXRUcmFjayh0cmFja0NvbmZpZykge1xuICAgIHRoaXMuZGF0YVJlYWRlci5wYXJhbXMuc2V0KCdzb3VyY2UnLCB0cmFja0NvbmZpZy5kYXRhKTtcbiAgICB0aGlzLmRhdGFSZWFkZXIuaW5pdFN0cmVhbSgpOyAvLyB3ZSBrbm93IGV2ZXJ0aGluZyBpcyBzeW5jaHJvbm91cyBpbiB0aGUgY2hhaW5cbiAgICB0aGlzLmRhdGFSZWFkZXIuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuX3J1bm5pbmcgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ydW5uaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGF0YVJlYWRlci5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5fcnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuZGF0YVJlYWRlci5zdG9wKCk7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5kYXRhUmVhZGVyLnBhdXNlKCk7XG4gIH1cblxuICBzZWVrKHBvc2l0aW9uKSB7XG4gICAgY29uc3QgcmVhbFBvc2l0aW9uID0gcG9zaXRpb24gKyB0aGlzLmRhdGFSZWFkZXIuc291cmNlU3RhcnRUaW1lO1xuICAgIHRoaXMuZGF0YVJlYWRlci5zZWVrKHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8vIHBsYXllciBzcGVjaWZpY1xuICBhZGRMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMuX2xpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucmVtb3ZlKGxpc3RlbmVyKTtcbiAgfVxuXG4gIF9lbWl0KGRhdGEpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lcihkYXRhKSk7XG4gIH1cblxuICBfZW5kZWQoKSB7XG4gICAgdGhpcy5ibG9jay5lbmRlZCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRhUGxheWVyO1xuIl19