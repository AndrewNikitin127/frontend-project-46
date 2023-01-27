#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();



program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0', '-v, --vers', 'output the current version')
  .arguments('<filepath1> <filepath2>') //обязательно принимает минимум 2 аргумента
  .option('-f, --format <type>',  'output format', 'standart') //указано значение по дефолту standart

program.parse();

//тут мы достаем из свойства args объекта program массив аргументов
const { args } = program;
//первые два аргумента из массива аргументов присваиваем
const [file1, file2] = args;
//получаем объект параметрами, свойства его - указанные нами параметры(format).
const options = program.opts();
console.log(options.format)

function test (file1, file2, format='не указан') {
    console.log(`файл1 ${file1} файл2 ${file2}`);
    console.log(`формат ${format}` );

}

test(file1, file2, options.format)