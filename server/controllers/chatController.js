const chatModel = require("../models/chatModel");

// api end points

// createChat
const createChat = async (req, res) => {
  const { userIds } = req.body;

  try {
    const chat = await chatModel
      .findOne({
        members: { $all: userIds },
      })
      .populate("members", "-password");

    console.log("chat", chat);

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: userIds,
    });
    let response = await newChat.save();
    response = await response.populate("members", "-password");
    console.log("response", response);

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// findUserChats
const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userChats = await chatModel
      .find({
        members: { $in: userId },
      })
      .populate("members", "-password");

    res.status(200).json(userChats);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// findChat
const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const userChat = await chatModel
      .findOne({
        members: { $all: [firstId, secondId] },
      })
      .populate("members", "-password");

    res.status(200).json(userChat);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChat,
};
