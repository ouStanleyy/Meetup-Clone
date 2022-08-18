const router = require("express").Router();
const {} = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Image } = require("../../db/models");

// Delete an image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const image = await Image.unscoped().findByPk(req.params.imageId);

  if (!image) {
    const err = new Error("Image couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (req.user.id !== image.userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  await image.destroy();
  res.json({ message: "Successfully deleted", statusCode: 200 });
});

module.exports = router;
