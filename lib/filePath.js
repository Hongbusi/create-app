const path = require('path');

const packagePath = path.resolve(__dirname, '../package.json');
const configPath = path.resolve(__dirname, '../config.json');

module.exports = {
  packagePath,
  configPath
}