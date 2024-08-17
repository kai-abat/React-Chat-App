import { ChatInfoType } from "./ChatTypes";
import { UserInfoType } from "./UserTypes";

export type UserResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { user: UserInfoType };
    };

export type AllUsersResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { users: UserInfoType[] };
    };

export type ChatResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { chat: ChatInfoType };
    };

export type ChatsResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { chats: ChatInfoType[] };
    };

export interface GetFetchRequestReturnType {
  status: boolean;
  data: any;
  error?: string;
}
