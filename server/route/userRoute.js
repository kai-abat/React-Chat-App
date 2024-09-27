const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// register user
router.post("/register", userController.registerUser);

// login user
router.post("/login", userController.loginUser);

// search for users
router.route("/search").get(protect, userController.searchUsers);

// get user by id: 66bd925d21f3eaa8bab043a1
router.get("/:userId", userController.findUser);

// get user by id

// get all users
router.get("/", userController.getUsers);

module.exports = router;
