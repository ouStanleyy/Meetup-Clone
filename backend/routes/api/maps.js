const router = require("express").Router();
const { googleMapsAPIKey } = require("../../config");

router.post("/key", (_req, res) => {
  res.json({ googleMapsAPIKey });
});

module.exports = router;
