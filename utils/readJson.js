const fse = require('fs-extra');

async function readJson(path) {
  try {
    return await fse.readJson(path);
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = readJson;