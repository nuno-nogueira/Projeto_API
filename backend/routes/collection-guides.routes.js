const auth = require('../controllers/auth.controller.js');

// route for /collection-guides requests
const express = require('express');
const router = express.Router();

// controller functions
const collection_guides_controller = require("../controllers/collection-guides.controller.js");

// router.get("/", auth.verifyToken, collection_guides_controller.getAllGuides);
// router.get("/:id", auth.verifyToken, collection_guides_controller.getGuideById);
// router.post("/", auth.verifyToken, collection_guides_controller.addCollectionGuide)
// router.put("/:id", auth.verifyToken, collection_guides_controller.updateGuideInfo)
// router.patch('/:id', auth.verifyToken, collection_guides_controller.updateCollectionStatus)

router.get("/", collection_guides_controller.getAllGuides); //Works
router.get("/:id", collection_guides_controller.getGuideById); //works
router.post("/", collection_guides_controller.addCollectionGuide); // 
router.patch('/:id', collection_guides_controller.patchGuideStatus); //works

module.exports = router;