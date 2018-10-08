const generateEntity = require(`../src/generateEntity`);
const entityConfig = require(`../src/config`).entity;
const assert = require(`assert`);
const url = require(`url`);

const SECS_IN_A_DAY = 216000;
// entityInstance создаётся раньше этого теста, поэтому нужно учесть этот лаг
const POTENTIAL_LAG_IN_SECS = 10;

/* eslint-disable max-nested-callbacks */
describe(`generateEntity`, () => {
  let entityInstance = generateEntity();

  beforeEach(() => {
    entityInstance = generateEntity();
  });

  it(`should generate an object`, () => {
    assert.equal(typeof entityInstance, `object`);
  });

  describe(`author`, () => {
    const {author} = entityInstance;

    it(`should have an avatar property`, () => {
      assert.equal(typeof author, `object`);
    });

    describe(`avatar`, () => {
      const {avatar} = author;

      it(`should be a string`, () => {
        assert.equal(typeof avatar, `string`);
      });

      const parsedAvatarUrl = url.parse(avatar);

      it(`protocol should start with http`, () => {
        assert.ok(parsedAvatarUrl.protocol.startsWith(`http`));
      });

      it(`host should be`, () => {
        assert.ok(parsedAvatarUrl.host);
      });
    });
  });

  describe(`offer`, () => {
    const {
      offer: {
        title,
        address,
        price,
        features,
        photos,
        type,
        rooms,
        guests,
        checkin,
        checkout,
        description
      },
      location
    } = entityInstance;

    describe(`title`, () => {
      const {values} = entityConfig.offer.title;

      it(`should be string one of title values list`, () => {
        assert.ok(values.includes(title), `${title} not in ${values} list`);
      });
    });

    describe(`address`, () => {
      it(`should consist of location.x and location.y`, () => {
        assert.equal(address, `${location.x}, ${location.y}`);
      });
    });

    describe(`price`, () => {
      const {min, max} = entityConfig.offer.price;

      it(`should be number`, () => {
        assert.equal(typeof price, `number`);
      });

      it(`should be between ${min} and ${max}`, () => {
        assert.ok(price >= min);
        assert.ok(price <= max);
      });
    });

    describe(`type`, () => {
      const {values} = entityConfig.offer.type;

      it(`should be string one of type values list`, () => {
        assert.ok(values.includes(type), `${type} not in ${values} list`);
      });
    });

    describe(`rooms`, () => {
      const {min, max} = entityConfig.offer.rooms;

      it(`should be between ${min} and ${max}`, () => {
        assert.equal(typeof rooms, `number`);
        assert.ok(rooms >= min, rooms);
        assert.ok(rooms <= max, rooms);
      });
    });

    describe(`guests`, () => {
      it(`should be number`, () => {
        assert.equal(typeof guests, `number`);
      });
    });

    describe(`checkin`, () => {
      const {checkinTimes} = entityConfig.offer;

      it(`should be string one of checkinTimes list`, () => {
        assert.ok(checkinTimes.includes(checkin), `${checkin} not in ${checkinTimes} list`);
      });
    });

    describe(`checkout`, () => {
      const {checkoutTimes} = entityConfig.offer;

      it(`should be string one of checkoutTimes list`, () => {
        assert.ok(checkoutTimes.includes(checkout), `${checkout} not in ${checkoutTimes} list`);
      });
    });

    describe(`features`, () => {
      const featuresList = entityConfig.offer.features;

      it(`should be an array`, () => {
        assert.ok(Array.isArray(features), `it's not an array`);
      });

      it(`should be an array of unique values`, () => {
        const featuresSet = new Set(features);

        assert.equal(features.length, featuresSet.size);
      });

      it(`elements should be items of features list`, () => {
        if (!features.length) {
          return;
        }

        assert.ok(features.every((i) => featuresList.includes(i)));
      });
    });

    describe(`description`, () => {
      it(`should be string`, () => {
        assert.equal(typeof description, `string`);
      });
    });

    describe(`photos`, () => {
      const photosList = entityConfig.offer.photos;

      it(`should be an array`, () => {
        assert.ok(Array.isArray(photos), `it's not an array`);
      });

      it(`elements should be items of photos list`, () => {
        if (!photos.length) {
          return;
        }

        assert.ok(photos.every((i) => photosList.includes(i)));
      });
    });

  });

  describe(`location`, () => {
    const {location} = entityInstance;

    it(`should have x and y properties`, () => {
      assert.equal(typeof location, `object`);
    });

    describe(`x`, () => {
      it(`should be number`, () => {
        assert.equal(typeof location.x, `number`);
      });

      it(`should be number between ${entityConfig.location.x.min} and ${entityConfig.location.x.max}`, () => {
        assert.ok(location.x >= entityConfig.location.x.min, location.x);
        assert.ok(location.x <= entityConfig.location.x.max, location.x);
      });
    });

    describe(`y`, () => {
      it(`should be number`, () => {
        assert.equal(typeof location.y, `number`);
      });

      it(`should be number between ${entityConfig.location.y.min} and ${entityConfig.location.y.max}`, () => {
        assert.ok(location.y >= entityConfig.location.y.min, location.y);
        assert.ok(location.y <= entityConfig.location.y.max, location.y);
      });
    });
  });

  describe(`date`, () => {
    const nowInUnix = Math.floor(Date.now() / 1000);
    const {date: {daysTillNow}} = entityConfig;

    it(`should be number`, () => {
      assert.equal(typeof entityInstance.date, `number`);
    });

    it(`should be earlier than now`, () => {
      assert.ok(entityInstance.date < nowInUnix, `date is ${entityInstance.date} which is later than now — ${nowInUnix}`);
    });

    it(`should be later than ${daysTillNow} days ago`, () => {
      const dateSinceInUnix = nowInUnix - (SECS_IN_A_DAY * daysTillNow) - POTENTIAL_LAG_IN_SECS;

      assert.ok(entityInstance.date > dateSinceInUnix, `date is ${entityInstance.date} which is earlier than ${daysTillNow} days ago — ${dateSinceInUnix}`);
    });
  });
});
/* eslint-enable max-nested-callbacks */
