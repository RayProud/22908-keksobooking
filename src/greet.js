const packageInfo = require(`../package.json`);
const greeting = `Привет пользователь!\nЭта программа будет запускать сервер «${packageInfo.name}».\nАвтор: Кекс.`;

module.exports = {
  name: `greet`,
  description: `Выводит приветственный текст, если не было пердано параметров`,
  execute() {
    console.log(greeting);
  }
};
