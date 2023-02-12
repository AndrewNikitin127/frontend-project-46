import { readFile, isObjectObject, getFileFormat } from './tools.js';
import parse from './parsers.js';
import buildDiffTree from './buildDiff.js';
import getDiffInForm from './formatters/index.js';

const genDiff = (path1, path2, formatName = 'stylish') => {
  const objData1 = parse(readFile(path1), getFileFormat(path1));
  const objData2 = parse(readFile(path2), getFileFormat(path2));

  if (!isObjectObject(objData1) || !isObjectObject(objData2)) {
    return 'unknown file format';
  }
  const diffTree = buildDiffTree(objData1, objData2);

  return getDiffInForm(diffTree, formatName);
};

export default genDiff;
