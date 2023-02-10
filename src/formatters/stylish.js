import _ from 'lodash';
import { theseisObjects } from '../tools.js';

const statDisplay = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const objectStringify = (data, replacer = ' ', spaceCount = 1) => {
  const iter = (currentvalue, count = 1) => {
    if (!_.isObject(currentvalue)) return `${currentvalue}`;

    const currentIndent = replacer.repeat(count);
    const bracketSpaceCounter = count - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    const lines = Object.entries(currentvalue).map(
      ([key, val]) => `${currentIndent}${statDisplay.unchanged}${key}: ${iter(val, count + 2)}`,
    );

    const result = ['{', ...lines, `${brackeIndent}}`].join('\n');
    return result;
  };
  return iter(data, spaceCount);
};

const isNotNode = (val) => !_.has(val, 'type');
const isLeafNode = (val) => _.has(val, 'value');

const buildStylishForm = (diffTree) => {
  const replacer = '  ';

  const iter = (currentvalue, spaceCount = 1) => {
    const currentIndent = replacer.repeat(spaceCount);
    const bracketSpaceCounter = spaceCount - 1;
    const brackeIndent = replacer.repeat(bracketSpaceCounter);

    if (isNotNode(currentvalue)) {
      const result = theseisObjects(currentvalue)
        ? objectStringify(currentvalue, replacer, spaceCount) : `${currentvalue}`;
      return result;
    }
    if (isLeafNode(currentvalue)) {
      const result = theseisObjects(currentvalue.value)
        ? objectStringify(currentvalue.value, replacer, spaceCount) : `${currentvalue.value}`;
      return result;
    }
    const children = currentvalue.children.map((child) => {
      if (child.type === 'changed') {
        const oldline = `${currentIndent}${statDisplay.removed}${child.name}: ${iter(child.oldValue, spaceCount + 2)}\n`;
        const newLine = `${currentIndent}${statDisplay.added}${child.name}: ${iter(child.newValue, spaceCount + 2)}`;
        return oldline + newLine;
      }
      return `${currentIndent}${statDisplay[child.type]}${child.name}: ${iter(child, spaceCount + 2)}`;
    });
    return ['{', ...children, `${brackeIndent}}`].join('\n');
  };
  return iter(diffTree);
};

export default buildStylishForm;
