import yaml from 'js-yaml';
import _ from 'lodash';

const parsers = {
  json: JSON.parse,
  yaml: yaml.load,
  yml: yaml.load,
};

export default (data, format) => {
  if (!parsers[format]) throw new Error('unknow file format');

  const outputObject = parsers[format](data);

  if (!_.isPlainObject(outputObject)) throw new Error('Failed correctly to parse files.');

  return outputObject;
};
