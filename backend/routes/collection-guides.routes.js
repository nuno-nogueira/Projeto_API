// route for /collection-guides requests
const express = require('express');
const router = express.Router();

// controller functions
const collection_guides_controller = require("../controllers/collection-guides.controller.js");

router.get("/", collection_guides_controller.getAllGuides);
router.get("/:id", collection_guides_controller.getGuideById);

router.post("/", collection_guides_controller.addCollectionGuide)

router.put("/:id", collection_guides_controller.updateGuideInfo)
module.exports = router;