#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const ora = require('ora');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const { exec } = require('child_process');

const templates = require('./templates');

program.version('1.0.0');

program
  .command('init <template> <project>')
  .description('init project template')
  .action((templateName, projectName) => {
    if (fs.existsSync(projectName)) {
      console.log(logSymbols.error, chalk.red('Project already exists'));
      return;
    }

    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: `Project name`,
        default: projectName
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description '
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author '
      },
    ]).then((answers) => {
      const spinner = ora('Downloading template...').start();
      const { downloadUrl, url } = templates[templateName];
      download(downloadUrl, projectName, { clone: true }, (err) => {
        if (err) {
          spinner.fail();
          console.log(logSymbols.error, chalk.red(err));
          return;
        }

        const packagePath = `${projectName}/package.json`;
        const packageContent = fs.readFileSync(packagePath, 'utf-8');
        const packageResult = handlebars.compile(packageContent)(answers);
        fs.writeFileSync(packagePath, packageResult);

        exec(`cd ${projectName} && npm install`, (error) => {
          if (error) {
            console.log(logSymbols.error, chalk.red(error));
            return;
          }
          spinner.succeed();
          console.log(logSymbols.success, chalk.green('Project initialization finished!\n'));
          console.log('To get started:\n');
          console.log(chalk.yellow(`   cd ${projectName}`));
          console.log(chalk.yellow('   npm run dev\n'));
          console.log(`Documentation can be fount at ${url}\n\n`);
        });
      });
    });
  });

program
  .command('list')
  .description('view all templates')
  .action(() => {
    for (const key in templates) {
      console.log(chalk.red('  ★ '), `${key}  ${templates[key].description}`);
    }
  });

program.parse(process.argv);