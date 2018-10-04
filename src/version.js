const colors = require(`colors/safe`);
const {version} = require(`../package.json`);
const [major, minor, patch] = version.split(`.`);

module.exports = {
  name: `version`,
  description: `Показывает версию программы`,
  execute() {
    console.log(`${colors.red(major)}.${colors.green(minor)}.${colors.blue(patch)}`);
  }
};
