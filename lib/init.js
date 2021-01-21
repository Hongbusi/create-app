const fse = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const handlebars = require('handlebars');

const { configPath } = require('./filePath');

async function init(templateName, projectName) {
  try {
    const exists = await fse.pathExists(projectName);
    if (exists) {
			console.log(symbols.error, chalk.red('The project already exists.'));
		} else {
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
      ]).then(async (answers) => {
        const initSpinner = ora('Initializing project...');
        initSpinner.start();

        const templates = await fse.readJson(configPath);

        const downloadUrl = templates[templateName].downloadUrl;

        download(downloadUrl, projectName, { clone: true }, async (err) => {
          if (err) {
            initSpinner.fail();
            console.log(logSymbols.error, chalk.red(err));
            process.exit();
          }

          try {
            const packagePath = `${projectName}/package.json`;
            const packageContent = await fse.readFile(packagePath, 'utf-8');
            const packageResult = await handlebars.compile(packageContent)(answers);
            await fse.outputFile(packagePath, packageResult);
          } catch (error) {
            initSpinner.text = chalk.red(`Initialize project failed. ${err}`);
						initSpinner.fail();
						process.exit();
          }
          initSpinner.text = 'Initialize project successful.';
          initSpinner.succeed();
          console.log(`
  To get started:

	cd ${chalk.yellow(projectName)}
	${chalk.yellow('npm install')} or ${chalk.yellow('yarn install')}
	${chalk.yellow('npm run dev')} or ${chalk.yellow('yarn run dev')}
					`);
        });
      });
    }
  } catch (err) {
    console.error(err);
		process.exit();
  }
}

module.exports = init;