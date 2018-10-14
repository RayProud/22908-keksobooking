const request = require(`supertest`);
const assert = require(`assert`);

const app = require(`../src/commands/server`).execute();

describe(`GET /api/offers`, () => {
  it(`without params responds with json`, () => {
    return request(app)
      .get(`/api/offers`)
      .set(`Accept`, /json/)
      .expect(200)
      .then((response) => {
        const body = response.body;
        const offers = body.data;
        const offersLength = offers.length;
        const skip = body.skip;
        const limit = body.limit;
        const total = body.total;

        assert.ok(Array.isArray(offers), `offers should be an array`);
        assert.ok(offers.length > 0, `offers should have length more than zero`);
        assert.deepEqual(skip, 0);
        assert.deepEqual(limit, 20);
        assert.deepEqual(total, offersLength);
      });
  });

  it(`?skip=5 responds with different skip`, () => {
    return request(app)
      .get(`/api/offers?skip=5`)
      .set(`Accept`, /json/)
      .expect(200)
      .then((response) => {
        const skip = response.body.skip;

        assert.deepEqual(skip, 5);
      });
  });

  it(`?limit=5 responds with different limit`, () => {
    return request(app)
      .get(`/api/offers?limit=5`)
      .set(`Accept`, /json/)
      .expect(200)
      .then((response) => {
        const limit = response.body.limit;

        assert.deepEqual(limit, 5);
      });
  });
});
