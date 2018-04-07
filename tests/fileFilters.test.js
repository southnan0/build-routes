const path = require('path');

import * as fileFilters from '../src/fileFilters';

const basePath = path.resolve(__dirname, '../tests');
const postfix = '.js';

test('hasIndex can find index.js file', () => {
  expect(fileFilters.hasIndex(`${basePath}/routes/System/Role`, postfix)).toBe(`index${postfix}`);
});

test('hasParams', () => {
  expect(fileFilters.hasParams(basePath, postfix)).toBeUndefined();
});

test('isEgnoreFile', () => {
  expect(fileFilters.isEgnoreFile('--Menu')).toBe(true);
});

test('isEgnoreFile fase', () => {
  expect(fileFilters.isEgnoreFile('Menu')).toBe(false);
});

const addComment = fileFilters.hasComment(`${basePath}/routes/System/Role/Add.js`);
const listComment = fileFilters.hasComment(`${basePath}/routes/System/Role/index.js`);

test('hasComment', () => {
  console.info(addComment)
  expect(addComment).not.toBeNull();
});

test('hasComment null', () => {
  expect(listComment).toBeNull();
});

test('isConfigComment', () => {
  expect(fileFilters.isConfigComment(addComment[0]).name).toEqual('新增');
});

test('isConfigComment without params', () => {
  expect(fileFilters.isConfigComment()).toBeUndefined();
});

test('isConfigComment comment split with , to be a array', () => {
  expect(fileFilters.isConfigComment(addComment[0]).models).toEqual(['role', 'user']);
});

test('hasConfigFile is true', () => {
  expect(fileFilters.hasConfigFile(`${basePath}/routes/System/Role/config.json`)).toBeTruthy();
});

test('hasConfigFile is false', () => {
  expect(fileFilters.hasConfigFile(path.resolve(__dirname, '../../src/routes/User1/config.json'))).not.toBeTruthy();
});

test('isFile', () => {
  expect(fileFilters.isFile(`${basePath}/routes/System/Role/Add.js`)).toBeTruthy();
});

test('isFile is false', () => {
  expect(fileFilters.isFile(`${basePath}/routes/System/Role`)).not.toBeTruthy();
});

test('isDir', () => {
  expect(fileFilters.isDir(`${basePath}/routes/System/Role`)).toBeTruthy();
});

test('isDir is not be truthy', () => {
  expect(fileFilters.isDir(`${basePath}/routes/System/Role/Add.js`)).not.toBeTruthy();
});

test('getRouterConfig', () => {
  expect(fileFilters.getRouterConfig({
    pathname: 'Add',
    fullPath: '/System/Role/Add',
    isAFile: true,
    basePath: path.resolve(__dirname, './routes'),
    postfix,
  })).toMatchObject({
    name: '新增',
    path: 'add',
    fullPath: '/System/Role/Add.js',
    children: [],
    models: ['role', 'user'],
    permission: '',
    hideChildren: false,
    exact: true,
    icon: '',
  });
});

test('getRouterConfig index', () => {
  expect(fileFilters.getRouterConfig({
    pathname: 'info',
    fullPath: '/User/info',
    isAFile: false,
    basePath: path.resolve(__dirname, './routes'),
    postfix,
  })).toMatchObject({
    name: '个人信息',
    path: 'info',
    fullPath: '/User/info/index.js',
    children: [],
    models: 'user',
    permission: '',
    hideChildren: true,
    exact: true,
    icon: '',
    layout: '',
  });
});

test('getComponentPath', () => {
  expect(fileFilters.getComponentPath({
    fullPath: '/System/Role/Add',
    isAFile: true,
    basePath: path.resolve(__dirname, '../../src/routes'),
    postfix,
  })).toEqual('/System/Role/Add.js');
});
