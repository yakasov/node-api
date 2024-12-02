const router = require("express").Router();
const controller = require("./controller");

// router.get("/getCards", controller.getCards);
// router.get("/getCache", controller.getCache);
router.post("/saveCards", controller.saveCards);

module.exports = router;
