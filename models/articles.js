const connection = require("../db/connection");

exports.fetchArticleById = id => {
  return connection("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .groupBy("articles.article_id")
    .select("articles.*")
    .where("articles.article_id", id)
    .first()
    .then(article => {
      // console.table(article);
      if (!article) {
        return Promise.reject({ status: 404, msg: `article "-10" not found` });
      } else return article;
    });
};

exports.updateArticleById = (id, incrementation = 0) => {
  return connection("articles")
    .where("article_id", id)
    .increment("votes", incrementation)
    .returning("*")
    .then(article => {
      // console.log(article);
      if (article.length === 0)
        return Promise.reject({
          status: 404,
          msg: `article "${id}" not found`
        });
      return article[0];
    });
};

exports.createComment = (id, user, comment) => {
  return connection("articles")
    .where("article_id", id)
    .first()
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `article_id ${id} not found`
        });
      } else {
        return connection("comments")
          .insert({
            body: comment,
            article_id: id,
            author: user
          })
          .returning("*")
          .then(res => {
            return res[0];
          });
      }
    });
};

exports.fetchComments = (id, sort_by = "created_at", order = "desc") => {
  return connection("comments")
    .select("author", "body", "comment_id", "votes", "created_at")
    .where("article_id", id)
    .returning("*")
    .orderBy(sort_by, order)
    .then(comments => {
      if (Math.sign(id) === -1 || id > 18)
        return Promise.reject({
          status: 404,
          msg: `article_id ${id} not found`
        });
      return comments;
    });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  { author, topic }
) => {
  return (
    connection("articles")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .count({ comment_count: "comments.comment_id" })
      .groupBy("articles.article_id")
      .select(
        "articles.article_id",
        "articles.author",
        "articles.created_at",
        "articles.title",
        "articles.topic",
        "articles.votes"
      )
      .orderBy(sort_by, order)
      .limit(limit)
      // .groupBy("articles.article_id")
      .modify(query => {
        if (author) query.where("articles.author", author);
        if (topic) query.where("articles.topic", topic);
        // if (page === 2) query.limit(10).offset(10);
        // if (page) query.offset((page - 1) * limit + 1);
      })
      .then(res => {
        if (res.length === 0)
          return Promise.reject({
            status: 404,
            msg: "query search term does not exist in data"
          });
        return res;
      })
  );
};

// PATCH ARTICLE - 400:BAD REQ
// PATCH ARTICLE - 404:NOT FOUND
// ARTICLE - 500:INTERNAL SERVER ERROR
