// route for /collection-guides requests
const express = require('express');
const router = express.Router();

// controller functions
const collection_points_controller = require("../controllers/collection-points.controller.js");

router.get("/", collection_points_controller.getAllPoints);
router.get("/:id", collection_points_controller.getPointById);

router.post("/", collection_points_controller.addPoint);

router.put("/:id", collection_points_controller.updateCollectionPoint);

router.delete("/:id", collection_points_controller.deletePoint);
module.exports = router;