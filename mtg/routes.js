const router = require("express").Router();
const controller = require("./controller");

router.get("/getCards", controller.getCards);
router.get("/getCache", controller.getCache);
router.get("/getImportStatus/:id", controller.getImportStatus);
router.get("/images/:imageId", controller.getImage);
router.post("/saveCards", controller.saveCards);

module.exports = router;
