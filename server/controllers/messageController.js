// const chatModel = require("../models/chatModel");
const latestMessageModel = require("../models/latestMessageModel");
const messageModel = require("../models/messageModel");

const populateRef = [
  { path: "chatId", populate: { path: "members", select: "-password" } },
  { path: "senderId", select: "-password" },
  { path: "readBy", select: "-password" },
];

const lmsgPopulateRef = [
  {
    path: "messageId",
    select: "-chatId -readBy",
    populate: [{ path: "senderId", select: "-password" }],
  },
];

// Reusable Functions
/* const getMessageById = async (id) => {
  return await messageModel.findOne({ _id: id }).populate(populateRef);
}; */

const getMessagesByChatId = async (chatId) => {
  return await messageModel.find({ chatId: chatId }).populate(populateRef);
};

const getLatestMessageByChatId = async (chatId) => {
  return await latestMessageModel
    .findOne({ chatId: chatId })
    .select("-createdAt -updatedAt")
    .populate(lmsgPopulateRef);
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

    // latest message
    const latestMessageData = {
      chatId: chatId,
      messageId: saveMessage._id,
    };
    await latestMessageModel.findOneAndUpdate(
      { chatId: chatId },
      latestMessageData,
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json(saveMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// getMessage
const getMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await getMessagesByChatId(chatId);

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getLatestMessage = async (req, res) => {
  const { chatId } = req.params;

  try {
    const latestMessage = await getLatestMessageByChatId(chatId);
    res.status(200).json(latestMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMessage, getMessage, getLatestMessage };
