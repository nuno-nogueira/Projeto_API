// route for /collection-guides requests
const express = require('express');
const router = express.Router();

// controller functions
const collection_points_controller = require("../controllers/collection-points.controller.js");
const authController = require("../controllers/auth.controller.js")

router.get("/", authController.verifyToken, collection_points_controller.getAllPoints);
router.get("/:id", collection_points_controller.getPointById);

router.post("/", authController.verifyToken, collection_points_controller.addPoint);

router.put("/:id", authController.verifyToken, collection_points_controller.updateCollectionPoint);
//router.patch("/:id", authController.verifyToken, collection_points_controller.updateCollectionPoint);
router.delete("/:id", authController.verifyToken, collection_points_controller.deletePoint);
module.exports = router;