const { Router } = require("express");
const space = require("../models/space");
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

module.exports = router;
