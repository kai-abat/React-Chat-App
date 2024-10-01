export type UserModelType = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatModelType = {
  _id: string;
  name: string | null;
  isGroupChat: boolean;
  members: UserModelType[];
  groupChatAdmin: UserModelType[];
  createdAt: string;
  updatedAt: string;
};

export type MessagesModelType = {
  _id: string;
  chatId: ChatModelType;
  senderId: UserModelType;
  text: string;
  readBy: UserModelType[];
  createdAt: string;
  updatedAt: string;
};

export type LatestMessageModelType = {
  _id: string;
  chatId: string;
  messageId: {
    _id: string;
    seneder: UserModelType;
    text: string;
    createdAt: string;
    updatedAt: string;
  };
};
