const router = require("express").Router();
const sequelize = require("sequelize");
const { validateLogin } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth");
const { Group, Membership, Image, User, Venue } = require("../../db/models");

// Get details of a group by group id
router.get("/:groupId", async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
      ],
    },
    include: [
      { model: Membership, attributes: [] },
      { model: Image, attributes: ["id", "imageableId", "url"] },
      { model: User },
      { model: Venue, attributes: { exclude: ["createdAt", "updatedAt"] } },
    ],
  });

  if (!group.id) {
    const err = new Error("Group couldn't be found");
    err.status = 404;
    // err.title = "Group couldn't be found";
    return next(err);
  }

  res.json(group);
});

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
