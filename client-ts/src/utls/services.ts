import { UserInfoType } from "../types/UserTypes";

export const baseUrl: string = "http://localhost:3010/api";

type ResponseType =
  | {
      failure: { message: string };
      success?: undefined;
    }
  | {
      failure?: undefined;
      success: { user: UserInfoType };
    };

export const postRequest = async (
  url: string,
  body: string
): Promise<ResponseType> => {
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
