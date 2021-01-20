const path = require('path');
const symbols = require('log-symbols');
const chalk = require('chalk');

const readJson = require('../utils/readJson');
const writeJson = require('../utils/writeJson');

const configPath = path.resolve(__dirname, '../config.json');

async function removeTemplate(templateName) {
  try {
    let templates = await readJson(configPath);
    if (templates[templateName]) {
      delete templates[templateName];
      await writeJson(configPath, templates);
      console.log(symbols.success, 'Remove successful.');
    } else {
      console.log(symbols.error, chalk.red('Template does not exist.'));
      process.exit();
    }
  } catch (err) {
    console.log(symbols.error, chalk.red(`Add failed. ${err}`));
    process.exit();
  }
}

module.exports = removeTemplate;
