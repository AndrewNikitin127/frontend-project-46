import _ from 'lodash';
import { theseisObjects } from './tools.js';

const getStatus = (obj1, obj2, key) => {
  if (!_.has(obj1, key)) return 'added';
  if (!_.has(obj2, key)) return 'removed';
  if (_.isEqual(obj1[key], obj2[key])) return 'unchanged';
  return 'changed';
};

const buildDiffTree = (object1, object2) => {
  const buildDiffObjects = (obj1, obj2) => {
    const allSortsKeys = _.union(_.keys(obj1), _.keys(obj2)).sort();

    return allSortsKeys.flatMap((key) => {
      const acc = { name: key, type: getStatus(obj1, obj2, key) };

      if (theseisObjects(obj1[key], obj2[key])) {
        acc.type = 'unchanged';
        acc.children = buildDiffObjects(obj1[key], obj2[key]);
      } else if (acc.type === 'added') {
        acc.value = obj2[key];
      } else if (acc.type === 'removed' || acc.type === 'unchanged') {
        acc.value = obj1[key];
      } else {
        acc.oldValue = obj1[key];
        acc.newValue = obj2[key];
      }
      return acc;
    });
  };

  return { name: '/', type: 'node', children: buildDiffObjects(object1, object2) };
};

export default buildDiffTree;
