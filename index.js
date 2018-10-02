// хотел везде вставить 'use strict', а eslint ругается
// 'use strict' is unnecessary inside of modules
const cmd = process.argv[2] && process.argv[2].slice(2);
const commandExecutor = require(`./src/command-executor`);

commandExecutor(cmd);
