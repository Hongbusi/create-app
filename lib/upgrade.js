const fse = require('fs-extra');
const updateNotifier = require('update-notifier');
const chalk = require('chalk');

const { packagePath } = require('./filePath');

const pkg = fse.readJsonSync(packagePath);

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000
});

function upgrade() {
  if (notifier.update) {
    console.log(`New version available: ${chalk.cyan(notifier.update.latest)}, it's recommended that you update before using.`);
    notifier.notify();
  } else {
    console.log('No new version is available.');
  }
};

module.exports = upgrade;