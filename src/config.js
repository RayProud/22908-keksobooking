
const {isNil} = require(`../src/helpers/common`);

module.exports = {
  entity: {
    offer: {
      title: {
        values: [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`],
      },
      price: {
        min: 1000,
        max: 1000000,
      },
      type: {
        values: [`flat`, `palace`, `house`, `bungalo`],
      },
      guests: {
        min: 0,
        max: 10,
      },
      rooms: {
        min: 1,
        max: 5,
      },
      checkin: {
        values: [`12:00`, `13:00`, `14:00`],
      },
      checkout: {
        values: [`12:00`, `13:00`, `14:00`],
      },
      features: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
      photos: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`],
    },
    location: {
      x: {
        min: 300,
        max: 900,
      },
      y: {
        min: 150,
        max: 500,
      },
    },
    date: {
      daysTillNow: 7,
    },
  },
  /* eslint-disable consistent-return */
  validateRules: {
    type(fieldName, value, type) {
      if (type === `image`) {
        const {mimetype} = value;

        if (!mimetype || !(/image/gi.test(mimetype))) {
          return {
            fieldName,
            errorMessage: `should be image`,
            error: `Validation Error`,
          };
        }
      } else if (type === `set`) {
        const testSet = new Set(value);

        if (testSet.size !== value.length) {
          return {
            fieldName,
            errorMessage: `should be array of unique values`,
            error: `Validation Error`,
          };
        }
      } else if (typeof value !== type) {
        return {
          fieldName,
          errorMessage: `should be ${type}`,
          error: `Validation Error`,
        };
      }
    },
    isRequired(fieldName, value, isRequired) {
      if (isRequired && isNil(value)) {
        return {
          fieldName,
          errorMessage: `is required`,
          error: `Validation Error`,
        };
      }
    },
    length(fieldName, value, {min, max}) {
      if (value.length < min) {
        return {
          fieldName,
          errorMessage: `should be more than ${min}`,
          error: `Validation Error`,
        };
      } else if (value.length > max) {
        return {
          fieldName,
          errorMessage: `should be less than ${max}`,
          error: `Validation Error`,
        };
      }
    },
    oneOfValues(fieldName, value, allowedValues) {
      if (allowedValues.indexOf(value) === -1) {
        return {
          fieldName,
          errorMessage: `should be one of ${allowedValues}`,
          error: `Validation Error`,
        };
      }
    },
    manyOfValues(fieldName, values, allowedValues) {
      for (let i = 0; i < values.length; i++) {
        if (allowedValues.indexOf(values[i]) === -1) {
          return {
            fieldName,
            errorMessage: `only ${allowedValues} are allowed`,
            error: `Validation Error`,
          };
        }
      }
    },
    range(fieldName, value, {min, max}) {
      if (value < min) {
        return {
          fieldName,
          errorMessage: `should be more than ${min}`,
          error: `Validation Error`,
        };
      } else if (value > max) {
        return {
          fieldName,
          errorMessage: `should be less than ${max}`,
          error: `Validation Error`,
        };
      }
    },
    mask(fieldName, value, mask) {
      if (mask.test(value)) {
        return {
          fieldName,
          errorMessage: `doesn't fit the expected format`,
          error: `Validation Error`,
        };
      }
    }
  },
  /* eslint-enable consistent-return */
  offerScheme: {
    title: {
      type: `string`,
      isRequired: true,
      length: {
        min: 30,
        max: 140,
      }
    },
    type: {
      type: `string`,
      isRequired: true,
      oneOfValues: [`flat`, `palace`, `house`, `bungalo`],
    },
    price: {
      type: `number`,
      isRequired: true,
      range: {
        min: 1,
        max: 100000,
      }
    },
    address: {
      type: `string`,
      isRequired: true,
      length: {
        min: 0,
        max: 100,
      },
      mask: /^\d+,\s*\d+$/gi
    },
    checkin: {
      type: `string`,
      isRequired: true,
      mask: /^\d{2}:\d{2}$/gi
    },
    checkout: {
      type: `string`,
      isRequired: true,
      mask: /^\d{2}:\d{2}$/gi
    },
    rooms: {
      type: `number`,
      isRequired: true,
      range: {
        min: 0,
        max: 1000,
      }
    },
    features: {
      type: `set`,
      isRequired: false,
      manyOfValues: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
    },
    avatar: {
      type: `image`,
      isRequired: false,
    },
    preview: {
      type: `image`,
      isRequired: false,
    },
    name: {
      type: `string`,
      isRequired: false,
    },
  }
};
