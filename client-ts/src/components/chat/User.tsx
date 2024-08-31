import { Stack } from "react-bootstrap";
import { UserInfoType } from "../../types/UserTypes";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const User = ({
  recipient,
  showModal,
}: {
  recipient: UserInfoType;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useContext(AuthContext);
  const { createChat, userChats, updateCurrentChat } = useContext(ChatContext);

  if (!user) return;

  const handleSelectUser = () => {
    showModal(false);

    // 1. Check if no existing chat history
    const foundChat = userChats?.find((chat) => {
      return chat.members.find((member) => {
        return member._id === recipient._id;
      });
    });

    if (foundChat) {
      updateCurrentChat(foundChat);
      return;
    }

    // 2. if no chat history then create a new chat
    createChat(user._id, recipient._id);
  };

  return (
    <Stack
      direction="horizontal"
      gap={4}
      className="user-card p-3"
      onClick={handleSelectUser}
    >
      <span className="avatar">
        <img src={avatar} alt="profile picture" height="60px" />
      </span>
      <span className=" text-capitalize">{recipient.name}</span>
    </Stack>
  );
};

export default User;
