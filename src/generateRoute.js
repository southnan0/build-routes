/**
 * 根据src/routes文件目录生成路由配置表
 * 如果
 */
const glob = require('glob');
const path = require('path');

import {isEgnoreFile, isFile, getRouterConfig} from './fileFilters';
import {arrToTree} from './utils';

// TODO: 增加use插槽
// 目前只支持以后后缀名的
const buildTemplate = (basicPath,obj, parentPath = '', preRelativePath, postfix) => {
    return Object.keys(obj)
        .filter(key => !isEgnoreFile(key))
        .filter((key) => {
            return !(isFile(path.resolve(basicPath, `${preRelativePath}${parentPath}/${key.replace(postfix, '')}`), postfix) && key.replace(postfix, '') === 'index');
        })
        .map((key) => {
            const pathname = key.replace(postfix, '');
            const fullPath = `${parentPath}/${pathname}`;

            const isLast = Object.keys(obj[key]).length === 0;
            const relativePath = `${preRelativePath}${fullPath}`;
            const isAFile = isLast && isFile(path.resolve(basicPath, relativePath), postfix);

            const config = getRouterConfig({
                pathname,
                fullPath,
                isAFile,
                basePath: path.resolve(basicPath, preRelativePath),
                postfix,
            });
            config.children = isLast ? [] : buildTemplate(basicPath,obj[key], fullPath, preRelativePath, postfix);

            return config;
        });
};

const generateRoute = (basicPath,prePath, postfix) => {
    const absolutePath = path.resolve(basicPath, prePath)
    const g = glob.sync(`${absolutePath}/**/*${postfix}`);
    // glob 会把路径转为正斜杠，而window path.resolve出来为反斜杠
    const arr = g.filter(item => !isEgnoreFile(item)).map((p) => {
        p = path.resolve(p)
        const withoutPrePath = p.replace(absolutePath, '');
        const arrPath = p.match(/\/|\\/g) ? withoutPrePath.split(/\/|\\/g) : [withoutPrePath];

        return arrPath.filter(item => item)
    });

    const objPath = arrToTree(arr);
    return buildTemplate(basicPath,objPath, '', prePath, postfix);
};

module.exports = generateRoute;
