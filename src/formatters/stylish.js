import _ from 'lodash';
import { objectStringify } from '../tools.js';

const statusDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const isValueInNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => !_.has(val, 'children');

const getNodeTextLine = (createFunc, node, currentIndent, spaceCount, spaceIncreaser = 2) => {
  if (node.type === 'changed') {
    const oldline = `${currentIndent}- ${node.name}: ${createFunc(node.oldValue, spaceCount + spaceIncreaser)}`;
    const newLine = `${currentIndent}+ ${node.name}: ${createFunc(node.newValue, spaceCount + spaceIncreaser)}`;
    return `${oldline}\n${newLine}`;
  }
  return `${currentIndent}${statusDisplay[node.type]}${node.name}: ${createFunc(node, spaceCount + spaceIncreaser)}`;
};

const buildStylishForm = (diffTree) => {
  const replacer = '  ';
  const numStartSpace = 1;
  const spaceIncreaser = 2;

  const createStylish = (currentValue, spaceСounter) => {
    const currentIndent = replacer.repeat(spaceСounter);
    const bracketSpaceCounter = spaceСounter - 1;
    const bracketIndent = replacer.repeat(bracketSpaceCounter);

    if (isValueInNode(currentValue)) {
      return _.isPlainObject(currentValue)
        ? objectStringify(currentValue, replacer, spaceСounter, spaceIncreaser)
        : `${currentValue}`;
    }
    if (isLeafNode(currentValue)) {
      return _.isPlainObject(currentValue.value)
        ? objectStringify(currentValue.value, replacer, spaceСounter, spaceIncreaser)
        : `${currentValue.value}`;
    }
    const children = currentValue.children.map(
      (child) => getNodeTextLine(createStylish, child, currentIndent, spaceСounter, spaceIncreaser),
    );
    return ['{', ...children, `${bracketIndent}}`].join('\n');
  };
  return createStylish(diffTree, numStartSpace);
};

export default buildStylishForm;
