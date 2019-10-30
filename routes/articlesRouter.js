const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getComments,
  getArticles
} = require("../controllers/articles");

const { error405 } = require("../Errors/error-405");
// const { error405 } = require("../Errors/errors405");

console.log(error405);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(error405);
//.all(error405);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(error405);

articlesRouter
  .route("/")
  .get(getArticles)
  .all(error405);

articlesRouter.get("/not-an-endpoint", (err, req, res, next) => {
  res.status(404).json({ msg: "invalid path" });
});

module.exports = { articlesRouter };
