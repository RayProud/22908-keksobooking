const VERSION = 'v0.0.1';
const PROJECT_NAME = 'Кексобукинг';

const cmd = process.argv[2];

const CommandsName = {
  help: '--help',
  version: '--version',
};

const commands = {
  [CommandsName.help]: {
    info: 'Доступные команды:\n--help    — печатает этот текст;\n--version — печатает версию приложения;',
    execute: function() {
      console.log(this.info);
    }
  },
  [CommandsName.version]: {
    info: VERSION,
    execute: function() {
      console.log(this.info);
    }
  },
  default: {
    info: `Привет пользователь!\nЭта программа будет запускать сервер «${PROJECT_NAME}».\nАвтор: Кекс.`,
    execute: function() {
      console.log(this.info);
    }
  },
  error: {
    info: `Неизвестная команда ${cmd}.\nЧтобы прочитать правила использования приложения, наберите "--help"`,
    execute: function() {
      console.log(this.info);
    }
  },
};

switch (cmd) {
  case undefined:
    commands.default.execute();
    break;
  case CommandsName.help:
  case CommandsName.version:
    commands[cmd].execute();
    break;
  default:
    commands.error.execute();
    process.exit(1);
}
