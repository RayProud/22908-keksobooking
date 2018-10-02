const packageInfo = require(`../package.json`);

module.exports = {
  name: `license`,
  description: `Показывает лицензию, по которой можно использовать программу`,
  execute() {
    console.log(packageInfo.license);
  }
};
