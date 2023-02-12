import _ from 'lodash';
import { isObjectObject, objectStringify } from '../tools.js';

const statusDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
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
      return isObjectObject(currentValue)
        ? objectStringify(currentValue, replacer, spaceСounter, spaceIncreaser)
        : `${currentValue}`;
    }
    if (isLeafNode(currentValue)) {
      return isObjectObject(currentValue.value)
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
