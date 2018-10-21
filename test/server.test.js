const request = require(`supertest`);
const assert = require(`assert`);

const app = require(`../src/commands/server`).execute();

function assertBodyAreNotNil(body) {
  const responseKeys = Object.keys(body);
  assert.ok(responseKeys.length > 0, `there should be lots of keys`);
  assert.ok(responseKeys.every((i) => body[i] !== undefined), `every key in the response object shouldn't represent undefined`);
}

/* eslint-disable max-nested-callbacks */
describe(`GET /randomMethod`, () => {
  it(`responds with 501 in application/json`, () => {
    return request(app)
      .get(`/randomUrl`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(501);
  });

  it(`responds with 501 in text/html`, () => {
    return request(app)
      .get(`/randomUrl`)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /text\/html/)
      .expect(501);
  });
});

describe(`GET /api/offers`, () => {
  it(`responds with an object of data, skip, limit and total`, () => {
    return request(app)
      .get(`/api/offers`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;
        const {skip, limit, total, data} = body;

        assertBodyAreNotNil(body);

        assert.ok(Array.isArray(data), `offers should be an array`);
        assert.ok(typeof skip === `number`, `skip should be number`);
        assert.ok(typeof limit === `number`, `limit should be number`);
        assert.ok(typeof total === `number`, `total should be number`);

        assert.deepEqual(skip, 0, `skip should be zero by default`);
        assert.deepEqual(limit, 20, `limit should be 20 by default`);
      });
  });

  it(`responds with an object where offers length less or equals to limit`, () => {
    return request(app)
      .get(`/api/offers`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;
        const {data, limit} = body;
        const offersLength = data.length;

        assertBodyAreNotNil(body);
        assert.ok(offersLength <= limit, `there is no chance offers length is more than limit param`);
      });
  });

  it(`?skip=5 responds with an object which is 5 element moved from ?skip=0`, async () => {
    const responseWithFiveSkiped = await request(app)
      .get(`/api/offers?skip=5`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => response.body.data);

    const responseWithZeroSkiped = await request(app)
      .get(`/api/offers`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => response.body.data);

    // date is unique in these data, so we can consider it as an id
    // @TODO: refactor using ids after MongoDB task
    assert.ok(responseWithFiveSkiped[0].date === responseWithZeroSkiped[5].date);
  });

  it(`?skip=5 responds with different skip`, () => {
    return request(app)
      .get(`/api/offers?skip=5`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;
        const {skip, limit} = body;

        assertBodyAreNotNil(body);

        assert.deepEqual(skip, 5);
        assert.deepEqual(limit, 20, `limit should be 20 by default`);
      });
  });

  it(`?limit=5 responds with different limit`, () => {
    return request(app)
      .get(`/api/offers?limit=5`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;
        const {skip, limit} = body;

        assertBodyAreNotNil(body);

        assert.deepEqual(skip, 0, `skip should be zero by default`);
        assert.deepEqual(limit, 5);
      });
  });

  it(`?limit=6&skip=10 responds with different limit and skip`, () => {
    return request(app)
      .get(`/api/offers?limit=6&skip=10`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;
        const {skip, limit} = body;

        assertBodyAreNotNil(body);

        assert.deepEqual(skip, 10);
        assert.deepEqual(limit, 6);
      });
  });

  it(`?skip=asd responds with Bad Request in application/json`, () => {
    return request(app)
      .get(`/api/offers?skip=asd`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(400)
      .then((response) => {
        const [firstError] = response.body;
        const {error, fieldName, errorMessage} = firstError;

        assert.deepEqual(error, `Validation Error`);
        assert.deepEqual(fieldName, `skip`);
        assert.deepEqual(errorMessage, `should be number`);
      });
  });

  it(`?skip=asd responds with Bad Request in text/html`, () => {
    return request(app)
      .get(`/api/offers?skip=asd`)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /text\/html/)
      .expect(400)
      .expect(`skip should be number`);
  });

  it(`?limit=&skip= responds with Bad Request in application/json`, () => {
    return request(app)
      .get(`/api/offers?limit=&skip=`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(400)
      .then((response) => {
        const [firstError, secondError] = response.body;

        assert.deepEqual(firstError.error, `Validation Error`);
        assert.deepEqual(firstError.fieldName, `limit`);
        assert.deepEqual(firstError.errorMessage, `should be number`);

        assert.deepEqual(secondError.error, `Validation Error`);
        assert.deepEqual(secondError.fieldName, `skip`);
        assert.deepEqual(secondError.errorMessage, `should be number`);
      });
  });

  it(`?limit=&skip= responds with Bad Request in text/html`, () => {
    return request(app)
      .get(`/api/offers?limit=&skip=`)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /html/)
      .expect(400)
      .expect(`limit should be number, skip should be number`);
  });
});

describe(`GET /api/offers/:date`, () => {
  const realMockDate = 1538317798;
  const randomMockDate = 1511110629;

  it(`with real date responds with an object with the same date which was in the request`, async () => {
    return request(app)
      .get(`/api/offers/${realMockDate}`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;
        const {date} = body;

        assertBodyAreNotNil(body);
        assert.deepEqual(realMockDate, date, `date in the response should be the same as it was in the request`);
      });
  });

  it(`with fake date responds with 404 Not Found in application/json`, async () => {
    return request(app)
      .get(`/api/offers/${randomMockDate}`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(404)
      .then((response) => {
        const [firstError] = response.body;
        const {error, errorMessage} = firstError;

        assert.deepEqual(error, `Not Found`);
        assert.deepEqual(errorMessage, `offer with date equals to ${randomMockDate} wasn't found`);
      });
  });

  it(`with fake date responds with 404 Not Found in text/html`, async () => {
    return request(app)
      .get(`/api/offers/${randomMockDate}`)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /text\/html/)
      .expect(404)
      .expect(`offer with date equals to ${randomMockDate} wasn't found`);
  });

  it(`with wrong date format responds with Bad Request in text/html`, () => {
    return request(app)
      .get(`/api/offers/sdlfj`)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /text\/html/)
      .expect(400)
      .expect(`date should be number`);
  });

  it(`with wrong date format responds with Bad Request in application/json`, () => {
    return request(app)
      .get(`/api/offers/sdlfj`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(400)
      .then((response) => {
        const [firstError] = response.body;

        assert.deepEqual(firstError.error, `Validation Error`);
        assert.deepEqual(firstError.fieldName, `date`);
        assert.deepEqual(firstError.errorMessage, `should be number`);
      });
  });
});

describe(`POST api/offers`, () => {
  const mockOffer = {
    author: {
      avatar: `https://robohash.org/skfejne`
    },
    offer: {
      title: `Некрасивый негостеприимный домик`,
      address: `310, 450`,
      price: 561653,
      type: `house`,
      rooms: 4,
      guests: 8,
      checkin: `12:00`,
      checkout: `13:00`,
      features: [
        `parking`,
        `wifi`,
        `dishwasher`
      ],
      description: ``,
      photos: [
        `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
        `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
        `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
      ]
    },
    location: {
      x: 310,
      y: 450
    },
    date: 1538484899
  };

  it(`responds with the same object in application/json`, () => {
    return request(app)
      .post(`/api/offers`)
      .send(mockOffer)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;

        assertBodyAreNotNil(body);
        assert.deepEqual(body, mockOffer);
      });
  });
});
/* eslint-enable max-nested-callbacks */
