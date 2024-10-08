import { ChatsWithMsgModelType } from "../types/dbModelTypes";

export const DUMMY_CHATWITHMSG: ChatsWithMsgModelType = {
  chat: {
    _id: "1",
    isGroupChat: false,
    createdAt: "",
    groupChatAdmin: [],
    members: [],
    name: "",
    updatedAt: "",
  },
  latestMessage: {
    _id: "1",
    chatId: "1",
    messageId: {
      _id: "m1",
      createdAt: "2024-09-28T07:58:55.869Z",
      updatedAt: "",
      text: "LOREM IPSUMSS LOA",
      readBy: [],
      senderId: {
        _id: "s1",
        name: "DUMMY USER",
        email: "DUMMY USER EMAIL",
        createdAt: "2024-09-28T07:58:55.869Z",
        updatedAt: "",
      },
    },
  },
};
