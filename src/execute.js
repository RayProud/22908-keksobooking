// будем считать, что эти команды — расширяемый функционал
const commands = require(`./commands/command-loader`);

// а эти три команды — стандартный набор и вообще исключительные случаи
const error = require(`./commands/error`);
const main = require(`./commands/main`);
const help = require(`./commands/help`);

function execute(cmd, otherKeys) {
  if (!cmd) {
    main.execute();
    return;
  }

  if (cmd === `help`) {
    help.execute();
    return;
  }

  try {
    commands[cmd].execute(...otherKeys);
  } catch (_) {
    error.execute(cmd);
    process.exit(1);
  }
}

module.exports = execute;
