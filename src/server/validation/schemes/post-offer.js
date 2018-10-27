module.exports = {
  title: {
    isRequired: true,
    testType: `string`,
    testLength: {
      min: 30,
      max: 140,
    }
  },
  description: {
    testType: `string`,
    testLength: {
      min: 0,
      max: 1000,
    }
  },
  type: {
    isRequired: true,
    testType: `string`,
    isOneOfValues: [`flat`, `palace`, `house`, `bungalo`],
  },
  price: {
    isRequired: true,
    testType: `number`,
    isInRange: {
      min: 1,
      max: 100000,
    }
  },
  guests: {
    testType: `number`,
    isInRange: {
      min: 1,
      max: 100,
    }
  },
  address: {
    isRequired: true,
    testType: `string`,
    testLength: {
      min: 0,
      max: 100,
    },
    testMask: /^\d+,\s*\d+$/
  },
  checkin: {
    isRequired: true,
    testType: `string`,
    testMask: /^\d{2}:\d{2}$/
  },
  checkout: {
    isRequired: true,
    testType: `string`,
    testMask: /^\d{2}:\d{2}$/
  },
  rooms: {
    isRequired: true,
    testType: `number`,
    isInRange: {
      min: 0,
      max: 1000,
    }
  },
  features: {
    isArrayOfUniqueValues: true,
    areManyOfValues: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  },
  avatar: {
    isImage: true,
  },
  preview: {
    isImage: true,
  },
  name: {
    testType: `string`,
  },
};
