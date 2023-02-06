import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(fullPath, 'UTF-8');
  return data;
};
const isObject = (object) => _.isObject(object) && !Array.isArray(object);
const getFileFormat = (filePath) => path.extname(path.basename(filePath));

const objectCompare = (object1, object2) => {
  const getStatus = (obj1, obj2, key) => {
    if (!_.has(obj1, key)) return 'added';
    if (!_.has(obj2, key)) return 'removed';
    if (_.isEqual(obj1[key], obj2[key])) return 'unupdated';
    return 'updeted';
  };

  const allSortsKeys = _.sortBy(Object.keys({ ...object1, ...object2 }));

  return allSortsKeys.flatMap((key) => {
    let acc = { name: key, status: getStatus(object1, object2, key) };

    if (acc.status === 'added') {
      acc.value = object2[key];
    } else if (acc.status === 'removed' || acc.status === 'unupdated') {
      acc.value = object1[key];
    } else if (isObject(object1[key]) && isObject(object2[key])) {
      acc.value = objectCompare(object1[key], object2[key]);
    } else {
      acc = [
        { name: key, status: 'removed', value: object1[key] },
        { name: key, status: 'added', value: object2[key] },
      ];
    }
    return acc;
  });
};

const genDiff = (path1, path2) => {
  const objData1 = parse(readFile(path1), getFileFormat(path1));
  const objData2 = parse(readFile(path2), getFileFormat(path2));
  if (!isObject(objData1) || !isObject(objData2)) {
    return 'unknown file format';
  }
  return `{\n${objectCompare(objData1, objData2)}\n}`;
};

export default genDiff;

const objet1 = {
  d: 'asds',
  v: 222,
  caches: { gg: 22, ddd: 1 },
};
const objet2 = {
  d: 'asds',
  v: 333,
  caches: { gg: 'hhh', ddd: '' },
};

console.log(JSON.stringify(objectCompare(objet1, objet2)));
