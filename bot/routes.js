const router = require("express").Router();
const controller = require("./controller");

router.get("/getRules/:player", controller.getRules);
router.post("/addRules", controller.addRules);

module.exports = router;
