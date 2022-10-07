const router = require("express").Router();
const usersRouter = require("./users.js");
const groupsRouter = require("./groups.js");
const venuesRouter = require("./venues.js");
const eventsRouter = require("./events.js");
const imagesRouter = require("./images.js");
const mapsRouter = require("./maps.js");
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);
router.use("/users", usersRouter);
router.use("/groups", groupsRouter);
router.use("/venues", venuesRouter);
router.use("/events", eventsRouter);
router.use("/images", imagesRouter);
router.use("/maps", mapsRouter);

module.exports = router;

// router.post("/test", (req, res) => {
//   res.json({ requestBody: req.body });
// });

// router.get("/restore-user", (req, res) => {
//   return res.json(req.user);
// });

// router.get("/require-auth", requireAuth, (req, res) => {
//   return res.json(req.user);
// });

// router.get("/set-token-cookie", async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: "Demo-lition",
//     },
//   });
//   setTokenCookie(res, user);
//   return res.json({ user });
// });
