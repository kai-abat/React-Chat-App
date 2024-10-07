import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import { searchUser } from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { ChatDetailType, UserModelType } from "../types/dbModelTypes";
import { createChat } from "../services/chatService";
import { ToasterContext } from "../context/ToasterContext";

const useSearchUser = () => {
  const queryClient = useQueryClient();
  const { usersURI } = useContext(AuthContext);
  const { getUser, getUserChats, updateCurrentChat, chatURI } =
    useContext(ChatV2Context);
  const { showToaster } = useContext(ToasterContext);
  const [usersFound, setUserFound] = useState<UserModelType[]>([]);
  const title = "Search Error";

  const { mutate: searchUserMutate, isPending } = useMutation({
    mutationFn: searchUser,
    onSuccess: (users) => {
      setUserFound(users);
    },
  });

  const { mutate: createChatMutate } = useMutation({
    mutationFn: createChat,
    onSuccess: async (chat) => {
      await queryClient.invalidateQueries({ queryKey: ["Chats"] });
      updateCurrentChat(chat);
    },
    onError: (err) => {
      showToaster(title, err.message);
    },
  });

  const handleSearchUser = (keyword: string) => {
    searchUserMutate({ keyword, url: usersURI });
  };

  const handleCreateChat = (user: UserModelType, recipient: UserModelType) => {
    const body: ChatDetailType = {
      name: null,
      isGroupChat: false,
      groupChatAdmin: [],
      members: [user, recipient],
    };
    createChatMutate({ url: chatURI, body });
  };

  return {
    getUser,
    getUserChats,
    handleSearchUser,
    handleCreateChat,
    isPending,
    usersFound,
  };
};
export default useSearchUser;
