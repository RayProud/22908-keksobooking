const {BadRequestError, NotFoundError} = require(`../../errors`);
const validate = require(`../../validation/validate`);
const {getOfferScheme} = require(`../../validation/schemes`);
const {asyncMiddleware} = require(`../../../helpers/common`);
const logger = require(`../../../logger`);

module.exports = (offersRouter) => {
  offersRouter.get(`/:date`, asyncMiddleware(async (req, res) => {
    const {date} = req.params;

    validate(req.params, getOfferScheme);

    const desiredOffer = await offersRouter.offersStore.getOffer(date);

    if (!desiredOffer) {
      throw new NotFoundError(`offer with date equals to ${date} wasn't found`);
    }

    res.send(desiredOffer);
  }));

  offersRouter.get(`/:date/avatar`, asyncMiddleware(async (req, res) => {
    const {date} = req.params;

    validate(req.params, getOfferScheme);

    const desiredOffer = await offersRouter.offersStore.getOffer(date);

    if (!desiredOffer) {
      throw new BadRequestError([{
        error: `Bad Request`,
        errorMessage: `there is no offer with date equals to ${date}`
      }]);
    }

    const avatar = await offersRouter.imageStore.get(desiredOffer._id);

    if (!avatar) {
      throw new NotFoundError(`offer with date equals to ${date} has no avatar`);
    }

    res.header(`Content-Type`, `image/jpg`);
    res.header(`Content-Length`, avatar.info.length);

    res.on(`error`, (e) => logger.error(e));
    res.on(`end`, () => res.end());

    const stream = avatar.stream;
    stream.on(`error`, (e) => logger.error(e));
    stream.on(`end`, () => res.end());
    stream.pipe(res);
  }));

};
