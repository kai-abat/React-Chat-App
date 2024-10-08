import {
  UserModelType,
  ChatsWithMsgModelType,
  ChatModelType,
} from "../types/dbModelTypes";

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getAvailableUsersToChat = (
  user: UserModelType,
  userChats: ChatsWithMsgModelType[]
): UserModelType[] => {
  return userChats.reduce((acc, ch) => {
    if (!ch.chat.isGroupChat) {
      const u = ch.chat.members.find((m) => m._id !== user._id);
      if (u) acc.push(u);
    }
    return acc;
  }, [] as UserModelType[]);
};

export const getChatName = (
  user: UserModelType | null,
  currentChat: ChatModelType | null
) => {
  let chatName = currentChat?.isGroupChat
    ? currentChat.name
    : currentChat?.members
        .filter((m) => m._id !== user?._id)
        .map((c) => c.name)
        .join(", ");

  if (!chatName) chatName = "No Name";
  return chatName;
};

export const truncateText = (text: string) => {
  let shortText = text.substring(0, 20);
  if (text.length > 20) shortText += "...";
  return shortText;
};

export const isNotAuthorized = (errMsg: string): boolean => {
  return errMsg.toLowerCase().startsWith("not authorized") ? true : false;
};
