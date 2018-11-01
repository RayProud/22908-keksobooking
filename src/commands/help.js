const colors = require(`colors/safe`);
const commands = require(`.`);

const description = Object.values(commands).reduce((prev, cur) => {
  return cur.name === `help` ? cur : `${prev}\n--${colors.grey(cur.name)} - ${colors.green(cur.description)}`;
}, `Доступные команды:`);

module.exports = {
  name: `help`,
  description,
  execute() {
    console.log(this.description);
  }
};
