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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFQbGF5ZXIuanMiXSwibmFtZXMiOlsibGZvIiwiRGF0YVBsYXllciIsImJsb2NrIiwiX3J1bm5pbmciLCJfbGlzdGVuZXJzIiwiX2VtaXQiLCJiaW5kIiwiX2VuZGVkIiwiZGF0YVJlYWRlciIsInNvdXJjZSIsIkRhdGFSZWFkZXIiLCJicmlkZ2UiLCJzaW5rIiwiQnJpZGdlIiwicHJvY2Vzc0ZyYW1lIiwiZmluYWxpemVTdHJlYW0iLCJjb25uZWN0IiwidHJhY2tDb25maWciLCJwYXJhbXMiLCJzZXQiLCJkYXRhIiwiaW5pdFN0cmVhbSIsImluaXRpYWxpemVkIiwic3RhcnQiLCJzdG9wIiwicGF1c2UiLCJwb3NpdGlvbiIsInJlYWxQb3NpdGlvbiIsInNvdXJjZVN0YXJ0VGltZSIsInNlZWsiLCJsaXN0ZW5lciIsImFkZCIsInJlbW92ZSIsImZvckVhY2giLCJlbmRlZCIsImZyYW1lSW5kZXgiLCJfZnJhbWVJbmRleCIsIm51bUZyYW1lcyIsIl9udW1GcmFtZXMiLCJkdXJhdGlvbiIsImlzTmFOIiwic291cmNlRW5kVGltZSIsIkFic3RyYWN0UGxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRzs7QUFDWjs7Ozs7Ozs7SUFHTUMsVTs7O0FBQ0osc0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw4SUFDWEEsS0FEVzs7QUFHakIsVUFBS0MsUUFBTCxHQUFnQixLQUFoQjs7QUFFQSxVQUFLQyxVQUFMLEdBQWtCLG1CQUFsQjs7QUFFQSxVQUFLQyxLQUFMLEdBQWEsTUFBS0EsS0FBTCxDQUFXQyxJQUFYLE9BQWI7QUFDQSxVQUFLQyxNQUFMLEdBQWMsTUFBS0EsTUFBTCxDQUFZRCxJQUFaLE9BQWQ7O0FBRUEsVUFBS0UsVUFBTCxHQUFrQixJQUFJUixJQUFJUyxNQUFKLENBQVdDLFVBQWYsRUFBbEI7QUFDQSxVQUFLQyxNQUFMLEdBQWMsSUFBSVgsSUFBSVksSUFBSixDQUFTQyxNQUFiLENBQW9CO0FBQ2hDQyxvQkFBYyxNQUFLVCxLQURhO0FBRWhDVSxzQkFBZ0IsTUFBS1I7QUFGVyxLQUFwQixDQUFkO0FBSUEsVUFBS0MsVUFBTCxDQUFnQlEsT0FBaEIsQ0FBd0IsTUFBS0wsTUFBN0I7QUFmaUI7QUFnQmxCOzs7OzZCQXlCUU0sVyxFQUFhO0FBQ3BCLFdBQUtULFVBQUwsQ0FBZ0JVLE1BQWhCLENBQXVCQyxHQUF2QixDQUEyQixRQUEzQixFQUFxQ0YsWUFBWUcsSUFBakQ7QUFDQSxXQUFLWixVQUFMLENBQWdCYSxVQUFoQixHQUZvQixDQUVVO0FBQzlCLFdBQUtiLFVBQUwsQ0FBZ0JjLFdBQWhCLEdBQThCLElBQTlCO0FBQ0Q7Ozs0QkFFTztBQUNOLFVBQUksS0FBS25CLFFBQUwsS0FBa0IsS0FBdEIsRUFBNkI7QUFDM0IsYUFBS0EsUUFBTCxHQUFnQixJQUFoQjtBQUNBLGFBQUtLLFVBQUwsQ0FBZ0JlLEtBQWhCO0FBQ0Q7QUFDRjs7OzJCQUVNO0FBQ0wsV0FBS3BCLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxXQUFLSyxVQUFMLENBQWdCZ0IsSUFBaEI7QUFDRDs7OzRCQUVPO0FBQ04sV0FBS3JCLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxXQUFLSyxVQUFMLENBQWdCaUIsS0FBaEI7QUFDRDs7O3lCQUVJQyxRLEVBQVU7QUFDYixVQUFNQyxlQUFlRCxXQUFXLEtBQUtsQixVQUFMLENBQWdCb0IsZUFBaEQ7QUFDQSxXQUFLcEIsVUFBTCxDQUFnQnFCLElBQWhCLENBQXFCSCxRQUFyQjtBQUNEOztBQUVEOzs7O2dDQUNZSSxRLEVBQVU7QUFDcEIsV0FBSzFCLFVBQUwsQ0FBZ0IyQixHQUFoQixDQUFvQkQsUUFBcEI7QUFDRDs7O21DQUVjQSxRLEVBQVU7QUFDdkIsV0FBSzFCLFVBQUwsQ0FBZ0I0QixNQUFoQixDQUF1QkYsUUFBdkI7QUFDRDs7OzBCQUVLVixJLEVBQU07QUFDVixXQUFLaEIsVUFBTCxDQUFnQjZCLE9BQWhCLENBQXdCO0FBQUEsZUFBWUgsU0FBU1YsSUFBVCxDQUFaO0FBQUEsT0FBeEI7QUFDRDs7OzZCQUVRO0FBQ1AsV0FBS2xCLEtBQUwsQ0FBV2dDLEtBQVgsQ0FBaUIsS0FBS1IsUUFBdEI7QUFDRDs7O3dCQWxFYztBQUNiO0FBQ0EsVUFBTVMsYUFBYSxLQUFLM0IsVUFBTCxDQUFnQjRCLFdBQW5DO0FBQ0EsVUFBTUMsWUFBWSxLQUFLN0IsVUFBTCxDQUFnQjhCLFVBQWxDO0FBQ0EsVUFBTUMsV0FBVyxLQUFLQSxRQUF0Qjs7QUFFQSxVQUFJYixXQUFXUyxhQUFhRSxTQUFiLEdBQXlCRSxRQUF4QztBQUNBO0FBQ0E7QUFDQSxVQUFJQyxNQUFNZCxRQUFOLENBQUosRUFDRUEsV0FBVyxDQUFYOztBQUVGLGFBQU9BLFFBQVA7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLbEIsVUFBTCxDQUFnQmlDLGFBQWhCLEdBQWdDLEtBQUtqQyxVQUFMLENBQWdCb0IsZUFBdkQ7QUFDRDs7O3dCQUVhO0FBQ1osYUFBTyxLQUFLekIsUUFBWjtBQUNEOzs7RUF4Q3NCdUMsd0I7O2tCQXdGVnpDLFUiLCJmaWxlIjoiRGF0YVBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uJztcbmltcG9ydCBBYnN0cmFjdFBsYXllciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0UGxheWVyJztcblxuXG5jbGFzcyBEYXRhUGxheWVyIGV4dGVuZHMgQWJzdHJhY3RQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihibG9jaykge1xuICAgIHN1cGVyKGJsb2NrKTtcblxuICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuICAgIHRoaXMuX2VtaXQgPSB0aGlzLl9lbWl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZW5kZWQgPSB0aGlzLl9lbmRlZC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5kYXRhUmVhZGVyID0gbmV3IGxmby5zb3VyY2UuRGF0YVJlYWRlcigpO1xuICAgIHRoaXMuYnJpZGdlID0gbmV3IGxmby5zaW5rLkJyaWRnZSh7XG4gICAgICBwcm9jZXNzRnJhbWU6IHRoaXMuX2VtaXQsXG4gICAgICBmaW5hbGl6ZVN0cmVhbTogdGhpcy5fZW5kZWQsXG4gICAgfSk7XG4gICAgdGhpcy5kYXRhUmVhZGVyLmNvbm5lY3QodGhpcy5icmlkZ2UpO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIC8vIGluZGV4IC8gbnVtRnJhbWVzICogZHVyYXRpb25cbiAgICBjb25zdCBmcmFtZUluZGV4ID0gdGhpcy5kYXRhUmVhZGVyLl9mcmFtZUluZGV4O1xuICAgIGNvbnN0IG51bUZyYW1lcyA9IHRoaXMuZGF0YVJlYWRlci5fbnVtRnJhbWVzO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblxuICAgIGxldCBwb3NpdGlvbiA9IGZyYW1lSW5kZXggLyBudW1GcmFtZXMgKiBkdXJhdGlvbjtcbiAgICAvLyBpZiBmb3Igc29tZSByZWFzb24gc2V0VHJhY2sgaGFzIG5vdCBiZWVuIGNhbGxlZCB5ZXRcbiAgICAvLyAoYWthIHNvbWUgbW9kdWxlLCBsaWtlIGN1cnNvciwgYXNraW5nIGZvciBhIHBvc2l0aW9uIHRvbyBlYXJseSlcbiAgICBpZiAoaXNOYU4ocG9zaXRpb24pKVxuICAgICAgcG9zaXRpb24gPSAwO1xuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFSZWFkZXIuc291cmNlRW5kVGltZSAtIHRoaXMuZGF0YVJlYWRlci5zb3VyY2VTdGFydFRpbWU7XG4gIH1cblxuICBnZXQgcnVubmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5fcnVubmluZztcbiAgfVxuXG4gIHNldFRyYWNrKHRyYWNrQ29uZmlnKSB7XG4gICAgdGhpcy5kYXRhUmVhZGVyLnBhcmFtcy5zZXQoJ3NvdXJjZScsIHRyYWNrQ29uZmlnLmRhdGEpO1xuICAgIHRoaXMuZGF0YVJlYWRlci5pbml0U3RyZWFtKCk7IC8vIHdlIGtub3cgZXZlcnRoaW5nIGlzIHN5bmNocm9ub3VzIGluIHRoZSBjaGFpblxuICAgIHRoaXMuZGF0YVJlYWRlci5pbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5fcnVubmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX3J1bm5pbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kYXRhUmVhZGVyLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5kYXRhUmVhZGVyLnN0b3AoKTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRhdGFSZWFkZXIucGF1c2UoKTtcbiAgfVxuXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICBjb25zdCByZWFsUG9zaXRpb24gPSBwb3NpdGlvbiArIHRoaXMuZGF0YVJlYWRlci5zb3VyY2VTdGFydFRpbWU7XG4gICAgdGhpcy5kYXRhUmVhZGVyLnNlZWsocG9zaXRpb24pO1xuICB9XG5cbiAgLy8gcGxheWVyIHNwZWNpZmljXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMuX2xpc3RlbmVycy5yZW1vdmUobGlzdGVuZXIpO1xuICB9XG5cbiAgX2VtaXQoZGF0YSkge1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKGRhdGEpKTtcbiAgfVxuXG4gIF9lbmRlZCgpIHtcbiAgICB0aGlzLmJsb2NrLmVuZGVkKHRoaXMucG9zaXRpb24pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFQbGF5ZXI7XG4iXX0=