module.exports = {
  name: `error`,
  description: `Сообщает пользователю об ошибке`,
  execute(cmd) {
    console.log(`Неизвестная команда ${cmd}.\nЧтобы прочитать правила использования приложения, наберите "--help"`);
  }
};
