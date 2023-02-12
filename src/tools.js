import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(fullPath, 'UTF-8');
  return data;
};
/** is object & not array */
const isObject = (object) => _.isObject(object) && !Array.isArray(object);

const getFileFormat = (filePath) => path.extname(path.basename(filePath));

export { readFile, isObject, getFileFormat };
