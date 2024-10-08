import { UserAuthType, UserModelType } from "../types/dbModelTypes";
import { timeout } from "../utls/helper";

export const getUserAuth = async (
  url: string
): Promise<UserModelType | null> => {
  console.log("Executing service getUserAuth....");

  try {
    const token = localStorage.getItem("Gchat_Token");
    console.log("getUserAuth fetching data............");
    const response = await fetch(`${url}/auth`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log("getUserAuth finished fetching data............");
    const data = await response.json();

    if (!response.ok) {
      console.log(
        `getUserAuth status is ERROR, error message is ${data.message} with status code ${response.status}`
      );
    } else {
      console.log(
        `getUserAuth status is OK, data is ${data} with status code ${response.status}`
      );
      return data;
    }
  } catch (error) {
    console.log(`catch getUserAuth THROW ERROR: ${error}`);
  }
  return null;
};

type SearchArgs = {
  url: string;
  keyword: string;
};
export const searchUser = async (
  args: SearchArgs
): Promise<UserModelType[]> => {
  const { url, keyword } = args;
  console.log("Executing service getUserAuth....");
  const token = localStorage.getItem("Gchat_Token");

  // const { data } = await axios.get(`/api/user?search=${search}`, config);
  const response = await fetch(`${url}/search?keyword=${keyword}`, {
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

  await timeout(1000);

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

  await timeout(1000);

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
