const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const {
  DB_HOST = `localhost:27017`,
  DB_PATH = `keksobooking`
} = process.env;

const URL = `mongodb://${DB_HOST}`;

const db = MongoClient.connect(URL)
  .then((client) => client.db(DB_PATH))
  .catch((error) => {
    logger.error(`Failed to conntect to ${DB_PATH} database`, error);
    process.exit(1);
  });

module.exports = db;
