const {name} = require(`../../package.json`);
const readline = require(`readline`);
const greeting = `Привет пользователь!\nЭта программа будет запускать сервер «${name}».\nАвтор: Кекс.`;
const generateEntity = require(`../generate-entity`);
const entityDefaultConfig = require(`../config`).entity;
const fs = require(`fs`);
const {promisify} = require(`util`);
const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function askQuestion(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer)));
}

async function askForAmount() {
  const entitiesCount = await askQuestion(`How many elements should we create?\n`);

  if (!isNumeric(entitiesCount)) {
    console.log(`Value should be a number. Try another time.\n`);
    process.exit(1);
  }

  return parseInt(entitiesCount, 10);
}

async function checkAndWrite(fileDir, entities) {
  let shouldWrite = false;

  try {
    await access(fileDir);
    const sureToRewrite = await askQuestion(`This file is already exist. Are you sure you want to rewrite it? (y/N)\n`, rl);

    if (sureToRewrite.toLowerCase().startsWith(`y`)) {
      shouldWrite = true;
    }
  } catch (_) {
    shouldWrite = true;
  }

  if (shouldWrite) {
    try {
      await writeFile(fileDir, JSON.stringify(entities));
      console.log(`Done!\n`);
    } catch (e) {
      console.error(`Some problems with writing the file:`, e);
    }
  }
}

module.exports = {
  name: `greet`,
  description: `Выводит приветственный текст, если не было передано параметров`,
  async execute() {
    console.log(greeting);

    const entitiesCount = await askForAmount();
    const entities = Array(entitiesCount).fill(generateEntity(entityDefaultConfig));
    const fileDir = await askQuestion(`Where to save?\n`);

    await checkAndWrite(fileDir, entities);
    console.log(`See ya next time!`);
    rl.close();
  }
};
