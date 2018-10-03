// хотел везде вставить 'use strict', а eslint ругается
// 'use strict' is unnecessary inside of modules
const userInput = process.argv[2];
const cmd = userInput && userInput.slice(2);
const execute = require(`./src/execute`);

execute(cmd);
