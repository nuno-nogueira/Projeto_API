// route for /collection-guides requests
const express = require('express');
const router = express.Router();

// controller functions
const collection_plan_controller = require("../controllers/collection-plan.controller.js");
const authController = require("../controllers/auth.controller.js")

router.get("/",authController.verifyToken, collection_plan_controller.getPlan);