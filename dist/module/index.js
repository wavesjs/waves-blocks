'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractAnnotationModule = require('./AbstractAnnotationModule');

var _AbstractAnnotationModule2 = _interopRequireDefault(_AbstractAnnotationModule);

var _BpfModule = require('./BpfModule');

var _BpfModule2 = _interopRequireDefault(_BpfModule);

var _CursorModule = require('./CursorModule');

var _CursorModule2 = _interopRequireDefault(_CursorModule);

var _GridAxisModule = require('./GridAxisModule');

var _GridAxisModule2 = _interopRequireDefault(_GridAxisModule);

var _MarkerModule = require('./MarkerModule');

var _MarkerModule2 = _interopRequireDefault(_MarkerModule);

var _SegmentModule = require('./SegmentModule');

var _SegmentModule2 = _interopRequireDefault(_SegmentModule);

var _SimpleWaveformModule = require('./SimpleWaveformModule');

var _SimpleWaveformModule2 = _interopRequireDefault(_SimpleWaveformModule);

var _TimeAxisModule = require('./TimeAxisModule');

var _TimeAxisModule2 = _interopRequireDefault(_TimeAxisModule);

var _WaveformModule = require('./WaveformModule');

var _WaveformModule2 = _interopRequireDefault(_WaveformModule);

var _ZoomModule = require('./ZoomModule');

var _ZoomModule2 = _interopRequireDefault(_ZoomModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  AbstractAnnotationModule: _AbstractAnnotationModule2.default,
  BpfModule: _BpfModule2.default,
  CursorModule: _CursorModule2.default,
  GridAxisModule: _GridAxisModule2.default,
  MarkerModule: _MarkerModule2.default,
  SegmentModule: _SegmentModule2.default,
  SimpleWaveformModule: _SimpleWaveformModule2.default,
  TimeAxisModule: _TimeAxisModule2.default,
  WaveformModule: _WaveformModule2.default,
  ZoomModule: _ZoomModule2.default
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSIsIkJwZk1vZHVsZSIsIkN1cnNvck1vZHVsZSIsIkdyaWRBeGlzTW9kdWxlIiwiTWFya2VyTW9kdWxlIiwiU2VnbWVudE1vZHVsZSIsIlNpbXBsZVdhdmVmb3JtTW9kdWxlIiwiVGltZUF4aXNNb2R1bGUiLCJXYXZlZm9ybU1vZHVsZSIsIlpvb21Nb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7a0JBRWU7QUFDYkEsOERBRGE7QUFFYkMsZ0NBRmE7QUFHYkMsc0NBSGE7QUFJYkMsMENBSmE7QUFLYkMsc0NBTGE7QUFNYkMsd0NBTmE7QUFPYkMsc0RBUGE7QUFRYkMsMENBUmE7QUFTYkMsMENBVGE7QUFVYkM7QUFWYSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSBmcm9tICcuL0Fic3RyYWN0QW5ub3RhdGlvbk1vZHVsZSc7XG5pbXBvcnQgQnBmTW9kdWxlIGZyb20gJy4vQnBmTW9kdWxlJztcbmltcG9ydCBDdXJzb3JNb2R1bGUgZnJvbSAnLi9DdXJzb3JNb2R1bGUnO1xuaW1wb3J0IEdyaWRBeGlzTW9kdWxlIGZyb20gJy4vR3JpZEF4aXNNb2R1bGUnO1xuaW1wb3J0IE1hcmtlck1vZHVsZSBmcm9tICcuL01hcmtlck1vZHVsZSc7XG5pbXBvcnQgU2VnbWVudE1vZHVsZSBmcm9tICcuL1NlZ21lbnRNb2R1bGUnO1xuaW1wb3J0IFNpbXBsZVdhdmVmb3JtTW9kdWxlIGZyb20gJy4vU2ltcGxlV2F2ZWZvcm1Nb2R1bGUnO1xuaW1wb3J0IFRpbWVBeGlzTW9kdWxlIGZyb20gJy4vVGltZUF4aXNNb2R1bGUnO1xuaW1wb3J0IFdhdmVmb3JtTW9kdWxlIGZyb20gJy4vV2F2ZWZvcm1Nb2R1bGUnO1xuaW1wb3J0IFpvb21Nb2R1bGUgZnJvbSAnLi9ab29tTW9kdWxlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBBYnN0cmFjdEFubm90YXRpb25Nb2R1bGUsXG4gIEJwZk1vZHVsZSxcbiAgQ3Vyc29yTW9kdWxlLFxuICBHcmlkQXhpc01vZHVsZSxcbiAgTWFya2VyTW9kdWxlLFxuICBTZWdtZW50TW9kdWxlLFxuICBTaW1wbGVXYXZlZm9ybU1vZHVsZSxcbiAgVGltZUF4aXNNb2R1bGUsXG4gIFdhdmVmb3JtTW9kdWxlLFxuICBab29tTW9kdWxlLFxufTtcbiJdfQ==