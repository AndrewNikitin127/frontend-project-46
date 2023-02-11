import _ from 'lodash';
import { theseisObjects } from '../tools.js';

const statusDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const objectStringify = (object, replacer = ' ', numStartIndent = 1, indentIncreaser = 2) => {
  const iter = (currentvalue, indentCount) => {
    if (!_.isObject(currentvalue)) return `${currentvalue}`;

    const currentIndent = replacer.repeat(indentCount);
    const bracketSpaceCounter = indentCount - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    const lines = Object.entries(currentvalue).map(
      ([key, val]) => `${currentIndent}  ${key}: ${iter(val, indentCount + indentIncreaser)}`,
    );

    const result = ['{', ...lines, `${brackeIndent}}`].join('\n');
    return result;
  };
  return iter(object, numStartIndent);
};

const isValueInNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => _.has(val, 'value');

const getNodeTextLine = (iterFunc, node, currentIndent, spaceCount, indentIncreaser = 2) => {
  if (node.type === 'changed') {
    const oldline = `${currentIndent}- ${node.name}: ${iterFunc(node.oldValue, spaceCount + indentIncreaser)}`;
    const newLine = `${currentIndent}+ ${node.name}: ${iterFunc(node.newValue, spaceCount + indentIncreaser)}`;
    return `${oldline}\n${newLine}`;
  }
  return `${currentIndent}${statusDisplay[node.type]}${node.name}: ${iterFunc(node, spaceCount + indentIncreaser)}`;
};

const buildStylishForm = (diffTree) => {
  const replacer = '  ';
  const numStartIndent = 1;
  const indentIncreaser = 2;

  const iter = (currentValue, indentСounter) => {
    const currentIndent = replacer.repeat(indentСounter);
    const bracketSpaceCounter = indentСounter - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    if (isValueInNode(currentValue)) {
      return theseisObjects(currentValue)
        ? objectStringify(currentValue, replacer, indentСounter, indentIncreaser)
        : `${currentValue}`;
    }
    if (isLeafNode(currentValue)) {
      return theseisObjects(currentValue.value)
        ? objectStringify(currentValue.value, replacer, indentСounter, indentIncreaser)
        : `${currentValue.value}`;
    }
    const children = currentValue.children.map(
      (child) => getNodeTextLine(iter, child, currentIndent, indentСounter, indentIncreaser),
    );
    return ['{', ...children, `${brackeIndent}}`].join('\n');
  };
  return iter(diffTree, numStartIndent);
};

export default buildStylishForm;
