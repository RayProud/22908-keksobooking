class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.code = 404;
    this.error = `Not Found`;
    this.errorMessage = message;
  }
}

module.exports = NotFoundError;
