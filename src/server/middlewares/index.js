const corsMiddleware = require(`./cors`);
const errorMiddleware = require(`./error`);
const notFoundMiddleware = require(`./not-found`);
const notImplementedMiddleware = require(`./not-implemented`);

module.exports = {
  corsMiddleware,
  errorMiddleware,
  notFoundMiddleware,
  notImplementedMiddleware,
};
