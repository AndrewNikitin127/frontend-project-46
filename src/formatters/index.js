import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const forrmaters = {
  plain,
  stylish,
  json,
};

export default (diffTree, formatter) => {
  if (!forrmaters[formatter]) throw new Error(`error: option '-f, --format <type>' argument '${formatter}' is invalid. Allowed choices are stylish, plain, json.`);

  return forrmaters[formatter](diffTree);
};
