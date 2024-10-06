import { UserModelType, ChatsWithMsgModelType } from "../types/dbModelTypes";

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
