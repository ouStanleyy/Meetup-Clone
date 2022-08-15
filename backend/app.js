const express = require("express");
const app = express();
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { environment } = require("./config");
const isProduction = environment === "production";
const routes = require("./routes");
const { ValidationError } = require("sequelize");

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) app.use(cors());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  // err.title = "Resource Not Found";
  // err.errors = ["The requested resource couldn't be found."];
  err.status = 404;

  next(err);
});

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    // console.log(err.errors);
    err.errors = err.errors.map((error) => error.message);
    // err.title = "Validation error";
  }

  next(err);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  // if (
  //   Array.isArray(err.errors) &&
  //   err.errors[0].toString() === "[object Object]"
  // )
  //   err.errors = Object.assign({}, ...err.errors);

  res.status(err.status || 500).json({
    // title: err.title || undefined,
    message: err.message,
    statusCode: err.status,
    errors: err.errors,
    // stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
