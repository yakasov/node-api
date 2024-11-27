const router = require("express").Router();
const controller = require("./controller");

router.get("/testConnection", controller.testConnection);

module.exports = router;
