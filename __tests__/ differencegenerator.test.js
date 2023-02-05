import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../src/ differencegenerator.js';

let pathFile1;
let pathFile2;
let expectedResult;

beforeAll(() => {
  const getFixturePath = (filename) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return path.join(__dirname, '..', '__fixtures__', filename);
  };

  pathFile1 = getFixturePath('file1.json');
  pathFile2 = getFixturePath('file2.json');

  expectedResult = [
    '{',
    '  - arr: [1, 2, true, "123"]',
    '  - follow: false',
    '    host: hexlet.io',
    '  - proxy: 123.234.53.22',
    '  - timeout: 50',
    '  + timeout: 20',
    '  + verbose: true',
    '}',
  ].join('\n');
});

test('finding and displaying file differences', () => {
  expect(gendiff(pathFile1, pathFile2)).toBe(expectedResult);
});
