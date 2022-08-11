const router = require("express").Router();
const sessionRouter = require("./session");
const { validateSignup } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

router.use("/session", sessionRouter);

// Sign up a new user
router.post("/", validateSignup, async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.signup({ username, email, password });

  setTokenCookie(res, user);

  res.json({ user });
});

module.exports = router;
