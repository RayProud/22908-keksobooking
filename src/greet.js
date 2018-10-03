const {name} = require(`../package.json`);
const greeting = `Привет пользователь!\nЭта программа будет запускать сервер «${name}».\nАвтор: Кекс.`;

module.exports = {
  name: `greet`,
  description: `Выводит приветственный текст, если не было передано параметров`,
  execute() {
    console.log(greeting);
  }
};
