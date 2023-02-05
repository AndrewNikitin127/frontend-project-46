import yaml from 'js-yaml';

const parse = (data, format) => {
  if (format === '.json') return JSON.parse(data);
  if (format === '.yaml' || format === '.yml') return yaml.safeload(data);
  return 'unknown format';
};

/*
const a = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
  arr: [1,2,'ff',true],
}

console.log(yaml.dump(a)); */
let a = [1,2,3,'2',true];
console.log(`${a}`);

export default parse;
