import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const forrmaters = {
  plain,
  stylish,
  json,
};

export default (diffTree, formatter) => forrmaters[formatter](diffTree);
