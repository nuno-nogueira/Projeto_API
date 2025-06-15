const express = require('express');
const router = express.Router();
const controller = require('../controllers/readings.controller.js');
const authController = require("../controllers/auth.controller.js")


router.get('/:user_id', authController.verifyToken, controller.getReadingsByWasteType);
router.get('/collection-guides/:guideID', controller.getReadingsByGuide);
router.post('/', controller.addReading);
router.patch('/:readingID', controller.updateReading);

module.exports = router;