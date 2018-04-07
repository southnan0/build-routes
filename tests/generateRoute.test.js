const generateRoute = require('../src/generateRoute')
const path = require('path')

const prePath = '../tests/routes';
const postfix = '.js';
const arr = generateRoute(path.resolve(__dirname),prePath, postfix);

test('generateRoute have length is 1', () => {
  expect(arr).toHaveLength(1);
});

test('arr[0].path is system', () => {
  expect(arr[0].path).toBe('system');
});

test('System has a child', () => {
  expect(arr[0].children).toHaveLength(1);
});

test('System s child s path call role', () => {
  expect(arr[0].children[0].path).toBe('role');
});

test('System s child s path call role', () => {
  expect(arr[0].children[0].path).toBe('role');
});

