const router = require("express").Router();
const controller = require("./controller");

router.get("/getCards/:player", controller.getLeaderboard);
router.post("/setLeaderboard", controller.setLeaderboard);

module.exports = router;
