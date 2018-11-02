const fs = require(`fs`);
const {promisify} = require(`util`);
const readFile = promisify(fs.readFile);
const colors = require(`colors/safe`);

module.exports = {
  name: `fill`,
  description: `Fills the database with mock data`,
  async execute() {
    // require store here to prevent connect to the db without using execute function
    const {offersStore} = require(`../server/stores`);
    console.log(colors.blue(`This program grabs mock data from 'keksobooking/test/mocks/test-data.json'\n`));

    try {
      const mockStringData = await readFile(`${__dirname}/../../test/mocks/test-data.json`, {encoding: `utf-8`});
      const objectToSave = JSON.parse(mockStringData);

      await offersStore.saveMany(objectToSave);
      console.log(colors.green(`Done! Data were saved!'\n`));

      // close db connection
      process.exit(0);
    } catch (err) {
      if (err.code === `ENOENT`) {
        console.log(colors.red(`There is no 'keksobooking/test/mocks/test-data.json'.\n`));
        console.log(colors.green(`Please use this script with no flags to generate mock data\n`));

        // close db connection
        process.exit(0);
      }

      console.error(`We have an uncaught error!`, err);
      process.exit(1);
    }
  }
};
