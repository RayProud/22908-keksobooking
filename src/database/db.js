const {MongoClient} = require(`mongodb`);

const URL = `mongodb://localhost:27017`;
const DB_NAME = `keksobooking`;

const db = MongoClient.connect(URL)
  .then((client) => client.db(DB_NAME))
  .catch((error) => {
    console.error(`Failed to conntect to ${DB_NAME} database`, error);
    process.exit(1);
  });

module.exports = db;
