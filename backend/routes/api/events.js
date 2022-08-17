const router = require("express").Router();
const sequelize = require("sequelize");
const {
  validateGroupInput,
  validateVenueInput,
} = require("../../utils/validation");
const {
  requireAuth,
  authorize,
  authorizeRole,
  authorizeAttendanceRole,
} = require("../../utils/auth");
const {
  Group,
  Image,
  User,
  Venue,
  Event,
  Attendance,
} = require("../../db/models");

// Add an image to an event based on the event's id
router.post(
  "/:eventId/images",
  requireAuth,
  authorizeAttendanceRole,
  async (req, res) => {
    // const event = await Event.findByPk(req.params.eventId);

    // if (!event) {
    //   const err = new Error("Event couldn't be found");
    //   err.status = 404;

    //   return next(err);
    // }

    const newImage = await req.event.createImage({
      userId: req.user.id,
      url: req.body.url,
    });

    const { id, imageableId, url } = newImage;

    res.json({ id, imageableId, url });
  }
);

// Get details of an event specified by its id
router.get("/:eventId", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      include: [
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("Attendances.id"))
          ),
          "numAttending",
        ],
      ],
      exclude: ["createdAt", "updatedAt"],
    },
    group: "Event.id",
    include: [
      { model: Attendance, attributes: [] },
      { model: Group, attributes: ["id", "name", "private", "city", "state"] },
    ],
  });

  if (!event) {
    const err = new Error("Event couldn't be found");
    err.status = 404;
    return next(err);
  }

  const includedTables = await Event.findByPk(req.params.eventId, {
    attributes: [],
    include: [
      {
        model: Venue,
        attributes: { exclude: ["groupId", "createdAt", "updatedAt"] },
      },
      { model: Image },
    ],
  });

  event.dataValues = { ...event.dataValues, ...includedTables.dataValues };

  res.json(event);
});

// Get all events
router.get("/", async (_req, res) => {
  const allEvents = await Event.findAll({
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

  res.json({ Events: allEvents });
});

module.exports = router;
