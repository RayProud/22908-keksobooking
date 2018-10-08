
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
      checkinTimes: [`12:00`, `13:00`, `14:00`],
      checkoutTimes: [`12:00`, `13:00`, `14:00`],
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
  }
};
