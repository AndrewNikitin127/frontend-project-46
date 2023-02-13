import _ from 'lodash';
import { isObjectObject } from './tools.js';

const buildDiffTree = (object1, object2) => {
  const getParentNode = (name, type, children) => ({ name, type, children });
  const getLeafNode = (name, type, value) => ({ name, type, value });
  const getChangedLeafNode = (name, type, oldValue, newValue) => ({
    name, type, oldValue, newValue,
  });

  const buildDiffNodes = (obj1, obj2) => {
    const allSortsKeys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

    return allSortsKeys.map((key) => {
      if (isObjectObject(obj1[key]) && isObjectObject(obj2[key])) {
        return getParentNode(key, 'unchanged', buildDiffNodes(obj1[key], obj2[key]));
      }
      if (!_.has(obj1, key)) {
        return getLeafNode(key, 'added', obj2[key]);
      }
      if (!_.has(obj2, key)) {
        return getLeafNode(key, 'removed', obj1[key]);
      }
      if (_.isEqual(obj1[key], obj2[key])) {
        return getLeafNode(key, 'unchanged', obj1[key]);
      }
      return getChangedLeafNode(key, 'changed', obj1[key], obj2[key]);
    });
  };

  return getParentNode('/', 'root', buildDiffNodes(object1, object2));
};

export default buildDiffTree;
