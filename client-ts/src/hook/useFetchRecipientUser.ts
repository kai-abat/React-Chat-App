import { ChatModelType, UserModelType } from "../types/dbModelTypes";
import { UserInfoType } from "../types/UserTypes";

export const useFetchRecipientUser = (
  chat: ChatModelType | null,
  user: UserInfoType | null
) => {
  let recipientUser: UserModelType | undefined;

  if (chat && !chat.isGroupChat) {
    recipientUser = chat.members.find((m) => m._id !== user?._id);
  }
  return { recipientUser };
};
