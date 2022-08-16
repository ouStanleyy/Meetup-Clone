const router = require("express").Router();
const sequelize = require("sequelize");
const {
  validateGroupInput,
  validateVenueInput,
} = require("../../utils/validation");
const { requireAuth, authorize, authorizeRole } = require("../../utils/auth");
const {
  Group,
  Membership,
  Image,
  User,
  Venue,
  Attendance,
  Event,
} = require("../../db/models");

// Get all events of a group specified by its id
router.get("/:groupId/events", async (req, res, next) => {
  const { groupId } = req.params;
  const group = await Group.findByPk(groupId);

  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;
    return next(err);
  }

  const events = await Event.findAll({
    where: { groupId },
    attributes: {
      include: [
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("Attendances.id"))
          ),
          "numAttending",
        ],
        [sequelize.col("Images.url"), "previewImage"],
      ],
      exclude: ["description", "capacity", "price", "createdAt", "updatedAt"],
    },
    group: "Event.id",
    include: [
      { model: Attendance, attributes: [] },
      { model: Image, attributes: [] },
      { model: Group, attributes: ["id", "name", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state"] },
    ],
  });

  res.json({ Events: events });
});

// Get all venues for a group specified by its id
router.get("/:groupId/venues", requireAuth, authorizeRole, async (req, res) => {
  const venues = await req.group.getVenues({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  res.json(venues);
});

// Create a new venue for a group specified by its id
router.post(
  "/:groupId/venues",
  requireAuth,
  authorizeRole,
  validateVenueInput,
  async (req, res) => {
    const { address, city, state, lat, lng } = req.body;
    const newVenue = await req.group.createVenue({
      address,
      city,
      state,
      lat,
      lng,
    });

    delete newVenue.dataValues.createdAt;
    delete newVenue.dataValues.updatedAt;

    res.json(newVenue);
  }
);

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

  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;
    return next(err);
  }

  const includedTables = await Group.findByPk(req.params.groupId, {
    attributes: [],
    include: [
      { model: Image },
      { model: User, as: "Organizer" },
      { model: Venue },
    ],
  });

  group.dataValues = { ...group.dataValues, ...includedTables.dataValues };

  res.json(group);
});

// Edit a group
router.put(
  "/:groupId",
  requireAuth,
  authorize,
  validateGroupInput,
  async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const updatedGroup = await req.group.update({
      name,
      about,
      type,
      private,
      city,
      state,
    });

    // updatedGroup.dataValues.createdAt = new Date(
    //   updatedGroup.dataValues.createdAt
    // ).toUTCString();

    res.json(updatedGroup);
  }
);

// Delete a group
router.delete("/:groupId", requireAuth, authorize, async (req, res) => {
  await req.group.destroy();
  res.json({ message: "Successfully deleted", statusCode: 200 });
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
router.post("/", requireAuth, validateGroupInput, async (req, res) => {
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
