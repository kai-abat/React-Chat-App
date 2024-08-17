const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
} = require("../controllers/chatController");
const router = express.Router();

// create chat
router.post("/", createChat);

// get all chats
router.get("/:userId", findUserChats);

// get one chat
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
