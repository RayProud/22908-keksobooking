const {version} = require(`../package.json`);

module.exports = {
  name: `version`,
  description: `Показывает версию программы`,
  execute() {
    console.log(version);
  }
};
