const {isNil, isNumeric, isArrayOfUniqueValues} = require(`../../../helpers/common`);

module.exports = {
  isNumeric(value) {
    if (!isNumeric(value)) {
      return {
        errorMessage: `should be number`,
      };
    }

    return null;
  },
  isArrayOfUniqueValues(value) {
    if (!isArrayOfUniqueValues(value)) {
      return {
        errorMessage: `should be array of unique values`,
      };
    }

    return null;
  },
  isImage(value) {
    const {mimetype} = value;

    if ((!mimetype || !(/image/gi.test(mimetype)))) {
      return {
        errorMessage: `should be image`,
      };
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
      return {
        errorMessage: `should be ${type}`,
      };
    }

    return null;
  },
  isRequired(value) {
    if (isNil(value)) {
      return {
        errorMessage: `is required`,
      };
    }

    return null;
  },
  testLength(value, {min, max}) {
    if (value.length < min) {
      return {
        errorMessage: `should be more than ${min}`,
      };
    } else if (value.length > max) {
      return {
        errorMessage: `should be less than ${max}`,
      };
    }

    return null;
  },
  isOneOfValues(value, allowedValues) {
    if (allowedValues.indexOf(value) === -1) {
      return {
        errorMessage: `should be one of ${allowedValues}`,
      };
    }

    return null;
  },
  areManyOfValues(values, allowedValues) {
    const isThereValueOutOfAllowed = values.some((i) => allowedValues.indexOf(i) === -1);

    if (isThereValueOutOfAllowed) {
      return {
        errorMessage: `only ${allowedValues} are allowed`,
      };
    }

    return null;
  },
  isInRange(value, {min, max}) {
    if (value < min) {
      return {
        errorMessage: `should be more than ${min}`,
      };
    } else if (value > max) {
      return {
        errorMessage: `should be less than ${max}`,
      };
    }

    return null;
  },
  testMask(value, testMask) {
    if (testMask.test(value)) {
      return {
        errorMessage: `doesn't fit the expected format`,
      };
    }

    return null;
  }
};
