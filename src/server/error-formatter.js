const DEFAULT_ERROR_MESSAGE = `Server has fallen into unrecoverable problem.`;

function generateHtmlError(err) {
  const {
    errors = [],
  } = err;

  let errorMessage = err.errorMessage || DEFAULT_ERROR_MESSAGE;

  if (errors.length) {
    errorMessage = errors.reduce((prev, cur) => {
      const fieldName = `${cur.fieldName ? `${cur.fieldName} ` : ``}`;
      const currentErrMsg = fieldName + cur.errorMessage;

      return prev ? `${prev}, ${currentErrMsg}` : currentErrMsg;
    }, ``);
  }

  return errorMessage;
}

function generateJSONError(err) {
  const {
    code = 500,
    error = `Internal Error`,
    errors = [],
  } = err;

  const errorMessage = err.errorMessage || DEFAULT_ERROR_MESSAGE;

  return errors.length ? errors : [{code, error, errorMessage}];
}

module.exports = {
  generateHtmlError,
  generateJSONError,
};
