import { UserInfoType } from "./UserTypes";

export interface ChatInfoType {
  _id: string;
  members: UserInfoType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatBodyType {
  userIds: string[];
}

export interface MessageInfoType {
  _id: string;
  chatId: ChatInfoType;
  senderId: UserInfoType;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationType {
  senderId: UserInfoType;
  isRead: boolean;
  date: Date;
}

export interface UserNotificationType extends NotificationType {
  user: UserInfoType;
}
