import _ from 'lodash';

const indent = (depth, spaceCount = 4) => {
  const numberSpecialSymbols = 2;
  return ' '.repeat(depth * spaceCount - numberSpecialSymbols);
};

const stringify = (data, depth, mapping) => {
  if (!_.isPlainObject(data)) return String(data);

  const textLine = Object.entries(data)
    .map(([key, value]) => mapping.unchanged({ key, value }, depth + 1));
  return `{\n${textLine.join('\n')}\n${indent(depth)}  }`;
};

const getLeafLine = (key, value, depth, mapping, status) => (
  `${indent(depth)}${status} ${key}: ${stringify(value, depth, mapping)}`);

const getChildrenLine = (children, depth, iter, mapping) => (
  children.flatMap((node) => mapping[node.type](node, depth + 1, iter)));

const mapping = {
  root: ({ children }, depth, iter) => {
    const childrenLine = getChildrenLine(children, depth, iter, mapping);
    return `{\n${childrenLine.join('\n')}\n}`;
  },
  nested: ({ key, children }, depth, iter) => {
    const childrenLine = getChildrenLine(children, depth, iter, mapping);
    return `${indent(depth)}  ${key}: {\n${childrenLine.join('\n')}\n${indent(depth)}  }`;
  },
  added: ({ key, value }, depth) => getLeafLine(key, value, depth, mapping, '+'),
  removed: ({ key, value }, depth) => getLeafLine(key, value, depth, mapping, '-'),
  unchanged: ({ key, value }, depth) => getLeafLine(key, value, depth, mapping, ' '),
  changed: ({ key, newValue, oldValue }, depth) => {
    const oldData = getLeafLine(key, oldValue, depth, mapping, '-');
    const newData = getLeafLine(key, newValue, depth, mapping, '+');
    return [oldData, newData];
  },
};

const renderTree = (ast) => {
  const iter = (node, depth) => mapping[node.type](node, depth, iter);
  return iter(ast, 0);
};

export default renderTree;
