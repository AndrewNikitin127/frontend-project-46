import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(fullPath, 'UTF-8');
  return data;
};

const objectCompare = (object1, object2) => {
  const allSortsKeys = _.sortBy(Object.keys({ ...object1, ...object2 }));

  return allSortsKeys.reduce((result, key) => {
    if (_.has(object1, key) && !_.has(object2, key)) {
      result.push(`  - ${key}: ${object1[key]}`);
    } else if (!_.has(object1, key) && _.has(object2, key)) {
      result.push(`  + ${key}: ${object2[key]}`);
    } else if (object1[key] !== object2[key]) {
      result.push(`  - ${key}: ${object1[key]}`);
      result.push(`  + ${key}: ${object2[key]}`);
    } else {
      result.push(`    ${key}: ${object1[key]}`);
    }
    return result;
  }, []);
};

const genDiff = (path1, path2) => {
  const data1 = JSON.parse(readFile(path1));
  const data2 = JSON.parse(readFile(path2));
  return `{\n${objectCompare(data1, data2)}\n}`;
};

export default genDiff;
