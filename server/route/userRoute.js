const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

// sample id: 66bd925d21f3eaa8bab043a1
router.get("/:userId", userController.findUser);

router.get("/", userController.getUsers);

module.exports = router;
