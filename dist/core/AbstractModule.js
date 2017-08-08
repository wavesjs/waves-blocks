'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _parameters = require('@ircam/parameters');

var _parameters2 = _interopRequireDefault(_parameters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Abstract class to derive in order to implement a module that decorates the
 * `BasePlayer`.
 * A module must implement the `install` and `uninstall` methods.
 * Other methods may or may not be implemented accroding to the functionnality
 * offered by the module.
 *
 * @param {Object} definitions - Object defining the parameters of the module.
 *  The definitions should follow the convetions defined in
 *  [https://github.com/ircam-jstools/parameters](https://github.com/ircam-jstools/parameters)
 * @param {Object} options - Oveeride parameters default values.
 */
var AbstractModule = function () {
  function AbstractModule(definitions, options) {
    (0, _classCallCheck3.default)(this, AbstractModule);

    this.params = (0, _parameters2.default)(definitions, options);
  }

  /**
   * Logic to implement when the module is added to the player.
   *
   * @abstract
   * @param {BasePlayer} player - instance of the host player
   */


  (0, _createClass3.default)(AbstractModule, [{
    key: 'install',
    value: function install(player) {}

    /**
     * Logic to implement when the module is added to the player.
     *
     * @abstract
     * @param {BasePlayer} player - instance of the host player
     */

  }, {
    key: 'uninstall',
    value: function uninstall(player) {}

    /**
     * Abstract methods that can optionnaly be implemented.
     * These commands are executed by the player on each installed module if
     * implemented at the module level.
     */

    /**
     * @abstract
     */
    // setTrack(trackConfig)


    // setWidth(value)
    // setHeight(value)

    /**
     * force rendering
     */
    // render()

    /**
     * event emitted by the main timeline
     */
    // onEvent(e)

    /**
     * audio player commands
     */
    // start
    // stop
    // pause
    // seek(position, isPlaying)

  }]);
  return AbstractModule;
}();

exports.default = AbstractModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0TW9kdWxlIiwiZGVmaW5pdGlvbnMiLCJvcHRpb25zIiwicGFyYW1zIiwicGxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0lBWU1BLGM7QUFDSiwwQkFBWUMsV0FBWixFQUF5QkMsT0FBekIsRUFBa0M7QUFBQTs7QUFDaEMsU0FBS0MsTUFBTCxHQUFjLDBCQUFXRixXQUFYLEVBQXdCQyxPQUF4QixDQUFkO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7NEJBTVFFLE0sRUFBUSxDQUFFOztBQUVsQjs7Ozs7Ozs7OzhCQU1VQSxNLEVBQVEsQ0FBRTs7QUFFcEI7Ozs7OztBQU1BOzs7QUFHQTs7O0FBR0E7QUFDQTs7QUFFQTs7O0FBR0E7O0FBRUE7OztBQUdBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O2tCQUdhSixjIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAnQGlyY2FtL3BhcmFtZXRlcnMnO1xuXG4vKipcbiAqIEFic3RyYWN0IGNsYXNzIHRvIGRlcml2ZSBpbiBvcmRlciB0byBpbXBsZW1lbnQgYSBtb2R1bGUgdGhhdCBkZWNvcmF0ZXMgdGhlXG4gKiBgQmFzZVBsYXllcmAuXG4gKiBBIG1vZHVsZSBtdXN0IGltcGxlbWVudCB0aGUgYGluc3RhbGxgIGFuZCBgdW5pbnN0YWxsYCBtZXRob2RzLlxuICogT3RoZXIgbWV0aG9kcyBtYXkgb3IgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBhY2Nyb2RpbmcgdG8gdGhlIGZ1bmN0aW9ubmFsaXR5XG4gKiBvZmZlcmVkIGJ5IHRoZSBtb2R1bGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb25zIC0gT2JqZWN0IGRlZmluaW5nIHRoZSBwYXJhbWV0ZXJzIG9mIHRoZSBtb2R1bGUuXG4gKiAgVGhlIGRlZmluaXRpb25zIHNob3VsZCBmb2xsb3cgdGhlIGNvbnZldGlvbnMgZGVmaW5lZCBpblxuICogIFtodHRwczovL2dpdGh1Yi5jb20vaXJjYW0tanN0b29scy9wYXJhbWV0ZXJzXShodHRwczovL2dpdGh1Yi5jb20vaXJjYW0tanN0b29scy9wYXJhbWV0ZXJzKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVlcmlkZSBwYXJhbWV0ZXJzIGRlZmF1bHQgdmFsdWVzLlxuICovXG5jbGFzcyBBYnN0cmFjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKGRlZmluaXRpb25zLCBvcHRpb25zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dpYyB0byBpbXBsZW1lbnQgd2hlbiB0aGUgbW9kdWxlIGlzIGFkZGVkIHRvIHRoZSBwbGF5ZXIuXG4gICAqXG4gICAqIEBhYnN0cmFjdFxuICAgKiBAcGFyYW0ge0Jhc2VQbGF5ZXJ9IHBsYXllciAtIGluc3RhbmNlIG9mIHRoZSBob3N0IHBsYXllclxuICAgKi9cbiAgaW5zdGFsbChwbGF5ZXIpIHt9XG5cbiAgLyoqXG4gICAqIExvZ2ljIHRvIGltcGxlbWVudCB3aGVuIHRoZSBtb2R1bGUgaXMgYWRkZWQgdG8gdGhlIHBsYXllci5cbiAgICpcbiAgICogQGFic3RyYWN0XG4gICAqIEBwYXJhbSB7QmFzZVBsYXllcn0gcGxheWVyIC0gaW5zdGFuY2Ugb2YgdGhlIGhvc3QgcGxheWVyXG4gICAqL1xuICB1bmluc3RhbGwocGxheWVyKSB7fVxuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBtZXRob2RzIHRoYXQgY2FuIG9wdGlvbm5hbHkgYmUgaW1wbGVtZW50ZWQuXG4gICAqIFRoZXNlIGNvbW1hbmRzIGFyZSBleGVjdXRlZCBieSB0aGUgcGxheWVyIG9uIGVhY2ggaW5zdGFsbGVkIG1vZHVsZSBpZlxuICAgKiBpbXBsZW1lbnRlZCBhdCB0aGUgbW9kdWxlIGxldmVsLlxuICAgKi9cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICAvLyBzZXRUcmFjayh0cmFja0NvbmZpZylcblxuXG4gIC8vIHNldFdpZHRoKHZhbHVlKVxuICAvLyBzZXRIZWlnaHQodmFsdWUpXG5cbiAgLyoqXG4gICAqIGZvcmNlIHJlbmRlcmluZ1xuICAgKi9cbiAgLy8gcmVuZGVyKClcblxuICAvKipcbiAgICogZXZlbnQgZW1pdHRlZCBieSB0aGUgbWFpbiB0aW1lbGluZVxuICAgKi9cbiAgLy8gb25FdmVudChlKVxuXG4gIC8qKlxuICAgKiBhdWRpbyBwbGF5ZXIgY29tbWFuZHNcbiAgICovXG4gIC8vIHN0YXJ0XG4gIC8vIHN0b3BcbiAgLy8gcGF1c2VcbiAgLy8gc2Vlayhwb3NpdGlvbiwgaXNQbGF5aW5nKVxufVxuXG5leHBvcnQgZGVmYXVsdCBBYnN0cmFjdE1vZHVsZTtcbiJdfQ==