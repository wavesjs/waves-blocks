"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractPlayer = function () {
  function AbstractPlayer(block) {
    (0, _classCallCheck3.default)(this, AbstractPlayer);

    this.block = block;
  }

  (0, _createClass3.default)(AbstractPlayer, [{
    key: "setTrack",
    value: function setTrack(trackBuffer) {}
  }, {
    key: "start",
    value: function start() {}
  }, {
    key: "pause",
    value: function pause() {}
  }, {
    key: "stop",
    value: function stop() {}
  }, {
    key: "seek",
    value: function seek(position) {}
  }, {
    key: "monitorPosition",
    value: function monitorPosition() {}
  }, {
    key: "position",
    get: function get() {}
  }, {
    key: "duration",
    get: function get() {}
  }, {
    key: "running",
    get: function get() {}
  }]);
  return AbstractPlayer;
}();

exports.default = AbstractPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0UGxheWVyIiwiYmxvY2siLCJ0cmFja0J1ZmZlciIsInBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBRU1BLGM7QUFDSiwwQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUNqQixTQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDRDs7Ozs2QkFRUUMsVyxFQUFhLENBRXJCOzs7NEJBRU8sQ0FBRTs7OzRCQUVGLENBQUU7OzsyQkFFSCxDQUFFOzs7eUJBRUpDLFEsRUFBVSxDQUFFOzs7c0NBRUMsQ0FBRTs7O3dCQWxCTCxDQUFFOzs7d0JBRUYsQ0FBRTs7O3dCQUVILENBQUU7Ozs7O2tCQWlCSEgsYyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5jbGFzcyBBYnN0cmFjdFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGJsb2NrKSB7XG4gICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCkge31cblxuICBnZXQgZHVyYXRpb24oKSB7fVxuXG4gIGdldCBydW5uaW5nKCkge31cblxuICBzZXRUcmFjayh0cmFja0J1ZmZlcikge1xuXG4gIH1cblxuICBzdGFydCgpIHt9XG5cbiAgcGF1c2UoKSB7fVxuXG4gIHN0b3AoKSB7fVxuXG4gIHNlZWsocG9zaXRpb24pIHt9XG5cbiAgbW9uaXRvclBvc2l0aW9uKCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RQbGF5ZXI7XG4iXX0=