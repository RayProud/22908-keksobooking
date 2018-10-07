const shuffle = require(`lodash/shuffle`);

function generateAvatar() {
  return `https://robohash.org/${Math.random().toString(36).slice(2)}`;
}

function generateTitle() {
  const flatTitles = [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`];
  const flatTitlesLength = flatTitles.length;

  return flatTitles[Math.floor(Math.random() * flatTitlesLength)];
}

function generateLocation() {
  const xMin = 300;
  const xMax = 900;
  const yMin = 150;
  const yMax = 500;

  return {
    x: Math.floor(Math.random() * (xMax - xMin + 1)) + xMin,
    y: Math.floor(Math.random() * (yMax - yMin + 1)) + yMin,
  };
}

function generateDate() {
  const todayInUnix = Math.floor(+new Date() / 1000);
  const secondsInAMinute = 60;
  const minutesInAnHour = 60;
  const hoursInADay = 60;
  const daysSinceNow = 7;
  const dateSinceInUnix = todayInUnix - (secondsInAMinute * minutesInAnHour * hoursInADay * daysSinceNow);

  return Math.floor(Math.random() * (todayInUnix - dateSinceInUnix + 1)) + dateSinceInUnix;
}

function generatePrice() {
  const min = 1000;
  const max = 1000000;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateType() {
  const types = [`flat`, `palace`, `house`, `bungalo`];
  const typesLength = types.length;

  return types[Math.floor(Math.random() * typesLength)];
}

function generateRooms() {
  const min = 1;
  const max = 5;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGuests() {
  return Math.floor(Math.random() * 10);
}

function generateCheckin() {
  const checkinTimes = [`12:00`, `13:00`, `14:00`];
  const checkinTimesLength = checkinTimes.length;

  return checkinTimes[Math.floor(Math.random() * checkinTimesLength)];
}

function generateCheckout() {
  const checkoutTimes = [`12:00`, `13:00`, `14:00`];
  const checkoutTimesLength = checkoutTimes.length;

  return checkoutTimes[Math.floor(Math.random() * checkoutTimesLength)];
}

function generateFeatures() {
  const features = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  const featuresLength = features.length;

  return shuffle(features).slice(0, Math.floor(Math.random() * featuresLength));
}

function generatePhotos() {
  const photos = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];

  return shuffle(photos);
}

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
