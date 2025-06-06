const express = require('express');
const router = express.Router();
const controller = require('../controllers/readings.controller.js');

router.get('/collection-guides/:guideID', controller.getReadingsByGuide);
router.post('/', controller.addReading);
router.patch('/:readingID', controller.updateReading);

module.exports = router;