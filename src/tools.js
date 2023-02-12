import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(fullPath, 'UTF-8');
  return data;
};
/** is object & not array */
const isObjectObject = (object) => _.isObject(object) && !Array.isArray(object);

const getFileFormat = (filePath) => path.extname(path.basename(filePath));

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

export {
  readFile, isObjectObject, getFileFormat, objectStringify,
};
