const connection = require("../db/connection");

exports.fetchUserById = username => {
  // console.log(username);
  return connection("users")
    .where("username", "=", username)
    .first()
    .then(user => {
      // console.log(user);
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `"user "${username}" not found"`
        });
      } else return user;
    });
};
