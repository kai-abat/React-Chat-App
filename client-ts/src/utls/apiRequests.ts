import { GetFetchRequestReturnType } from "../types/APIReturnTypes";

export const postFetchRequest = async (
  url: string,
  body: string
): Promise<GetFetchRequestReturnType> => {
  const token = localStorage.getItem("Gchat_Token");
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body,
  });

  const data = await response.json();

  let responseError: string | undefined;

  if (!response.ok) {
    let message: string;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    responseError = message;
  }

  return { status: response.ok, data, error: responseError };
};

export const getFetchRequest = async (
  url: string
): Promise<GetFetchRequestReturnType> => {
  const token = localStorage.getItem("Gchat_Token");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();

  let responseError: string | undefined;

  if (!response.ok) {
    let message: string;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    responseError = message;
  }

  return { status: response.ok, data, error: responseError };
};

export const getFetchRequestV2 = async (
  url: string
): Promise<GetFetchRequestReturnType> => {
  const token = localStorage.getItem("Gchat_Token");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();

  let responseError: string | undefined;

  if (!response.ok) {
    let message: string;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    responseError = message;
  }

  return { status: response.ok, data, error: responseError };
};

export const getCatchErrorMessage = (error: unknown): string => {
  let errMsg: string = "Unknown error";
  if (typeof error === "string") {
    errMsg = error.toUpperCase();
  } else if (error instanceof Error) {
    errMsg = error.message;
  }
  return errMsg;
};
