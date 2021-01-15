#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer'); // 命令行交互
const download = require('download-git-repo');
const handlebars = require('handlebars'); // 模板解析
const ora = require('ora'); // loading 效果
const chalk = require('chalk'); // 粉笔
const logSymbols = require('log-symbols'); // icon
const { exec } = require('child_process'); // run cmd

const templates = require('./templates'); // 模板数据

program.version('1.0.0');

program
  .command('init <template> <project>')
  .description('init project template')
  .action((templateName, projectName) => {
    // 文件是否已存在
    if (fs.existsSync(projectName)) {
      console.log(logSymbols.error, chalk.red('Project already exists'));
      return;
    }

    // 命令行交互, 获取用户需要配置的信息
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
      const spinner = ora('Downloading template...').start(); // 启动 loading 效果
      const { downloadUrl, url } = templates[templateName];
      download(downloadUrl, projectName, { clone: true }, (err) => { // 下载存放在远程的 git 仓库代码
        if (err) {
          spinner.fail(); // loading -> fail
          console.log(logSymbols.error, chalk.red(err));
          return;
        }

        const packagePath = `${projectName}/package.json`;
        const packageContent = fs.readFileSync(packagePath, 'utf-8');
        const packageResult = handlebars.compile(packageContent)(answers); // 解析模板获得新的内容
        fs.writeFileSync(packagePath, packageResult); // 重新写入到 package.json

        exec(`cd ${projectName} && npm install`, (error) => { // 给模板安装 npm 包
          if (error) {
            console.log(logSymbols.error, chalk.red(error));
            return;
          }
          spinner.succeed(); // loading -> succeed
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
      console.log(chalk.red('  ★ '), `${key}  ${templates[key].description}`)
    }
  });

program.parse(process.argv);