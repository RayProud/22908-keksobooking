const express = require(`express`);
const multer = require(`multer`);
const toStream = require(`buffer-to-stream`);

const upload = multer({storage: multer.memoryStorage()});

const validate = require(`../../validation/validate`);
const {postOfferScheme, getOffersScheme} = require(`../../validation/schemes`);
const {asyncMiddleware, getRandomItemFromArray} = require(`../../../helpers/common`);

const jsonParser = express.json();

const DEFAULT_SKIP_AMOUNT = 0;
const DEFAULT_LIMIT_AMOUNT = 20;
const DEFAULT_NAMES = [`Keks`,
  `Pavel`,
  `Nikolay`,
  `Alex`,
  `Ulyana`,
  `Anastasyia`,
  `Julia`
];

const toPage = async (cursor, skip = DEFAULT_SKIP_AMOUNT, limit = DEFAULT_LIMIT_AMOUNT) => {
  const data = await cursor.skip(skip).limit(limit).toArray();

  return {
    data,
    limit,
    skip,
    total: await cursor.count(),
  };
};

function prepareOfferForSave(offer) {
  const date = Math.floor(Date.now() / 1000);

  const offerToSave = Object.assign(
      {},
      offer,
      {
        date,
        author: {
          name: offer.name || getRandomItemFromArray(DEFAULT_NAMES),
        }
      }
  );

  if (offer.avatar) {
    offerToSave.author.avatar = `api/offers/${date}/avatar`;
  }

  return offerToSave;
}

module.exports = (offersRouter) => {
  offersRouter.get(`/`, asyncMiddleware(async (req, res) => {
    const {limit, skip} = req.query;

    validate(req.query, getOffersScheme);

    const from = +skip || DEFAULT_SKIP_AMOUNT;
    const till = +limit || DEFAULT_LIMIT_AMOUNT;

    const page = await toPage(await offersRouter.offersStore.getAllOffers(), from, till);

    res.json(page);
  }));

  offersRouter.post(`/`, jsonParser, upload.single(`avatar`), asyncMiddleware(async (req, res) => {
    const {body, file} = req;

    if (file) {
      const {originalname, mimetype} = file;
      body.avatar = {
        name: originalname,
        mimetype
      };
    }

    const validatedOffer = validate(body, postOfferScheme);
    const {address} = body;
    const [x, y] = address.split(`,`);
    const location = {
      x: +x.trim(),
      y: +y.trim(),
    };
    validatedOffer.location = location;

    const objectToSave = prepareOfferForSave(validatedOffer);

    const result = await offersRouter.offersStore.save(objectToSave);
    const {insertedId} = result;

    if (file) {
      await offersRouter.imageStore.save(insertedId, toStream(file.buffer));
    }

    res.send(validatedOffer);
  }));
};
