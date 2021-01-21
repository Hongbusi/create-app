const fse = require('fs-extra');
const chalk = require('chalk');
const symbols = require('log-symbols');

const { configPath, defaultConfigPath } = require('./filePath');

async function resetTemplate() {
  try {
    const defaultTemplates = await fse.readJson(defaultConfigPath);
    await fse.writeJson(configPath, defaultTemplates);
    console.log(symbols.success, 'Reset successful.');
  } catch (err) {
    console.log(symbols.error, chalk.red(`Reset failed. ${err}`));
    process.exit();
  }
}

module.exports = resetTemplate;