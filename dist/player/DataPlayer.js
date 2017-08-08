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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImxmbyIsIkRhdGFQbGF5ZXIiLCJibG9jayIsIl9ydW5uaW5nIiwiX2xpc3RlbmVycyIsIl9lbWl0IiwiYmluZCIsIl9lbmRlZCIsImRhdGFSZWFkZXIiLCJzb3VyY2UiLCJEYXRhUmVhZGVyIiwiYnJpZGdlIiwic2luayIsIkJyaWRnZSIsInByb2Nlc3NGcmFtZSIsImZpbmFsaXplU3RyZWFtIiwiY29ubmVjdCIsInRyYWNrQ29uZmlnIiwicGFyYW1zIiwic2V0IiwiZGF0YSIsImluaXRTdHJlYW0iLCJpbml0aWFsaXplZCIsInN0YXJ0Iiwic3RvcCIsInBhdXNlIiwicG9zaXRpb24iLCJyZWFsUG9zaXRpb24iLCJzb3VyY2VTdGFydFRpbWUiLCJzZWVrIiwibGlzdGVuZXIiLCJhZGQiLCJyZW1vdmUiLCJmb3JFYWNoIiwiZW5kZWQiLCJmcmFtZUluZGV4IiwiX2ZyYW1lSW5kZXgiLCJudW1GcmFtZXMiLCJfbnVtRnJhbWVzIiwiZHVyYXRpb24iLCJpc05hTiIsInNvdXJjZUVuZFRpbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxHOztBQUNaOzs7Ozs7OztJQUdNQyxVOzs7QUFDSixzQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhJQUNYQSxLQURXOztBQUdqQixVQUFLQyxRQUFMLEdBQWdCLEtBQWhCOztBQUVBLFVBQUtDLFVBQUwsR0FBa0IsbUJBQWxCOztBQUVBLFVBQUtDLEtBQUwsR0FBYSxNQUFLQSxLQUFMLENBQVdDLElBQVgsT0FBYjtBQUNBLFVBQUtDLE1BQUwsR0FBYyxNQUFLQSxNQUFMLENBQVlELElBQVosT0FBZDs7QUFFQSxVQUFLRSxVQUFMLEdBQWtCLElBQUlSLElBQUlTLE1BQUosQ0FBV0MsVUFBZixFQUFsQjtBQUNBLFVBQUtDLE1BQUwsR0FBYyxJQUFJWCxJQUFJWSxJQUFKLENBQVNDLE1BQWIsQ0FBb0I7QUFDaENDLG9CQUFjLE1BQUtULEtBRGE7QUFFaENVLHNCQUFnQixNQUFLUjtBQUZXLEtBQXBCLENBQWQ7QUFJQSxVQUFLQyxVQUFMLENBQWdCUSxPQUFoQixDQUF3QixNQUFLTCxNQUE3QjtBQWZpQjtBQWdCbEI7Ozs7NkJBeUJRTSxXLEVBQWE7QUFDcEIsV0FBS1QsVUFBTCxDQUFnQlUsTUFBaEIsQ0FBdUJDLEdBQXZCLENBQTJCLFFBQTNCLEVBQXFDRixZQUFZRyxJQUFqRDtBQUNBLFdBQUtaLFVBQUwsQ0FBZ0JhLFVBQWhCLEdBRm9CLENBRVU7QUFDOUIsV0FBS2IsVUFBTCxDQUFnQmMsV0FBaEIsR0FBOEIsSUFBOUI7QUFDRDs7OzRCQUVPO0FBQ04sVUFBSSxLQUFLbkIsUUFBTCxLQUFrQixLQUF0QixFQUE2QjtBQUMzQixhQUFLQSxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBS0ssVUFBTCxDQUFnQmUsS0FBaEI7QUFDRDtBQUNGOzs7MkJBRU07QUFDTCxXQUFLcEIsUUFBTCxHQUFnQixLQUFoQjtBQUNBLFdBQUtLLFVBQUwsQ0FBZ0JnQixJQUFoQjtBQUNEOzs7NEJBRU87QUFDTixXQUFLckIsUUFBTCxHQUFnQixLQUFoQjtBQUNBLFdBQUtLLFVBQUwsQ0FBZ0JpQixLQUFoQjtBQUNEOzs7eUJBRUlDLFEsRUFBVTtBQUNiLFVBQU1DLGVBQWVELFdBQVcsS0FBS2xCLFVBQUwsQ0FBZ0JvQixlQUFoRDtBQUNBLFdBQUtwQixVQUFMLENBQWdCcUIsSUFBaEIsQ0FBcUJILFFBQXJCO0FBQ0Q7O0FBRUQ7Ozs7Z0NBQ1lJLFEsRUFBVTtBQUNwQixXQUFLMUIsVUFBTCxDQUFnQjJCLEdBQWhCLENBQW9CRCxRQUFwQjtBQUNEOzs7bUNBRWNBLFEsRUFBVTtBQUN2QixXQUFLMUIsVUFBTCxDQUFnQjRCLE1BQWhCLENBQXVCRixRQUF2QjtBQUNEOzs7MEJBRUtWLEksRUFBTTtBQUNWLFdBQUtoQixVQUFMLENBQWdCNkIsT0FBaEIsQ0FBd0I7QUFBQSxlQUFZSCxTQUFTVixJQUFULENBQVo7QUFBQSxPQUF4QjtBQUNEOzs7NkJBRVE7QUFDUCxXQUFLbEIsS0FBTCxDQUFXZ0MsS0FBWCxDQUFpQixLQUFLUixRQUF0QjtBQUNEOzs7d0JBbEVjO0FBQ2I7QUFDQSxVQUFNUyxhQUFhLEtBQUszQixVQUFMLENBQWdCNEIsV0FBbkM7QUFDQSxVQUFNQyxZQUFZLEtBQUs3QixVQUFMLENBQWdCOEIsVUFBbEM7QUFDQSxVQUFNQyxXQUFXLEtBQUtBLFFBQXRCOztBQUVBLFVBQUliLFdBQVdTLGFBQWFFLFNBQWIsR0FBeUJFLFFBQXhDO0FBQ0E7QUFDQTtBQUNBLFVBQUlDLE1BQU1kLFFBQU4sQ0FBSixFQUNFQSxXQUFXLENBQVg7O0FBRUYsYUFBT0EsUUFBUDtBQUNEOzs7d0JBRWM7QUFDYixhQUFPLEtBQUtsQixVQUFMLENBQWdCaUMsYUFBaEIsR0FBZ0MsS0FBS2pDLFVBQUwsQ0FBZ0JvQixlQUF2RDtBQUNEOzs7d0JBRWE7QUFDWixhQUFPLEtBQUt6QixRQUFaO0FBQ0Q7Ozs7O2tCQWdEWUYsVSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uJztcbmltcG9ydCBBYnN0cmFjdFBsYXllciBmcm9tICcuLi9jb3JlL0Fic3RyYWN0UGxheWVyJztcblxuXG5jbGFzcyBEYXRhUGxheWVyIGV4dGVuZHMgQWJzdHJhY3RQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihibG9jaykge1xuICAgIHN1cGVyKGJsb2NrKTtcblxuICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuICAgIHRoaXMuX2VtaXQgPSB0aGlzLl9lbWl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZW5kZWQgPSB0aGlzLl9lbmRlZC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5kYXRhUmVhZGVyID0gbmV3IGxmby5zb3VyY2UuRGF0YVJlYWRlcigpO1xuICAgIHRoaXMuYnJpZGdlID0gbmV3IGxmby5zaW5rLkJyaWRnZSh7XG4gICAgICBwcm9jZXNzRnJhbWU6IHRoaXMuX2VtaXQsXG4gICAgICBmaW5hbGl6ZVN0cmVhbTogdGhpcy5fZW5kZWQsXG4gICAgfSk7XG4gICAgdGhpcy5kYXRhUmVhZGVyLmNvbm5lY3QodGhpcy5icmlkZ2UpO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIC8vIGluZGV4IC8gbnVtRnJhbWVzICogZHVyYXRpb25cbiAgICBjb25zdCBmcmFtZUluZGV4ID0gdGhpcy5kYXRhUmVhZGVyLl9mcmFtZUluZGV4O1xuICAgIGNvbnN0IG51bUZyYW1lcyA9IHRoaXMuZGF0YVJlYWRlci5fbnVtRnJhbWVzO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblxuICAgIGxldCBwb3NpdGlvbiA9IGZyYW1lSW5kZXggLyBudW1GcmFtZXMgKiBkdXJhdGlvbjtcbiAgICAvLyBpZiBmb3Igc29tZSByZWFzb24gc2V0VHJhY2sgaGFzIG5vdCBiZWVuIGNhbGxlZCB5ZXRcbiAgICAvLyAoYWthIHNvbWUgbW9kdWxlLCBsaWtlIGN1cnNvciwgYXNraW5nIGZvciBhIHBvc2l0aW9uIHRvbyBlYXJseSlcbiAgICBpZiAoaXNOYU4ocG9zaXRpb24pKVxuICAgICAgcG9zaXRpb24gPSAwO1xuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFSZWFkZXIuc291cmNlRW5kVGltZSAtIHRoaXMuZGF0YVJlYWRlci5zb3VyY2VTdGFydFRpbWU7XG4gIH1cblxuICBnZXQgcnVubmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5fcnVubmluZztcbiAgfVxuXG4gIHNldFRyYWNrKHRyYWNrQ29uZmlnKSB7XG4gICAgdGhpcy5kYXRhUmVhZGVyLnBhcmFtcy5zZXQoJ3NvdXJjZScsIHRyYWNrQ29uZmlnLmRhdGEpO1xuICAgIHRoaXMuZGF0YVJlYWRlci5pbml0U3RyZWFtKCk7IC8vIHdlIGtub3cgZXZlcnRoaW5nIGlzIHN5bmNocm9ub3VzIGluIHRoZSBjaGFpblxuICAgIHRoaXMuZGF0YVJlYWRlci5pbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5fcnVubmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX3J1bm5pbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kYXRhUmVhZGVyLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5kYXRhUmVhZGVyLnN0b3AoKTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRhdGFSZWFkZXIucGF1c2UoKTtcbiAgfVxuXG4gIHNlZWsocG9zaXRpb24pIHtcbiAgICBjb25zdCByZWFsUG9zaXRpb24gPSBwb3NpdGlvbiArIHRoaXMuZGF0YVJlYWRlci5zb3VyY2VTdGFydFRpbWU7XG4gICAgdGhpcy5kYXRhUmVhZGVyLnNlZWsocG9zaXRpb24pO1xuICB9XG5cbiAgLy8gcGxheWVyIHNwZWNpZmljXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMuX2xpc3RlbmVycy5yZW1vdmUobGlzdGVuZXIpO1xuICB9XG5cbiAgX2VtaXQoZGF0YSkge1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKGRhdGEpKTtcbiAgfVxuXG4gIF9lbmRlZCgpIHtcbiAgICB0aGlzLmJsb2NrLmVuZGVkKHRoaXMucG9zaXRpb24pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFQbGF5ZXI7XG4iXX0=