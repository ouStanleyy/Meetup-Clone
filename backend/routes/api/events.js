const router = require("express").Router();
const sequelize = require("sequelize");
const { Op } = sequelize;
const {
  validateEventInput,
  validateAttendanceInput,
  validateAttendanceDeletion,
} = require("../../utils/validation");
const {
  requireAuth,
  authParams,
  authAttendance,
  authMembership,
} = require("../../utils/auth");
const {
  Group,
  Image,
  User,
  Venue,
  Event,
  Attendance,
  Membership,
} = require("../../db/models");

// Change the status of an attendance for an event specified by id
router.put(
  "/:eventId/attendances/:userId",
  requireAuth,
  authParams,
  authMembership,
  validateAttendanceInput,
  async (req, res, next) => {
    const attendance = await Attendance.findOne({
      where: { userId: req.body.userId, eventId: req.event.id },
    });

    if (!attendance) {
      const err = new Error(
        "Attendance between the user and the event does not exist"
      );
      err.status = 404;
      return next(err);
    }

    const { id, eventId, userId, status } = await attendance.update({
      status: req.body.status,
    });
    res.json({ id, eventId, userId, status });
  }
);

// Delete attendance to an event specified by id
router.delete(
  "/:eventId/attendances/:userId",
  requireAuth,
  authParams,
  validateAttendanceDeletion,
  async (req, res, next) => {
    const { id } = req.user;
    const { userId, eventId } = req.params;
    const attendance = await Attendance.findOne({
      where: { userId, eventId },
    });

    if (!attendance) {
      const err = new Error("Attendance does not exist for this User");
      err.status = 404;
      return next(err);
    }

    if (id !== req.group.organizerId && id != userId) {
      const err = new Error(
        "Only the User or organizer may delete an Attendance"
      );
      err.status = 403;
      return next(err);
    }

    await attendance.destroy();
    res.json({ message: "Successfully deleted attendance from event" });
  }
);

// Get all attendees of an event specified by its id
router.get("/:eventId/attendees", requireAuth, authParams, async (req, res) => {
  let attendees;
  const { eventId } = req.params;
  const currUser = await req.event.getAttendances({
    where: { userId: req.user.id },
  });

  if (
    currUser.length &&
    (currUser[0].status === "host" || currUser[0].status === "co-host")
  )
    attendees = await User.findAll({
      include: {
        model: Attendance,
        where: { eventId },
        attributes: ["status"],
      },
    });
  else
    attendees = await User.findAll({
      include: {
        model: Attendance,
        where: { eventId, status: { [Op.not]: "pending" } },
        attributes: ["status"],
      },
    });

  attendees.forEach((attendee) => {
    attendee.dataValues.Attendance = attendee.dataValues.Attendances[0];
    delete attendee.dataValues.Attendances;
  });

  res.json({ Attendees: attendees });
});

// Request to attend an event based on the event's id
router.post(
  "/:eventId/attendances",
  requireAuth,
  authParams,
  async (req, res, next) => {
    const membership = await Membership.findOne({
      where: { memberId: req.user.id, groupId: req.group.id },
    });

    if (!membership || membership.status === "pending") {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    const { id } = req.event;
    const attendance = await Attendance.findOne({
      where: { userId: req.user.id, eventId: id },
    });

    if (!attendance) {
      const { eventId, userId, status } = await req.user.createAttendance({
        eventId: id,
      });
      return res.json({ eventId, userId, status });
    }

    const err = new Error();
    err.status = 400;
    if (attendance.status === "pending")
      err.message = "Attendance has already been requested";
    else err.message = "User is already an attendees of the event";
    next(err);
  }
);

// Add an image to an event based on the event's id
router.post(
  "/:eventId/images",
  requireAuth,
  authParams,
  authAttendance,
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

// Edit an event specified by its id
router.put(
  "/:eventId",
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
    const updatedEvent = await req.event.update({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    delete updatedEvent.dataValues.createdAt;
    delete updatedEvent.dataValues.updatedAt;
    updatedEvent.dataValues.startDate = new Date(
      updatedEvent.dataValues.startDate
    )
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/g, "");
    updatedEvent.dataValues.endDate = new Date(updatedEvent.dataValues.endDate)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/g, "");

    res.json(updatedEvent);
  }
);

// Delete an event specified by its id
router.delete(
  "/:eventId",
  requireAuth,
  authParams,
  authMembership,
  async (req, res) => {
    await req.event.destroy();
    res.json({ message: "Successfully deleted" });
  }
);

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
