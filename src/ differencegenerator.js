import { readFile, buildFullPath, getFileFormat } from './tools.js';
import parse from './parsers.js';
import buildDiffTree from './buildDiff.js';
import getDiffInForm from './formatters/index.js';

const genDiff = (path1, path2, formatName = 'stylish') => {
  const fileData1 = readFile(buildFullPath(path1));
  const fileData2 = readFile(buildFullPath(path2));
  const object1 = parse(fileData1, getFileFormat(path1));
  const object2 = parse(fileData2, getFileFormat(path2));

  const diffTree = buildDiffTree(object1, object2);

  return getDiffInForm(diffTree, formatName);
};

export default genDiff;
