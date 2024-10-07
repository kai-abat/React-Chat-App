import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat } from "../services/chatService";
import { useContext } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import { ToasterContext } from "../context/ToasterContext";
import { ChatDetailType, UserModelType } from "../types/dbModelTypes";

const useCreateChat = (title: string) => {
  const queryClient = useQueryClient();
  const { showToaster } = useContext(ToasterContext);
  const { updateCurrentChat, chatURI, handleCreateGroupChatError } =
    useContext(ChatV2Context);
  const { mutate: createChatMutate } = useMutation({
    mutationFn: createChat,
    onSuccess: async (chat) => {
      await queryClient.invalidateQueries({ queryKey: ["Chats"] });
      updateCurrentChat(chat);
    },
    onError: (err) => {
      if (title === "Create Group Chat") {
        console.log("useCreateChat: Create Group Chat: err", err.message);
        handleCreateGroupChatError([err.message]);
      } else {
        showToaster(title, err.message);
      }
    },
  });

  const handleCreateChat = (user: UserModelType, recipient: UserModelType) => {
    const body: ChatDetailType = {
      name: null,
      isGroupChat: false,
      groupChatAdmin: [],
      members: [user, recipient],
    };
    createChatMutate({ url: chatURI, body });
  };

  const handleCreateGroupChat = (data: ChatDetailType) => {
    createChatMutate({ url: chatURI, body: data });
  };
  return { handleCreateChat, handleCreateGroupChat };
};
export default useCreateChat;
