// будем считать, что эти команды — расширяемый функционал
const commands = require(`./command-loader`);

// а эти три команды — стандартный набор и вообще исключительные случаи
const error = require(`./error`);
const greet = require(`./greet`);
const help = require(`./help`);

function execute(cmd) {
  if (!cmd) {
    greet.execute();
    return;
  }

  if (cmd === `help`) {
    help.execute();
    return;
  }

  try {
    commands[cmd].execute();
  } catch (_) {
    error.execute(cmd);
    process.exit(1);
  }
}

module.exports = execute;
