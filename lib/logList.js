const path = require('path');

const readJson = require('../utils/readJson');

const configPath = path.resolve(__dirname, '../config.json');

async function logList() {
  try {
    const templates = await readJson(configPath);
    for (const key in templates) {
      console.log(key);
    }
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = logList;
