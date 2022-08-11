const { validationResult, check } = require("express-validator");

// Handles validation errors
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = new Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";

    return next(err);
  }

  next();
};

const validateLogin = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .isLength({ min: 3, max: 256 })
    .withMessage("Please provide a valid email."),
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 4, max: 30 })
    .withMessage(
      "Please provide a valid first name with at least 4 characters."
    ),
  check("firstName")
    .not()
    .isEmail()
    .withMessage("First name cannot be an email."),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 4, max: 30 })
    .withMessage(
      "Please provide a valid last name with at least 4 characters."
    ),
  check("lastName")
    .not()
    .isEmail()
    .withMessage("Last name cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Please provide a valid password with at least 6 characters."),
  handleValidationErrors,
];

module.exports = {
  validateLogin,
  validateSignup,
};
