import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import { getChatMessage } from "../services/chatService";
import { ChatModelType } from "../types/MongoDBModelTypes";

const useChatMessage = (chat: ChatModelType | null) => {
  const { messageURI } = useContext(ChatV2Context);

  const {
    data: chatMessages,
    isLoading: isFetchingMessages,
    error,
  } = useQuery({
    queryKey: ["Current_Chat_Messages", chat?._id],
    queryFn: () => getChatMessage(chat?._id, messageURI),
  });

  return { chatMessages, isFetchingMessages, error };
};

export default useChatMessage;
