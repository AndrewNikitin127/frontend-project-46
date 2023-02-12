import _ from 'lodash';
import { isObjectObject } from './tools.js';

const buildDiffTree = (object1, object2) => {
  const buildDiffNodes = (obj1, obj2) => {
    const allSortsKeys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

    return allSortsKeys.flatMap((key) => {
      if (isObjectObject(obj1[key]) && isObjectObject(obj2[key])) {
        return { name: key, type: 'unchanged', children: buildDiffNodes(obj1[key], obj2[key]) };
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

  return { name: '/', type: 'root', children: buildDiffNodes(object1, object2) };
};

export default buildDiffTree;
