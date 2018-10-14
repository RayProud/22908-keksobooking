const colors = require(`colors`);
const {isNumeric} = require(`../helpers/common`);
const {normalize} = require(`path`);
const express = require(`express`);
const app = express();

app.use(express.static(normalize(`${__dirname}/../../static`)));


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
