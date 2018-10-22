const express = require(`express`);
const offersRouter = express.Router(); /* eslint-disable-line new-cap */
const multer = require(`multer`);

const upload = multer({storage: multer.memoryStorage()});

const mockData = require(`../../../../mocks/test-data.json`);
const NotFoundError = require(`../errors/not-found-error`);
const {validateUsingAScheme, makeObjectToValidate} = require(`../validation/validate`);
const {postOfferScheme, getOffersScheme, getOfferScheme} = require(`../validation/schemes`);

const jsonParser = express.json();

const DEFAULT_SKIP_AMOUNT = 0;
const DEFAULT_LIMIT_AMOUNT = 20;

offersRouter.get(`/`, (req, res) => {
  const {limit, skip} = req.query;

  validateUsingAScheme(makeObjectToValidate(req.query), getOffersScheme);

  const from = +skip || DEFAULT_SKIP_AMOUNT;
  const till = +limit || DEFAULT_LIMIT_AMOUNT;

  res.json({
    data: mockData.slice(from, till),
    total: mockData.length,
    limit: till,
    skip: from,
  });
});

offersRouter.get(`/:date`, (req, res) => {
  const {date} = req.params;

  validateUsingAScheme(makeObjectToValidate(req.params), getOfferScheme);

  const desiredOffer = mockData.find((item) => item.date === +date);

  if (!desiredOffer) {
    throw new NotFoundError(`offer with date equals to ${date} wasn't found`);
  }

  res.send(desiredOffer);
});

offersRouter.post(`/`, jsonParser, upload.single(`avatar`), (req, res) => {
  const {body, file} = req;

  if (file) {
    const {originalname, mimetype} = file;
    body.avatar = {
      name: originalname,
      mimetype
    };
  }

  validateUsingAScheme(body, postOfferScheme);

  res.send(body);
});

module.exports = offersRouter;
