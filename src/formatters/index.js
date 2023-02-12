import stylish from './stylish.js';
import plain from './plain.js';

const getDiffInForm = (diffTree, formatter) => {
  if (formatter === 'plain') return plain(diffTree);
  if (formatter === 'stylish') return stylish(diffTree);
  return 'unknown formatter';
};

export default getDiffInForm;