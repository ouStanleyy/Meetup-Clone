const router = require("express").Router();
const { validateLogin } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth");
const { Group, Membership } = require("../../db/models");

// Get all groups
router.get("/", async (req, res, next) => {
  const Groups = await Group.findAll({ include: { model: Membership } });

  res.json({ Groups });
});

module.exports = router;
