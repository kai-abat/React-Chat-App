import {
  UserResponseType,
  AllUsersResponseType,
  ChatResponseType,
  ChatsResponseType,
} from "../types/APIReturnTypes";
import { ChatInfoType } from "../types/ChatTypes";
import { UserInfoType } from "../types/UserTypes";
import {
  getFetchRequest,
  getCatchErrorMessage,
  postFetchRequest,
} from "./apiRequests";

export const baseUrl: string = "http://localhost:3010/api";

export const postUserRequest = async (
  url: string,
  body: string
): Promise<UserResponseType> => {
  try {
    const { status, data, error } = await postFetchRequest(url, body);
    if (!status && error) {
      return { failure: { message: error } };
    }

    const user: UserInfoType = {
      id: data._id,
      name: data.name,
      email: data.email,
      token: data.token,
    };
    return { success: { user } };
  } catch (error) {
    let errMsg: string | undefined;
    if (typeof error === "string") {
      errMsg = error.toUpperCase();
    } else if (error instanceof Error) {
      errMsg = error.message;
    }

    console.log(error);
    return { failure: { message: `Server Error: ${errMsg}` } };
  }
};

export const getUserRequest = async (
  url: string
): Promise<UserResponseType> => {
  try {
    const { status, data, error } = await getFetchRequest(url);
    if (!status && error) {
      return { failure: { message: error } };
    }

    const user: UserInfoType = {
      id: data._id,
      name: data.name,
      email: data.email,
      token: data.token,
    };
    return { success: { user } };
  } catch (error) {
    const errMsg = getCatchErrorMessage(error);
    console.log(error);
    return { failure: { message: `Server Error: ${errMsg}` } };
  }
};

export const getAllUsersRequest = async (
  url: string
): Promise<AllUsersResponseType> => {
  try {
    const { status, data, error } = await getFetchRequest(url);
    if (!status && error) {
      return { failure: { message: error } };
    }

    const users: UserInfoType[] = data.map((u: any) => {
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        token: u.token,
      };
    });

    return { success: { users } };
  } catch (error) {
    const errMsg = getCatchErrorMessage(error);
    console.log(error);
    return { failure: { message: `Server Error: ${errMsg}` } };
  }
};

export const postCreateChatRequest = async (
  url: string,
  body: string
): Promise<ChatResponseType> => {
  try {
    const { status, data, error } = await postFetchRequest(url, body);
    if (!status && error) {
      return { failure: { message: error } };
    }

    const chat: ChatInfoType = {
      id: data._id,
      members: data.members.slice(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return { success: { chat } };
  } catch (error) {
    let errMsg: string | undefined;
    if (typeof error === "string") {
      errMsg = error.toUpperCase();
    } else if (error instanceof Error) {
      errMsg = error.message;
    }

    console.log(error);
    return { failure: { message: `Server Error: ${errMsg}` } };
  }
};

export const getAllChatRequest = async (
  url: string
): Promise<ChatsResponseType> => {
  try {
    const { status, data, error } = await getFetchRequest(url);
    if (!status && error) {
      return { failure: { message: error } };
    }

    const chats: ChatInfoType[] = data.map((c: any) => {
      return {
        id: c._id,
        members: c.members.slice(),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return { success: { chats } };
  } catch (error) {
    let errMsg: string | undefined;
    if (typeof error === "string") {
      errMsg = error.toUpperCase();
    } else if (error instanceof Error) {
      errMsg = error.message;
    }

    console.log(error);
    return { failure: { message: `Server Error: ${errMsg}` } };
  }
};
