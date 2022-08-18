const jwt = require("jsonwebtoken");
const {
  jwtConfig: { secret, expiresIn },
} = require("../config");
const { User, Group, Membership, Venue, Event } = require("../db/models");

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  const token = jwt.sign({ data: user.toSafeObject() }, secret, {
    expiresIn: parseInt(expiresIn),
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    maxAge: expiresIn * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

// Checks current user through JWT
const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (!err) {
      try {
        req.user = await User.getCurrentUserById(jwtPayload.data.id);
      } catch (err) {}
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = (req, _res, next) => {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.status = 401;
  return next(err);
};

// // Checks permission
// const authorize = async (req, _res, next) => {
//   req.group = await Group.findByPk(req.params.groupId);

//   if (!req.group) {
//     const err = new Error("Group couldn't be found");
//     err.status = 404;
//     return next(err);
//   } else if (req.user.id === req.group.organizerId) return next();

//   const err = new Error("Forbidden");
//   err.status = 403;
//   return next(err);
// };

// Checks params
const authParams = async (req, _res, next) => {
  const { groupId, venueId, eventId } = req.params;
  let errorType;

  if (eventId) {
    req.event = await Event.findByPk(eventId);
    if (!req.event) errorType = "Event";
  }
  if (venueId || req.body.venueId) {
    req.venue = await Venue.findByPk(venueId || req.body.venueId);
    if (!req.venue) errorType = "Venue";
  }
  if (groupId || req.event || req.venue) {
    req.event
      ? (req.group = await Group.findByPk(groupId || req.event.groupId))
      : (req.group = await Group.findByPk(groupId || req.venue.groupId));
    if (!req.group) errorType = "Group";
  }
  if (errorType) {
    const err = new Error(`${errorType} couldn't be found`);
    err.status = 404;
    return next(err);
  }
  next();
};

// Checks ownership of group
const authOwnership = async (req, _res, next) => {
  if (req.user.id === req.group.organizerId) return next();

  const err = new Error("Forbidden");
  err.status = 403;
  next(err);
};

// Checks user role in memberships
const authMembership = async (req, _res, next) => {
  req.membership = await Membership.findOne({
    where: { memberId: req.user.id, groupId: req.group.id },
  });

  if (
    req.membership &&
    (req.membership.status === "host" || req.membership.status === "co-host")
  )
    return next();

  const err = new Error("Forbidden");
  err.status = 403;
  next(err);
};

// Checks user role in attendances
const authAttendance = async (req, _res, next) => {
  // const { eventId } = req.params;

  // if (eventId) {
  //   req.event = await Event.findByPk(eventId);
  //   if (!req.event) {
  //     const err = new Error("Event couldn't be found");
  //     err.status = 404;
  //     return next(err);
  //   }
  // }

  req.attendance = await req.event.getAttendances({
    where: { userId: req.user.id },
  });

  if (
    req.attendance.length &&
    (req.attendance[0].status === "host" ||
      req.attendance[0].status === "co-host" ||
      req.attendance[0].status === "member")
  )
    return next();

  const err = new Error("Forbidden");
  err.status = 403;
  next(err);
};

// Checks user role
const authorizeRole = async (req, _res, next) => {
  const { groupId, venueId, eventId } = req.params;
  let errorType;

  if (eventId) {
    req.event = await Event.findByPk(eventId);
    if (!req.event) errorType = "Event";
    // else {
    //   req.venue = await Venue.findByPk(req.event.venueId);
    //   req.group = await Group.findByPk(req.venue.groupId);
    // }
  }
  if (groupId || req.event) {
    req.group = await Group.findByPk(groupId || req.event.groupId);
    if (!req.group) errorType = "Group";
  }
  if (venueId || req.body.venueId) {
    req.venue = await Venue.findByPk(venueId || req.body.venueId);
    if (!req.venue) errorType = "Venue";
    // req.group = await Group.findByPk(req.venue.groupId);
  }

  // if ((eventId || venueId) && !req.venue) {
  //   const err = new Error("Venue couldn't be found");
  //   err.status = 404;
  //   return next(err);
  // }

  if (errorType) {
    const err = new Error(`${errorType} couldn't be found`);
    err.status = 404;
    return next(err);
  }

  req.membership = await req.group.getMemberships({
    where: { memberId: req.user.id },
  });
  // req.membership = await Membership.findOne({
  //   where: { memberId: req.user.id, groupId: req.params.groupId },
  // });
  if (
    req.membership.length &&
    (req.membership[0].status === "host" ||
      req.membership[0].status === "co-host")
  )
    return next();

  const err = new Error("Forbidden");
  err.status = 403;
  return next(err);
};

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  // authorize,
  // authorizeRole,
  // authorizeAttendanceRole,
  authParams,
  authOwnership,
  authMembership,
  authAttendance,
};
