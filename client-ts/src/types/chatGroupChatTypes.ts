import { UserModelType } from "./dbModelTypes";

export interface CreateGroupChatFormType {
  name: string;
  members: UserModelType[];
  groupChatAdmin: UserModelType[];
  errors: string[];
}
