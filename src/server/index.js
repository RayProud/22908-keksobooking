const colors = require(`colors`);
const {isNumeric} = require(`../helpers/common`);
const express = require(`express`);
const logger = require(`../logger`);

const {
  SERVER_PORT = 3000,
  SERVER_HOST = `localhost`
} = process.env;

module.exports = {
  name: `server`,
  description: `Runs the server`,
  execute(port = SERVER_PORT) {
    if (!isNumeric(port)) {
      logger.warn(colors.yellow(`'port' argument should be a number. The server will try to listen on ${SERVER_PORT} port.`));
    }

    // we hold the logic of running a server inside the execute function
    // to run the server only when we want it to run
    const app = express();
    const {offersStore, imagesStore} = require(`./stores`);
    const offersRouter = require(`./routes/offers`)(offersStore, imagesStore);
    const defaultRouter = require(`./routes/default`);

    app.disable(`x-powered-by`);

    app.use(`/api/offers`, offersRouter);
    app.use(`/`, defaultRouter);

    app.listen(port, () => logger.info(colors.green(`The server is listening on http://${SERVER_HOST}:${port}`)));

    return app;
  }
};
