const { createComment } = require("../models/comments");

exports.postComment = (req, res, next) => {
  console.log(req.body);
};
