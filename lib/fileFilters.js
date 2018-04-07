'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 这里是有的路径只能由外部传入绝对路径
 */

var fs = require('fs');

var hasIndex = exports.hasIndex = function hasIndex(basePath, postfix) {
  var arr = fs.readdirSync('' + basePath);
  return arr.find(function (fileItem) {
    return fileItem === 'index' + postfix && fs.statSync(basePath + '/index' + postfix).isFile();
  });
};

/**
 * 是否存在_开头的
 * @param basePath
 * @param postfix
 * @param paramsFlag
 * @returns {string | undefined}
 */
var hasParams = exports.hasParams = function hasParams(basePath, postfix) {
  var paramsFlag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_';

  var arr = fs.readdirSync('' + basePath);

  return arr.find(function (fileItem) {
    return fileItem.substring(fileItem.length - postfix.length) === postfix && isParams(fileItem, paramsFlag);
  });
};

var isParams = exports.isParams = function isParams(filename) {
  var paramsFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_';

  return filename.substring(0, 1) === paramsFlag;
};

/**
 * 是否是以-开头需要被忽略的文件/文件夹
 * @param fileName
 * @param egnoreFlag
 * @returns {boolean}
 */
var isEgnoreFile = exports.isEgnoreFile = function isEgnoreFile(fileName) {
  var egnoreFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';

  return fileName.substring(0, 1) === egnoreFlag;
};

/**
 * 是否存在多行的注释
 * @param fullPath
 * @returns {RegExpMatchArray | null}
 */
var hasComment = exports.hasComment = function hasComment(fullPath) {
  var file = fs.readFileSync(fullPath);
  var str = file.toString();
  console.info(str.match(/\/\*\*(\n|.)*?\*\//g));
  return str.match(/\/\*\*(\r|\n|.)*?\*\//g);
};

/**
 * 检查是否为路由配置类型的注释 eg:    <name:新增>
 * @param comment
 * @returns {{}}
 */
var isConfigComment = exports.isConfigComment = function isConfigComment() {
  var comment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var arrConfig = comment.match(/<(.*)>/g);
  if (arrConfig) {
    var config = {};
    arrConfig.forEach(function (c) {
      var arrCommentItem = c.replace(/<(.*)>/g, '$1').split(':');
      var value = (arrCommentItem[1] || '').trim();
      if (value.match(',')) {
        value = value.split(',');
      }
      config[arrCommentItem[0].trim()] = value;
    });
    return config;
  }
};

/**
 * 检查某个
 * @param f
 * @returns {any}
 */
var hasConfigFile = exports.hasConfigFile = function hasConfigFile(f) {
  try {
    var str = fs.readFileSync(f).toString();
    return JSON.parse(str);
  } catch (e) {
    // console.info(e);
  }
};

/**
 * 是否为文件
 * @param fullPath
 * @param postfix
 * @returns {boolean}
 */
var isFile = exports.isFile = function isFile(fullPath) {
  var postfix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  try {
    return fs.statSync('' + fullPath + postfix).isFile();
  } catch (e) {
    return false;
  }
};

/**
 *
 * @param fullPath
 * @param postfix 如果不是最后一个，不是必填，避免出现文件夹后面有.js
 * @returns {boolean}
 */
var isDir = exports.isDir = function isDir(fullPath) {
  var postfix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return fs.statSync('' + fullPath + postfix).isDirectory();
};

/**
 * 路由默认配置参数
 * @returns {{name: string, path: string, fullPath: string, children: Array, models: Array, permission: string, hideChildren: boolean, exact: boolean}}
 */
var getDefaultConfig = exports.getDefaultConfig = function getDefaultConfig() {
  return {
    name: '',
    path: '',
    fullPath: '',
    children: [],
    models: [],
    permission: '',
    hideChildren: false,
    exact: true,
    icon: '',
    layout: ''
  };
};

/**
 * 获取路由配置
 * @param pathname
 * @param fullPath
 * @param isAFile
 * @param relativePath
 * @param postfix
 * @returns {{name, path, fullPath, children, models, permission, hideChildren, exact}}
 */
var getRouterConfig = exports.getRouterConfig = function getRouterConfig(_ref) {
  var pathname = _ref.pathname,
      fullPath = _ref.fullPath,
      basePath = _ref.basePath,
      isAFile = _ref.isAFile,
      postfix = _ref.postfix;

  var absPath = getComponentPath({
    basePath: basePath,
    fullPath: fullPath,
    postfix: postfix,
    isAFile: isAFile
  });

  var fileName = isParams('' + pathname);

  var config = _extends({}, getDefaultConfig(), {
    path: fileName ? '' + pathname.replace('_', ':') : lowerFirstWord(pathname),
    fullPath: absPath
  });

  var dirConfig = isAFile ? null : hasConfigFile('' + basePath + fullPath + '/config.json');

  if (dirConfig) {
    config = _extends({}, config, dirConfig);
  } else {
    var curPath = '';
    if (isAFile) {
      curPath = '' + basePath + fullPath + postfix;
    } else if (absPath) {
      curPath = '' + basePath + absPath;
    }
    if (curPath) {
      var comment = hasComment(curPath);
      if (comment) {
        config = _extends({}, config, isConfigComment(comment[0]) || {});
      }
    }
  }
  return config;
};

/**
 * router component path
 * @param fullPath
 * @param postfix
 * @param isAFile
 * @param basePath
 * @returns {*}
 */
var getComponentPath = exports.getComponentPath = function getComponentPath(_ref2) {
  var fullPath = _ref2.fullPath,
      postfix = _ref2.postfix,
      isAFile = _ref2.isAFile,
      basePath = _ref2.basePath;

  if (isAFile) {
    return '' + fullPath + postfix;
  } else {
    var fileName = hasIndex('' + basePath + fullPath, postfix);
    return fileName ? fullPath + '/' + fileName : fileName;
  }
};

var lowerFirstWord = exports.lowerFirstWord = function lowerFirstWord(word) {
  return word ? word.substring(0, 1).toLocaleLowerCase() + word.substring(1) : word;
};

// TODO: 文件夹查找是否存在同名文件，有的话，默认为入口文件