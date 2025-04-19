

// controller functions
const collection_points_controller = require("../controllers/collection-points.controller.js");

router.get("/", collection_points_controller.getAllPoints);
router.get("/:id", collection_points_controller.getPointById);

router.post("/", collection_points_controller.validateBodyData, collection_points_controller.addCollectionPoint);

router.put("/:id", collection_points_controller.validateBodyData, collection_points_controller.updatePointInfo)

router.delete("/:id", collection_points_controller.deletePoint)
module.exports = router;