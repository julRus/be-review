const usersRouter = require("express").Router();
const { getUserById } = require("../controllers/users");
const { error405 } = require("../Errors/error-405");

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(error405);

module.exports = { usersRouter };
