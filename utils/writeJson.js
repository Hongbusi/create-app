const fse = require('fs-extra');

async function writeJson(path, jsonObj) {
  try {
    await fse.writeJson(path, jsonObj);
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = writeJson;