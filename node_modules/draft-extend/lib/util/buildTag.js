'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buildTag = exports.buildTag = function buildTag(tagName, contents) {
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var attrStr = '';
  if (Object.keys(attrs).length) {
    attrStr = Object.keys(attrs).filter(function (k) {
      return attrs[k];
    }).map(function (k) {
      return k + '="' + attrs[k] + '"';
    }).join(' ');
    if (attrStr.length) {
      attrStr = ' ' + attrStr;
    }
  }

  return '<' + tagName + attrStr + '>' + contents + '</' + tagName + '>';
};