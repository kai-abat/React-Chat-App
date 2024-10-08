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
  const { name, isGroupChat, members, groupChatAdmin } = req.body;

  try {
    if (isGroupChat) {
      console.log(
        "create group chat input values:",
        name,
        isGroupChat,
        members,
        groupChatAdmin
      );
      // return if existing group is already exist
      // no logic for this yet.

      if (!name) {
        return res.status(401).json({ message: "Group chat name required" });
      }

      if (members.length < 3) {
        return res
          .status(401)
          .json({ message: "Group chat required 3 members or more!" });
      }

      if (groupChatAdmin.length < 1) {
        return res
          .status(401)
          .json({ message: "Group chat required atleast 1 admin!" });
      }

      const newChat = new chatModel({
        name,
        isGroupChat: true,
        members: members,
        groupChatAdmin: groupChatAdmin,
      });

      let response = await newChat.save();
      response = await response.populate(populateRef);
      console.log("create group chat: response:", response);

      res.status(200).json(response);
    } else {
      const admin = members[0];
      const chat = await chatModel
        .findOne({
          members: { $all: members },
        })
        .populate(populateRef);

      console.log("found chat:", chat);

      if (chat) return res.status(200).json(chat);

      const newChat = new chatModel({
        members: members,
        groupChatAdmin: [admin],
      });

      let response = await newChat.save();
      response = await response.populate(populateRef);
      console.log("create chat:", response);

      res.status(200).json(response);
    }
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
