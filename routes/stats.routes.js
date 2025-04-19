// route for /stats requests
const express = require('express');
const router = express.Router();

// controller functions
const stats_controller = require("../controllers/stats.controller.js");

router.get("/:residualType", stats_controller.calculateStatsByResidualType)

module.exports = router;