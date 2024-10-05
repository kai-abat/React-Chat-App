const chatModel = require("../models/chatModel");
const latestMessageModel = require("../models/latestMessageModel");

const populateRef = [
  { path: "members", select: "-password" },
  { path: "groupChatAdmin", select: "-password" },
];
const populateLMsgRef = [
  {
    path: "messageId",
    populate: [
      {
        path: "senderId",
        select: "-password",
      },
      {
        path: "readBy",
        select: "-password",
      },
    ],
  },
];

// api end points

// createChat
// regular chat (not a group chat)
const createChat = async (req, res) => {
  const { userIds } = req.body;

  try {
    const admin = userIds[0];
    const chat = await chatModel
      .findOne({
        members: { $all: userIds },
      })
      .populate(populateRef);

    console.log("found chat:", chat);

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: userIds,
      groupChatAdmin: [admin],
    });

    let response = await newChat.save();
    response = await response.populate(populateRef);
    console.log("create chat:", response);

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
      .populate(populateRef);

    const userChatsWithMsg = await Promise.all(
      userChats.map(async (chat) => {
        const latestMsg = await latestMessageModel
          .findOne({ chatId: chat._id })
          .populate(populateLMsgRef);

        return { chat, latestMessage: latestMsg };
      })
    );

    res.status(200).json(userChatsWithMsg);
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
      .populate(populateRef);

    const latestMsg = await latestMessageModel
      .findOne({ chatId: userChat._id })
      .populate(populateLMsgRef);

    res.status(200).json({ ...userChat, latestMsg });
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
