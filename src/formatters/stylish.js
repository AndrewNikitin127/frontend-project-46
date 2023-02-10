import _ from 'lodash';
import { theseisObjects } from '../tools.js';

const statDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const objectStringify = (data, replacer = ' ', indentСounter = 1, indentProg = 2) => {
  const iter = (currentvalue, indentCount = 1) => {
    if (!_.isObject(currentvalue)) return `${currentvalue}`;

    const currentIndent = replacer.repeat(indentCount);
    const bracketSpaceCounter = indentCount - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    const lines = Object.entries(currentvalue).map(
      ([key, val]) => `${currentIndent}  ${key}: ${iter(val, indentCount + indentProg)}`,
    );

    const result = ['{', ...lines, `${brackeIndent}}`].join('\n');
    return result;
  };
  return iter(data, indentСounter);
};

const isValueInNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => _.has(val, 'value');

const getNodeTextLine = (iterFunc, node, indent, spaceCount, indentProg = 2) => {
  if (node.type === 'changed') {
    const oldline = `${indent}- ${node.name}: ${iterFunc(node.oldValue, spaceCount + indentProg)}`;
    const newLine = `${indent}+ ${node.name}: ${iterFunc(node.newValue, spaceCount + indentProg)}`;
    return `${oldline}\n${newLine}`;
  }
  return `${indent}${statDisplay[node.type]}${node.name}: ${iterFunc(node, spaceCount + indentProg)}`;
};

const buildStylishForm = (diffTree, replacer = '  ', indentationProgress = 2) => {
  const iter = (currentValue, indentСounter = 1) => {
    const currentIndent = replacer.repeat(indentСounter);
    const bracketSpaceCounter = indentСounter - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    if (isValueInNode(currentValue)) {
      return theseisObjects(currentValue)
        ? objectStringify(currentValue, replacer, indentСounter, indentationProgress)
        : `${currentValue}`;
    }
    if (isLeafNode(currentValue)) {
      return theseisObjects(currentValue.value)
        ? objectStringify(currentValue.value, replacer, indentСounter, indentationProgress)
        : `${currentValue.value}`;
    }
    const children = currentValue.children.map(
      (child) => getNodeTextLine(iter, child, currentIndent, indentСounter, indentationProgress),
    );
    return ['{', ...children, `${brackeIndent}}`].join('\n');
  };
  return iter(diffTree);
};

export default buildStylishForm;
