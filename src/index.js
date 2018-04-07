/**
 * 每个文件夹对应如果有index.js 意味着有对应的component
 * 如果文件名不为index，默认为它的子模块，如果存在相同名的文件夹，那么查找改文件夹是否有对应的index文件，有的话，以后者为主
 * models
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const prePath = 'src/routes/';
const postfix = '.js';

const templatePath = path.resolve(__dirname, './route.js');
const itemTemplatePath = path.resolve(__dirname, './routeItem.js');

const generateRoute = require('./generateRoute');

const generateTemplate = (arr, template) => {
    if (Array.isArray(arr)) {
        return arr.map(item => _.template(template)({...item, template, getChildren: generateTemplate}));
    } else if (arr && typeof arr === 'object' && !(arr instanceof Function)) {
        return _.template(template)({...arr, template, getChildren: generateTemplate});
    } else {
        console.info('格式不符合');
    }
};

// 如果有layout，那么返回，如果没有，继续往下寻找
const sortLayout = (arr, layout) => {
    return arr.filter((item) => {
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
const buildRoute = (outputPath,preRelativePath) => {
    const strTemplate = fs.readFileSync(templatePath).toString();
    const strItemTemplate = fs.readFileSync(itemTemplatePath).toString();

    const objRoute = generateRoute(prePath, postfix,preRelativePath);
    const obj = {
        userLayout: sortLayout(_.cloneDeep(objRoute), 'UserLayout'),
        basicLayout: sortLayout(_.cloneDeep(objRoute), 'BasicLayout'),
    };
    // console.info(JSON.stringify(obj.basicLayout))
    const routes = {
        userLayout: generateTemplate(obj.userLayout, strItemTemplate),
        basicLayout: generateTemplate(obj.basicLayout, strItemTemplate),
    };

    const d = _.template(strTemplate);

    fs.writeFileSync(outputPath, d({routes}));
};
//TODO： 父级路由权限应该是子路由的集合
