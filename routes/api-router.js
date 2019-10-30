const apiRouter = require("express").Router();
const { topicsRouter } = require("../routes/topicsRouter");
const { usersRouter } = require("../routes/usersRouter");
const { articlesRouter } = require("../routes/articlesRouter");
const { commentsRouter } = require("../routes/commentsRouter");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

// apiRouter.use("/owners", ownersRouter);

// apiRouter.use(errorHandler);

apiRouter.get("/not-a-path", (req, res, next) => {
  res.status(404).json({ msg: "ERROR: 404 - path not found" });
});

module.exports = apiRouter;
