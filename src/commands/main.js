const readline = require(`readline`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const writeFile = promisify(fs.writeFile);
const colors = require(`colors/safe`);

const {name} = require(`../../package.json`);
const generateEntity = require(`../../test/mocks/generator/generate-entity`);
const {entity} = require(`../config`);
const {isNumeric} = require(`../helpers/common`);

const GREETING = `Hi there!\nThis program will run the server of «${name}».\n`;

module.exports = {
  name: `main`,
  description: `Shows greeting and offers to generate data`,
  async execute() {
    console.log(GREETING);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    async function askForAmount() {
      let entitiesCount = await askQuestion(colors.blue(`How many elements should we create?\n`));

      while (!isNumeric(entitiesCount)) {
        console.warn(colors.red(`Value should be a number. Try another time.\n`));
        entitiesCount = await askQuestion(colors.blue(`How many elements should we create?\n`));
      }

      return parseInt(entitiesCount, 10);
    }

    function checkAndWrite(fileDir, entities) {
      return writeFile(fileDir, JSON.stringify(entities), {flag: `wx`})
        .catch(async (err) => {
          if (err.code === `EEXIST`) {
            const sureToRewrite = await askQuestion(colors.yellow(`This file is already exist. Are you sure you want to rewrite it? (y/N)\n`));

            if (sureToRewrite.toLowerCase().startsWith(`y`)) {
              return writeFile(fileDir, JSON.stringify(entities));
            } else {
              // User doesn't want to rewrite file
              // There is no error, just exit
              return null;
            }
          }

          throw err;
        });
    }

    function askQuestion(question) {
      return new Promise((resolve) => rl.question(question, (answer) => resolve(answer)));
    }

    try {
      const entitiesCount = await askForAmount();
      const entities = Array.from({length: entitiesCount}, () => generateEntity(entity));
      const fileDir = await askQuestion(colors.blue(`Where to save?\n`));
      await checkAndWrite(fileDir, entities);
      console.log(colors.green(`Done!\n`));
    } catch (err) {
      console.error(colors.red(`Some problems with writing the file:\n`), err);
      process.exit(1);
    }

    console.log(`See ya next time!`);
    rl.close();
  }
};
