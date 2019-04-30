"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// utility function to accumulate the common plugin option function pattern of
// handling args by returning a non-null result or delegate to other plugins
exports.default = function (newFn, acc) {
  return function () {
    var result = newFn.apply(undefined, arguments);
    if (result === null || result === undefined) {
      return acc.apply(undefined, arguments);
    }
    return result;
  };
};