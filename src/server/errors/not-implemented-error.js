class NotImplementedError extends Error {
  constructor(message) {
    super(message);

    this.code = 501;
    this.error = `Not Implemented`;
    this.errorMessage = message;
  }
}

module.exports = NotImplementedError;
