const BadRequest = require(`../errors/bad-request-error`);
const {isNumeric, exists, isNil} = require(`../../../helpers/common`);
const validateRules = require(`./rules`);

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

function validateUsingAScheme(objToValidate, scheme) {
  const errors = Object.keys(objToValidate).reduce((prev, key) => {
    let innerErrors = [];
    const value = objToValidate[key];
    const currentScheme = scheme[key];

    if (currentScheme) {
      const validationErrors = Object.keys(currentScheme).reduce((initialArray, rule) => {
        const schemeRequirement = currentScheme[rule];
        const validateRule = validateRules[rule];
        const maybeError = validateRule && validateRule(value, schemeRequirement);

        if (maybeError) {
          initialArray.push(Object.assign(
              {},
              maybeError,
              {
                fieldName: key,
                error: `Validation Error`,
              }
          ));
        }

        return initialArray;
      }, []);

      innerErrors = validationErrors;
    }

    return prev.concat(innerErrors);
  }, []);

  if (errors.length) {
    throw new BadRequest(errors);
  }
}

module.exports = {
  validate,
  validateUsingAScheme,
};
