const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const latestMessageSchema = new Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);
const latestMessageModel = mongoose.model(
  "Latest_Message",
  latestMessageSchema
);
module.exports = latestMessageModel;
