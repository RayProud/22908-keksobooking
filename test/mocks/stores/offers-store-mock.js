const Cursor = require(`../cursor-mock`);
const testEntities = require(`../test-data`);

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
      insertedId: 42
    };
  }

  async saveMany() {
  }
}

module.exports = new OffersStoreMock(testEntities);
