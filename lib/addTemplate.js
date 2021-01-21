const fse = require('fs-extra');
const chalk = require('chalk');
const symbols = require('log-symbols');

const { configPath } = require('./filePath');

async function addTemplate(templateName, templateUrl) {
  try {
    let templates = await fse.readJson(configPath);
    if (templates[templateName]) {
      console.log(symbols.error, chalk.red('Template already exists.'));
    } else {
      templates[templateName] = {
        downloadUrl: templateUrl
      }
      await fse.writeJson(configPath, templates);
      console.log(symbols.success, 'Add successful.');
    }
  } catch (err) {
    console.log(symbols.error, chalk.red(`Add failed. ${err}`));
    process.exit();
  }
}

module.exports = addTemplate;


