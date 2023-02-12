import _ from 'lodash';
import { isObject } from './tools.js';

/* const getStatus = (obj1, obj2, key) => {
  if (!_.has(obj1, key)) return 'added';
  if (!_.has(obj2, key)) return 'removed';
  if (_.isEqual(obj1[key], obj2[key])) return 'unchanged';
  return 'changed';
};
*/
const buildDiffTree = (object1, object2) => {
  const buildDiffObjects = (obj1, obj2) => {
    const allSortsKeys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

    return allSortsKeys.flatMap((key) => {
      if (isObject(obj1[key]) && isObject(obj2[key])) {
        return { name: key, type: 'unchanged', children: buildDiffObjects(obj1[key], obj2[key]) };
      }
      if (!_.has(obj1, key)) {
        return { name: key, type: 'added', value: obj2[key] };
      }
      if (!_.has(obj2, key)) {
        return { name: key, type: 'removed', value: obj1[key] };
      }
      if (_.isEqual(obj1[key], obj2[key])) {
        return { name: key, type: 'unchanged', value: obj1[key] };
      }
      return {
        name: key, type: 'changed', oldValue: obj1[key], newValue: obj2[key],
      };
    });
  };

  return { name: '/', type: 'root', children: buildDiffObjects(object1, object2) };
};

export default buildDiffTree;
