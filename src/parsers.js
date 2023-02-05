import yaml from 'js-yaml';

const parse = (data, format) => {
  if (format === '.json') return JSON.parse(data);
  if (format === '.yaml' || format === '.yml') return yaml.load(data);
  return 'unknown format';
};

const obj1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false
}

const obj2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io'
}

export default parse;
