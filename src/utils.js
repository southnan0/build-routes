import _ from 'lodash';

export const arrToTree = (arr) => {
  const obj = {};

  arr.map((p) => {
    _.reduce(p, (preObj, key) => {
      if (!preObj[key]) {
        preObj[key] = {};
      }
      return preObj[key];
    }, obj);
  });

  return obj;
};
