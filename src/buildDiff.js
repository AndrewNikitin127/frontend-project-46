import _ from 'lodash';

const buildDiffTree = (object1, object2) => {
  const getParentNode = (key, type, children) => ({ key, type, children });
  const getLeafNode = (key, type, value) => ({ key, type, value });
  const getChangedLeafNode = (key, type, oldValue, newValue) => ({
    key, type, oldValue, newValue,
  });

  const createNodesOfDifference = (obj1, obj2) => {
    const allSortsKeys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

    return allSortsKeys.map((key) => {
      if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
        return getParentNode(key, 'nested', createNodesOfDifference(obj1[key], obj2[key]));
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

  return getParentNode('/', 'root', createNodesOfDifference(object1, object2));
};

export default buildDiffTree;
