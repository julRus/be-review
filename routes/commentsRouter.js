const commentsRouter = require("express").Router();
const { postComment } = require("../controllers/comments");
// const { error405 } = require("../Errors/errors405");

commentsRouter.route("/articles/:article_id/comments").post(postComment);
//.all(error405);

module.exports = { commentsRouter };
