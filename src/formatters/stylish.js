import _ from 'lodash';

const indent = (depth, spaceCount = 4) => {
  const numberSpecialSymbols = 2;
  return ' '.repeat(depth * spaceCount - numberSpecialSymbols);
};

const stringify = (data, depth, mapping) => {
  if (!_.isPlainObject(data)) return String(data);

  const textLine = Object.entries(data)
    .map(([name, value]) => mapping.unchanged({ name, value }, depth + 1));
  return `{\n${textLine.join('\n')}\n${indent(depth)}  }`;
};

const getLeafLine = (name, value, depth, mapping, status) => (
  `${indent(depth)}${status} ${name}: ${stringify(value, depth, mapping)}`);

const getParentLine = (children, depth, iter, mapping) => (
  children.flatMap((node) => mapping[node.type](node, depth + 1, iter)));

const mapping = {
  root: ({ children }, depth, iter) => {
    const textLine = getParentLine(children, depth, iter, mapping);
    return `{\n${textLine.join('\n')}\n}`;
  },
  nested: ({ name, children }, depth, iter) => {
    const textLine = getParentLine(children, depth, iter, mapping);
    return `${indent(depth)}  ${name}: {\n${textLine.join('\n')}\n${indent(depth)}  }`;
  },
  added: ({ name, value }, depth) => getLeafLine(name, value, depth, mapping, '+'),
  removed: ({ name, value }, depth) => getLeafLine(name, value, depth, mapping, '-'),
  unchanged: ({ name, value }, depth) => getLeafLine(name, value, depth, mapping, ' '),
  changed: ({ name, newValue, oldValue }, depth) => {
    const oldData = getLeafLine(name, oldValue, depth, mapping, '-');
    const newData = getLeafLine(name, newValue, depth, mapping, '+');
    return [oldData, newData];
  },
};

const renderTree = (ast) => {
  const iter = (node, depth) => mapping[node.type](node, depth, iter);
  return iter(ast, 0);
};

export default renderTree;
