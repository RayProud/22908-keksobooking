const packageInfo = require(`../package.json`);

module.exports = {
  name: `version`,
  description: `Показывает версию программы`,
  execute() {
    console.log(packageInfo.version);
  }
};
