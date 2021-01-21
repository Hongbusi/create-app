const path = require('path');
const fse = require('fs-extra');

const configPath = path.resolve(__dirname, '../config.json');

async function logList() {
  try {
    const templates = await fse.readJson(configPath);
    for (const key in templates) {
      console.log(key);
    }
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = logList;
