interface ModelIdTYpe {
  _id: string;
}
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

export interface ChatDetailType {
  name: string | null;
  isGroupChat: boolean;
  members: UserModelType[];
  groupChatAdmin: UserModelType[];
}

export type ChatModelType = ModelIdTYpe & ChatDetailType & TimeStampType;

export interface MessagesModelType extends TimeStampType {
  _id: string;
  chatId: ChatModelType;
  senderId: UserModelType;
  text: string;
  readBy: UserModelType[];
}

export interface LatestMessageModelType {
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
}

export type ChatsWithMsgModelType = {
  chat: ChatModelType;
  latestMessage?: LatestMessageModelType;
};

export type NotificationModelType = {
  timeSent: Date;
  isRead: boolean;
  message: MessagesModelType;
  count: number;
};
