require("dotenv").config();

const express = require("express");
const path = require("path");
const createError = require("http-errors");
const cors = require("./middlewares/cors");
const logger = require("morgan");

const mongoose = require("mongoose");
const connect = mongoose.connect(process.env.MONGO_URI);
// routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/userRouter");
const quizRouter = require("./routes/quizRouter");

const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.options("*", cors.corsWithOptions);
app.use(cors.corsWithOptions);

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/quiz", quizRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

connect.then(
  (db) => {
    console.log("Successfully connected to server: ");
  },
  (err) => {
    console.log(err);
  },
);

module.exports = app;
