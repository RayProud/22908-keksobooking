const {entity} = require(`../config`);
const {
  shuffle,
  getRandomNumberInRange,
  generateRandomString,
  getRandomItemFromArray,
} = require(`./common`);

function generateAvatar() {
  return `https://robohash.org/${generateRandomString()}`;
}

function generateTitle() {
  const {flatTitles} = entity.offer;

  return getRandomItemFromArray(flatTitles);
}

function generateLocation() {
  const {x, y} = entity.locationRange;

  return {
    x: getRandomNumberInRange(x.min, x.max, true),
    y: getRandomNumberInRange(y.min, y.max, true),
  };
}

function generateDate() {
  // нужна только здесь, поэтому объявляю внутри функции
  const SECS_IN_A_DAY = 216000;
  const todayInUnix = Math.floor(Date.now() / 1000);
  const {daysTillNow} = entity.date;
  const dateSinceInUnix = todayInUnix - (SECS_IN_A_DAY * daysTillNow);

  return getRandomNumberInRange(dateSinceInUnix, todayInUnix, true);
}

function generatePrice() {
  const {max, min} = entity.offer.price;

  return getRandomNumberInRange(max, min, true);
}

function generateType() {
  const {types} = entity.offer;

  return getRandomItemFromArray(types);
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

  return getRandomItemFromArray(checkinTimes);
}

function generateCheckout() {
  const {checkoutTimes} = entity.offer;

  return getRandomItemFromArray(checkoutTimes);
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

module.exports = {
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
};
