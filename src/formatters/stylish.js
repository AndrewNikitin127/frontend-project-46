import _ from 'lodash';
import { isObject } from '../tools.js';

const statusDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const objectStringify = (object, replacer = ' ', numStartSpace = 1, spaceIncreaser = 1) => {
  const iter = (currentValue, spaceCount) => {
    if (!_.isObject(currentValue)) return `${currentValue}`;

    const currentIndent = replacer.repeat(spaceCount);
    const bracketSpaceCounter = spaceCount - 1;
    const bracketIndent = replacer.repeat(bracketSpaceCounter);

    const lines = Object.entries(currentValue).map(
      ([key, val]) => `${currentIndent}  ${key}: ${iter(val, spaceCount + spaceIncreaser)}`,
    );

    const result = ['{', ...lines, `${bracketIndent}}`].join('\n');
    return result;
  };
  return iter(object, numStartSpace);
};

const isValueInNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => !_.has(val, 'children');

const getNodeTextLine = (iterFunc, node, currentIndent, spaceCount, spaceIncreaser = 2) => {
  if (node.type === 'changed') {
    const oldline = `${currentIndent}- ${node.name}: ${iterFunc(node.oldValue, spaceCount + spaceIncreaser)}`;
    const newLine = `${currentIndent}+ ${node.name}: ${iterFunc(node.newValue, spaceCount + spaceIncreaser)}`;
    return `${oldline}\n${newLine}`;
  }
  return `${currentIndent}${statusDisplay[node.type]}${node.name}: ${iterFunc(node, spaceCount + spaceIncreaser)}`;
};

const buildStylishForm = (diffTree) => {
  const replacer = '  ';
  const numStartSpace = 1;
  const spaceIncreaser = 2;

  const iter = (currentValue, spaceСounter) => {
    const currentIndent = replacer.repeat(spaceСounter);
    const bracketSpaceCounter = spaceСounter - 1;
    const bracketIndent = replacer.repeat(bracketSpaceCounter);

    if (isValueInNode(currentValue)) {
      return isObject(currentValue)
        ? objectStringify(currentValue, replacer, spaceСounter, spaceIncreaser)
        : `${currentValue}`;
    }
    if (isLeafNode(currentValue)) {
      return isObject(currentValue.value)
        ? objectStringify(currentValue.value, replacer, spaceСounter, spaceIncreaser)
        : `${currentValue.value}`;
    }
    const children = currentValue.children.map(
      (child) => getNodeTextLine(iter, child, currentIndent, spaceСounter, spaceIncreaser),
    );
    return ['{', ...children, `${bracketIndent}}`].join('\n');
  };
  return iter(diffTree, numStartSpace);
};

export default buildStylishForm;
