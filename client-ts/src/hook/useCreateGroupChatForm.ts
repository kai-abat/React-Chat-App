import { useContext } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import useCreateChat from "./useCreateChat";

const useCreateGroupChatForm = () => {
  const {
    getUser,
    getUserChats,
    groupChatForm,
    handleChangeName,
    handleAddMember,
    handleRemoveMember,
    handleAddAdmin,
    resetCreateGroupChatForm,
  } = useContext(ChatV2Context);

  const { handleCreateGroupChat } = useCreateChat("Create Group Chat");

  return {
    getUser,
    getUserChats,
    groupChatForm,
    handleChangeName,
    handleAddMember,
    handleRemoveMember,
    handleAddAdmin,
    handleCreateGroupChat,
    resetCreateGroupChatForm,
  };
};

export default useCreateGroupChatForm;
