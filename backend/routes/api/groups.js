const router = require("express").Router();
const sequelize = require("sequelize");
const { validateLogin } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth");
const { Group, Membership, Image } = require("../../db/models");

// Get all groups
router.get("/", async (req, res, next) => {
  const allGroups = await Group.findAll({
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
        [sequelize.col("Images.url"), "previewImage"],
      ],
    },
    group: "name",
    include: [
      { model: Membership, attributes: [] },
      { model: Image, attributes: [] },
    ],
  });

  res.json({ Groups: allGroups });
});

module.exports = router;
