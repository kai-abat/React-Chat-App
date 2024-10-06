import { UserAuthType, UserModelType } from "../types/dbModelTypes";
import { timeout } from "../utls/helper";

export const getUserAuth = async (url: string): Promise<UserModelType> => {
  console.log("Executing service getUserAuth....");
  const token = localStorage.getItem("Gchat_Token");

  const response = await fetch(`${url}/auth`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

type LoginArgs = {
  url: string;
  email: string;
  password: string;
};
export const loginUser = async (args: LoginArgs): Promise<UserAuthType> => {
  const { url, email, password } = args;
  const body = {
    email,
    password,
  };

  const targetUrl = `${url}/login`;
  console.log("loginUser:", targetUrl, body);

  await timeout(2000);

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

type RegisterArgs = {
  url: string;
  name: string;
  email: string;
  password: string;
};
export const registerUser = async (
  args: RegisterArgs
): Promise<UserAuthType> => {
  const { url, name, email, password } = args;
  const body = {
    name,
    email,
    password,
  };

  const targetUrl = `${url}/register`;
  console.log("registerUser:", targetUrl, body);

  await timeout(2000);

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
