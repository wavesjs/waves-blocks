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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsidWkiLCJNdWx0aWxpbmUiLCJjb2xvcnMiLCJmcmFtZVNpemUiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsIiRwYXRocyIsInBhcmFtcyIsImkiLCIkcGF0aCIsInNldEF0dHJpYnV0ZU5TIiwiYXBwZW5kQ2hpbGQiLCJkYXRhIiwidGltZU9mZnNldCIsInRpbWUiLCJudW1GcmFtZXMiLCJsZW5ndGgiLCJwYXRoIiwiaiIsImZyYW1lIiwieCIsInRpbWVUb1BpeGVsIiwieSIsInZhbHVlVG9QaXhlbCIsInNoYXBlcyIsIkJhc2VTaGFwZSIsImRlZmluaXRpb25zIiwiQnBmIiwib3B0aW9ucyIsIl9saW5lcyIsImJ1ZmZlciIsIm1ldGFkYXRhIiwiYmxvY2siLCJ0cmFjayIsInRpbWVDb250ZXh0IiwicmVjb3JkaW5nIiwicmVtb3ZlIiwibGluZXMiLCJjb3JlIiwiTGF5ZXIiLCJmcmFtZXMiLCJoZWlnaHQiLCJ5RG9tYWluIiwic2V0VGltZUNvbnRleHQiLCJjb25maWd1cmVTaGFwZSIsInN0cmVhbVBhcmFtcyIsImFkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsRTs7QUFDWjs7Ozs7Ozs7QUFFQTtJQUNNQyxTOzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxXQUFQO0FBQW9COzs7dUNBRWxCO0FBQ2pCLGFBQU8sRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLGdCQUFRLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsUUFBeEIsRUFBa0MsT0FBbEMsRUFBMkMsUUFBM0MsRUFBcUQsTUFBckQsQ0FESDtBQUVMQyxtQkFBVztBQUZOLE9BQVA7QUFJRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsR0FB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QSxXQUFLUixNQUFMLEdBQWNRLEtBQWQ7QUFDRDs7Ozs7a0JBR1lWLEciLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHVpIGZyb20gJ3dhdmVzLXVpJztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuLi9jb3JlL0Fic3RyYWN0TW9kdWxlJztcblxuLy8gZGlzcGxheSBzaWduYWwgZnJvbSBMRk8gdmVjdG9yIHN0cmVhbSBsaWtlXG5jbGFzcyBNdWx0aWxpbmUgZXh0ZW5kcyB1aS5zaGFwZXMuQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ211bHRpbGluZScgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcnM6IFsnc3RlZWxibHVlJywgJ29yYW5nZScsICd5ZWxsb3cnLCAnZ3JlZW4nLCAncHVycGxlJywgJ2dyZXknXSxcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kcGF0aHMgPSBbXTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCAkcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgICAgJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yc1tpXSk7XG4gICAgICAkcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG5cbiAgICAgIHRoaXMuJHBhdGhzW2ldID0gJHBhdGg7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkcGF0aClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvLyByZWNlbnRlciBvbiB6ZXJvXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgY29uc3QgdGltZU9mZnNldCA9IGRhdGFbMF0udGltZTtcbiAgICBjb25zdCBudW1GcmFtZXMgPSBkYXRhLmxlbmd0aDtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBsZXQgcGF0aCA9ICdNJztcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1GcmFtZXM7IGorKykge1xuICAgICAgICBjb25zdCBmcmFtZSA9IGRhdGFbal07XG4gICAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGZyYW1lLnRpbWUgLSB0aW1lT2Zmc2V0KTtcbiAgICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGZyYW1lLmRhdGFbaV0pO1xuICAgICAgICBwYXRoICs9IGAke3h9LCR7eX1gO1xuXG4gICAgICAgIGlmIChqIDwgbnVtRnJhbWVzIC0gMSlcbiAgICAgICAgICBwYXRoICs9ICdMJztcbiAgICAgIH1cblxuICAgICAgdGhpcy4kcGF0aHNbaV0uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBwYXRoKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7fTtcblxuY2xhc3MgQnBmIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fbGluZXMgPSBudWxsO1xuICB9XG5cbiAgc2V0VHJhY2soYnVmZmVyLCBtZXRhZGF0YSkge1xuICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9jaztcbiAgICBjb25zdCB7IHRyYWNrLCB0aW1lQ29udGV4dCB9ID0gYmxvY2sudWk7XG4gICAgY29uc3QgcmVjb3JkaW5nID0gbWV0YWRhdGEuZGF0YTtcblxuICAgIGlmICh0aGlzLl9saW5lcylcbiAgICAgIHRyYWNrLnJlbW92ZSh0aGlzLl9saW5lcyk7XG5cbiAgICBjb25zdCBsaW5lcyA9IG5ldyB1aS5jb3JlLkxheWVyKCdlbnRpdHknLCByZWNvcmRpbmcuZnJhbWVzLCB7XG4gICAgICBoZWlnaHQ6IGJsb2NrLmhlaWdodCxcbiAgICAgIHlEb21haW46IFswLCA2MDBdLFxuICAgIH0pO1xuXG4gICAgbGluZXMuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpXG4gICAgbGluZXMuY29uZmlndXJlU2hhcGUoTXVsdGlsaW5lLCB7XG4gICAgICBmcmFtZVNpemU6IHJlY29yZGluZy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplLFxuICAgIH0sIHt9KTtcblxuICAgIHRyYWNrLmFkZChsaW5lcyk7XG5cbiAgICB0aGlzLl9saW5lcyA9IGxpbmVzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJwZjtcbiJdfQ==