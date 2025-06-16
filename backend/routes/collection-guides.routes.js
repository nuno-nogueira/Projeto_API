const auth = require('../controllers/auth.controller.js');

// route for /collection-guides requests
const express = require('express');
const router = express.Router();

// controller functions
const collection_guides_controller = require("../controllers/collection-guides.controller.js");

router.get("/", auth.verifyToken, collection_guides_controller.getAllGuides);
router.get("/:id", auth.verifyToken, collection_guides_controller.getGuideById);
router.post("/", auth.verifyToken, collection_guides_controller.addCollectionGuide)
router.patch('/:id', auth.verifyToken, collection_guides_controller.patchGuideStatus)

module.exports = router;