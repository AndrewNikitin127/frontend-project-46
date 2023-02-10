import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(fullPath, 'UTF-8');
  return data;
};
const theseisObjects = (...objects) => {
  const result = objects.every((object) => _.isObject(object) && !Array.isArray(object));
  return result;
};
const getFileFormat = (filePath) => path.extname(path.basename(filePath));

export { readFile, theseisObjects, getFileFormat };
