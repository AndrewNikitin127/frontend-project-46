import yaml from 'js-yaml';

const parse = (data, format) => {
  if (format === 'json') return JSON.parse(data);
  if (format === 'yaml' || format === 'yml') return yaml.load(data);
  return 'unknown format file';
};

export default parse;
