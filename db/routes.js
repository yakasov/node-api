const router = require("express").Router();
const controller = require("./controller");

router.get("/testConnection", controller.testConnection);
router.get("/transferCache", controller.transferCache);

module.exports = router;
