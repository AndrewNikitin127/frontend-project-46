import fs from 'fs';
import path from 'path';

const buildFullPath = (filePath) => path.resolve(process.cwd(), filePath);

const readFile = (fullPath) => fs.readFileSync(fullPath, 'UTF-8');

const getFileFormat = (filePath) => path.extname(filePath).slice(1);

export {
  readFile, buildFullPath, getFileFormat,
};
