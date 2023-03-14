import _ from 'lodash';
import { readFile, buildFullPath, getFileFormat } from './tools.js';
import parse from './parsers.js';
import buildDiffTree from './buildDiff.js';
import getDiffInForm from './formatters/index.js';

const objectsAreValid = (obj1, obj2) => _.isPlainObject(obj1) && _.isPlainObject(obj2);

const genDiff = (path1, path2, formatName = 'stylish') => {
  const fileData1 = readFile(buildFullPath(path1));
  const fileData2 = readFile(buildFullPath(path2));
  const object1 = parse(fileData1, getFileFormat(path1));
  const object2 = parse(fileData2, getFileFormat(path2));

  if (!objectsAreValid(object1, object2)) {
    return 'Failed correctly to parse files. Check if the specified path and file format are correct.';
  }

  const diffTree = buildDiffTree(object1, object2);

  return getDiffInForm(diffTree, formatName);
};

export default genDiff;
