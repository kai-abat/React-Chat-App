const messageModel = require("../models/messageModel");

// createMessage
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });
    let saveMessage = await message.save();
    saveMessage = await saveMessage.populate("chatId");
    saveMessage = await saveMessage.populate("chatId.members", "-password");
    saveMessage = await saveMessage.populate("senderId", "-password");

    res.status(200).json(saveMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// getMessage
const getMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await messageModel
      .find({ chatId })
      .populate({
        path: "chatId",
        model: "Chat",
        populate: { path: "members", model: "User", select: "-password" },
      })
      .populate("senderId", "-password");

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessage };
