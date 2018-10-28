const {BadRequestError} = require(`../errors`);
const validateRules = require(`./rules`);
const {isNumeric, isNil} = require(`../../helpers/common`);

function prepareForValidation(value, currentScheme) {
  // in case of multipart/form-data everything is a string
  // so we should check if it's numeric and should be numeric
  if (currentScheme.testType === `number` && isNumeric(value)) {
    return +value;
  }

  // the same problem with the only element of an array
  if (currentScheme.isArrayOfUniqueValues && typeof value === `string`) {
    return [value];
  }

  return value;
}

function validate(objToValidate, scheme) {
  const validatedObj = {};

  const errors = Object.keys(scheme).reduce((prev, key) => {
    let innerErrors = [];
    const currentScheme = scheme[key];

    const value = prepareForValidation(objToValidate[key], currentScheme);

    // no need to test a nil value which is not required
    if (isNil(value) && !currentScheme.isRequired) {
      return prev;
    }

    validatedObj[key] = value;

    const validationErrors = Object.keys(currentScheme).reduce((initialArray, rule) => {
      const schemeRequirement = currentScheme[rule];
      const validateRule = validateRules[rule];
      const maybeError = validateRule && validateRule(value, schemeRequirement);

      if (maybeError) {
        initialArray.push({
          errorMessage: maybeError,
          fieldName: key,
          error: `Validation Error`,
        });
      }

      return initialArray;
    }, []);

    innerErrors = validationErrors;

    return prev.concat(innerErrors);
  }, []);

  if (errors.length) {
    throw new BadRequestError(errors);
  }

  return validatedObj;
}

module.exports = validate;
