/**
 * 这里是有的路径只能由外部传入绝对路径
 */

const fs = require('fs');

export const hasIndex = (basePath, postfix) => {
  const arr = fs.readdirSync(`${basePath}`);
  return arr.find(fileItem => (fileItem === `index${postfix}` && fs.statSync(`${basePath}/index${postfix}`).isFile()));
};

/**
 * 是否存在_开头的
 * @param basePath
 * @param postfix
 * @param paramsFlag
 * @returns {string | undefined}
 */
export const hasParams = (basePath, postfix, paramsFlag = '_') => {
  const arr = fs.readdirSync(`${basePath}`);

  return arr.find(fileItem => fileItem.substring(fileItem.length - postfix.length) === postfix && isParams(fileItem, paramsFlag));
};

export const isParams = (filename, paramsFlag = '_') => {
  return filename.substring(0, 1) === paramsFlag;
};

/**
 * 是否是以-开头需要被忽略的文件/文件夹
 * @param fileName
 * @param egnoreFlag
 * @returns {boolean}
 */
export const isEgnoreFile = (fileName, egnoreFlag = '-') => {
  return fileName.substring(0, 1) === egnoreFlag;
};

/**
 * 是否存在多行的注释
 * @param fullPath
 * @returns {RegExpMatchArray | null}
 */
export const hasComment = (fullPath) => {
  const file = fs.readFileSync(fullPath);
  const str = file.toString();
  console.info(str.match(/\/\*\*(\n|.)*?\*\//g))
  return str.match(/\/\*\*(\r|\n|.)*?\*\//g);
};

/**
 * 检查是否为路由配置类型的注释 eg:    <name:新增>
 * @param comment
 * @returns {{}}
 */
export const isConfigComment = (comment = '') => {
  const arrConfig = comment.match(/<(.*)>/g);
  if (arrConfig) {
    const config = {};
    arrConfig.forEach((c) => {
      const arrCommentItem = c.replace(/<(.*)>/g, '$1').split(':');
      let value = (arrCommentItem[1] || '').trim();
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
export const hasConfigFile = (f) => {
  try {
    const str = fs.readFileSync(f).toString();
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
export const isFile = (fullPath, postfix = '') => {
  try {
    return fs.statSync(`${fullPath}${postfix}`).isFile();
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
export const isDir = (fullPath, postfix = '') => {
  return fs.statSync(`${fullPath}${postfix}`).isDirectory();
};

/**
 * 路由默认配置参数
 * @returns {{name: string, path: string, fullPath: string, children: Array, models: Array, permission: string, hideChildren: boolean, exact: boolean}}
 */
export const getDefaultConfig = () => {
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
    layout: '',
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
export const getRouterConfig = ({ pathname, fullPath, basePath, isAFile, postfix }) => {
  const absPath = getComponentPath({
    basePath,
    fullPath,
    postfix,
    isAFile,
  });

  const fileName = isParams(`${pathname}`);

  let config = {
    ...getDefaultConfig(),
    path: fileName ? `${pathname.replace('_', ':')}` : lowerFirstWord(pathname),
    fullPath: absPath,
  };

  const dirConfig = isAFile ? null : hasConfigFile(`${basePath}${fullPath}/config.json`);

  if (dirConfig) {
    config = { ...config, ...dirConfig };
  } else {
    let curPath = '';
    if (isAFile) {
      curPath = `${basePath}${fullPath}${postfix}`;
    } else if (absPath) {
      curPath = `${basePath}${absPath}`;
    }
    if (curPath) {
      const comment = hasComment(curPath);
      if (comment) {
        config = { ...config, ...(isConfigComment(comment[0]) || {}) };
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
export const getComponentPath = ({ fullPath, postfix, isAFile, basePath }) => {
  if (isAFile) {
    return `${fullPath}${postfix}`;
  } else {
    const fileName = hasIndex(`${basePath}${fullPath}`, postfix);
    return fileName ? `${fullPath}/${fileName}` : fileName;
  }
};

export const lowerFirstWord = (word) => {
  return word ? word.substring(0, 1).toLocaleLowerCase() + word.substring(1) : word;
};

// TODO: 文件夹查找是否存在同名文件，有的话，默认为入口文件
