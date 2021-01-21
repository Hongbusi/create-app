const fse = require('fs-extra');
const chalk = require('chalk');
const symbols = require('log-symbols');

const { configPath } = require('./filePath');

async function removeTemplate(templateName) {
  try {
    let templates = await fse.readJson(configPath);
    if (templates[templateName]) {
      delete templates[templateName];
      await fse.writeJson(configPath, templates);
      console.log(symbols.success, 'Remove successful.');
    } else {
      console.log(symbols.error, chalk.red('Template does not exist.'));
    }
  } catch (err) {
    console.log(symbols.error, chalk.red(`Add failed. ${err}`));
    process.exit();
  }
}

module.exports = removeTemplate;
