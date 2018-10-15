const ValidationError = require(`./errors/validation-error`);

const validate = (data) => {
  const errors = [];

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return data;
};

module.exports = validate;
