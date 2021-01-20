const path = require('path');
const symbols = require('log-symbols');
const chalk = require('chalk');

const readJson = require('../utils/readJson');
const writeJson = require('../utils/writeJson');

const configPath = path.resolve(__dirname, '../config.json');

async function addTemplate(templateName, templateUrl) {
  try {
    let templates = await readJson(configPath);
    if (templates[templateName]) {
      console.log(symbols.error, chalk.red('Template already exists.'));
      process.exit();
    } else {
      templates[templateName] = {
        downloadUrl: templateUrl
      }
      await writeJson(configPath, templates);
      console.log(symbols.success, 'Add successful.');
    }
  } catch (err) {
    console.log(symbols.error, chalk.red(`Add failed. ${err}`));
    process.exit();
  }
}

module.exports = addTemplate;


