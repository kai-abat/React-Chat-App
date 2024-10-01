const express = require("express");
const {
  createMessage,
  getMessage,
  getLatestMessage,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", createMessage);

router.get("/:chatId", getMessage);

router.get("/latest/:chatId", getLatestMessage);

module.exports = router;
