import _ from 'lodash';

const nodeCreateFunc = {
  root: (key, type, obj1, obj2, createNodesOfDifference) => (
    { key, type, children: createNodesOfDifference(obj1, obj2) }),
  nested: (key, type, obj1, obj2, createNodesOfDifference) => (
    { key, type, children: createNodesOfDifference(obj1[key], obj2[key]) }),
  addedLeaf: (key, type, obj1, obj2) => (
    { key, type, value: obj2[key] }),
  removedLeaf: (key, type, obj1) => (
    { key, type, value: obj1[key] }),
  changedLeaf: (key, type, obj1, obj2) => ({
    key, type, oldValue: obj1[key], newValue: obj2[key],
  }),
};

const nodesActions = [
  {
    type: 'nested',
    getNode: nodeCreateFunc.nested,
    check: (key, obj1, obj2) => _.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key]),
  },
  {
    type: 'added',
    getNode: nodeCreateFunc.addedLeaf,
    check: (key, obj1) => !_.has(obj1, key),
  },
  {
    type: 'removed',
    getNode: nodeCreateFunc.removedLeaf,
    check: (key, obj1, obj2) => !_.has(obj2, key),
  },
  {
    type: 'unchanged',
    getNode: nodeCreateFunc.addedLeaf,
    check: (key, obj1, obj2) => _.isEqual(obj1[key], obj2[key]),
  },
  {
    type: 'changed',
    getNode: nodeCreateFunc.changedLeaf,
    check: (key, obj1, obj2) => !_.isEqual(obj1[key], obj2[key]),
  },
];

const buildDiffTree = (object1, object2) => {
  const createNodesOfDifference = (obj1, obj2) => {
    const allSortsKeys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

    return allSortsKeys.map((key) => {
      const object = nodesActions.find(({ check }) => check(key, obj1, obj2));
      return object.getNode(key, object.type, obj1, obj2, createNodesOfDifference);
    });
  };

  return nodeCreateFunc.root('/', 'root', object1, object2, createNodesOfDifference);
};

export default buildDiffTree;

// Так получилось, что раздул этот модуль. Изначально было много if и return, но меньше строк.
// codeclimate ругался на много ретурнов. достал ругаться, вот я и психанул.
// Ни одного if и всего 3 ретурна :)
