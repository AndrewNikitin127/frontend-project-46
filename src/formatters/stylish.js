import _ from 'lodash';
import { theseisObjects } from '../tools.js';

const statDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};
const getNameAndStatus = (name, status, indent = '') => `${indent}${status}${name}`;
const isNotNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => _.has(val, 'value');
const getNodeLine = (node, indent, spaceCount, iterFunc) => {
  if (node.type === 'changed') {
    const oldline = `${getNameAndStatus(node.name, statDisplay.removed, indent)}`
    + `: ${iterFunc(node.oldValue, spaceCount + 2)}`;
    const newLine = `${getNameAndStatus(node.name, statDisplay.added, indent)}`
    + `: ${iterFunc(node.newValue, spaceCount + 2)}`;
    return `${oldline}\n${newLine}`;
  }
  return `${getNameAndStatus(node.name, statDisplay[node.type], indent)}`
  + `: ${iterFunc(node, spaceCount + 2)}`;
};

const objectStringify = (data, replacer = ' ', spaceCount = 1) => {
  const iter = (currentvalue, count = 1) => {
    if (!_.isObject(currentvalue)) return `${currentvalue}`;

    const currentIndent = replacer.repeat(count);
    const bracketSpaceCounter = count - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    const lines = Object.entries(currentvalue).map(
      ([key, val]) => `${getNameAndStatus(key, statDisplay.unchanged, currentIndent)}`
      + `: ${iter(val, count + 2)}`,
    );

    const result = ['{', ...lines, `${brackeIndent}}`].join('\n');
    return result;
  };
  return iter(data, spaceCount);
};

const buildStylishForm = (diffTree) => {
  const replacer = '  ';

  const iter = (currentvalue, spaceCount = 1) => {
    const currentIndent = replacer.repeat(spaceCount);
    const bracketSpaceCounter = spaceCount - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    if (isNotNode(currentvalue)) {
      return theseisObjects(currentvalue)
        ? objectStringify(currentvalue, replacer, spaceCount) : `${currentvalue}`;
    }
    if (isLeafNode(currentvalue)) {
      return theseisObjects(currentvalue.value)
        ? objectStringify(currentvalue.value, replacer, spaceCount) : `${currentvalue.value}`;
    }
    const children = currentvalue.children.map(
      (child) => getNodeLine(child, currentIndent, spaceCount, iter),
    );
    return ['{', ...children, `${brackeIndent}}`].join('\n');
  };
  return iter(diffTree);
};

export default buildStylishForm;
