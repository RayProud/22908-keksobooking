const Cursor = require(`../cursor-mock`);
const testEntities = require(`../test-data`);
const THE_BEST_MOCK_ID = 42;

class OffersStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getOffer(date) {
    return this.data.find((offer) => offer.date === +date);
  }

  async getAllOffers() {
    return new Cursor(this.data);

  }

  async save() {
    return {
      insertedId: THE_BEST_MOCK_ID
    };
  }

  async saveMany() {
  }
}

module.exports = new OffersStoreMock(testEntities);
