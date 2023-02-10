#!/usr/bin/env node
import { Command } from 'commander';
import gendiff from '../src/ differencegenerator.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0', '-v, --vers', 'output the current version')
  .arguments('<filepath1> <filepath2>') // обязательно принимает минимум 2 аргумента
  .option('-f, --format <type>', 'output format', 'stylish') // указано значение по дефолту standart
  .action((filepath1, filepath2) => {
    console.log(gendiff(filepath1, filepath2));
  });

program.parse();
/*

//тут мы достаем из свойства args объекта program массив аргументов
const { args } = program;
//первые два аргумента из массива аргументов присваиваем
const [file1, file2] = args;
//получаем объект параметрами, свойства его - указанные нами параметры(format).
const options = program.opts();
//получаем указанный формат
const format = options.format;
*/
