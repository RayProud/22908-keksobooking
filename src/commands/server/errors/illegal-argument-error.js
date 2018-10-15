class IllegalArgumentError extends Error {
  constructor(message) {
    super(message);

    this.code = 400;
    this.error = `Bad Request`;
    this.errorMessage = message;
  }
}

module.exports = IllegalArgumentError;
