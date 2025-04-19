// route for /users requests
const express = require('express');
const router = express.Router();

//controller functions
const usersController = require("../controllers/users.controller.js");

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);

router.post("/", usersController.validateSignUpData, usersController.addUser);
router.post("/login", usersController.validateLoginData);

router.put("/:id", usersController.validateSignUpData, usersController.updateUserInfo)

router.delete("/:id", usersController.deleteUser)
module.exports = router;