import _ from 'lodash';
import { objectStringify } from '../tools.js';

const statusDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const isValueInNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => !_.has(val, 'children');

const getTextLines = (currentValue, replacer, spaceСounter, spaceIncreaser) => {
  if (!_.isPlainObject(currentValue)) return `${currentValue}`;
  return objectStringify(currentValue, replacer, spaceСounter, spaceIncreaser);
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
      return getTextLines(currentValue, replacer, spaceСounter, spaceIncreaser);
    }
    if (isLeafNode(currentValue)) {
      return getTextLines(currentValue.value, replacer, spaceСounter, spaceIncreaser);
    }
    const children = currentValue.children.map((child) => {
      if (child.type === 'changed') {
        const oldline = `${currentIndent}- ${child.name}: ${iterStylish(child.oldValue, spaceСounter + spaceIncreaser)}`;
        const newLine = `${currentIndent}+ ${child.name}: ${iterStylish(child.newValue, spaceСounter + spaceIncreaser)}`;
        return `${oldline}\n${newLine}`;
      }
      return `${currentIndent}${statusDisplay[child.type]}${child.name}: ${iterStylish(child, spaceСounter + spaceIncreaser)}`;
    });
    return ['{', ...children, `${bracketIndent}}`].join('\n');
  };
  return iterStylish(diffTree, numStartSpace);
};

export default buildStylishForm;
