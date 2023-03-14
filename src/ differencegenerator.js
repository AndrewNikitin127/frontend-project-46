import _ from 'lodash';
import { readFile, getFileFormat } from './tools.js';
import parse from './parsers.js';
import buildDiffTree from './buildDiff.js';
import getDiffInForm from './formatters/index.js';

const objectsAreValid = (obj1, obj2) => _.isPlainObject(obj1) && _.isPlainObject(obj2);

const genDiff = (path1, path2, formatName = 'stylish') => {
  const objData1 = parse(readFile(path1), getFileFormat(path1));
  const objData2 = parse(readFile(path2), getFileFormat(path2));

  if (!objectsAreValid(objData1, objData2)) {
    return 'Failed correctly to parse files. Check if the specified path and file format are correct.';
  }

  const diffTree = buildDiffTree(objData1, objData2);

  return getDiffInForm(diffTree, formatName);
};

export default genDiff;
