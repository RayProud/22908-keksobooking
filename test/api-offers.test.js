const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const offersStoreMock = require(`./mocks/stores/offers-store-mock`);
const imagesStoreMock = require(`./mocks/stores/images-store-mock`);
const offersRouter = require(`../src/server/routes/offers`)(offersStoreMock, imagesStoreMock);

const app = express();
app.use(`/api/offers`, offersRouter);

function assertBodyAreNotNil(body) {
  const responseKeys = Object.keys(body);
  assert.ok(responseKeys.length > 0, `there should be lots of keys`);
  assert.ok(responseKeys.every((i) => body[i] !== undefined), `every key in the response object shouldn't represent undefined`);
}

/* eslint-disable max-nested-callbacks */
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
  describe(`with valid data`, () => {
    describe(`of JSON`, () => {
      it(`with name field responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          name: `Roman`,
          title: `Amazingly awful and not hospitable (just joking) house`,
          address: `310, 450`,
          price: 56653,
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
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 310,
                y: 450
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .send(mockRequestOffer)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });

      it(`without name field responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          title: `Random name just to test the api`,
          address: `500,100`,
          price: 100,
          type: `palace`,
          rooms: 1,
          guests: 2,
          checkin: `11:00`,
          checkout: `12:00`,
          features: [
            `parking`,
            `wifi`
          ],
          description: `Random description`,
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 500,
                y: 100
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .send(mockRequestOffer)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });

      it(`with the only feature value responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          title: `Random name just to test the api`,
          address: `500,100`,
          price: 100,
          type: `house`,
          rooms: 1000,
          guests: 12,
          checkin: `11:00`,
          checkout: `12:00`,
          features: [`parking`],
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 500,
                y: 100
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .send(mockRequestOffer)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });

      it(`without a feature field responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          title: `Random name just to test the api`,
          address: `500,100`,
          price: 100,
          type: `house`,
          rooms: 1000,
          guests: 12,
          checkin: `11:00`,
          checkout: `12:00`,
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 500,
                y: 100
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .send(mockRequestOffer)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });
    });

    describe(`of multipart/form-data`, () => {
      it(`with name field responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          name: `Roman`,
          title: `Amazingly awful and not hospitable (just joking) house`,
          address: `310, 450`,
          price: 56653,
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
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 310,
                y: 450
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`name`, mockRequestOffer.name)
        .field(`title`, mockRequestOffer.title)
        .field(`type`, mockRequestOffer.type)
        .field(`price`, mockRequestOffer.price)
        .field(`address`, mockRequestOffer.address)
        .field(`checkin`, mockRequestOffer.checkin)
        .field(`checkout`, mockRequestOffer.checkout)
        .field(`rooms`, mockRequestOffer.rooms)
        .field(`guests`, mockRequestOffer.guests)
        .field(`features`, mockRequestOffer.features)
        .field(`description`, mockRequestOffer.description)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });

      it(`without name field responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          title: `Random name just to test the api`,
          address: `500,100`,
          price: 100,
          type: `palace`,
          rooms: 1,
          guests: 2,
          checkin: `11:00`,
          checkout: `12:00`,
          features: [
            `parking`,
            `wifi`
          ],
          description: `Random description`,
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 500,
                y: 100
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`title`, mockRequestOffer.title)
        .field(`type`, mockRequestOffer.type)
        .field(`price`, mockRequestOffer.price)
        .field(`address`, mockRequestOffer.address)
        .field(`checkin`, mockRequestOffer.checkin)
        .field(`checkout`, mockRequestOffer.checkout)
        .field(`rooms`, mockRequestOffer.rooms)
        .field(`guests`, mockRequestOffer.guests)
        .field(`features`, mockRequestOffer.features)
        .field(`description`, mockRequestOffer.description)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });

      it(`with the only feature value responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          title: `Random name just to test the api`,
          address: `500,100`,
          price: 100,
          type: `house`,
          rooms: 1000,
          guests: 12,
          checkin: `11:00`,
          checkout: `12:00`,
          features: [`parking`],
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 500,
                y: 100
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`title`, mockRequestOffer.title)
        .field(`type`, mockRequestOffer.type)
        .field(`price`, mockRequestOffer.price)
        .field(`address`, mockRequestOffer.address)
        .field(`checkin`, mockRequestOffer.checkin)
        .field(`checkout`, mockRequestOffer.checkout)
        .field(`rooms`, mockRequestOffer.rooms)
        .field(`guests`, mockRequestOffer.guests)
        .field(`features`, mockRequestOffer.features)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });

      it(`without a feature field responds with a valid offer including a location field`, () => {
        const mockRequestOffer = {
          title: `Random name just to test the api`,
          address: `500,100`,
          price: 100,
          type: `house`,
          rooms: 1000,
          guests: 12,
          checkin: `11:00`,
          checkout: `12:00`,
        };

        const mockResponseOffer = Object.assign(
            {},
            mockRequestOffer,
            {
              location: {
                x: 500,
                y: 100
              }
            }
        );

        return request(app)
        .post(`/api/offers`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`title`, mockRequestOffer.title)
        .field(`type`, mockRequestOffer.type)
        .field(`price`, mockRequestOffer.price)
        .field(`address`, mockRequestOffer.address)
        .field(`checkin`, mockRequestOffer.checkin)
        .field(`checkout`, mockRequestOffer.checkout)
        .field(`rooms`, mockRequestOffer.rooms)
        .field(`guests`, mockRequestOffer.guests)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const {body} = response;

          assertBodyAreNotNil(body);
          assert.deepEqual(body, mockResponseOffer);
        });
      });
    });
  });

  describe(`with invalid data`, () => {
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

      it(`responds with error in json — price is required`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const priceError = response.body[2];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `is required`);
          });
      });

      it(`responds with error in json — price should be number`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const priceError = response.body[3];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `should be number`);
          });
      });

      it(`responds with error in json — address should be in format 'xxx, xxx', where xxx are numbers`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const addressError = response.body[4];

            assert.deepEqual(addressError.error, `Validation Error`);
            assert.deepEqual(addressError.fieldName, `address`);
            assert.deepEqual(addressError.errorMessage, `doesn't fit the expected format`);
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
            const checkinTypeError = response.body[5];

            assert.deepEqual(checkinTypeError.error, `Validation Error`);
            assert.deepEqual(checkinTypeError.fieldName, `checkin`);
            assert.deepEqual(checkinTypeError.errorMessage, `should be string`);
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
            const checkinTypeError = response.body[6];

            assert.deepEqual(checkinTypeError.error, `Validation Error`);
            assert.deepEqual(checkinTypeError.fieldName, `checkin`);
            assert.deepEqual(checkinTypeError.errorMessage, `doesn't fit the expected format`);
          });
      });

      it(`responds with error in json — checkout should be HH:mm`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const checkoutTypeError = response.body[7];

            assert.deepEqual(checkoutTypeError.error, `Validation Error`);
            assert.deepEqual(checkoutTypeError.fieldName, `checkout`);
            assert.deepEqual(checkoutTypeError.errorMessage, `doesn't fit the expected format`);
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
            const roomsError = response.body[8];

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
            const featuresError = response.body[9];

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
            const avatarError = response.body[10];

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
            const previewError = response.body[11];

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

      it(`responds with error in json — type is required`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const priceError = response.body[1];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `type`);
            assert.deepEqual(priceError.errorMessage, `is required`);
          });
      });

      it(`responds with error in json — type should be string`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const priceError = response.body[2];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `type`);
            assert.deepEqual(priceError.errorMessage, `should be string`);
          });
      });


      it(`responds with error in json — `, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const priceError = response.body[3];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `type`);
            assert.deepEqual(priceError.errorMessage, `should be one of flat,palace,house,bungalo`);
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
            const priceError = response.body[4];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `should be less than 100000`);
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
            const priceError = response.body[4];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `should be less than 100000`);
          });
      });

      it(`responds with error in json — checkout should fit HH:mm format`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => {
            const checkoutError = response.body[5];

            assert.deepEqual(checkoutError.error, `Validation Error`);
            assert.deepEqual(checkoutError.fieldName, `checkout`);
            assert.deepEqual(checkoutError.errorMessage, `doesn't fit the expected format`);
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
            const roomsError = response.body[6];

            assert.deepEqual(roomsError.error, `Validation Error`);
            assert.deepEqual(roomsError.fieldName, `rooms`);
            assert.deepEqual(roomsError.errorMessage, `should be more than 0`);
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
            const featuresError = response.body[7];

            assert.deepEqual(featuresError.error, `Validation Error`);
            assert.deepEqual(featuresError.fieldName, `features`);
            assert.deepEqual(featuresError.errorMessage, `should be array of unique values`);
          });
      });

      it(`responds with Bad Request in html`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(invalidOffer)
          .set(`Accept`, `text/html`)
          .expect(`Content-Type`, /text\/html/)
          .expect(`title should be more than 30, type should be one of flat,palace,house,bungalo, price is required, price should be number, address doesn\'t fit the expected format, checkin should be string, checkin doesn\'t fit the expected format, checkout doesn\'t fit the expected format, rooms should be less than 1000, features only wifi,dishwasher,parking,washer,elevator,conditioner are allowed, avatar should be image, preview should be image`)
          .expect(400);
      });

      it(`responds with Bad Request in html`, () => {
        return request(app)
          .post(`/api/offers`)
          .send(anotherInvalidOffer)
          .set(`Accept`, `text/html`)
          .expect(`Content-Type`, /text\/html/)
          .expect(`title should be less than 140, type is required, type should be string, type should be one of flat,palace,house,bungalo, price should be less than 100000, checkout doesn\'t fit the expected format, rooms should be more than 0, features should be array of unique values`)
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

      it(`responds with error in json — price is required`, () => {
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
            const priceError = response.body[2];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `is required`);
          });
      });

      it(`responds with error in json — price should be number`, () => {
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
            const priceError = response.body[3];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `should be number`);
          });
      });

      it(`responds with error in json — address should be in format 'xxx, xxx', where xxx are numbers`, () => {
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
            const addressError = response.body[4];

            assert.deepEqual(addressError.error, `Validation Error`);
            assert.deepEqual(addressError.fieldName, `address`);
            assert.deepEqual(addressError.errorMessage, `doesn't fit the expected format`);
          });
      });

      it(`responds with error in json — checkin should be HH:mm`, () => {
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
            const roomsError = response.body[5];

            assert.deepEqual(roomsError.error, `Validation Error`);
            assert.deepEqual(roomsError.fieldName, `checkin`);
            assert.deepEqual(roomsError.errorMessage, `doesn't fit the expected format`);
          });
      });

      it(`responds with error in json — checkout should be HH:mm`, () => {
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
            const featuresError = response.body[6];

            assert.deepEqual(featuresError.error, `Validation Error`);
            assert.deepEqual(featuresError.fieldName, `checkout`);
            assert.deepEqual(featuresError.errorMessage, `doesn't fit the expected format`);
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
            const roomsError = response.body[7];

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
            const featuresError = response.body[8];

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
            const avatarError = response.body[9];

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
            const previewError = response.body[10];

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

      it(`responds with error in json — type is required`, () => {
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
          const typeError = response.body[1];

          assert.deepEqual(typeError.error, `Validation Error`);
          assert.deepEqual(typeError.fieldName, `type`);
          assert.deepEqual(typeError.errorMessage, `is required`);
        });
      });

      it(`responds with error in json — type should be string`, () => {
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
          const typeError = response.body[2];

          assert.deepEqual(typeError.error, `Validation Error`);
          assert.deepEqual(typeError.fieldName, `type`);
          assert.deepEqual(typeError.errorMessage, `should be string`);
        });
      });

      it(`responds with error in json — type should be one of flat,palace,house,bungalo`, () => {
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
          const typeError = response.body[3];

          assert.deepEqual(typeError.error, `Validation Error`);
          assert.deepEqual(typeError.fieldName, `type`);
          assert.deepEqual(typeError.errorMessage, `should be one of flat,palace,house,bungalo`);
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
            const priceError = response.body[4];

            assert.deepEqual(priceError.error, `Validation Error`);
            assert.deepEqual(priceError.fieldName, `price`);
            assert.deepEqual(priceError.errorMessage, `should be less than 100000`);
          });
      });

      it(`responds with error in json — checkout should be HH:mm`, () => {
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
            const checkoutError = response.body[5];

            assert.deepEqual(checkoutError.error, `Validation Error`);
            assert.deepEqual(checkoutError.fieldName, `checkout`);
            assert.deepEqual(checkoutError.errorMessage, `doesn't fit the expected format`);
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
            const roomsError = response.body[6];

            assert.deepEqual(roomsError.error, `Validation Error`);
            assert.deepEqual(roomsError.fieldName, `rooms`);
            assert.deepEqual(roomsError.errorMessage, `should be more than 0`);
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
            const featuresError = response.body[7];

            assert.deepEqual(featuresError.error, `Validation Error`);
            assert.deepEqual(featuresError.fieldName, `features`);
            assert.deepEqual(featuresError.errorMessage, `should be array of unique values`);
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
          .expect(`title should be more than 30, type should be one of flat,palace,house,bungalo, price is required, price should be number, address doesn\'t fit the expected format, checkin doesn\'t fit the expected format, checkout doesn\'t fit the expected format, rooms should be less than 1000, features only wifi,dishwasher,parking,washer,elevator,conditioner are allowed, avatar should be image, preview should be image`)
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
          .attach(`avatar`, `${__dirname}/mocks/fixtures/keks.png`)
          .set(`Accept`, `text/html`)
          .expect(`Content-Type`, /text\/html/)
          .expect(`title should be less than 140, type is required, type should be string, type should be one of flat,palace,house,bungalo, price should be less than 100000, checkout doesn\'t fit the expected format, rooms should be more than 0, features should be array of unique values`)
          .expect(400);
      });
    });
  });
});

describe(`GET api/offers/:data/avatar`, () => {
  const realOfferDateWithAvatar = 1538317798;
  const realOfferDateWithoutAvatar = 1538544650;
  const notExistingOfferDate = 1511110629;

  // how to test it with no real DB?
  describe.skip(`with a valid date which has an avatar`, () => {
    it(`responds with an image`, async () => {
      return request(app)
        .get(`/api/offers/${realOfferDateWithAvatar}/avatar`)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /image/)
        .expect(200);
    });
  });

  describe(`with a valid date which has no avatar`, () => {
    it(`responds with Not Found in json`, async () => {
      return request(app)
        .get(`/api/offers/${realOfferDateWithoutAvatar}/avatar`)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(404)
        .then((response) => {
          const [firstError] = response.body;
          const {error, errorMessage} = firstError;

          assert.deepEqual(error, `Not Found`);
          assert.deepEqual(errorMessage, `offer with date equals to ${realOfferDateWithoutAvatar} has no avatar`);
        });
    });

    it(`responds with Not Found in html`, async () => {
      return request(app)
        .get(`/api/offers/${realOfferDateWithoutAvatar}/avatar`)
        .set(`Accept`, `text/html`)
        .expect(`Content-Type`, /text\/html/)
        .expect(`offer with date equals to ${realOfferDateWithoutAvatar} has no avatar`)
        .expect(404);
    });
  });

  describe(`with an invalid date`, () => {
    it(`responds with Bad Request in json`, async () => {
      return request(app)
        .get(`/api/offers/${notExistingOfferDate}/avatar`)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(400)
        .then((response) => {
          const [firstError] = response.body;
          const {error, errorMessage} = firstError;

          assert.deepEqual(error, `Bad Request`);
          assert.deepEqual(errorMessage, `there is no offer with date equals to ${notExistingOfferDate}`);
        });
    });

    it(`responds with Bad Request in html`, async () => {
      return request(app)
        .get(`/api/offers/${notExistingOfferDate}/avatar`)
        .set(`Accept`, `text/html`)
        .expect(`Content-Type`, /text\/html/)
        .expect(`there is no offer with date equals to ${notExistingOfferDate}`)
        .expect(400);
    });
  });
});
/* eslint-enable max-nested-callbacks */
