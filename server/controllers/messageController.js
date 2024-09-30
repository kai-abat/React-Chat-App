// const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");

const populateRef = [
  { path: "chatId", populate: { path: "members", select: "-password" } },
  { path: "senderId", select: "-password" },
  { path: "readBy", select: "-password" },
];

// Reusable Functions
const getMessageById = async (id) => {
  return await messageModel.findOne({ _id: id }).populate(populateRef);
};

// createMessage
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const readBy = [senderId];
  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
      readBy,
    });
    let saveMessage = await message.save();
    saveMessage = await saveMessage.populate(populateRef);

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
    const messages = await getMessageById(chatId);

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessage };
