#!/usr/bin/env node
import { Command, Option } from 'commander';
import gendiff from '../src/ differencegenerator.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference. Supports json, yaml, yml formats')
  .version('1.0.0', '-v, --vers', 'output the current version')
  .arguments('<filepath1> <filepath2>')
  .addOption(new Option('-f, --format <type>', 'output format')
    .choices(['stylish', 'plain', 'JSON']).default('stylish'))
  .action((filepath1, filepath2, option) => {
    console.log(gendiff(filepath1, filepath2, option.format));
  });

program.parse();
