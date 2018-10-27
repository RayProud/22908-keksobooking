const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const defaultRouter = require(`../src/server/routes/default`);

const app = express();
app.use(`/`, defaultRouter);

describe(`GET /`, () => {
  it(`responds with 200 and html data`, async () => {
    return request(app)
      .get(`/`)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /html/)
      .expect(200);
  });
});

describe(`GET /randomUrl`, () => {
  const randomUrl = `/randomUrl`;

  it(`responds with 404 status and description in html`, async () => {
    return request(app)
      .get(randomUrl)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /html/)
      .expect(404)
      .expect(`${randomUrl} not found`);
  });

  it(`responds with 404 status and description in json`, async () => {
    return request(app)
      .get(randomUrl)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(404)
      .then((response) => {
        const [firstError] = response.body;

        assert.deepEqual(firstError.error, `Not Found`);
        assert.deepEqual(firstError.errorMessage, `/randomUrl not found`);
      });
  });
});
