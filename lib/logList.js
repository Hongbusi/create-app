const fse = require('fs-extra');

const { configPath } = require('./filePath');

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
