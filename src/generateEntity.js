const {
  generateAvatar,
  generateTitle,
  generateLocation,
  generateDate,
  generatePrice,
  generateType,
  generateRooms,
  generateGuests,
  generateCheckin,
  generateCheckout,
  generateFeatures,
  generatePhotos,
} = require(`./helpers/entity`);

function generateEntity(entityConfig) {
  const {offer: {title, price, type, rooms, guests, checkin, checkout, features, photos}, date} = entityConfig;
  const location = generateLocation(entityConfig.location);

  return {
    author: {
      avatar: generateAvatar()
    },

    offer: {
      title: generateTitle(title),
      address: `${location.x}, ${location.y}`,
      price: generatePrice(price),
      type: generateType(type),
      rooms: generateRooms(rooms),
      guests: generateGuests(guests),
      checkin: generateCheckin(checkin),
      checkout: generateCheckout(checkout),
      features: generateFeatures(features),
      description: ``,
      photos: generatePhotos(photos),
    },

    location,

    date: generateDate(date)
  };
}

module.exports = generateEntity;
