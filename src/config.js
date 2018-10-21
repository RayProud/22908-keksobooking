
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
  offerSchema: {
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
      values: [`flat`, `palace`, `house`, `bungalo`],
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
      values: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
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
