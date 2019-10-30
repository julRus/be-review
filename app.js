const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  errorHandlerPsql,
  errorHandlerCustom
} = require("./Errors/error-handler");

app.use(express.json());

app.use("/api", apiRouter);

app.use(errorHandlerPsql);
app.use(errorHandlerCustom);
// const { errorHandler } = require("./Errors/error-handler");

module.exports = app;
