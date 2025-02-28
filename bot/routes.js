const router = require("express").Router();
const controller = require("./controller");

router.get("/getRules", controller.getRules);
router.post("/addRules", controller.addRules);

module.exports = router;
