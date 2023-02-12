import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../src/ differencegenerator.js';

let jsonPath1;
let jsonPath2;
let yamlPath1;
let ymlPath2;

let stylishResult;
let plainResult;

beforeAll(() => {
  const getFixturePath = (filename) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return path.join(__dirname, '..', '__fixtures__', filename);
  };

  jsonPath1 = getFixturePath('file1.json');
  jsonPath2 = getFixturePath('file2.json');
  yamlPath1 = getFixturePath('file1.yaml');
  ymlPath2 = getFixturePath('file2.yml');

  stylishResult = `{
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

  plainResult = `Property 'common.follow' was added with value: false
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
  expect(gendiff(jsonPath1, jsonPath2)).toBe(stylishResult);
  expect(gendiff(yamlPath1, ymlPath2)).toBe(stylishResult);
});

test('displaying file differences in stylish form', () => {
  expect(gendiff(jsonPath1, jsonPath2, 'stylish')).toBe(stylishResult);
  expect(gendiff(yamlPath1, ymlPath2, 'stylish')).toBe(stylishResult);
});

test('displaying file differences in plain form', () => {
  expect(gendiff(jsonPath1, jsonPath2, 'plain')).toBe(plainResult);
  expect(gendiff(yamlPath1, ymlPath2, 'plain')).toBe(plainResult);
});
