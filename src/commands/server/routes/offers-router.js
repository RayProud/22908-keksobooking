const offersRouter = require(`express`).Router(); /* eslint-disable-line new-cap */
const mockData = require(`../../../../mocks/test-data.json`);
const NotFoundError = require(`../errors/not-found-error`);
const validate = require(`../validate`);

offersRouter.get(`/`, (req, res) => {
  const {limit, skip} = req.query;

  validate([{limit}, {skip}], `numeric`);

  const from = skip || 0;
  const till = limit || 20;

  res.json({
    data: mockData.slice(from, till),
    total: mockData.length,
    limit: till,
    skip: from,
  });
});

offersRouter.get(`/:date`, (req, res) => {
  const {date} = req.params;

  validate([{date}], `numeric`);

  const desiredOffer = mockData.find((item) => item.date === +date);

  if (!desiredOffer) {
    throw new NotFoundError(`offer with date equals to ${date} wasn't found`);
  }

  res.send(desiredOffer);
});

module.exports = offersRouter;
