const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
const { error405 } = require("../Errors/error-405");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(error405);

module.exports = { topicsRouter };
