const express = require('express');
const router = express.Router();
const controller = require('../controllers/readings.controller.js');

// GET readings by collection guide
router.get('/collection-guides/:guideID', controller.getReadingsByGuide);

// POST new reading
router.post('/', controller.addReading);

module.exports = router;
