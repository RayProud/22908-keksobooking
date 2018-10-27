const {NotImplementedError} = require(`../errors`);

module.exports = (router) => {
  const NOT_IMPLEMENTED_HANDLER = (req, _res) => {
    throw new NotImplementedError(`${req.path} is not implemented yet`);
  };

  router.use(NOT_IMPLEMENTED_HANDLER);
};
