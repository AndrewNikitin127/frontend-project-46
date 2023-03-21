import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const buildFullPath = (filePath) => path.resolve(process.cwd(), filePath);

const readFile = (fullPath) => fs.readFileSync(fullPath, 'UTF-8');

const getFileFormat = (filePath) => path.extname(filePath).slice(1);

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
  readFile, buildFullPath, getFileFormat, objectStringify,
};
