import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { ChatInfoType, MessageInfoType } from "../types/ChatTypes";
import { baseUrl, getAllMessageOfCurrentChatRequest } from "../utls/services";

export const useFetchLatestMessage = (chat: ChatInfoType) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState<MessageInfoType | null>(
    null
  );

  useEffect(() => {
    const getMessage = async () => {
      const response = await getAllMessageOfCurrentChatRequest(
        `${baseUrl}/messages/${chat._id}`
      );

      console.log("useFetchLatestMessage getMessage", response, chat._id);

      if (response.success) {
        const length = response.success.messages.length;
        const lastMessage = response.success.messages[length - 1];
        setLatestMessage(lastMessage);
      }
    };
    getMessage();
  }, [newMessage, notifications, chat]);

  return { latestMessage };
};
