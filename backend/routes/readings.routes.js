const auth = require('../controllers/auth.controller.js');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/readings.controller.js');

router.get('/collection-guides/:guideID', auth.verifyToken, controller.getReadingsByGuide); 
router.post('/', auth.verifyToken, controller.addReading); 
router.patch('/:readingID', auth.verifyToken, controller.updateReading); 

module.exports = router;