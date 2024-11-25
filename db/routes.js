const router = require("express").Router();
const controller = require("./controller");

router.get("/getConnection", controller.getConnection);

module.exports = router;
