import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../src/ differencegenerator.js';

let pathJsonFile1;
let pathJsonFile2;
let pathYamlFile1;
let pathYamlFile2;

let expectedResult;

beforeAll(() => {
  const getFixturePath = (filename) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return path.join(__dirname, '..', '__fixtures__', filename);
  };

  pathJsonFile1 = getFixturePath('file1.json');
  pathJsonFile2 = getFixturePath('file2.json');
  pathYamlFile1 = getFixturePath('file1.yaml');
  pathYamlFile2 = getFixturePath('file2.yml');

  expectedResult = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;
});

test('finding and displaying file differences', () => {
  expect(gendiff(pathJsonFile1, pathJsonFile2)).toBe(expectedResult);
  expect(gendiff(pathYamlFile1, pathYamlFile2)).toBe(expectedResult);
});
