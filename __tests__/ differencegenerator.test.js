import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../src/ differencegenerator.js';

const pathFile = {};

const result = {};

beforeAll(() => {
  const getFixturePath = (filename) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return path.join(__dirname, '..', '__fixtures__', filename);
  };

  pathFile.json1 = getFixturePath('file1.json');
  pathFile.json2 = getFixturePath('file2.json');
  pathFile.yaml1 = getFixturePath('file1.yaml');
  pathFile.yaml2 = getFixturePath('file2.yml');

  result.stylish = `{
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

  result.plain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;
});

test('displaying file differences in default form', () => {
  expect(gendiff(pathFile.json1, pathFile.json2)).toBe(result.stylish);
  expect(gendiff(pathFile.yaml1, pathFile.yaml2)).toBe(result.stylish);
});

test('displaying file differences in stylish form', () => {
  expect(gendiff(pathFile.json1, pathFile.json2, 'stylish')).toBe(result.stylish);
  expect(gendiff(pathFile.yaml1, pathFile.yaml2, 'stylish')).toBe(result.stylish);
});

test('displaying file differences in plain form', () => {
  expect(gendiff(pathFile.json1, pathFile.json2, 'plain')).toBe(result.plain);
  expect(gendiff(pathFile.yaml1, pathFile.yaml2, 'plain')).toBe(result.plain);
});
