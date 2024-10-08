const express = require("express");
const {
  createMessage,
  getMessage,
  getLatestMessage,
} = require("../controllers/messageController");
const { protect } = require("../auth/auth");

const router = express.Router();

router.route("/").post(protect, createMessage);

router.route("/:chatId").get(protect, getMessage);

router.route("/latest/:chatId").get(protect, getLatestMessage);

module.exports = router;
