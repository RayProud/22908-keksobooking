const generateEntity = require(`../src/generateEntity`);
const entityConfig = require(`../src/config`).entity;
const assert = require(`assert`);
const url = require(`url`);

const SECS_IN_A_DAY = 216000;
// entityInstance создаётся раньше этого теста, поэтому нужно учесть этот лаг
const POTENTIAL_LAG_IN_SECS = 10;

/* eslint-disable max-nested-callbacks */
describe(`generateEntity`, () => {
  let entityInstance;

  beforeEach(() => {
    entityInstance = generateEntity(entityConfig);
  });

  it(`should generate an object`, () => {
    assert.equal(typeof entityInstance, `object`);
  });

  describe(`author`, () => {
    it(`should have an avatar property`, () => {
      assert.equal(typeof entityInstance.author, `object`);
    });

    describe(`avatar`, () => {
      it(`should be a string`, () => {
        assert.equal(typeof entityInstance.author.avatar, `string`);
      });

      it(`protocol should start with http`, () => {
        const parsedAvatarUrl = url.parse(entityInstance.author.avatar);

        assert.ok(parsedAvatarUrl.protocol.startsWith(`http`));
      });

      it(`host should be`, () => {
        const parsedAvatarUrl = url.parse(entityInstance.author.avatar);

        assert.ok(parsedAvatarUrl.host);
      });
    });
  });

  describe(`offer`, () => {
    describe(`title`, () => {
      const {values} = entityConfig.offer.title;

      it(`should be string one of title values list`, () => {
        const {title} = entityInstance.offer;

        assert.ok(values.includes(title), `${title} not in ${values} list`);
      });
    });

    describe(`address`, () => {
      it(`should consist of location.x and location.y`, () => {
        assert.equal(entityInstance.offer.address, `${entityInstance.location.x}, ${entityInstance.location.y}`);
      });
    });

    describe(`price`, () => {
      const {min, max} = entityConfig.offer.price;

      it(`should be number`, () => {
        assert.equal(typeof entityInstance.offer.price, `number`);
      });

      it(`should be between ${min} and ${max}`, () => {
        assert.ok(entityInstance.offer.price >= min);
        assert.ok(entityInstance.offer.price <= max);
      });
    });

    describe(`type`, () => {
      const {values} = entityConfig.offer.type;

      it(`should be string one of type values list`, () => {
        assert.ok(values.includes(entityInstance.offer.type), `${entityInstance.offer.type} not in ${values} list`);
      });
    });

    describe(`rooms`, () => {
      const {min, max} = entityConfig.offer.rooms;

      it(`should be between ${min} and ${max}`, () => {
        assert.equal(typeof entityInstance.offer.rooms, `number`);
        assert.ok(entityInstance.offer.rooms >= min, entityInstance.offer.rooms);
        assert.ok(entityInstance.offer.rooms <= max, entityInstance.offer.rooms);
      });
    });

    describe(`guests`, () => {
      it(`should be number`, () => {
        assert.equal(typeof entityInstance.offer.guests, `number`);
      });
    });

    describe(`checkin`, () => {
      const {values} = entityConfig.offer.checkin;

      it(`should be string one of checkin list`, () => {
        assert.ok(values.includes(entityInstance.offer.checkin), `${entityInstance.offer.checkin} not in ${values} list`);
      });
    });

    describe(`checkout`, () => {
      const {values} = entityConfig.offer.checkout;

      it(`should be string one of checkout list`, () => {
        assert.ok(values.includes(entityInstance.offer.checkout), `${entityInstance.offer.checkout} not in ${values} list`);
      });
    });

    describe(`features`, () => {
      const featuresList = entityConfig.offer.features;

      it(`should be an array`, () => {
        assert.ok(Array.isArray(entityInstance.offer.features), `it's not an array`);
      });

      it(`should be an array of unique values`, () => {
        const featuresSet = new Set(entityInstance.offer.features);

        assert.equal(entityInstance.offer.features.length, featuresSet.size);
      });

      it(`elements should be items of features list`, () => {
        if (!entityInstance.offer.features.length) {
          return;
        }

        assert.ok(entityInstance.offer.features.every((i) => featuresList.includes(i)));
      });
    });

    describe(`description`, () => {
      it(`should be string`, () => {
        assert.equal(typeof entityInstance.offer.description, `string`);
      });
    });

    describe(`photos`, () => {
      const photosList = entityConfig.offer.photos;

      it(`should be an array`, () => {
        assert.ok(Array.isArray(entityInstance.offer.photos), `it's not an array`);
      });

      it(`elements should be items of photos list`, () => {
        if (!entityInstance.offer.photos.length) {
          return;
        }

        assert.ok(entityInstance.offer.photos.every((i) => photosList.includes(i)));
      });
    });

  });

  describe(`location`, () => {
    it(`should have x and y properties`, () => {
      assert.equal(typeof entityInstance.location, `object`);
    });

    describe(`x`, () => {
      it(`should be number`, () => {
        assert.equal(typeof entityInstance.location.x, `number`);
      });

      it(`should be number between ${entityConfig.location.x.min} and ${entityConfig.location.x.max}`, () => {
        assert.ok(entityInstance.location.x >= entityConfig.location.x.min, entityInstance.location.x);
        assert.ok(entityInstance.location.x <= entityConfig.location.x.max, entityInstance.location.x);
      });
    });

    describe(`y`, () => {
      it(`should be number`, () => {
        assert.equal(typeof entityInstance.location.y, `number`);
      });

      it(`should be number between ${entityConfig.location.y.min} and ${entityConfig.location.y.max}`, () => {
        assert.ok(entityInstance.location.y >= entityConfig.location.y.min, entityInstance.location.y);
        assert.ok(entityInstance.location.y <= entityConfig.location.y.max, entityInstance.location.y);
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
