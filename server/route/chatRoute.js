const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
} = require("../controllers/chatController");
const { protect } = require("../auth/auth");
const router = express.Router();

// create chat
router.route("/").post(protect, createChat);

// get all chats
router.route("/:userId").get(protect, findUserChats);

// get one chat
router.route("/find/:firstId/:secondId").get(protect, findChat);

module.exports = router;
