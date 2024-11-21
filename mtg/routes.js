const router = require("express").Router();
const controller = require("./controller");

router.get("/getCards", controller.getCards);

module.exports = router;
