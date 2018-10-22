const {isNil, isNumeric} = require(`../../../helpers/common`);

/* eslint-disable consistent-return */
module.exports = {
  isNumeric(value, shouldBeNumeric) {
    if (shouldBeNumeric && !isNumeric(value)) {
      return {
        errorMessage: `should be number`,
      };
    }
  },
  isArrayOfUniqueValues(value, shouldBeAnArrayOfUniqueValues) {
    const testSet = new Set(value);

    if (shouldBeAnArrayOfUniqueValues && testSet.size !== value.length) {
      return {
        errorMessage: `should be array of unique values`,
      };
    }
  },
  isImage(value, shouldBeAnImage) {
    const {mimetype} = value;

    if (shouldBeAnImage && (!mimetype || !(/image/gi.test(mimetype)))) {
      return {
        errorMessage: `should be image`,
      };
    }
  },
  type(value, type) {
    if (typeof value !== type) {
      return {
        errorMessage: `should be ${type}`,
      };
    }
  },
  isRequired(value, isRequired) {
    if (isRequired && isNil(value)) {
      return {
        errorMessage: `is required`,
      };
    }
  },
  length(value, {min, max}) {
    if (value.length < min) {
      return {
        errorMessage: `should be more than ${min}`,
      };
    } else if (value.length > max) {
      return {
        errorMessage: `should be less than ${max}`,
      };
    }
  },
  oneOfValues(value, allowedValues) {
    if (allowedValues.indexOf(value) === -1) {
      return {
        errorMessage: `should be one of ${allowedValues}`,
      };
    }
  },
  manyOfValues(values, allowedValues) {
    for (let i = 0; i < values.length; i++) {
      if (allowedValues.indexOf(values[i]) === -1) {
        return {
          errorMessage: `only ${allowedValues} are allowed`,
        };
      }
    }
  },
  range(value, {min, max}) {
    if (value < min) {
      return {
        errorMessage: `should be more than ${min}`,
      };
    } else if (value > max) {
      return {
        errorMessage: `should be less than ${max}`,
      };
    }
  },
  mask(value, mask) {
    if (mask.test(value)) {
      return {
        errorMessage: `doesn't fit the expected format`,
      };
    }
  }
};
/* eslint-enable consistent-return */
