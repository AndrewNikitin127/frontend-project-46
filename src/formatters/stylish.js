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

const mapping = {
  root: ({ children }, depth, iter) => {
    const textLine = children.flatMap((node) => mapping[node.type](node, depth + 1, iter));
    return `{\n${textLine.join('\n')}\n}`;
  },
  nested: ({ name, children }, depth, iter) => {
    const textLine = children.flatMap((node) => mapping[node.type](node, depth + 1, iter));
    return `${indent(depth)}  ${name}: {\n${textLine.join('\n')}\n${indent(depth)}  }`;
  },
  added: (node, depth) => `${indent(depth)}+ ${node.name}: ${stringify(node.value, depth, mapping)}`,
  removed: (node, depth) => `${indent(depth)}- ${node.name}: ${stringify(node.value, depth, mapping)}`,
  unchanged: (node, depth) => `${indent(depth)}  ${node.name}: ${stringify(node.value, depth, mapping)}`,
  changed: (node, depth) => {
    const { name, newValue, oldValue } = node;

    const oldData = `${indent(depth)}- ${name}: ${stringify(oldValue, depth, mapping)}`;
    const newData = `${indent(depth)}+ ${name}: ${stringify(newValue, depth, mapping)}`;
    return [oldData, newData];
  },
};

const renderTree = (ast) => {
  const iter = (node, depth) => mapping[node.type](node, depth, iter);
  return iter(ast, 0);
};

export default renderTree;
