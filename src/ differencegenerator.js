import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(fullPath, 'UTF-8');
  return data;
};

const getFileFormat = (filePath) => path.extname(path.basename(filePath));

const objectCompare = (object1, object2) => {
  const allSortsKeys = _.sortBy(Object.keys({ ...object1, ...object2 }));

  return allSortsKeys.map((key) => {
    let acc = '';
    if (!_.has(object2, key)) {
      acc = `  - ${key}: ${JSON.stringify(object1[key])}`;
    } else if (!_.has(object1, key)) {
      acc = `  + ${key}: ${JSON.stringify(object2[key])}`;
    } else if (!_.isEqual(object1[key], object2[key])) {
      acc = `  - ${key}: ${JSON.stringify(object1[key])}\n`
          + `  + ${key}: ${JSON.stringify(object2[key])}`;
    } else {
      acc = `    ${key}: ${JSON.stringify(object1[key])}`;
    }
    return acc;
  }).join('\n').replace(/"/g, '');
};

const genDiff = (path1, path2) => {
  const objData1 = parse(readFile(path1), getFileFormat(path1));
  const objData2 = parse(readFile(path2), getFileFormat(path2));
  if (!_.isObject(objData1) || !_.isObject(objData2)) return 'unknown file format';
  return `{\n${objectCompare(objData1, objData2)}\n}`;
};

export default genDiff;
