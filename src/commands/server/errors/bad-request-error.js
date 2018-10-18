class BadRequest extends Error {
  constructor(errors) {
    super(`Bad Request`);

    this.code = 400;
    this.error = `Bad Request`;
    this.errors = errors;
  }
}

module.exports = BadRequest;
