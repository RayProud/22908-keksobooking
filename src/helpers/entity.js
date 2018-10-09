const {
  getRandomNumberInRange,
  generateRandomString,
} = require(`./common`);

function generateAvatar() {
  return `https://robohash.org/${generateRandomString()}`;
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

module.exports = {
  generateAvatar,
  generateLocation,
  generateDate,
};
