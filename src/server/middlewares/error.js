const {MongoError} = require(`mongodb`);
const {generateHtmlError, generateJSONError} = require(`../errors-formatter`);

module.exports = (router) => {
  const ERROR_HANDLER = (err, req, res, _next) => {
    if (err) {
      const doesAcceptHtml = req.accepts(`html`) === `html`;
      const errorMsg = doesAcceptHtml ? generateHtmlError(err) : generateJSONError(err);

      if (err instanceof MongoError) {
        res.status(400).json(err.message);
        return;
      }

      res
        .status(err.code)
        .send(errorMsg);
    }
  };

  router.use(ERROR_HANDLER);
};
