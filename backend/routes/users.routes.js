// route for /users requests
const express = require('express');

//controller functions
const usersController = require("../controllers/users.controller.js");
const authController = require("../controllers/auth.controller.js")

const router = express.Router();

router.get("/", authController.verifyToken, usersController.getAllUsers);
router.get("/:user_id", authController.verifyToken, usersController.getUserById);

router.post("/", usersController.addUser);
router.post("/login", usersController.loginUser);

router.put("/:user_id", authController.verifyToken, usersController.updateUserInfo)

router.delete("/:user_id", authController.verifyToken, usersController.deleteUser)
module.exports = router;