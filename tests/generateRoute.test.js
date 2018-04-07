const generateRoute = require('../src/generateRoute')

const prePath = '../tests/routes';
const postfix = '.js';
const arr = generateRoute(prePath, postfix);

test('generateRoute have length is 4', () => {
  expect(arr).toHaveLength(4);
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

