import _ from 'lodash';

const isLeafNode = (val) => !_.has(val, 'children');

const getValueText = (val) => {
  if (_.isObject(val)) return '[complex value]';
  if (_.isString(val)) return `'${val}'`;
  return val;
};

const getReportNodeChanges = (node, ancestry) => {
  if (node.type === 'added') {
    return `Property '${ancestry}' was added with value: ${getValueText(node.value)}`;
  } if (node.type === 'changed') {
    return `Property '${ancestry}' was updated. From ${getValueText(node.oldValue)} to ${getValueText(node.newValue)}`;
  } if (node.type === 'removed') {
    return `Property '${ancestry}' was removed`;
  } return [];
};

const buildPlainForm = (diffTree) => {
  const iter = (node, ancestry = '') => {
    const newAncestry = ancestry ? [ancestry, node.name].join('.') : node.name;

    if (isLeafNode(node)) return getReportNodeChanges(node, newAncestry);

    return node.children
      .flatMap((child) => iter(child, newAncestry))
      .join('\n');
  };

  const resultTextLines = diffTree.children.map((node) => iter(node));
  return resultTextLines.join('\n');
};

export default buildPlainForm;
