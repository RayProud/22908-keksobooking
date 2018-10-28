const express = require(`express`);

module.exports = (defaultRouter) => {
  defaultRouter.use(express.static(`${__dirname}/../../../../static`));
};
