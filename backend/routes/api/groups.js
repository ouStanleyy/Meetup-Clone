const router = require("express").Router();
const sequelize = require("sequelize");
const { validateGroupCreation } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Group, Membership, Image, User, Venue } = require("../../db/models");

// Add an image to a group based on the group's id
router.post("/:groupId/images", requireAuth, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;

    return next(err);
  }

  const newImage = await group.createImage({
    userId: req.user.id,
    url: req.body.url,
  });

  const { id, imageableId, url } = newImage;

  res.json({ id, imageableId, url });
});

// Get details of a group by group id
router.get("/:groupId", async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    attributes: {
      include: [
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("Memberships.id"))
          ),
          "numMembers",
        ],
      ],
    },
    group: "Group.id",
    include: [
      { model: Membership, attributes: [] },
      // { model: Image },
      // { model: User, as: "Organizer" },
      // { model: Venue, attributes: { exclude: ["createdAt", "updatedAt"] } },
    ],
  });

  const includedTables = await Group.findByPk(req.params.groupId, {
    attributes: [],
    include: [
      { model: Image },
      { model: User, as: "Organizer" },
      { model: Venue, attributes: { exclude: ["createdAt", "updatedAt"] } },
    ],
  });

  group.dataValues = { ...group.dataValues, ...includedTables.dataValues };

  if (!group.id) {
    const err = new Error("Group couldn't be found");
    err.status = 404;
    return next(err);
  }

  res.json(group);
});

// Get all groups
router.get("/", async (_req, res) => {
  const allGroups = await Group.findAll({
    attributes: {
      include: [
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("Memberships.id"))
          ),
          "numMembers",
        ],
        [sequelize.col("Images.url"), "previewImage"],
      ],
    },
    group: "Group.id",
    include: [
      { model: Membership, attributes: [] },
      { model: Image, attributes: [] },
    ],
  });

  res.json({ Groups: allGroups });
});

// Create a group
router.post("/", requireAuth, validateGroupCreation, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const currUser = await User.findByPk(req.user.id);
  const newGroup = await currUser.createGroup({
    name,
    about,
    type,
    private,
    city,
    state,
  });

  await currUser.createMembership({ groupId: newGroup.id, status: "host" });

  res.status(201).json(newGroup);
});

module.exports = router;
