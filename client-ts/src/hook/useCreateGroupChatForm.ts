import { useContext } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import CreateGroupChatForm from "../components/chat/CreateGroupChatForm";

const useCreateGroupChatForm = () => {
  const {
    getUser,
    getUserChats,
    groupChatForm,
    handleChangeName,
    handleAddMember,
    handleRemoveMember,
    handleAddAdmin,
  } = useContext(ChatV2Context);

  return {
    getUser,
    getUserChats,
    groupChatForm,
    handleChangeName,
    handleAddMember,
    handleRemoveMember,
    handleAddAdmin,
  };
};

export default useCreateGroupChatForm;
