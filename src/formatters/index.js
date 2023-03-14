import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const getDiffInForm = (diffTree, formatter) => {
  if (formatter === 'plain') return plain(diffTree);
  if (formatter === 'stylish') return stylish(diffTree);
  if (formatter === 'json') return json(diffTree);
  return 'unknown formatter';
};

export default getDiffInForm;
