#!/usr/bin/env node

const program = require('commander');

const logList = require('../lib/logList');
const upgrade = require('../lib/upgrade');
const addTemplate = require('../lib/addTemplate');
const removeTemplate = require('../lib/removeTemplate');

// version
program.version(require('../package.json').version, '-v, --version');

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
	.description(`check the ${require('../package.json').name} version`)
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
  .description('init a template')
  .action(() => {
    
  });
  
program.parse(process.argv);
