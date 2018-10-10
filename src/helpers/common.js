function shuffle(array) {
  if (!Array.isArray(array)) {
    throw new TypeError(`Argument should be an array`);
  }

  const length = array.length;

  if (length <= 1) {
    return array;
  }

  const newArray = [...array];

  for (let i = 0; i < length; i++) {
    const j = getRandomNumberInRange(i, length);

    const tmp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = tmp;
  }

  return newArray;
}

function getRandomNumberInRange(min, max, isInclusiveMax) {
  const maxValue = isInclusiveMax ? (max - min + 1) : (max - min);

  return Math.floor(Math.random() * maxValue) + min;
}

function generateRandomString() {
  return Math.random().toString(36).slice(2);
}

function getRandomItemFromArray(array) {
  if (!Array.isArray(array)) {
    throw new TypeError(`Argument should be an array`);
  }

  const length = array.length;

  if (length <= 1) {
    return array;
  }

  return array[getRandomNumberInRange(0, length)];
}

function getRandomSample(array) {
  if (!Array.isArray(array)) {
    throw new TypeError(`Argument should be an array`);
  }

  const length = array.length;

  if (length <= 1) {
    return array;
  }

  return shuffle(array).slice(0, getRandomNumberInRange(0, length));
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = {
  shuffle,
  getRandomNumberInRange,
  generateRandomString,
  getRandomItemFromArray,
  getRandomSample,
  isNumeric,
};
