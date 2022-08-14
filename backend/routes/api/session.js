const router = require("express").Router();
const sequelize = require("sequelize");
const { validateLogin } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Group, Membership, Image } = require("../../db/models");

// Get all groups joined or organized by the Current User
router.get("/groups", requireAuth, async (req, res, next) => {
  const allGroups = await Group.findAll({
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
        [sequelize.col("Images.url"), "previewImage"],
      ],
    },
    group: "name",
    include: [
      {
        model: Membership,
        where: {
          groupId: [
            sequelize.literal(
              `SELECT groupId FROM Memberships WHERE memberId = ${req.user.id}`
            ),
          ],
        },
        attributes: [],
      },
      { model: Image, attributes: [] },
    ],
  });

  res.json({ Groups: allGroups });
});

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
