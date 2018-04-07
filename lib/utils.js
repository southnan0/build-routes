'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrToTree = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arrToTree = exports.arrToTree = function arrToTree(arr) {
  var obj = {};

  arr.map(function (p) {
    _lodash2.default.reduce(p, function (preObj, key) {
      if (!preObj[key]) {
        preObj[key] = {};
      }
      return preObj[key];
    }, obj);
  });

  return obj;
};