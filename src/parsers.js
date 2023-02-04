import yaml from 'js-yaml';

const parse = (data, format) => {
  if (format === '.json') return JSON.parse(data);
  if (format === '.yaml' || format === '.yml') return yaml.safeload(data);
  return 'unknown format';
};

export default parse;
