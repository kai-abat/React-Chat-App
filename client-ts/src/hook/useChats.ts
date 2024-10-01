import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatV2Context } from "../context/ChatV2Context";
import { useQuery } from "@tanstack/react-query";
import { getUserChat } from "../services/chatService";

const useChats = () => {
  const { user } = useContext(AuthContext);
  const { chatURI } = useContext(ChatV2Context);

  const {
    data: chats,
    isLoading: isFetchingChats,
    error,
  } = useQuery({
    queryKey: ["Chats"],
    queryFn: () => getUserChat(user?._id, chatURI),
  });

  return { chats, isFetchingChats, error };
};

export default useChats;
