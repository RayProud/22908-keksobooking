const express = require(`express`);

const {corsMiddleware, notImplementedMiddleware, errorMiddleware} = require(`../../middlewares`);
const defaultRoute = require(`./default`);
const dateRoute = require(`./date`);

const offersRouter = new express.Router();

corsMiddleware(offersRouter);
defaultRoute(offersRouter);
dateRoute(offersRouter);
notImplementedMiddleware(offersRouter);
errorMiddleware(offersRouter);

module.exports = (offersStore, imagesStore) => {
  offersRouter.offersStore = offersStore;
  offersRouter.imageStore = imagesStore;
  return offersRouter;
};
