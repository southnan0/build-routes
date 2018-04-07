'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 每个文件夹对应如果有index.js 意味着有对应的component
 * 如果文件名不为index，默认为它的子模块，如果存在相同名的文件夹，那么查找改文件夹是否有对应的index文件，有的话，以后者为主
 * models
 */
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var templatePath = path.resolve(__dirname, '../templates/route.js');
var itemTemplatePath = path.resolve(__dirname, '../templates/routeItem.js');

var generateRoute = require('./generateRoute');

var generateTemplate = function generateTemplate(arr, template) {
    if (Array.isArray(arr)) {
        return arr.map(function (item) {
            return _.template(template)(_extends({}, item, { template: template, getChildren: generateTemplate }));
        });
    } else if (arr && (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) === 'object' && !(arr instanceof Function)) {
        return _.template(template)(_extends({}, arr, { template: template, getChildren: generateTemplate }));
    } else {
        console.info('格式不符合');
    }
};

// 如果有layout，那么返回，如果没有，继续往下寻找
var sortLayout = function sortLayout(arr, layout) {
    return arr.filter(function (item) {
        if (!item.children.length && !item.layout) {
            item.layout = 'BasicLayout';
        }

        if (item.layout === layout) {
            return true;
        } else if (item.children.length) {
            item.children = sortLayout(item.children, layout);
            return item.children.length > 0;
        }
        return false;
    });
};

/**
 * 绝对地址
 * @param outputPath
 */
var buildRoute = function buildRoute(outputPath, basicPath, prePath, postfix) {
    var strTemplate = fs.readFileSync(templatePath).toString();
    var strItemTemplate = fs.readFileSync(itemTemplatePath).toString();

    var objRoute = generateRoute(basicPath, prePath, postfix);
    var obj = {
        userLayout: sortLayout(_.cloneDeep(objRoute), 'UserLayout'),
        basicLayout: sortLayout(_.cloneDeep(objRoute), 'BasicLayout')
    };
    // console.info(JSON.stringify(obj.basicLayout))
    var routes = {
        userLayout: generateTemplate(obj.userLayout, strItemTemplate),
        basicLayout: generateTemplate(obj.basicLayout, strItemTemplate)
    };

    var d = _.template(strTemplate);

    fs.writeFileSync(outputPath, d({ routes: routes }));
};

//TODO： 父级路由权限应该是子路由的集合
module.exports = buildRoute;