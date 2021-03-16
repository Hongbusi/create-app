const fse = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const handlebars = require('handlebars');

const { configPath } = require('./filePath');

const initSpinner = ora('Initializing project...');

function downloadTemplate(downloadUrl, projectName, answers) {
  download(downloadUrl, projectName, { clone: true }, (err) => {
    if (err) {
      initSpinner.fail();
      console.log(logSymbols.error, chalk.red(err));
      process.exit();
    }
    updateProjectConfig(projectName, answers);
  });
}

async function updateProjectConfig(projectName, answers) {
  try {
    const packagePath = `${projectName}/package.json`;
    const packageContent = await fse.readFile(packagePath, 'utf-8');
    const packageResult = await handlebars.compile(packageContent)(answers);
    await fse.outputFile(packagePath, packageResult);
  } catch (err) {
    initSpinner.text = chalk.red(`Initialize project failed. ${err}`);
    initSpinner.fail();
    process.exit();
  }

  initAfter(projectName);
}

function initAfter(projectName) {
  initSpinner.text = 'Initialize project successful.';
  initSpinner.succeed();
  console.log(`
    To get started:

    cd ${chalk.yellow(projectName)}
    ${chalk.yellow('npm install')} or ${chalk.yellow('yarn')}
    ${chalk.yellow('npm run dev')} or ${chalk.yellow('yarn run dev')}
  `);
}

function getTemplateList(templates) {
  const templateList = [];
  for (const key in templates) {
    templateList.push({ name: key });
  }
  return templateList;
}

async function init(projectName) {
  try {
    const exists = await fse.pathExists(projectName);
    const templates = await fse.readJson(configPath);

    if (exists) {
      console.log(symbols.error, chalk.red('The project already exists.'));
      process.exit();
    }

    inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: `Select template`,
        choices: getTemplateList(templates)
      },
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
      initSpinner.start();

      const downloadUrl = templates[answers.template].downloadUrl;
      downloadTemplate(downloadUrl, projectName, answers);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = init;
