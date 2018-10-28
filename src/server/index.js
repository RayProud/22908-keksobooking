const colors = require(`colors`);
const {isNumeric} = require(`../helpers/common`);
const express = require(`express`);
const app = express();

const {offersStore, imagesStore} = require(`./stores`);
const offersRouter = require(`./routes/offers`)(offersStore, imagesStore);
const defaultRouter = require(`./routes/default`);

app.disable(`x-powered-by`);

app.use(`/api/offers`, offersRouter);
app.use(`/`, defaultRouter);

module.exports = {
  name: `server`,
  description: `Runs the server`,
  execute(port = `3000`) {
    if (!isNumeric(port)) {
      console.warn(colors.yellow(`'port' argument should be a number. The server will try listen on 3000.`));
    }

    app.listen(port, () => console.log(colors.green(`The server is listening on ${port}`)));

    return app;
  }
};
