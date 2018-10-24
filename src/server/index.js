const colors = require(`colors`);
const {isNumeric} = require(`../helpers/common`);
const {normalize} = require(`path`);
const express = require(`express`);
const app = express();
const offersRouter = require(`./routes/offers-router`);
const {generateHtmlError, generateJSONError} = require(`./errors-formatter`);
const NotImplementedError = require(`./errors/not-implemented-error`);

app.use(express.static(normalize(`${__dirname}/../../static`)));
app.disable(`x-powered-by`);

app.use(`/api/offers`, offersRouter);

app.use((req, _res) => {
  throw new NotImplementedError(`${req.path} is not implemented yet`);
});

app.use((err, req, res, _next) => {
  if (err) {
    const doesAcceptHtml = req.accepts(`html`) === `html`;
    const errorMsg = doesAcceptHtml ? generateHtmlError(err) : generateJSONError(err);

    res
      .status(err.code)
      .send(errorMsg);
  }
});

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
