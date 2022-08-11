const router = require("express").Router();
const { validateLogin } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");

// Get current user/session
router.get("/", (req, res) => {
  // if (req.user) return res.json({ user: req.user.toSafeObject() });

  // res.json({});
  res.json(req.user);
});

// Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.login({ email, password });

  if (!user) {
    const err = new Error("Login failed");
    err.title = "Login failed";
    err.status = 401;
    err.errors = ["The provided credentials were invalid"];

    return next(err);
  }

  user.dataValues.token = setTokenCookie(res, user);

  res.json(user);
});

// Log out
router.delete("/", (req, res, next) => {
  if (!req.user) {
    const err = new Error("No active session");
    err.title = "No active session";
    err.status = 401;
    err.errors = ["A user is not currently logged in"];

    return next(err);
  }

  res.clearCookie("token");

  res.json({ message: "Successfully logged out" });
});

module.exports = router;
