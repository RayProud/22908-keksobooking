const {
  generateAvatar,
  generateLocation,
  generateDate,
} = require(`../../../src/helpers/entity`);
const {
  shuffle,
  getRandomNumberInRange,
  getRandomItemFromArray,
  getRandomSample,
} = require(`../../../src/helpers/common`);

function generateEntity(entityConfig) {
  const {offer: {title, price, type, rooms, guests, checkin, checkout, features, photos}, date} = entityConfig;
  const location = generateLocation(entityConfig.location);

  return {
    author: {
      avatar: generateAvatar()
    },

    offer: {
      title: getRandomItemFromArray(title.values),
      address: `${location.x}, ${location.y}`,
      price: getRandomNumberInRange(price.max, price.min, true),
      type: getRandomItemFromArray(type.values),
      rooms: getRandomNumberInRange(rooms.max, rooms.min, true),
      guests: getRandomNumberInRange(guests.max, guests.min, true),
      checkin: getRandomItemFromArray(checkin.values),
      checkout: getRandomItemFromArray(checkout.values),
      features: getRandomSample(features),
      description: ``,
      photos: shuffle(photos),
    },

    location,

    date: generateDate(date)
  };
}

module.exports = generateEntity;
