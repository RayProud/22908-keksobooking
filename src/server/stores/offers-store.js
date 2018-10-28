const db = require(`../../database/db`);
const OFFERS_COLLECTION_NAME = `offers`;

const setupCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(OFFERS_COLLECTION_NAME);
  collection.createIndex({name: 1});
  return collection;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffer(date) {
    return (await this.collection).findOne({date: +date});
  }

  async getAllOffers() {
    return (await this.collection).find();
  }

  async save(offer) {
    return (await this.collection).insertOne(offer);
  }

  async saveMany(offers) {
    return (await this.collection).insertMany(offers);
  }
}

module.exports = new OffersStore(setupCollection().catch(`Couldn't connect to ${OFFERS_COLLECTION_NAME} collection`));
