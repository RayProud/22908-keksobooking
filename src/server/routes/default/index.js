const express = require(`express`);

const {corsMiddleware, errorMiddleware, notFoundMiddleware} = require(`../../middlewares`);
const defaultRoute = require(`./default`);
const defaultRouter = new express.Router();

corsMiddleware(defaultRouter);
defaultRoute(defaultRouter);
notFoundMiddleware(defaultRouter);
errorMiddleware(defaultRouter);

module.exports = defaultRouter;
