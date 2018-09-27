const VERSION = 'v0.0.1';
const PROJECT_NAME = 'Кексобукинг';

const cmd = process.argv[2];

const helpMsg = `Доступные команды:
--help    — печатает этот текст;
--version — печатает версию приложения;`

const errorMsg = `Неизвестная команда ${cmd}.
Чтобы прочитать правила использования приложения, наберите "--help"`;

const noCmdMsg = `Привет пользователь!
Эта программа будет запускать сервер «${PROJECT_NAME}».
Автор: Кекс.`;

if (!cmd) {
  console.log(noCmdMsg);
  process.exit(0);
}

switch (cmd) {
  case '--help':
    console.log(helpMsg);
    process.exit(0);
  case '--version':
    console.log(VERSION);
    process.exit(0);
  default:
    console.error(errorMsg);
    process.exit(1);
}

