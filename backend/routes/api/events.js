const router = require("express").Router();
const sequelize = require("sequelize");
const {
  validateGroupInput,
  validateVenueInput,
} = require("../../utils/validation");
const { requireAuth, authorize, authorizeRole } = require("../../utils/auth");
const {
  Group,
  Image,
  User,
  Venue,
  Event,
  Attendance,
} = require("../../db/models");

// Get all events
router.get("/", async (req, res, next) => {
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
