const auth = require('../controllers/auth.controller.js');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/readings.controller.js');
const authController = require("../controllers/auth.controller.js")

router.get('/:user_id', authController.verifyToken, controller.getReadingsByWasteType);
router.get('/collection-guides/:guideID', auth.verifyToken, controller.getReadingsByGuide); 
router.post('/', auth.verifyToken, controller.addReading); 
router.patch('/:readingID', auth.verifyToken, controller.updateReading); 

module.exports = router;