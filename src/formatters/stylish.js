import _ from 'lodash';
import { objectStringify } from '../tools.js';

const statusDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
  nested: '  ',
};

const isValueInNode = (val) => !_.has(val, 'type');

const getNodeTextLine = (createFunc, node, currentIndent, spaceCount, spaceIncreaser) => {
  if (node.type === 'changed') {
    const oldline = `${currentIndent}- ${node.name}: ${createFunc(node.oldValue, spaceCount + spaceIncreaser)}`;
    const newLine = `${currentIndent}+ ${node.name}: ${createFunc(node.newValue, spaceCount + spaceIncreaser)}`;
    return `${oldline}\n${newLine}`;
  }
  if (node.type === 'nested') {
    return `${currentIndent}${statusDisplay[node.type]}${node.name}: ${createFunc(node, spaceCount + spaceIncreaser)}`;
  }
  return `${currentIndent}${statusDisplay[node.type]}${node.name}: ${createFunc(node.value, spaceCount + spaceIncreaser)}`;
};

const buildStylishForm = (diffTree) => {
  const replacer = '  ';
  const numStartSpace = 1;
  const spaceIncreaser = 2;

  const iterStylish = (currentValue, spaceСounter) => {
    const currentIndent = replacer.repeat(spaceСounter);
    const bracketSpaceCounter = spaceСounter - 1;
    const bracketIndent = replacer.repeat(bracketSpaceCounter);

    if (isValueInNode(currentValue)) {
      return !_.isPlainObject(currentValue)
        ? `${currentValue}`
        : objectStringify(currentValue, replacer, spaceСounter, spaceIncreaser);
    }
    const children = currentValue.children.map((child) => (
      getNodeTextLine(iterStylish, child, currentIndent, spaceСounter, spaceIncreaser)
    ));
    return ['{', ...children, `${bracketIndent}}`].join('\n');
  };

  return iterStylish(diffTree, numStartSpace);
};

export default buildStylishForm;
