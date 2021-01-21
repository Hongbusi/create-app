const path = require('path');

const packagePath = path.resolve(__dirname, '../package.json');
const configPath = path.resolve(__dirname, '../config.json');
const defaultConfigPath = path.resolve(__dirname, '../config.json.example');

module.exports = {
  packagePath,
  configPath,
  defaultConfigPath
}