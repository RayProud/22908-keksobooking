const colors = require(`colors`);
const {isNumeric} = require(`../helpers/common`);
const {normalize} = require(`path`);
const express = require(`express`);
const app = express();
const offersRouter = require(`./server/routes/offers-router`);

app.use(express.static(normalize(`${__dirname}/../../static`)));
app.disable(`x-powered-by`);

app.use(`/api/offers`, offersRouter);

app.use((err, req, res, _next) => {
  if (err) {
    const {
      code = 500,
      error = `Internal Error`,
      errors = [],
    } = err;

    const doesAcceptHtml = req.accepts(`html`) === `html`;

    let errorMessage = err.errorMessage || `Server has fallen into unrecoverable problem.`;

    if (errors.length) {
      errorMessage = errors.reduce((prev, cur) => {
        const currentErrMsg = `${cur.fieldName} ${cur.errorMessage}`;

        return prev ? `${prev}, ${currentErrMsg}` : currentErrMsg;
      }, ``);
    }

    const errorsArray = errors.length ? errors : [{code, error, errorMessage}];

    res
      .status(code)
      .send(doesAcceptHtml ? errorMessage : errorsArray);
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
