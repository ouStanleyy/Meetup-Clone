const router = require("express").Router();
const sequelize = require("sequelize");
const {
  validateGroupInput,
  validateVenueInput,
} = require("../../utils/validation");
const { requireAuth, authorize, authorizeRole } = require("../../utils/auth");
const { Group, Membership, Image, User, Venue } = require("../../db/models");

// Edit a venue specified by its id
router.put(
  "/:venueId",
  requireAuth,
  authorizeRole,
  validateVenueInput,
  async (req, res) => {
    const { address, city, state, lat, lng } = req.body;
    const updatedVenue = await req.venue.update({
      address,
      city,
      state,
      lat,
      lng,
    });

    delete updatedVenue.dataValues.updatedAt;

    res.json(updatedVenue);
  }
);

module.exports = router;
