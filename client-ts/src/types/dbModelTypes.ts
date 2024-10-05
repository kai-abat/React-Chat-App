interface TimeStampType {
  createdAt: string;
  updatedAt: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
}

export type UserModelType = UserType & TimeStampType;

export interface UserAuthType extends UserModelType {
  token: string;
}

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
    senderId: UserModelType;
    readBy: UserModelType[];
    text: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type ChatsWithMsgModelType = {
  chat: ChatModelType;
  latestMessage: LatestMessageModelType;
};

export type NotificationModelType = {
  timeSent: Date;
  isRead: boolean;
  message: MessagesModelType;
  count: number;
};
