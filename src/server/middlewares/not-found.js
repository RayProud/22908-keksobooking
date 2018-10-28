const {NotFoundError} = require(`../errors`);

module.exports = (router) => {
  const NOT_FOUND_HANDLER = (req, _res) => {
    throw new NotFoundError(`${req.path} not found`);
  };

  router.use(NOT_FOUND_HANDLER);
};
