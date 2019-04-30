'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = memoize;

var _immutable = require('immutable');

// memoization higher-order function using Immutable.js.
// used to memoize accumulated options when rendering plugin wrapper components.

function memoize(func) {
  var _cache = (0, _immutable.Map)();

  return function () {
    var argList = _immutable.List.of.apply(_immutable.List, arguments);
    if (!_cache.has(argList)) {
      _cache = _cache.set(argList, func.apply(undefined, arguments));
    }
    return _cache.get(argList);
  };
};