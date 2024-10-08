const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../auth/auth");

// register user
router.route("/register").post(userController.registerUser);

// login user
router.route("/login").post(userController.loginUser);

// search for users
router.route("/search").get(protect, userController.searchUsers);

router.route("/auth").get(protect, userController.getAuthUserInfo);

// get user by id: 66bd925d21f3eaa8bab043a1
router.route("/:userId").get(protect, userController.findUser);

// get user by id

// get all users
router.route("/").get(protect, userController.getUsers);

module.exports = router;
