const router = require("express").Router();
const sequelize = require("sequelize");
const { Op } = sequelize;
const {
  validateGroupInput,
  validateVenueInput,
  validateEventInput,
  validateMembershipInput,
  validateMembershipDeletion,
} = require("../../utils/validation");
const {
  requireAuth,
  authParams,
  authMembership,
  authOwnership,
} = require("../../utils/auth");
const {
  Group,
  Membership,
  Image,
  User,
  Venue,
  Attendance,
  Event,
} = require("../../db/models");

// Change the status of a membership for a group specified by id
router.put(
  "/:groupId/memberships/:memberId",
  requireAuth,
  authParams,
  authMembership,
  validateMembershipInput,
  async (req, res, next) => {
    const membership = await Membership.findOne({
      where: { memberId: req.body.memberId, groupId: req.group.id },
    });

    if (!membership) {
      const err = new Error(
        "Membership between the user and the group does not exist"
      );
      err.status = 404;
      return next(err);
    }

    if (req.body.status === "co-host" && req.membership.status !== "host") {
      const err = new Error(
        "Must be organizer of group to change status to 'co-host'"
      );
      err.status = 403;
      return next(err);
    }

    const { id, groupId, memberId, status } = await membership.update({
      status: req.body.status,
    });
    res.json({ id, groupId, memberId, status });
  }
);

// Delete membership to a group specified by id
router.delete(
  "/:groupId/memberships/:memberId",
  requireAuth,
  authParams,
  validateMembershipDeletion,
  async (req, res, next) => {
    const { id } = req.user;
    const { memberId } = req.body;
    const membership = await Membership.findOne({
      where: { memberId, groupId: req.group.id },
    });

    if (!membership) {
      const err = new Error("Membership does not exist for this User");
      err.status = 404;
      return next(err);
    }

    if (id !== req.group.organizerId && id !== memberId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    await membership.destroy();
    res.json({ message: "Successfully deleted membership from group" });
  }
);

// Get all members of a group specified by its id
router.get("/:groupId/members", requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const group = await Group.findByPk(groupId, {
    include: { model: Membership },
  });
  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;
    return next(err);
  }

  const currUser = await group.getMemberships({
    where: { memberId: req.user.id },
  });
  let members;

  if (
    currUser.length &&
    (currUser[0].status === "host" || currUser[0].status === "co-host")
  )
    members = await User.findAll({
      include: {
        model: Membership,
        where: { groupId },
        attributes: ["status"],
      },
    });
  else
    members = await User.findAll({
      include: {
        model: Membership,
        where: { groupId, status: { [Op.not]: "pending" } },
        attributes: ["status"],
      },
    });

  members.forEach((member) => {
    member.dataValues.Membership = member.dataValues.Memberships[0];
    delete member.dataValues.Memberships;
  });

  res.json({ Members: members });
});

// Request a membership for a group based on the group's id
router.post(
  "/:groupId/memberships",
  requireAuth,
  authParams,
  async (req, res, next) => {
    const { id } = req.group;
    const membership = await Membership.findOne({
      where: { memberId: req.user.id, groupId: id },
    });

    if (!membership) {
      const { groupId, memberId, status } = await req.user.createMembership({
        groupId: id,
      });
      return res.json({ groupId, memberId, status });
    }

    const err = new Error();
    err.status = 400;
    if (membership.status === "pending")
      err.message = "Membership has already been requested";
    else err.message = "User is already a member of the group";
    next(err);
  }
);

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

// Create a new event for a group specified by its id
router.post(
  "/:groupId/events",
  requireAuth,
  authParams,
  authMembership,
  validateEventInput,
  async (req, res) => {
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;
    const currUser = await User.findByPk(req.user.id);
    const newEvent = await req.group.createEvent({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    delete newEvent.dataValues.createdAt;
    delete newEvent.dataValues.updatedAt;
    newEvent.dataValues.startDate = new Date(newEvent.dataValues.startDate)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/g, "");
    newEvent.dataValues.endDate = new Date(newEvent.dataValues.endDate)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/g, "");

    await currUser.createAttendance({ eventId: newEvent.id, status: "host" });

    res.json(newEvent);
  }
);

// Get all venues for a group specified by its id
router.get(
  "/:groupId/venues",
  requireAuth,
  authParams,
  authMembership,
  async (req, res) => {
    const venues = await req.group.getVenues({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.json(venues);
  }
);

// Create a new venue for a group specified by its id
router.post(
  "/:groupId/venues",
  requireAuth,
  authParams,
  authMembership,
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
  authParams,
  authOwnership,
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
router.delete(
  "/:groupId",
  requireAuth,
  authParams,
  authOwnership,
  async (req, res) => {
    await req.group.destroy();
    res.json({ message: "Successfully deleted", statusCode: 200 });
  }
);

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
