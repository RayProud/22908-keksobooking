module.exports = {
  title: {
    testType: `string`,
    isRequired: true,
    testLength: {
      min: 30,
      max: 140,
    }
  },
  type: {
    testType: `string`,
    isRequired: true,
    isOneOfValues: [`flat`, `palace`, `house`, `bungalo`],
  },
  price: {
    testType: `number`,
    isRequired: true,
    isInRange: {
      min: 1,
      max: 100000,
    }
  },
  address: {
    testType: `string`,
    isRequired: true,
    testLength: {
      min: 0,
      max: 100,
    },
    testMask: /^\d+,\s*\d+$/gi
  },
  checkin: {
    testType: `string`,
    isRequired: true,
    testMask: /^\d{2}:\d{2}$/gi
  },
  checkout: {
    testType: `string`,
    isRequired: true,
    testMask: /^\d{2}:\d{2}$/gi
  },
  rooms: {
    testType: `number`,
    isRequired: true,
    isInRange: {
      min: 0,
      max: 1000,
    }
  },
  features: {
    isArrayOfUniqueValues: true,
    isRequired: false,
    areManyOfValues: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  },
  avatar: {
    isImage: true,
    isRequired: false,
  },
  preview: {
    isImage: true,
    isRequired: false,
  },
  name: {
    testType: `string`,
    isRequired: false,
  },
};
