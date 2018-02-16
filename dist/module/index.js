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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpc3RvcnkuanMiXSwibmFtZXMiOlsiQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlIiwiQnBmTW9kdWxlIiwiQ3Vyc29yTW9kdWxlIiwiR3JpZEF4aXNNb2R1bGUiLCJNYXJrZXJNb2R1bGUiLCJTZWdtZW50TW9kdWxlIiwiU2ltcGxlV2F2ZWZvcm1Nb2R1bGUiLCJUaW1lQXhpc01vZHVsZSIsIldhdmVmb3JtTW9kdWxlIiwiWm9vbU1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZTtBQUNiQSw4REFEYTtBQUViQyxnQ0FGYTtBQUdiQyxzQ0FIYTtBQUliQywwQ0FKYTtBQUtiQyxzQ0FMYTtBQU1iQyx3Q0FOYTtBQU9iQyxzREFQYTtBQVFiQywwQ0FSYTtBQVNiQywwQ0FUYTtBQVViQztBQVZhLEMiLCJmaWxlIjoiSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdEFubm90YXRpb25Nb2R1bGUgZnJvbSAnLi9BYnN0cmFjdEFubm90YXRpb25Nb2R1bGUnO1xuaW1wb3J0IEJwZk1vZHVsZSBmcm9tICcuL0JwZk1vZHVsZSc7XG5pbXBvcnQgQ3Vyc29yTW9kdWxlIGZyb20gJy4vQ3Vyc29yTW9kdWxlJztcbmltcG9ydCBHcmlkQXhpc01vZHVsZSBmcm9tICcuL0dyaWRBeGlzTW9kdWxlJztcbmltcG9ydCBNYXJrZXJNb2R1bGUgZnJvbSAnLi9NYXJrZXJNb2R1bGUnO1xuaW1wb3J0IFNlZ21lbnRNb2R1bGUgZnJvbSAnLi9TZWdtZW50TW9kdWxlJztcbmltcG9ydCBTaW1wbGVXYXZlZm9ybU1vZHVsZSBmcm9tICcuL1NpbXBsZVdhdmVmb3JtTW9kdWxlJztcbmltcG9ydCBUaW1lQXhpc01vZHVsZSBmcm9tICcuL1RpbWVBeGlzTW9kdWxlJztcbmltcG9ydCBXYXZlZm9ybU1vZHVsZSBmcm9tICcuL1dhdmVmb3JtTW9kdWxlJztcbmltcG9ydCBab29tTW9kdWxlIGZyb20gJy4vWm9vbU1vZHVsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgQWJzdHJhY3RBbm5vdGF0aW9uTW9kdWxlLFxuICBCcGZNb2R1bGUsXG4gIEN1cnNvck1vZHVsZSxcbiAgR3JpZEF4aXNNb2R1bGUsXG4gIE1hcmtlck1vZHVsZSxcbiAgU2VnbWVudE1vZHVsZSxcbiAgU2ltcGxlV2F2ZWZvcm1Nb2R1bGUsXG4gIFRpbWVBeGlzTW9kdWxlLFxuICBXYXZlZm9ybU1vZHVsZSxcbiAgWm9vbU1vZHVsZSxcbn07XG4iXX0=