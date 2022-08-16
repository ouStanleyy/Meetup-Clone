const jwt = require("jsonwebtoken");
const {
  jwtConfig: { secret, expiresIn },
} = require("../config");
const { User, Group } = require("../db/models");

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  const token = jwt.sign({ data: user.toSafeObject() }, secret, {
    expiresIn: parseInt(expiresIn),
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    maxAge: expiresIn * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

// Checks current user through JWT
const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (!err) {
      try {
        req.user = await User.getCurrentUserById(jwtPayload.data.id);
      } catch (err) {}
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = (req, _res, next) => {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.status = 401;
  return next(err);
};

// Checks permission
const authorize = async (req, _res, next) => {
  req.group = await Group.findByPk(req.params.groupId);

  if (!req.group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;
    return next(err);
  } else if (req.user.id === req.group.organizerId) return next();

  const err = new Error("Forbidden");
  err.status = 403;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth, authorize };
