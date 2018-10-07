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

function generateEntity() {
  const location = generateLocation();

  return {
    author: {
      avatar: generateAvatar()
    },

    offer: {
      title: generateTitle(),
      address: `${location.x}, ${location.y}`,
      price: generatePrice(),
      type: generateType(),
      rooms: generateRooms(),
      guests: generateGuests(),
      checkin: generateCheckin(),
      checkout: generateCheckout(),
      features: generateFeatures(),
      description: ``,
      photos: generatePhotos(),
    },

    location,

    date: generateDate()
  };
}

module.exports = generateEntity;
