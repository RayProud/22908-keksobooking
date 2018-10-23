module.exports = {
  title: {
    fitsType: `string`,
    isRequired: true,
    length: {
      min: 30,
      max: 140,
    }
  },
  type: {
    fitsType: `string`,
    isRequired: true,
    isOneOfValues: [`flat`, `palace`, `house`, `bungalo`],
  },
  price: {
    fitsType: `number`,
    isRequired: true,
    isInRange: {
      min: 1,
      max: 100000,
    }
  },
  address: {
    fitsType: `string`,
    isRequired: true,
    length: {
      min: 0,
      max: 100,
    },
    fitsMask: /^\d+,\s*\d+$/gi
  },
  checkin: {
    fitsType: `string`,
    isRequired: true,
    fitsMask: /^\d{2}:\d{2}$/gi
  },
  checkout: {
    fitsType: `string`,
    isRequired: true,
    fitsMask: /^\d{2}:\d{2}$/gi
  },
  rooms: {
    fitsType: `number`,
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
    fitsType: `string`,
    isRequired: false,
  },
};
