module.exports = {
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
    isArrayOfUniqueValues: true,
    isRequired: false,
    manyOfValues: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
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
    type: `string`,
    isRequired: false,
  },
};
