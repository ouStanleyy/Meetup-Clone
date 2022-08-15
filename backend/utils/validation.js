const { validationResult, check } = require("express-validator");

// Handles validation errors
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return { [error.param]: error.msg };
    });
    console.log(errors);

    const err = new Error("Validation error");
    err.errors = errors;
    err.status = 400;
    // err.title = "Bad request.";

    return next(err);
  }

  next();
};

const validateLogin = [
  check("email")
    .exists({ checkFalsy: true })
    // .isEmail()
    .withMessage("Email is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors,
];

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .isLength({ min: 3, max: 256 })
    .withMessage("Invalid email"),
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 4, max: 30 })
    .withMessage("First Name is required"),
  check("firstName")
    .not()
    .isEmail()
    .withMessage("First name cannot be an email."),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 4, max: 30 })
    .withMessage("Last Name is required"),
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
