process.env.NODE_ENV = "test";
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app");
const connection = require("../db/connection");

chai.use(require("sams-chai-sorted"));

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("GET:200 - Returns all topics from topics table", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics.length).to.equal(3);
          expect(topics).to.eql([
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" }
          ]);
        });
    });
  });
  describe("/topics-errors", () => {
    it("ERROR: 404 - Returns status code 404 along with a msg: 'invalid path' when given an invalid path", () => {
      return request(app)
        .get("/api/not-a-path")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("ERROR: 404 - path not found");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET:200 - Returns a single user object by given username", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          // console.log(user);
          expect(user).to.be.an("object");
          expect(user).to.have.keys(["username", "name", "avatar_url"]);
        });
    });
  });
  describe("/users/:username-errors", () => {
    it("ERROR:404 - Returns status code 404 and a msg user not found when an username is passed which does not exist in the db", () => {
      const username = undefined;
      return request(app)
        .get(`/api/users/${username}`)
        .expect(404)
        .then(res => {
          // console.log(user);
          expect(res.body.msg).to.be.equal(`"user "${username}" not found"`);
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET:200 - Returns status code 200 and a article by its id", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("object");
        });
    });
    it("GET:200 - Returns status code 200 and a article by its id AND the a total count of comments made towards this article", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("object");
          expect(article).to.have.keys([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
          expect(article.comment_count).to.equal("13");
        });
    });
    it("PATCH:202 - Returns status code 202 and an article whose votes have been updated to match the origional votes plus the given votes (incremented)", () => {
      return request(app)
        .patch(`/api/articles/1`)
        .send({ inc_votes: -1 })
        .expect(202)
        .then(({ body: { article } }) => {
          expect(article).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          ]);
          expect(article.votes).to.equal(99);
          // console.log(article.votes);
        });
    });
  });
  describe("/articles/:article_id-errors", () => {
    it("ERROR:400 - Returns psql error with status 400 and a msg 'Bad request, invalid data type'", () => {
      return request(app)
        .get(`/api/articles/not-a-number`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "not-a-number"'
          );
        });
    });
    it("ERROR:404 - Returns modified error with status 404 and a msg 'article does not exist'", () => {
      const id = -10;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(`article "${id}" not found`);
        });
    });
    it("ERROR:400 - Returns psql error with status 400 and a msg 'bad request' when given a patch request in the incorrect format", () => {
      return request(app)
        .patch(`/api/articles/1`)
        .send({
          inc_votes: "not-a-number!!!!!!"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'invalid input syntax for integer: "NaN"'
          );
        });
    });
    it("ERROR:500 - Returns an interanl server error with status 500", () => {});
    it("ERROR:405 - Returns an error", () => {});
  });
  describe("/articles/:article_id/comments", () => {
    it("POST:201 - Returns status code 201 along with a newlwy created comment", () => {
      return request(app)
        .post(`/api/articles/1/comments`)
        .send({
          username: "butter_bridge",
          body: "S'alright"
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          expect(comment).to.be.an("object");
          expect(comment).to.have.keys([
            "comment_id",
            "body",
            "votes",
            "article_id",
            "author",
            "created_at"
          ]);
          expect(comment.author).to.equal("butter_bridge");
          expect(comment.body).to.equal("S'alright");
        });
    });
    it("GET:200 - Returns status code 200 along with an array of comments by a given article_id", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.an("array");
          expect(comments.length).to.equal(13);
          comments.forEach(comment => {
            expect(comment).to.have.keys([
              "comment_id",
              "body",
              "votes",
              "author",
              "created_at"
            ]);
          });
          // Why is my new comment not added?
        });
    });
    it("GET:200 - Returns status code 200 along with an array of comments sorted by a defeault of created_at", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.descendingBy("created_at");
          // Why is my new comment not added?
        });
    });
    it("GET:200 - Returns status code 200 along with an array of comments sorted by a given property", () => {
      return request(app)
        .get(`/api/articles/1/comments?sort_by=author`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.descendingBy("author");
          // Why is my new comment not added?
        });
    });
    it("GET:200 - Returns status code 200 along with an array of comments sorted by a given order defaulting to descending", () => {
      return request(app)
        .get(`/api/articles/1/comments?sort_by=votes&order=asc`)
        .expect(200)
        .then(({ body: { comments } }) => {
          // console.log(comment, "<<<<<<<<<<<<<<<<,TEST TEST TEST!");
          // console.log(comments);
          expect(comments).to.be.ascendingBy("votes");
          // Why can't i sort by text body????
        });
    });
  });
});

// {
//   article_id: 1,
//     title: 'Living in the shadow of a great man',
//       body: 'I find this existence challenging',
//         votes: 100,
//           topic: 'mitch',
//             author: 'butter_bridge',
//               created_at: 2018 - 11 - 15T12: 21: 54.171Z
// }