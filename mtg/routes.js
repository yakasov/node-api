const router = require("express").Router();
const controller = require("./controller");

router.get("/getCards", controller.getCards);
router.get("/getCache", controller.getCache)

module.exports = router;
