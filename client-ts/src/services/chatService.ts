import {
  ChatModelType,
  LatestMessageModelType,
  MessagesModelType,
} from "../types/MongoDBModelTypes";

export const getUserChat = async (
  id: string | undefined,
  url: string
): Promise<ChatModelType[]> => {
  if (!id) throw new Error("Not authorized");
  const token = localStorage.getItem("Gchat_Token");

  const response = await fetch(`${url}/${id}`, {
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

export const getChatMessage = async (
  chatId: string | undefined,
  url: string
): Promise<MessagesModelType[]> => {
  // get chat message
  console.log("getChatMessage:", chatId, url);
  if (!chatId) throw new Error("No chat id provided");

  const token = localStorage.getItem("Gchat_Token");

  const response = await fetch(`${url}/${chatId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  console.log("getChatMessage data:", data);

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getChatLatestMessage = async (
  chatId: string,
  url: string
): Promise<LatestMessageModelType> => {
  const token = localStorage.getItem("Gchat_Token");

  const response = await fetch(`${url}/latest/${chatId}`, {
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
