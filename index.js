#!/usr/bin/env node

const path = require('path');
const fse = require('fs-extra');
const program = require('commander');
const ora = require('ora');
const inquirer = require('inquirer');

const initSpinner = ora('Initializing...');
const templatesDit = path.resolve(__dirname, 'templates');

// version
const packagePath = path.resolve(__dirname, 'package.json');
program.version(fse.readJsonSync(packagePath).version, '-v, --version');

// list
program
  .command('list')
  .description('View all template')
  .action(async() => {
    try {
      const templates = await fse.readdir(templatesDit);
      for (const template of templates) {
        console.log(template);
      }
    } catch (error) {
      console.error(error);
      process.exit();
    }
  });

// init
program
  .command('init')
  .description('Create a project with the template')
  .action(async (projectName) => {
    try {
      const exists = await fse.pathExists(projectName);

      if (exists) {
        console.log('The project already exists.');
        process.exit();
      }

      let templates = null;

      try {
        templates = await fse.readdir(templatesDit);
      } catch (error) {
        console.error(error);
        process.exit();
      }

      inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: `Select template`,
          choices: templates
        },
        {
          type: 'input',
          name: 'name',
          message: `Project name`,
          default: 'Vite project'
        }
      ]).then(async (answers) => {
        initSpinner.start();

        const { template, name } = answers;
        const templateDir = path.resolve(__dirname, `templates/${template}`);

        try {
          await fse.copy(templateDir, name);
          initSpinner.succeed();
          console.log(`
    To get started:

      cd ${name}
      yarn
      yarn run dev
        `);
        } catch (err) {
          console.error(err);
          initSpinner.fail();
          process.exit();
        }
      });
    } catch (err) {
      console.error(err);
      process.exit();
    }
  });

// // upgrade
// program
//   .command('upgrade')
//   .description(`upgrade the ${packageObj.name} version`)
//   .action(() => {
//     upgrade();
//   });

program.parse(process.argv);
