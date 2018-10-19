const BadRequest = require(`./errors/bad-request-error`);
const {isNumeric, exists, isNil} = require(`../../helpers/common`);

const testMap = {
  numeric: {
    testFunc: isNumeric,
    failMessage: `should be number`,
  },
  exists: {
    testFunc: exists,
    failMessage: `is required`,
  }
};

const validate = (data, test) => {
  if (!Array.isArray(data) || !test) {
    return;
  }

  const errors = data.reduce((prev, i) => {
    const key = Object.keys(i)[0];

    if (!isNil(i[key]) && !testMap[test].testFunc(i[key])) {
      prev.push({
        error: `Validation Error`,
        fieldName: key,
        errorMessage: testMap[test].failMessage,
      });
    }

    return prev;
  }, []);

  if (errors.length) {
    throw new BadRequest(errors);
  }
};

module.exports = validate;
