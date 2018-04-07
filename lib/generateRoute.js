'use strict';

var _fileFilters = require('./fileFilters');

var _utils = require('./utils');

/**
 * 根据src/routes文件目录生成路由配置表
 * 如果
 */
var glob = require('glob');
var path = require('path');

// TODO: 增加use插槽
// 目前只支持以后后缀名的
var buildTemplate = function buildTemplate(basicPath, obj) {
    var parentPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var preRelativePath = arguments[3];
    var postfix = arguments[4];

    return Object.keys(obj).filter(function (key) {
        return !(0, _fileFilters.isEgnoreFile)(key);
    }).filter(function (key) {
        return !((0, _fileFilters.isFile)(path.resolve(basicPath, '' + preRelativePath + parentPath + '/' + key.replace(postfix, '')), postfix) && key.replace(postfix, '') === 'index');
    }).map(function (key) {
        var pathname = key.replace(postfix, '');
        var fullPath = parentPath + '/' + pathname;

        var isLast = Object.keys(obj[key]).length === 0;
        var relativePath = '' + preRelativePath + fullPath;
        var isAFile = isLast && (0, _fileFilters.isFile)(path.resolve(basicPath, relativePath), postfix);

        var config = (0, _fileFilters.getRouterConfig)({
            pathname: pathname,
            fullPath: fullPath,
            isAFile: isAFile,
            basePath: path.resolve(basicPath, preRelativePath),
            postfix: postfix
        });
        config.children = isLast ? [] : buildTemplate(basicPath, obj[key], fullPath, preRelativePath, postfix);

        return config;
    });
};

var generateRoute = function generateRoute(basicPath, prePath, postfix) {
    var absolutePath = path.resolve(basicPath, prePath);
    var g = glob.sync(absolutePath + '/**/*' + postfix);
    // glob 会把路径转为正斜杠，而window path.resolve出来为反斜杠
    var arr = g.filter(function (item) {
        return !(0, _fileFilters.isEgnoreFile)(item);
    }).map(function (p) {
        p = path.resolve(p);
        var withoutPrePath = p.replace(absolutePath, '');
        var arrPath = p.match(/\/|\\/g) ? withoutPrePath.split(/\/|\\/g) : [withoutPrePath];

        return arrPath.filter(function (item) {
            return item;
        });
    });

    var objPath = (0, _utils.arrToTree)(arr);
    return buildTemplate(basicPath, objPath, '', prePath, postfix);
};

module.exports = generateRoute;