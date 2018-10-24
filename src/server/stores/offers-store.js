const db = require(`../../database/db`);
const OFFERS_COLLECTION_NAME = `offers`;

const setupCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(OFFERS_COLLECTION_NAME);
  collection.createIndex({date: 1}, {unique: true});
  return collection;
};

class OfferStore {
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

module.exports = new OfferStore(setupCollection().catch(`Couldn't connect to ${OFFERS_COLLECTION_NAME} collection`));
