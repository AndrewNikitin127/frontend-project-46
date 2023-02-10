import _ from 'lodash';
import { theseisObjects } from '../tools.js';

const statDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const isNotNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => _.has(val, 'value');

const getNodeLine = (iterFunc, node, indent, spaceCount, indentProg = 2) => {
  if (node.type === 'changed') {
    const oldline = `${indent}- ${node.name}: ${iterFunc(node.oldValue, spaceCount + indentProg)}`;
    const newLine = `${indent}+ ${node.name}: ${iterFunc(node.newValue, spaceCount + indentProg)}`;
    return `${oldline}\n${newLine}`;
  }
  return `${indent}${statDisplay[node.type]}${node.name}: ${iterFunc(node, spaceCount + indentProg)}`;
};

const objectStringify = (data, replacer = ' ', spaceCount = 1, indentProg = 2) => {
  const iter = (currentvalue, innerSaceCount = 1) => {
    if (!_.isObject(currentvalue)) return `${currentvalue}`;

    const currentIndent = replacer.repeat(innerSaceCount);
    const bracketSpaceCounter = innerSaceCount - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    const lines = Object.entries(currentvalue).map(
      ([key, val]) => `${currentIndent}  ${key}: ${iter(val, innerSaceCount + indentProg)}`,
    );

    const result = ['{', ...lines, `${brackeIndent}}`].join('\n');
    return result;
  };
  return iter(data, spaceCount);
};

const buildStylishForm = (diffTree, replacer = '  ', indentationProgress = 2) => {
  const iter = (currentValue, spaceCount = 1) => {
    const currentIndent = replacer.repeat(spaceCount);
    const bracketSpaceCounter = spaceCount - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    if (isNotNode(currentValue)) {
      return theseisObjects(currentValue)
        ? objectStringify(currentValue, replacer, spaceCount, indentationProgress)
        : `${currentValue}`;
    }
    if (isLeafNode(currentValue)) {
      return theseisObjects(currentValue.value)
        ? objectStringify(currentValue.value, replacer, spaceCount, indentationProgress)
        : `${currentValue.value}`;
    }
    const children = currentValue.children.map(
      (child) => getNodeLine(iter, child, currentIndent, spaceCount, indentationProgress),
    );
    return ['{', ...children, `${brackeIndent}}`].join('\n');
  };
  return iter(diffTree);
};

export default buildStylishForm;
