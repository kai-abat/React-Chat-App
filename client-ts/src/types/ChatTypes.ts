export interface ChatInfoType {
  id: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatBodyType {
  firstId: string;
  secondId: string;
}

export interface MessageInfoType {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}
