const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getComments
} = require("../controllers/articles");
// const { error405 } = require("../Errors/errors405");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
//.all(error405);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments);

module.exports = { articlesRouter };
