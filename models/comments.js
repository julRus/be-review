const connection = require("../db/connection");

exports.updateComment = (id, votes) => {
  return connection("comments")
    .where("comment_id", id)
    .first()
    .increment("votes", votes)
    .returning("*")
    .then(res => {
      if (res.length === 0)
        return Promise.reject({
          status: 404,
          msg: `comment ${id} does not exist`
        });
      return res[0];
    });
};

exports.removeComment = id => {
  return connection("comments")
    .where("comment_id", id)
    .delete();
};
