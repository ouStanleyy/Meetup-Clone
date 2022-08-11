const jwt = require("jsonwebtoken");
const {
  jwtConfig: { secret, expiresIn },
} = require("../config");
const { User } = require("../db/models");

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
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Unauthorized");
  err.title = "Unauthorized";
  err.errors = ["Unauthorized"];
  err.status = 401;

  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
