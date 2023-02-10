import { readFile, theseisObjects, getFileFormat } from './tools.js';
import parse from './parsers.js';
import buildDiffTree from './buildDiff.js';
import stylish from './formatters/stylish.js';

const genDiff = (path1, path2, formator = stylish) => {
  const objData1 = parse(readFile(path1), getFileFormat(path1));
  const objData2 = parse(readFile(path2), getFileFormat(path2));
  if (!theseisObjects(objData1, objData2)) {
    return 'unknown file format';
  }
  const diffTree = buildDiffTree(objData1, objData2);
  return formator(diffTree);
};

export default genDiff;
