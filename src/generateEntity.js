const shuffle = require(`lodash/shuffle`);
const {entity} = require(`./config`);

const SECS_IN_A_MINUTE = 60;
const MINS_IN_AN_HOUR = 60;
const HRS_IN_A_DAY = 60;

function getRandomNumberInRange(min, max, isInclusiveMax) {
  const maxValue = isInclusiveMax ? (max - min + 1) : (max - min);

  return Math.floor(Math.random() * maxValue) + min;
}

function generateAvatar() {
  return `https://robohash.org/${Math.random().toString(36).slice(2)}`;
}

function generateTitle() {
  const flatTitlesLength = entity.offer.flatTitles.length;

  return entity.offer.flatTitles[getRandomNumberInRange(0, flatTitlesLength)];
}

function generateLocation() {
  const {x, y} = entity.locationRange;

  return {
    x: getRandomNumberInRange(x.min, x.max, true),
    y: getRandomNumberInRange(y.min, y.max, true),
  };
}

function generateDate() {
  const todayInUnix = Math.floor(+new Date() / 1000);
  const {daysTillNow} = entity.date;
  const dateSinceInUnix = todayInUnix - (SECS_IN_A_MINUTE * MINS_IN_AN_HOUR * HRS_IN_A_DAY * daysTillNow);

  return getRandomNumberInRange(dateSinceInUnix, todayInUnix, true);
}

function generatePrice() {
  const {max, min} = entity.offer.price;

  return getRandomNumberInRange(max, min, true);
}

function generateType() {
  const {types} = entity.offer;
  const typesLength = entity.offer.types.length;

  return types[getRandomNumberInRange(0, typesLength)];
}

function generateRooms() {
  const {min, max} = entity.offer.rooms;

  return getRandomNumberInRange(min, max, true);
}

function generateGuests() {
  const {min, max} = entity.offer.guests;

  return getRandomNumberInRange(min, max, true);
}

function generateCheckin() {
  const {checkinTimes} = entity.offer;
  const checkinTimesLength = checkinTimes.length;

  return checkinTimes[getRandomNumberInRange(0, checkinTimesLength)];
}

function generateCheckout() {
  const {checkoutTimes} = entity.offer;
  const checkoutTimesLength = checkoutTimes.length;

  return checkoutTimes[getRandomNumberInRange(0, checkoutTimesLength)];
}

function generateFeatures() {
  const {features} = entity.offer;
  const featuresLength = features.length;

  return shuffle(features).slice(0, getRandomNumberInRange(0, featuresLength));
}

function generatePhotos() {
  const {photos} = entity.offer;

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
