import { ChatInfoType, MessageInfoType } from "./ChatTypes";
import { UserInfoType } from "./UserTypes";

export type GenericResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { message: string };
    };

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

export type MessageResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { message: MessageInfoType };
    };

export type MessagesResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { messages: MessageInfoType[] };
    };

export interface GetFetchRequestReturnType {
  status: boolean;
  data: any;
  error?: string;
}
