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

var Bpf = function (_AbstractModule) {
  (0, _inherits3.default)(Bpf, _AbstractModule);

  function Bpf(options) {
    (0, _classCallCheck3.default)(this, Bpf);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Bpf.__proto__ || (0, _getPrototypeOf2.default)(Bpf)).call(this, definitions, options));

    _this2._lines = null;
    return _this2;
  }

  (0, _createClass3.default)(Bpf, [{
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
  return Bpf;
}(_AbstractModule3.default);

exports.default = Bpf;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJwZi5qcyJdLCJuYW1lcyI6WyJ1aSIsIk11bHRpbGluZSIsImNvbG9ycyIsImZyYW1lU2l6ZSIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJHBhdGhzIiwicGFyYW1zIiwiaSIsIiRwYXRoIiwic2V0QXR0cmlidXRlTlMiLCJhcHBlbmRDaGlsZCIsImRhdGEiLCJ0aW1lT2Zmc2V0IiwidGltZSIsIm51bUZyYW1lcyIsImxlbmd0aCIsInBhdGgiLCJqIiwiZnJhbWUiLCJ4IiwidGltZVRvUGl4ZWwiLCJ5IiwidmFsdWVUb1BpeGVsIiwic2hhcGVzIiwiQmFzZVNoYXBlIiwiZGVmaW5pdGlvbnMiLCJCcGYiLCJvcHRpb25zIiwiX2xpbmVzIiwiYnVmZmVyIiwibWV0YWRhdGEiLCJibG9jayIsInRyYWNrIiwidGltZUNvbnRleHQiLCJyZWNvcmRpbmciLCJyZW1vdmUiLCJsaW5lcyIsImNvcmUiLCJMYXllciIsImZyYW1lcyIsImhlaWdodCIsInlEb21haW4iLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic3RyZWFtUGFyYW1zIiwiYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxFOztBQUNaOzs7Ozs7OztBQUVBO0lBQ01DLFM7Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLFdBQVA7QUFBb0I7Ozt1Q0FFbEI7QUFDakIsYUFBTyxFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTEMsZ0JBQVEsQ0FBQyxXQUFELEVBQWMsUUFBZCxFQUF3QixRQUF4QixFQUFrQyxPQUFsQyxFQUEyQyxRQUEzQyxFQUFxRCxNQUFyRCxDQURIO0FBRUxDLG1CQUFXO0FBRk4sT0FBUDtBQUlEOzs7MkJBRU1DLGdCLEVBQWtCO0FBQ3ZCLFdBQUtDLEdBQUwsR0FBV0MsU0FBU0MsZUFBVCxDQUF5QixLQUFLQyxFQUE5QixFQUFrQyxHQUFsQyxD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QUtSLE1BQUwsR0FBY1EsS0FBZDtBQUNEOzs7OztrQkFHWVYsRyIsImZpbGUiOiJCcGYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbi8vIGRpc3BsYXkgc2lnbmFsIGZyb20gTEZPIHZlY3RvciBzdHJlYW0gbGlrZVxuY2xhc3MgTXVsdGlsaW5lIGV4dGVuZHMgdWkuc2hhcGVzLkJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdtdWx0aWxpbmUnIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3JzOiBbJ3N0ZWVsYmx1ZScsICdvcmFuZ2UnLCAneWVsbG93JywgJ2dyZWVuJywgJ3B1cnBsZScsICdncmV5J10sXG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcblxuICAgIHRoaXMuJHBhdGhzID0gW107XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgJHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgICRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcnNbaV0pO1xuICAgICAgJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuXG4gICAgICB0aGlzLiRwYXRoc1tpXSA9ICRwYXRoO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLy8gcmVjZW50ZXIgb24gemVyb1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGNvbnN0IHRpbWVPZmZzZXQgPSBkYXRhWzBdLnRpbWU7XG4gICAgY29uc3QgbnVtRnJhbWVzID0gZGF0YS5sZW5ndGg7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgbGV0IHBhdGggPSAnTSc7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtRnJhbWVzOyBqKyspIHtcbiAgICAgICAgY29uc3QgZnJhbWUgPSBkYXRhW2pdO1xuICAgICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChmcmFtZS50aW1lIC0gdGltZU9mZnNldCk7XG4gICAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChmcmFtZS5kYXRhW2ldKTtcbiAgICAgICAgcGF0aCArPSBgJHt4fSwke3l9YDtcblxuICAgICAgICBpZiAoaiA8IG51bUZyYW1lcyAtIDEpXG4gICAgICAgICAgcGF0aCArPSAnTCc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJHBhdGhzW2ldLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgcGF0aCk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge307XG5cbmNsYXNzIEJwZiBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2xpbmVzID0gbnVsbDtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGEpIHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2s7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IGJsb2NrLnVpO1xuICAgIGNvbnN0IHJlY29yZGluZyA9IG1ldGFkYXRhLmRhdGE7XG5cbiAgICBpZiAodGhpcy5fbGluZXMpXG4gICAgICB0cmFjay5yZW1vdmUodGhpcy5fbGluZXMpO1xuXG4gICAgY29uc3QgbGluZXMgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgcmVjb3JkaW5nLmZyYW1lcywge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbMCwgNjAwXSxcbiAgICB9KTtcblxuICAgIGxpbmVzLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KVxuICAgIGxpbmVzLmNvbmZpZ3VyZVNoYXBlKE11bHRpbGluZSwge1xuICAgICAgZnJhbWVTaXplOiByZWNvcmRpbmcuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSxcbiAgICB9LCB7fSk7XG5cbiAgICB0cmFjay5hZGQobGluZXMpO1xuXG4gICAgdGhpcy5fbGluZXMgPSBsaW5lcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcGY7XG4iXX0=