import _ from 'lodash';
import { objectStringify } from '../tools.js';

const indent = (indentCount) => '  '.repeat(indentCount);

const stringify = (nodeValue, indentCount) => {
  if (!_.isPlainObject(nodeValue)) return String(nodeValue);

  return objectStringify(nodeValue, '  ', indentCount + 2, 2);
};

const mapper = {
  root: ({ children }, indentCount, iter) => {
    const textLine = children.flatMap((node) => mapper[node.type](node, indentCount + 1, iter));
    return `{\n${textLine.join('\n')}\n}`;
  },
  nested: ({ name, children }, indentCount, iter) => {
    const textLine = children.flatMap((node) => mapper[node.type](node, indentCount + 2, iter));
    return `${indent(indentCount)}  ${name}: {\n${textLine.join('\n')}\n${indent(indentCount)}  }`;
  },

  added: (node, indentCount) => `${indent(indentCount)}+ ${node.name}: ${stringify(node.value, indentCount)}`,
  removed: (node, indentCount) => `${indent(indentCount)}- ${node.name}: ${stringify(node.value, indentCount)}`,
  unchanged: (node, indentCount) => `${indent(indentCount)}  ${node.name}: ${stringify(node.value, indentCount)}`,

  changed: (node, indentCount) => {
    const { name, newValue, oldValue } = node;

    const oldData = `${indent(indentCount)}- ${name}: ${stringify(oldValue, indentCount)}`;
    const newData = `${indent(indentCount)}+ ${name}: ${stringify(newValue, indentCount)}`;

    return [oldData, newData];
  },
};

const renderTree = (ast) => {
  const iter = (node, indentCount) => mapper[node.type](node, indentCount, iter);
  return iter(ast, 0);
};

export default renderTree;
