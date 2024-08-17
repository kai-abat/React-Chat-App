const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// register user
router.post("/register", userController.registerUser);

// login user
router.post("/login", userController.loginUser);

// get user by id: 66bd925d21f3eaa8bab043a1
router.get("/:userId", userController.findUser);

// get all users
router.get("/", userController.getUsers);

module.exports = router;
