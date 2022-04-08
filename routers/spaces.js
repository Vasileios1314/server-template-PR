const { Router } = require("express");
const auth = require("../auth/middleware");
const Spaces = require("../models").space;
const Story = require("../models").story;

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const spaces = await Spaces.findAll();
    res.send(spaces);
  } catch (e) {
    console.log(e.message);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const spaceId = parseInt(req.params.id);
    const space = await Spaces.findByPk(spaceId, {
      include: [Story],
    });
    if (space) {
      res.send(space);
    } else {
      res.status(404).send("Space not found");
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:spaceId/stories/:storyId", auth, async (req, res, next) => {
  try {
    const { spaceId, storyId } = req.params;
    const story = await Story.findByPk(storyId, { include: [Spaces] });
    if (!story) {
      return res.status(404).send("Story not found");
    }

    // Check if this user is the owner of the space
    if (story.space.userId !== req.user.id) {
      return res.status(401).send("You're not authorized to delete this story");
    }

    await story.destroy();

    res.send({ message: "ok", storyId });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
