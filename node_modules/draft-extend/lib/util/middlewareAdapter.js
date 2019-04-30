'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _immutable = require('immutable');

// function to handle previous techniques to convert to HTML, including
// plain objects with `{start, end}` values and non-HOF functions that return
// either a String or ReactElement

var middlewareAdapter = function middlewareAdapter(middleware) {
  if (middleware && middleware.__isMiddleware) {
    return middleware;
  }
  return function (next) {
    return function () {
      if ((typeof middleware === 'undefined' ? 'undefined' : _typeof(middleware)) === 'object') {
        // handle old blockToHTML objects
        var block = arguments.length <= 0 ? undefined : arguments[0];

        var objectResult = void 0;

        if (typeof block === 'string') {
          // handle case of inline style value
          var style = block;
          if (process.env.NODE_ENV === 'development') {
            console.warn('styleToHTML: Use of plain objects to define HTML output is being deprecated. Please switch to using functions that return a {start, end} object or ReactElement.');
          }

          objectResult = middleware[style];
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('blockToHTML: Use of plain objects to define HTML output is being deprecated. Please switch to using functions that return a {start, end} object or ReactElement.');
          }

          objectResult = middleware[block.type];
        }

        // check for inline style value instead of a raw block
        if (objectResult !== null && objectResult !== undefined) {
          return objectResult;
        }
        return next.apply(undefined, arguments);
      }

      var returnValue = void 0;
      try {
        // try immediately giving the function the content data in case it's a simple
        // function that doesn't expect a `next` function
        var nonMiddlewareResult = middleware.apply(undefined, arguments);
        if (nonMiddlewareResult === null || nonMiddlewareResult === undefined) {
          // the behavior for non-middleware functions is to delegate by returning
          // `null` or `undefined`, so do delegation for them
          returnValue = next.apply(undefined, arguments);
        } else if (arguments.length === 2 && typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'string' && (arguments.length <= 1 ? undefined : arguments[1]) === nonMiddlewareResult) {
          // entityToHTML option returned `originalText`, i.e. no change was made
          returnValue = next.apply(undefined, arguments);
        } else if (Array.isArray(nonMiddlewareResult)) {
          // returned an array from a textToEntity function, concat with next
          returnValue = nonMiddlewareResult.concat(next.apply(undefined, arguments));
        } else if (_immutable.OrderedSet.isOrderedSet(nonMiddlewareResult)) {
          var _ref;

          // returned an OrderedSet from htmlToStyle, pass to next as third argument
          var previousStyles = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
          returnValue = previousStyles.union(nonMiddlewareResult).union(next.apply(undefined, arguments));
        } else if (typeof nonMiddlewareResult === 'function') {
          // most middleware HOFs will return another function when invoked, so we
          // can assume that it is one here
          returnValue = middleware(next).apply(undefined, arguments);
        } else {
          // the function was a simple non-middleware function and
          // returned a reasonable value, so return its result
          returnValue = nonMiddlewareResult;
        }
      } catch (e) {
        // it's possible that trying to use a middleware function like a simple non-
        // middleware function will throw, so try it as a middleware HOF
        returnValue = middleware(next).apply(undefined, arguments);
      } finally {
        return returnValue;
      }
    };
  };
};

exports.default = middlewareAdapter;