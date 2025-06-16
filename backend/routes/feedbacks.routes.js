// route for /feedbacks requests
const express = require('express');
const router = express.Router();

// controller functions
const feedback_controller = require("../controllers/feedbacks.controller.js");
const authController = require("../controllers/auth.controller.js")

router.get("/:id", feedback_controller.getFeedbackById);

router.post("/", feedback_controller.addFeedback);

module.exports = router;