const offersRouter = require(`express`).Router(); /* eslint-disable-line new-cap */
const {isNumeric} = require(`../../../helpers/common`);
const mockData = require(`../../../../mocks/test-data.json`);
const IllegalArgumentError = require(`../errors/illegal-argument-error`);
const NotFoundError = require(`../errors/not-found-error`);

offersRouter.get(`/:date`, (req, res) => {
  const {date} = req.params;

  if (!isNumeric(date)) {
    throw new IllegalArgumentError(`date should be number`);
  }

  const desiredOffer = mockData.find((item) => item.date === +date);

  if (!desiredOffer) {
    throw new NotFoundError(`offer with date equals to ${date} wasn't found`);
  }

  res.send(desiredOffer);
});

module.exports = offersRouter;
