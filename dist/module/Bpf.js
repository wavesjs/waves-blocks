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

/**
 * @fixme
 */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJwZi5qcyJdLCJuYW1lcyI6WyJ1aSIsIk11bHRpbGluZSIsImNvbG9ycyIsImZyYW1lU2l6ZSIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJHBhdGhzIiwicGFyYW1zIiwiaSIsIiRwYXRoIiwic2V0QXR0cmlidXRlTlMiLCJhcHBlbmRDaGlsZCIsImRhdGEiLCJ0aW1lT2Zmc2V0IiwidGltZSIsIm51bUZyYW1lcyIsImxlbmd0aCIsInBhdGgiLCJqIiwiZnJhbWUiLCJ4IiwidGltZVRvUGl4ZWwiLCJ5IiwidmFsdWVUb1BpeGVsIiwic2hhcGVzIiwiQmFzZVNoYXBlIiwiZGVmaW5pdGlvbnMiLCJCcGYiLCJvcHRpb25zIiwiX2xpbmVzIiwiYnVmZmVyIiwibWV0YWRhdGEiLCJibG9jayIsInRyYWNrIiwidGltZUNvbnRleHQiLCJyZWNvcmRpbmciLCJyZW1vdmUiLCJsaW5lcyIsImNvcmUiLCJMYXllciIsImZyYW1lcyIsImhlaWdodCIsInlEb21haW4iLCJzZXRUaW1lQ29udGV4dCIsImNvbmZpZ3VyZVNoYXBlIiwic3RyZWFtUGFyYW1zIiwiYWRkIiwiQWJzdHJhY3RNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7Ozs7Ozs7O0FBRUE7SUFDTUMsUzs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8sV0FBUDtBQUFvQjs7O3VDQUVsQjtBQUNqQixhQUFPLEVBQVA7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTztBQUNMQyxnQkFBUSxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQXdCLFFBQXhCLEVBQWtDLE9BQWxDLEVBQTJDLFFBQTNDLEVBQXFELE1BQXJELENBREg7QUFFTEMsbUJBQVc7QUFGTixPQUFQO0FBSUQ7OzsyQkFFTUMsZ0IsRUFBa0I7QUFDdkIsV0FBS0MsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVB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LEdBQU4sQ0FBVVQsS0FBVjs7QUFFQSxXQUFLUixNQUFMLEdBQWNRLEtBQWQ7QUFDRDs7O0VBNUJlVSx3Qjs7a0JBK0JIcEIsRyIsImZpbGUiOiJCcGYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aSBmcm9tICd3YXZlcy11aSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi4vY29yZS9BYnN0cmFjdE1vZHVsZSc7XG5cbi8vIGRpc3BsYXkgc2lnbmFsIGZyb20gTEZPIHZlY3RvciBzdHJlYW0gbGlrZVxuY2xhc3MgTXVsdGlsaW5lIGV4dGVuZHMgdWkuc2hhcGVzLkJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdtdWx0aWxpbmUnIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3JzOiBbJ3N0ZWVsYmx1ZScsICdvcmFuZ2UnLCAneWVsbG93JywgJ2dyZWVuJywgJ3B1cnBsZScsICdncmV5J10sXG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcblxuICAgIHRoaXMuJHBhdGhzID0gW107XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgJHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgICRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcnNbaV0pO1xuICAgICAgJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuXG4gICAgICB0aGlzLiRwYXRoc1tpXSA9ICRwYXRoO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLy8gcmVjZW50ZXIgb24gemVyb1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGNvbnN0IHRpbWVPZmZzZXQgPSBkYXRhWzBdLnRpbWU7XG4gICAgY29uc3QgbnVtRnJhbWVzID0gZGF0YS5sZW5ndGg7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgbGV0IHBhdGggPSAnTSc7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtRnJhbWVzOyBqKyspIHtcbiAgICAgICAgY29uc3QgZnJhbWUgPSBkYXRhW2pdO1xuICAgICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChmcmFtZS50aW1lIC0gdGltZU9mZnNldCk7XG4gICAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChmcmFtZS5kYXRhW2ldKTtcbiAgICAgICAgcGF0aCArPSBgJHt4fSwke3l9YDtcblxuICAgICAgICBpZiAoaiA8IG51bUZyYW1lcyAtIDEpXG4gICAgICAgICAgcGF0aCArPSAnTCc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJHBhdGhzW2ldLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgcGF0aCk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge307XG5cbi8qKlxuICogQGZpeG1lXG4gKi9cbmNsYXNzIEJwZiBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2xpbmVzID0gbnVsbDtcbiAgfVxuXG4gIHNldFRyYWNrKGJ1ZmZlciwgbWV0YWRhdGEpIHtcbiAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2s7XG4gICAgY29uc3QgeyB0cmFjaywgdGltZUNvbnRleHQgfSA9IGJsb2NrLnVpO1xuICAgIGNvbnN0IHJlY29yZGluZyA9IG1ldGFkYXRhLmRhdGE7XG5cbiAgICBpZiAodGhpcy5fbGluZXMpXG4gICAgICB0cmFjay5yZW1vdmUodGhpcy5fbGluZXMpO1xuXG4gICAgY29uc3QgbGluZXMgPSBuZXcgdWkuY29yZS5MYXllcignZW50aXR5JywgcmVjb3JkaW5nLmZyYW1lcywge1xuICAgICAgaGVpZ2h0OiBibG9jay5oZWlnaHQsXG4gICAgICB5RG9tYWluOiBbMCwgNjAwXSxcbiAgICB9KTtcblxuICAgIGxpbmVzLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KVxuICAgIGxpbmVzLmNvbmZpZ3VyZVNoYXBlKE11bHRpbGluZSwge1xuICAgICAgZnJhbWVTaXplOiByZWNvcmRpbmcuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSxcbiAgICB9LCB7fSk7XG5cbiAgICB0cmFjay5hZGQobGluZXMpO1xuXG4gICAgdGhpcy5fbGluZXMgPSBsaW5lcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcGY7XG4iXX0=