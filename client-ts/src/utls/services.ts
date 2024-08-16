import { ChatInfoType } from "../types/ChatTypes";
import { UserInfoType } from "../types/UserTypes";

export const baseUrl: string = "http://localhost:3010/api";

type UserResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { user: UserInfoType };
    };

type ChatResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { chats: ChatInfoType[] };
    };

export const postRequest = async (
  url: string,
  body: string
): Promise<UserResponseType> => {
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    const data = await response.json();

    if (!response.ok) {
      let message: string;
      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { failure: { message } };
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
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      let message: string;
      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { failure: { message } };
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

export const getChatRequest = async (
  url: string
): Promise<ChatResponseType> => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      let message: string;
      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { failure: { message } };
    }

    const chats: ChatInfoType[] = data.map((c) => {
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
