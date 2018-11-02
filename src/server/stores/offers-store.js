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
    this._collection = collection;
  }

  async getAllOffers() {
    return (await this._collection).find();
  }

  async getOffer(date) {
    return (await this._collection).findOne({date: +date});
  }

  async save(offer) {
    return (await this._collection).insertOne(offer);
  }

  async saveMany(offers) {
    return (await this._collection).insertMany(offers);
  }
}

module.exports = new OffersStore(setupCollection().catch(`Couldn't connect to ${OFFERS_COLLECTION_NAME} collection`));
