const express = require(`express`);
const offersRouter = express.Router(); /* eslint-disable-line new-cap */
const multer = require(`multer`);

const upload = multer({storage: multer.memoryStorage()});

const NotFoundError = require(`../errors/not-found-error`);
const BadRequest = require(`../errors/bad-request-error`);
const validate = require(`../validation/validate`);
const {postOfferScheme, getOffersScheme, getOfferScheme} = require(`../validation/schemes`);
const offersStore = require(`../stores/offers-store`);
const {asyncMiddleware} = require(`../../helpers/common`);

const jsonParser = express.json();

const DEFAULT_SKIP_AMOUNT = 0;
const DEFAULT_LIMIT_AMOUNT = 20;

const toPage = async (cursor, skip = DEFAULT_SKIP_AMOUNT, limit = DEFAULT_LIMIT_AMOUNT) => {
  const data = await cursor.skip(skip).limit(limit).toArray();

  return {
    data,
    limit,
    skip,
    total: await cursor.count(),
  };
};

offersRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const {limit, skip} = req.query;

  validate(req.query, getOffersScheme);

  const from = +skip || DEFAULT_SKIP_AMOUNT;
  const till = +limit || DEFAULT_LIMIT_AMOUNT;

  const page = await toPage(await offersStore.getAllOffers(), from, till);

  res.json(page);
}));

offersRouter.get(`/:date`, asyncMiddleware(async (req, res) => {
  const {date} = req.params;

  validate(req.params, getOfferScheme);

  const desiredOffer = await offersStore.getOffer(date);

  if (!desiredOffer) {
    throw new NotFoundError(`offer with date equals to ${date} wasn't found`);
  }

  res.send(desiredOffer);
}));

offersRouter.get(`/:date/avatar`, asyncMiddleware(async (req, res) => {
  const {date} = req.params;

  validate(req.params, getOfferScheme);

  const desiredOffer = await offersStore.getOffer(date);

  if (!desiredOffer) {
    throw new BadRequest([{
      error: `Bad Request`,
      errorMessage: `there is no offer with date equals to ${date}`
    }]);
  }

  const {author: {avatar}} = desiredOffer;

  if (!avatar) {
    throw new NotFoundError(`offer with date equals to ${date} has no avatar`);
  }

  res.send(avatar);
}));

offersRouter.post(`/`, jsonParser, upload.single(`avatar`), (req, res) => {
  const {body, file} = req;

  if (file) {
    const {originalname, mimetype} = file;
    body.avatar = {
      name: originalname,
      mimetype
    };
  }

  validate(body, postOfferScheme);

  res.send(body);
});

module.exports = offersRouter;
