const {isNil, isNumeric, isArrayOfUniqueValues} = require(`../../../helpers/common`);

module.exports = {
  isNumeric(value) {
    if (!isNumeric(value)) {
      return `should be number`;
    }

    return null;
  },
  isArrayOfUniqueValues(value) {
    if (!isArrayOfUniqueValues(value)) {
      return `should be array of unique values`;
    }

    return null;
  },
  isImage(value) {
    const {mimetype} = value;

    if ((!mimetype || !(/image/gi.test(mimetype)))) {
      return `should be image`;
    }

    return null;
  },
  testType(value, type) {
    // in case of multipart/form-data everything is a string
    // so we should check if it's numeric and should be numeric
    if (type === `number` && isNumeric(value)) {
      value = +value;
    }

    if (typeof value !== type) {
      return `should be ${type}`;
    }

    return null;
  },
  isRequired(value) {
    if (isNil(value)) {
      return `is required`;
    }

    return null;
  },
  testLength(value, {min, max}) {
    if (value.length < min) {
      return `should be more than ${min}`;
    } else if (value.length > max) {
      return `should be less than ${max}`;
    }

    return null;
  },
  isOneOfValues(value, allowedValues) {
    if (allowedValues.indexOf(value) === -1) {
      return `should be one of ${allowedValues}`;
    }

    return null;
  },
  areManyOfValues(values, allowedValues) {
    const isThereValueOutOfAllowed = values.some((i) => allowedValues.indexOf(i) === -1);

    if (isThereValueOutOfAllowed) {
      return `only ${allowedValues} are allowed`;
    }

    return null;
  },
  isInRange(value, {min, max}) {
    if (value < min) {
      return `should be more than ${min}`;
    } else if (value > max) {
      return `should be less than ${max}`;
    }

    return null;
  },
  testMask(value, testMask) {
    if (testMask.test(value)) {
      return `doesn't fit the expected format`;
    }

    return null;
  }
};
