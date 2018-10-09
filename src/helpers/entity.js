const {
  shuffle,
  getRandomNumberInRange,
  generateRandomString,
  getRandomItemFromArray,
} = require(`./common`);

function generateAvatar() {
  return `https://robohash.org/${generateRandomString()}`;
}

function generateTitle(title) {
  const {values} = title;

  return getRandomItemFromArray(values);
}

function generateLocation(location) {
  const {x, y} = location;

  return {
    x: getRandomNumberInRange(x.min, x.max, true),
    y: getRandomNumberInRange(y.min, y.max, true),
  };
}

function generateDate(date) {
  // нужна только здесь, поэтому объявляю внутри функции
  const SECS_IN_A_DAY = 216000;
  const todayInUnix = Math.floor(Date.now() / 1000);
  const {daysTillNow} = date;
  const dateSinceInUnix = todayInUnix - (SECS_IN_A_DAY * daysTillNow);

  return getRandomNumberInRange(dateSinceInUnix, todayInUnix, true);
}

function generatePrice(price) {
  const {max, min} = price;

  return getRandomNumberInRange(max, min, true);
}

function generateType(type) {
  const {values} = type;

  return getRandomItemFromArray(values);
}

function generateRooms(rooms) {
  const {min, max} = rooms;

  return getRandomNumberInRange(min, max, true);
}

function generateGuests(guests) {
  const {min, max} = guests;

  return getRandomNumberInRange(min, max, true);
}

function generateCheckin(checkin) {
  const {values} = checkin;

  return getRandomItemFromArray(values);
}

function generateCheckout(checkout) {
  const {values} = checkout;

  return getRandomItemFromArray(values);
}

function generateFeatures(features) {
  const featuresLength = features.length;

  return shuffle(features).slice(0, getRandomNumberInRange(0, featuresLength));
}

function generatePhotos(photos) {
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
