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

var BpfModule = function (_AbstractModule) {
  (0, _inherits3.default)(BpfModule, _AbstractModule);

  function BpfModule(options) {
    (0, _classCallCheck3.default)(this, BpfModule);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (BpfModule.__proto__ || (0, _getPrototypeOf2.default)(BpfModule)).call(this, definitions, options));

    _this2._lines = null;
    return _this2;
  }

  (0, _createClass3.default)(BpfModule, [{
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
  return BpfModule;
}(_AbstractModule3.default);

exports.default = BpfModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJNdWx0aWxpbmUiLCJjb2xvcnMiLCJmcmFtZVNpemUiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsIiRwYXRocyIsInBhcmFtcyIsImkiLCIkcGF0aCIsInNldEF0dHJpYnV0ZU5TIiwiYXBwZW5kQ2hpbGQiLCJkYXRhIiwidGltZU9mZnNldCIsInRpbWUiLCJudW1GcmFtZXMiLCJsZW5ndGgiLCJwYXRoIiwiaiIsImZyYW1lIiwieCIsInRpbWVUb1BpeGVsIiwieSIsInZhbHVlVG9QaXhlbCIsInNoYXBlcyIsIkJhc2VTaGFwZSIsImRlZmluaXRpb25zIiwiQnBmTW9kdWxlIiwib3B0aW9ucyIsIl9saW5lcyIsImJ1ZmZlciIsIm1ldGFkYXRhIiwiYmxvY2siLCJ0cmFjayIsInRpbWVDb250ZXh0IiwicmVjb3JkaW5nIiwicmVtb3ZlIiwibGluZXMiLCJjb3JlIiwiTGF5ZXIiLCJmcmFtZXMiLCJoZWlnaHQiLCJ5RG9tYWluIiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInN0cmVhbVBhcmFtcyIsImFkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7Ozs7Ozs7QUFFQTtJQUNNQyxTOzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxXQUFQO0FBQW9COzs7dUNBRWxCO0FBQ2pCLGFBQU8sRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLGdCQUFRLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsUUFBeEIsRUFBa0MsT0FBbEMsRUFBMkMsUUFBM0MsRUFBcUQsTUFBckQsQ0FESDtBQUVMQyxtQkFBVztBQUZOLE9BQVA7QUFJRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFB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QVY7O0FBRUEsV0FBS1IsTUFBTCxHQUFjUSxLQUFkO0FBQ0Q7Ozs7O2tCQUdZVixTIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbi8vIGRpc3BsYXkgc2lnbmFsIGZyb20gTEZPIHZlY3RvciBzdHJlYW0gbGlrZVxuY2xhc3MgTXVsdGlsaW5lIGV4dGVuZHMgdWkuc2hhcGVzLkJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdtdWx0aWxpbmUnIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3JzOiBbJ3N0ZWVsYmx1ZScsICdvcmFuZ2UnLCAneWVsbG93JywgJ2dyZWVuJywgJ3B1cnBsZScsICdncmV5J10sXG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcblxuICAgIHRoaXMuJHBhdGhzID0gW107XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgJHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgICRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcnNbaV0pO1xuICAgICAgJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuXG4gICAgICB0aGlzLiRwYXRoc1tpXSA9ICRwYXRoO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLy8gcmVjZW50ZXIgb24gemVyb1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGNvbnN0IHRpbWVPZmZzZXQgPSBkYXRhWzBdLnRpbWU7XG4gICAgY29uc3QgbnVtRnJhbWVzID0gZGF0YS5sZW5ndGg7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgbGV0IHBhdGggPSAnTSc7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtRnJhbWVzOyBqKyspIHtcbiAgICAgICAgY29uc3QgZnJhbWUgPSBkYXRhW2pdO1xuICAgICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChmcmFtZS50aW1lIC0gdGltZU9mZnNldCk7XG4gICAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChmcmFtZS5kYXRhW2ldKTtcbiAgICAgICAgcGF0aCArPSBgJHt4fSwke3l9YDtcblxuICAgICAgICBpZiAoaiA8IG51bUZyYW1lcyAtIDEpXG4gICAgICAgICAgcGF0aCArPSAnTCc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJHBhdGhzW2ldLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgcGF0aCk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge307XG5cbmNsYXNzIEJwZk1vZHVsZSBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2xpbmVzID0gbnVsbDtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGEpIHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2s7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IGJsb2NrLnVpO1xuICAgIGNvbnN0IHJlY29yZGluZyA9IG1ldGFkYXRhLmRhdGE7XG5cbiAgICBpZiAodGhpcy5fbGluZXMpXG4gICAgICB0cmFjay5yZW1vdmUodGhpcy5fbGluZXMpO1xuXG4gICAgY29uc3QgbGluZXMgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgcmVjb3JkaW5nLmZyYW1lcywge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbMCwgNjAwXSxcbiAgICB9KTtcblxuICAgIGxpbmVzLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KVxuICAgIGxpbmVzLmNvbmZpZ3VyZVNoYXBlKE11bHRpbGluZSwge1xuICAgICAgZnJhbWVTaXplOiByZWNvcmRpbmcuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSxcbiAgICB9LCB7fSk7XG5cbiAgICB0cmFjay5hZGQobGluZXMpO1xuXG4gICAgdGhpcy5fbGluZXMgPSBsaW5lcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcGZNb2R1bGU7XG4iXX0=