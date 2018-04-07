import { arrToTree } from '../src/utils';

test('arr to tree', () => {
  expect(arrToTree([
    ['a', 'b', 'c', 'd'],
    ['a', 'f', 'c', 'd'],
    ['a', 'b', 'c1', 'd1'],
    ['a1', 'b', 'c1', 'd1'],
    ['a1', 'b'],
    ['b', 'a'],
  ])).toMatchObject({
    a: {
      b: {
        c: {
          d: {},
        },
        c1: {
          d1: {},
        },
      },
      f: {
        c: {
          d: {},
        },
      },
    },
    a1: {
      b: {
        c1: {
          d1: {},
        },
      },
    },
    b: {
      a: {},
    },
  });
});
