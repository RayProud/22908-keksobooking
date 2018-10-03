const {description} = require(`../package.json`);

module.exports = {
  name: `description`,
  description: `Показывает описание программы`,
  execute() {
    console.log(description);
  }
};
