const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  errorHandlerPsql,
  errorHandlerCustom
} = require("./Errors/error-handler");
const { error405 } = require("./Errors/error-405");

app.use(express.json());

app.use("/api", apiRouter);

app.use(errorHandlerPsql);
app.use(errorHandlerCustom);
app.use("/api", error405);
// const { errorHandler } = require("./Errors/error-handler");

module.exports = app;
