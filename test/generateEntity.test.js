const generateEntity = require(`../src/generateEntity`);
const assert = require(`assert`);
const flatTitles = [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`];
const features = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const types = [`flat`, `palace`, `house`, `bungalo`];
const checkinTimes = [`12:00`, `13:00`, `14:00`];
const checkoutTimes = [`12:00`, `13:00`, `14:00`];
const photos = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];

/* eslint-disable max-nested-callbacks */
describe(`generateEntity`, () => {
  const entity = generateEntity();

  it(`should generate an object`, () => {
    assert.equal(typeof entity, `object`);
  });

  describe(`author`, () => {
    it(`should have an avatar property`, () => {
      assert.equal(typeof entity.author, `object`);
    });

    describe(`avatar`, () => {
      it(`should be a string`, () => {
        assert.equal(typeof entity.author.avatar, `string`);
      });

      it(`should start with http`, () => {
        assert.equal(entity.author.avatar.indexOf(`http`), 0);
      });
    });
  });

  describe(`offer`, () => {
    describe(`title`, () => {
      it(`should be string one of flatTitles list`, () => {
        assert.ok(flatTitles.includes(entity.offer.title), `${entity.offer.title} not in ${flatTitles} list`);
      });
    });

    describe(`address`, () => {
      it(`should consist of location.x and location.y`, () => {
        assert.equal(entity.offer.address, `${entity.location.x}, ${entity.location.y}`);
      });
    });

    describe(`price`, () => {
      it(`should be between 1 000 and 1 000 000`, () => {
        assert.equal(typeof entity.offer.price, `number`);
        assert.ok(entity.offer.price >= 1000);
        assert.ok(entity.offer.price <= 1000000);
      });
    });

    describe(`type`, () => {
      it(`should be string one of types list`, () => {
        assert.ok(types.includes(entity.offer.type), `${entity.offer.type} not in ${types} list`);
      });
    });

    describe(`rooms`, () => {
      it(`should be between 1 and 5`, () => {
        assert.equal(typeof entity.offer.rooms, `number`);
        assert.ok(entity.offer.rooms >= 1);
        assert.ok(entity.offer.rooms <= 5);
      });
    });

    describe(`guests`, () => {
      it(`should be number`, () => {
        assert.equal(typeof entity.offer.guests, `number`);
      });
    });

    describe(`checkin`, () => {
      it(`should be string one of checkinTimes list`, () => {
        assert.ok(checkinTimes.includes(entity.offer.checkin), `${entity.offer.checkin} not in ${checkinTimes} list`);
      });
    });

    describe(`checkout`, () => {
      it(`should be string one of checkoutTimes list`, () => {
        assert.ok(checkoutTimes.includes(entity.offer.checkout), `${entity.offer.checkout} not in ${checkoutTimes} list`);
      });
    });

    describe(`features`, () => {
      const offerFeatures = entity.offer.features;

      it(`should be an array`, () => {
        assert.equal(({}).toString.call(offerFeatures), `[object Array]`, `it's not an array`);
      });

      it(`should be an array of unique values`, () => {
        const map = offerFeatures.reduce((prev, cur) => {
          if (prev[cur]) {
            prev[cur] = prev[cur] + 1;
          } else {
            prev[cur] = 1;
          }

          return prev;
        }, {});
        console.log(`Object.values(map)`, Object.values(map));
        console.log(`map`, map);
        assert.ok(Object.values(map).every((i) => i === 1));
      });

      it(`elements should be items of features list`, () => {
        if (!offerFeatures.length) {
          return;
        }

        assert.ok(offerFeatures.every((i) => features.includes(i)));
      });
    });

    describe(`description`, () => {
      it(`should be string`, () => {
        assert.equal(typeof entity.offer.description, `string`);
      });
    });

    describe(`photos`, () => {
      const offerPhotos = entity.offer.photos;

      it(`should be an array`, () => {
        assert.equal(({}).toString.call(offerPhotos), `[object Array]`, `it's not an array`);
      });

      it(`elements should be items of photos list`, () => {
        if (!offerPhotos.length) {
          return;
        }

        assert.ok(offerPhotos.every((i) => photos.includes(i)));
      });
    });

  });

  describe(`location`, () => {
    it(`should have x and y properties`, () => {
      assert.equal(typeof entity.location, `object`);
    });

    describe(`x`, () => {
      it(`should be number between 300 and 900`, () => {
        assert.equal(typeof entity.location.x, `number`);
        assert.ok(entity.location.x >= 300, entity.location.x);
        assert.ok(entity.location.x <= 900, entity.location.x);
      });
    });

    describe(`y`, () => {
      it(`should be number between 150 and 500`, () => {
        assert.equal(typeof entity.location.x, `number`);
        assert.ok(entity.location.y >= 150, entity.location.y);
        assert.ok(entity.location.y <= 500, entity.location.y);
      });
    });
  });

  describe(`date`, () => {
    const nowInUnix = Math.floor(+new Date() / 1000);

    it(`should be number`, () => {
      assert.equal(typeof entity.date, `number`);
    });

    it(`should be earlier than now`, () => {
      assert.ok(entity.date < nowInUnix, `date is ${entity.date} which is later than now — ${nowInUnix}`);
    });

    it(`should be later than 7 days ago`, () => {
      const secondsInAMinute = 60;
      const minutesInAnHour = 60;
      const hoursInADay = 60;
      const daysSinceNow = 7;
      const potentialLagInSeconds = 10;
      const dateSinceInUnix = nowInUnix - (secondsInAMinute * minutesInAnHour * hoursInADay * daysSinceNow) - potentialLagInSeconds;

      assert.ok(entity.date > dateSinceInUnix, `date is ${entity.date} which is earlier than 7 days ago — ${dateSinceInUnix}`);
    });
  });
});
/* eslint-enable max-nested-callbacks */
