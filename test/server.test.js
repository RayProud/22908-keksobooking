const request = require(`supertest`);
const assert = require(`assert`);

const app = require(`../src/server`).execute();

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
  it(`with data in json responds with the same object in application/json`, () => {
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

  it(`with text data in multipart/form-data responds with the same object in application/json`, () => {
    const testNameField = `A beautiful name`;
    const desiredResponse = {
      name: testNameField
    };

    return request(app)
      .post(`/api/offers`)
      .field(`name`, testNameField)
      .set(`Content-Type`, `multipart/form-data`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;

        assertBodyAreNotNil(body);
        assert.deepEqual(body, desiredResponse);
      });
  });

  it(`with img data in multipart/form-data responds with the same object in application/json`, () => {
    const testImgName = `keks.png`;
    const desiredResponse = {
      avatar: {
        name: testImgName,
        mimetype: `image/png`
      }
    };

    return request(app)
      .post(`/api/offers`)
      .attach(`avatar`, `${__dirname}/../mocks/${testImgName}`)
      .set(`Content-Type`, `multipart/form-data`)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(200)
      .then((response) => {
        const {body} = response;

        assertBodyAreNotNil(body);
        assert.deepEqual(body, desiredResponse);
      });
  });

  describe(`with wrong data`, () => {
    let invalidOffer;
    let anotherInvalidOffer;

    beforeEach(() => {
      invalidOffer = {
        title: `test title`,
        type: `studio`,
        address: `some, some`,
        checkin: 12,
        checkout: `tvelve`,
        rooms: 1200,
        features: [`fan`, `dishwasher`],
        avatar: `just string`,
        preview: 234,
      };

      anotherInvalidOffer = {
        title: `Very long title which does not fit because of its innumerous, fascinating and astonishing length we have never seen before in our entire lives`,
        price: 1000000,
        address: `0, 0`,
        checkin: `12:70`,
        checkout: ``,
        rooms: -1200,
        features: [`dishwasher`, `dishwasher`],
        name: `Boris`
      };
    });

    describe(`of JSON`, () => {
      it(`responds with error in json — title length should be in range between 30 and 140`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const titleError = response.body[0];

            assert.deepEqual(titleError.error, `Validation Error`);
            assert.deepEqual(titleError.fieldName, `title`);
            assert.deepEqual(titleError.errorMessage, `should be more than 30`);
          });
      });

      it(`responds with error in json — type should be one of allowed values`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const typeError = response.body[1];

            assert.deepEqual(typeError.error, `Validation Error`);
            assert.deepEqual(typeError.fieldName, `type`);
            assert.deepEqual(typeError.errorMessage, `should be one of flat,palace,house,bungalo`);
          });
      });

      it(`responds with error in json — checkin should be HH:mm`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const checkinTypeError = response.body[2];

            assert.deepEqual(checkinTypeError.error, `Validation Error`);
            assert.deepEqual(checkinTypeError.fieldName, `checkin`);
            assert.deepEqual(checkinTypeError.errorMessage, `should be string`);
          });
      });

      it(`responds with error in json — checkin rooms should be in range between 0 and 1000`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const roomsError = response.body[3];

            assert.deepEqual(roomsError.error, `Validation Error`);
            assert.deepEqual(roomsError.fieldName, `rooms`);
            assert.deepEqual(roomsError.errorMessage, `should be less than 1000`);
          });
      });

      it(`responds with error in json — features should be array of unique allowed values`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const featuresError = response.body[4];

            assert.deepEqual(featuresError.error, `Validation Error`);
            assert.deepEqual(featuresError.fieldName, `features`);
            assert.deepEqual(featuresError.errorMessage, `only wifi,dishwasher,parking,washer,elevator,conditioner are allowed`);
          });
      });

      it(`responds with error in json — avatar should be an image`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const avatarError = response.body[5];

            assert.deepEqual(avatarError.error, `Validation Error`);
            assert.deepEqual(avatarError.fieldName, `avatar`);
            assert.deepEqual(avatarError.errorMessage, `should be image`);
          });
      });

      it(`responds with error in json — preview should be an image`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const previewError = response.body[6];

            assert.deepEqual(previewError.error, `Validation Error`);
            assert.deepEqual(previewError.fieldName, `preview`);
            assert.deepEqual(previewError.errorMessage, `should be image`);
          });
      });

      it(`responds with error in json — title length should be in range between 30 and 140`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const titleError = response.body[0];

            assert.deepEqual(titleError.error, `Validation Error`);
            assert.deepEqual(titleError.fieldName, `title`);
            assert.deepEqual(titleError.errorMessage, `should be less than 140`);
          });
      });

      it(`responds with error in json — price should be in range between 1 and 100000`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const priceError = response.body[1];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `should be less than 100000`);
          });
      });

      it(`responds with error in json — address should be in format 'xxx, xxx', where xxx are numbers`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const addressError = response.body[2];

            assert.deepEqual(addressError.error, `Validation Error`);
            assert.deepEqual(addressError.fieldName, `address`);
            assert.deepEqual(addressError.errorMessage, `doesn't fit the expected format`);
          });
      });

      it(`responds with error in json — features should be array of unique allowed values`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const featuresError = response.body[3];

            assert.deepEqual(featuresError.error, `Validation Error`);
            assert.deepEqual(featuresError.fieldName, `features`);
            assert.deepEqual(featuresError.errorMessage, `should be array of unique values`);
          });
      });

      it(`responds with error in json — checkin rooms should be in range between 0 and 1000`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const roomsError = response.body[4];

            assert.deepEqual(roomsError.error, `Validation Error`);
            assert.deepEqual(roomsError.fieldName, `rooms`);
            assert.deepEqual(roomsError.errorMessage, `should be more than 0`);
          });
      });

      it(`responds with Bad Request in html`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `text/html`)
          .expect(`Content-Type`, /text\/html/)
          .expect(`title should be more than 30, type should be one of flat,palace,house,bungalo, checkin should be string, rooms should be less than 1000, features only wifi,dishwasher,parking,washer,elevator,conditioner are allowed, avatar should be image, preview should be image`)
          .expect(400);
      });

      it(`responds with Bad Request in html`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `text/html`)
          .expect(`Content-Type`, /text\/html/)
          .expect(`title should be less than 140, price should be less than 100000, address doesn\'t fit the expected format, checkin doesn\'t fit the expected format, rooms should be more than 0, features should be array of unique values`)
          .expect(400);
      });
    });

    describe(`of multipart/form-data`, () => {
      it(`responds with error in json — title length should be in range between 30 and 140`, () => {
        return request(app)
          .post(`/api/offers`)
                    .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, invalidOffer.title)
          .field(`type`, invalidOffer.type)
          .field(`address`, invalidOffer.address)
          .field(`checkin`, invalidOffer.checkin)
          .field(`checkout`, invalidOffer.checkout)
          .field(`rooms`, invalidOffer.rooms)
          .field(`features`, invalidOffer.features)
          .field(`avatar`, invalidOffer.avatar)
          .field(`preview`, invalidOffer.preview)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const titleError = response.body[0];

            assert.deepEqual(titleError.error, `Validation Error`);
            assert.deepEqual(titleError.fieldName, `title`);
            assert.deepEqual(titleError.errorMessage, `should be more than 30`);
          });
      });

      it(`responds with error in json — type should be one of allowed values`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, invalidOffer.title)
          .field(`type`, invalidOffer.type)
          .field(`address`, invalidOffer.address)
          .field(`checkin`, invalidOffer.checkin)
          .field(`checkout`, invalidOffer.checkout)
          .field(`rooms`, invalidOffer.rooms)
          .field(`features`, invalidOffer.features)
          .field(`avatar`, invalidOffer.avatar)
          .field(`preview`, invalidOffer.preview)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const typeError = response.body[1];

            assert.deepEqual(typeError.error, `Validation Error`);
            assert.deepEqual(typeError.fieldName, `type`);
            assert.deepEqual(typeError.errorMessage, `should be one of flat,palace,house,bungalo`);
          });
      });

      it(`responds with error in json — checkin rooms should be in range between 0 and 1000`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, invalidOffer.title)
          .field(`type`, invalidOffer.type)
          .field(`address`, invalidOffer.address)
          .field(`checkin`, invalidOffer.checkin)
          .field(`checkout`, invalidOffer.checkout)
          .field(`rooms`, invalidOffer.rooms)
          .field(`features`, invalidOffer.features)
          .field(`avatar`, invalidOffer.avatar)
          .field(`preview`, invalidOffer.preview)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const roomsError = response.body[2];

            assert.deepEqual(roomsError.error, `Validation Error`);
            assert.deepEqual(roomsError.fieldName, `rooms`);
            assert.deepEqual(roomsError.errorMessage, `should be less than 1000`);
          });
      });

      it(`responds with error in json — features should be array of unique allowed values`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, invalidOffer.title)
          .field(`type`, invalidOffer.type)
          .field(`address`, invalidOffer.address)
          .field(`checkin`, invalidOffer.checkin)
          .field(`checkout`, invalidOffer.checkout)
          .field(`rooms`, invalidOffer.rooms)
          .field(`features`, invalidOffer.features)
          .field(`avatar`, invalidOffer.avatar)
          .field(`preview`, invalidOffer.preview)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const featuresError = response.body[3];

            assert.deepEqual(featuresError.error, `Validation Error`);
            assert.deepEqual(featuresError.fieldName, `features`);
            assert.deepEqual(featuresError.errorMessage, `only wifi,dishwasher,parking,washer,elevator,conditioner are allowed`);
          });
      });

      it(`responds with error in json — avatar should be an image`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, invalidOffer.title)
          .field(`type`, invalidOffer.type)
          .field(`address`, invalidOffer.address)
          .field(`checkin`, invalidOffer.checkin)
          .field(`checkout`, invalidOffer.checkout)
          .field(`rooms`, invalidOffer.rooms)
          .field(`features`, invalidOffer.features)
          .field(`avatar`, invalidOffer.avatar)
          .field(`preview`, invalidOffer.preview)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const avatarError = response.body[4];

            assert.deepEqual(avatarError.error, `Validation Error`);
            assert.deepEqual(avatarError.fieldName, `avatar`);
            assert.deepEqual(avatarError.errorMessage, `should be image`);
          });
      });

      it(`responds with error in json — preview should be an image`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, invalidOffer.title)
          .field(`type`, invalidOffer.type)
          .field(`address`, invalidOffer.address)
          .field(`checkin`, invalidOffer.checkin)
          .field(`checkout`, invalidOffer.checkout)
          .field(`rooms`, invalidOffer.rooms)
          .field(`features`, invalidOffer.features)
          .field(`avatar`, invalidOffer.avatar)
          .field(`preview`, invalidOffer.preview)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const previewError = response.body[5];

            assert.deepEqual(previewError.error, `Validation Error`);
            assert.deepEqual(previewError.fieldName, `preview`);
            assert.deepEqual(previewError.errorMessage, `should be image`);
          });
      });

      it(`responds with error in json — title length should be in range between 30 and 140`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, anotherInvalidOffer.title)
          .field(`price`, anotherInvalidOffer.price)
          .field(`address`, anotherInvalidOffer.address)
          .field(`checkin`, anotherInvalidOffer.checkin)
          .field(`checkout`, anotherInvalidOffer.checkout)
          .field(`rooms`, anotherInvalidOffer.rooms)
          .field(`features`, anotherInvalidOffer.features)
          .field(`name`, anotherInvalidOffer.name)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const titleError = response.body[0];

            assert.deepEqual(titleError.error, `Validation Error`);
            assert.deepEqual(titleError.fieldName, `title`);
            assert.deepEqual(titleError.errorMessage, `should be less than 140`);
          });
      });

      it(`responds with error in json — price should be in range between 1 and 100000`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, anotherInvalidOffer.title)
          .field(`price`, anotherInvalidOffer.price)
          .field(`address`, anotherInvalidOffer.address)
          .field(`checkin`, anotherInvalidOffer.checkin)
          .field(`checkout`, anotherInvalidOffer.checkout)
          .field(`rooms`, anotherInvalidOffer.rooms)
          .field(`features`, anotherInvalidOffer.features)
          .field(`name`, anotherInvalidOffer.name)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const priceError = response.body[1];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `should be less than 100000`);
          });
      });

      it(`responds with error in json — address should be in format 'xxx, xxx', where xxx are numbers`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, anotherInvalidOffer.title)
          .field(`price`, anotherInvalidOffer.price)
          .field(`address`, anotherInvalidOffer.address)
          .field(`checkin`, anotherInvalidOffer.checkin)
          .field(`checkout`, anotherInvalidOffer.checkout)
          .field(`rooms`, anotherInvalidOffer.rooms)
          .field(`features`, anotherInvalidOffer.features)
          .field(`name`, anotherInvalidOffer.name)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const addressError = response.body[2];

            assert.deepEqual(addressError.error, `Validation Error`);
            assert.deepEqual(addressError.fieldName, `address`);
            assert.deepEqual(addressError.errorMessage, `doesn't fit the expected format`);
          });
      });

      it(`responds with error in json — features should be array of unique allowed values`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, anotherInvalidOffer.title)
          .field(`price`, anotherInvalidOffer.price)
          .field(`address`, anotherInvalidOffer.address)
          .field(`checkin`, anotherInvalidOffer.checkin)
          .field(`checkout`, anotherInvalidOffer.checkout)
          .field(`rooms`, anotherInvalidOffer.rooms)
          .field(`features`, anotherInvalidOffer.features)
          .field(`name`, anotherInvalidOffer.name)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const featuresError = response.body[3];

            assert.deepEqual(featuresError.error, `Validation Error`);
            assert.deepEqual(featuresError.fieldName, `features`);
            assert.deepEqual(featuresError.errorMessage, `should be array of unique values`);
          });
      });

      it(`responds with error in json — checkin rooms should be in range between 0 and 1000`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, anotherInvalidOffer.title)
          .field(`price`, anotherInvalidOffer.price)
          .field(`address`, anotherInvalidOffer.address)
          .field(`checkin`, anotherInvalidOffer.checkin)
          .field(`checkout`, anotherInvalidOffer.checkout)
          .field(`rooms`, anotherInvalidOffer.rooms)
          .field(`features`, anotherInvalidOffer.features)
          .field(`name`, anotherInvalidOffer.name)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const roomsError = response.body[4];

            assert.deepEqual(roomsError.error, `Validation Error`);
            assert.deepEqual(roomsError.fieldName, `rooms`);
            assert.deepEqual(roomsError.errorMessage, `should be more than 0`);
          });
      });

      it(`responds with Bad Request in html`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, invalidOffer.title)
          .field(`type`, invalidOffer.type)
          .field(`address`, invalidOffer.address)
          .field(`checkin`, invalidOffer.checkin)
          .field(`checkout`, invalidOffer.checkout)
          .field(`rooms`, invalidOffer.rooms)
          .field(`features`, invalidOffer.features)
          .field(`avatar`, invalidOffer.avatar)
          .field(`preview`, invalidOffer.preview)
          .set(`Accept`, `text/html`)
          .expect(`Content-Type`, /text\/html/)
          .expect(`title should be more than 30, type should be one of flat,palace,house,bungalo, rooms should be less than 1000, features only wifi,dishwasher,parking,washer,elevator,conditioner are allowed, avatar should be image, preview should be image`)
          .expect(400);
      });

      it(`responds with Bad Request in html`, () => {
        return request(app)
          .post(`/api/offers`)
          .set(`Content-Type`, `multipart/form-data`)
          .field(`title`, anotherInvalidOffer.title)
          .field(`price`, anotherInvalidOffer.price)
          .field(`address`, anotherInvalidOffer.address)
          .field(`checkin`, anotherInvalidOffer.checkin)
          .field(`checkout`, anotherInvalidOffer.checkout)
          .field(`rooms`, anotherInvalidOffer.rooms)
          .field(`features`, anotherInvalidOffer.features)
          .field(`name`, anotherInvalidOffer.name)
          .attach(`avatar`, `${__dirname}/../mocks/keks.png`)
          .set(`Accept`, `text/html`)
          .expect(`Content-Type`, /text\/html/)
          .expect(`title should be less than 140, price should be less than 100000, address doesn\'t fit the expected format, checkin doesn\'t fit the expected format, rooms should be more than 0, features should be array of unique values`)
          .expect(400);
      });
    });
  });
});

describe(`POST api/offers/randomUrl`, () => {
  const notImplementedUrl = `/api/offers/randomUrl`;

  it(`responds with Not Implemented in text/html`, () => {
    return request(app)
      .post(notImplementedUrl)
      .set(`Accept`, `text/html`)
      .expect(`Content-Type`, /text\/html/)
      .expect(501)
      .expect(`${notImplementedUrl} is not implemented yet`);
  });

  it(`responds with Not Implemented in application/json`, () => {
    return request(app)
      .post(notImplementedUrl)
      .set(`Accept`, `application/json`)
      .expect(`Content-Type`, /json/)
      .expect(501)
      .then((response) => {
        const [firstError] = response.body;

        assert.deepEqual(firstError.error, `Not Implemented`);
        assert.deepEqual(firstError.errorMessage, `${notImplementedUrl} is not implemented yet`);
      });
  });
});
/* eslint-enable max-nested-callbacks */
