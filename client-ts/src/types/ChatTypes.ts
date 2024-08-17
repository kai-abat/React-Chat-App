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
