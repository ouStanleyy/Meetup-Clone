const { validationResult, check } = require("express-validator");
const { User, Venue } = require("../db/models");

// Handles validation errors
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.param] = error.msg));

    const err = new Error();

    if (errors.email === "User with that email already exists") {
      err.message = "User already exists";
      err.errors = { email: errors.email };
      err.status = 403;
    } else {
      err.message = "Validation error";
      err.errors = errors;
      err.status = 400;
    }

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
  check("email").custom((email) =>
    User.findOne({ where: { email } }).then((user) => {
      if (user) return Promise.reject("User with that email already exists");
    })
  ),
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

const validateGroupInput = [
  check("name")
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  handleValidationErrors,
];

const validateVenueInput = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  handleValidationErrors,
];

const validateEventInput = [
  check("venueId").custom((venueId, { req }) =>
    Venue.findByPk(venueId).then((venue) => {
      if (!venue || venue.groupId != req.group.id)
        return Promise.reject("Venue does not exist");
    })
  ),
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("capacity")
    .isInt()
    .not()
    .isString()
    .withMessage("Capacity must be an integer"),
  check("price")
    .isDecimal({ force_decimal: true, decimal_digits: "1,2" })
    .not()
    .isString()
    .withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate").isAfter().withMessage("Start date must be in the future"),
  check("endDate").custom((endDate, { req }) => {
    if (new Date(endDate) <= new Date(req.body.startDate))
      return Promise.reject("End date is less than start date");
    return true;
  }),
  handleValidationErrors,
];

const validateMembershipInput = [
  check("memberId").custom((memberId) =>
    User.findByPk(memberId).then((user) => {
      if (!user) return Promise.reject("User couldn't be found");
    })
  ),
  check("status")
    .isIn(["co-host", "member"])
    .withMessage("Membership status must be 'co-host' or 'member'"),
  check("status")
    .not()
    .isIn(["pending"])
    .withMessage("Cannot change a membership status to 'pending'"),
  handleValidationErrors,
];

const validateMembershipDeletion = [
  check("memberId").custom((memberId, { req }) => {
    if (memberId != req.params.memberId)
      return Promise.reject("Body and params memberId does not match");
    return true;
  }),
  check("memberId").custom((memberId) =>
    User.findByPk(memberId).then((user) => {
      if (!user) return Promise.reject("User couldn't be found");
    })
  ),
  handleValidationErrors,
];

module.exports = {
  validateLogin,
  validateSignup,
  validateGroupInput,
  validateVenueInput,
  validateEventInput,
  validateMembershipInput,
  validateMembershipDeletion,
};
