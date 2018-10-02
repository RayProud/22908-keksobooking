const commands = require(`./command-loader`);

const description = Object.values(commands).reduce((prev, cur) => {
  if (cur.name !== `help`) {
    return `${prev}\n--${cur.name} - ${cur.description}`;
  }
  return cur;
}, `Доступные команды:`);

module.exports = {
  name: `help`,
  description,
  execute() {
    console.log(this.description);
  }
};
