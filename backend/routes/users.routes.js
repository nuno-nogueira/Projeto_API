// route for /users requests
const express = require('express');
const router = express.Router();

//controller functions
const usersController = require("../controllers/users.controller.js");

router.get("/", usersController.getAllUsers);
router.get("/:user_id", usersController.getUserById);

router.post("/", usersController.addUser);
router.post("/login", usersController.loginUser);

router.put("/:user_id", usersController.updateUserInfo)

router.delete("/:user_id", usersController.deleteUser)
module.exports = router;