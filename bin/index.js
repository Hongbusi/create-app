#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const program = require('commander');

const logList = require('../lib/logList');
const upgrade = require('../lib/upgrade');
const addTemplate = require('../lib/addTemplate');
const removeTemplate = require('../lib/removeTemplate');
const init = require('../lib/init');

const packagePath = path.resolve(__dirname, '../package.json');

const packageObj = fse.readJsonSync(packagePath);

// version
program.version(packageObj.version, '-v, --version');

// list
program
  .command('list')
  .description('view all template')
  .action(() => {
    logList();
  });

// upgrade
program
	.command('upgrade')
	.description(`upgrade the ${packageObj.name} version`)
	.action(() => {
		upgrade();
	});

// add
program
	.command('add <template_name> <template_url>')
	.description('add a template')
	.action((templateName, templateUrl) => {
		addTemplate(templateName, templateUrl);
  });

// remove
program
  .command('remove <template_name>')
  .description('remove a template')
  .action((templateName) => {
    removeTemplate(templateName);
  });

// init
program
  .command('init <template_name> <project_name>')
  .description('create a project with the template')
  .action((templateName, projectName) => {
    init(templateName, projectName);
  });
  
program.parse(process.argv);
