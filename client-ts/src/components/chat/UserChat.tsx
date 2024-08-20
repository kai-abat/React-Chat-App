import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hook/useFetchRecipientUser";
import { ChatInfoType } from "../../types/ChatTypes";
import { UserInfoType } from "../../types/UserTypes";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import moment from "moment";
import { useFetchLatestMessage } from "../../hook/useFetchLatestMessage";

// Component that display the user's with chat history
const UserChat = ({
  chat,
  user,
}: {
  chat: ChatInfoType;
  user: UserInfoType;
}) => {
  const {
    onlineUsers,
    notifications,
    updateCurrentChat,
    markAsReadThisNotification,
  } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { latestMessage } = useFetchLatestMessage(chat);

  const isOnline = onlineUsers.some(
    (olUser) => olUser.userId === recipientUser?.id
  );

  const recipientNotification = notifications.filter(
    (n) => n.senderId === recipientUser?.id && n.isRead === false
  );

  const numberOfNotification = recipientNotification.length;

  // const latestNotification = recipientNotification[0];

  const handleClickChat = () => {
    updateCurrentChat(chat);
    if (recipientUser) {
      markAsReadThisNotification(recipientUser);
    }
  };

  const truncateText = (text: string) => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) shortText += "...";
    return shortText;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={handleClickChat}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="profile picture" height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={`${
            numberOfNotification > 0 ? "this-user-notifications" : ""
          }`}
        >
          {numberOfNotification > 0 ? numberOfNotification : ""}
        </div>
        <span className={`${isOnline ? "user-online" : ""}`}></span>
      </div>
    </Stack>
  );
};
export default UserChat;
