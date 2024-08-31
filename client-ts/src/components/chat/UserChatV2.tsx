import moment from "moment";
import { useContext } from "react";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { ChatContext } from "../../context/ChatContext";
import { useFetchLatestMessage } from "../../hook/useFetchLatestMessage";
import { useFetchRecipientUser } from "../../hook/useFetchRecipientUser";
import { ChatInfoType } from "../../types/ChatTypes";
import { UserInfoType } from "../../types/UserTypes";

// Component that display the user's with chat history
const UserChatV2 = ({
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
    (olUser) => olUser.user._id === recipientUser?._id
  );

  const recipientNotification = notifications.filter(
    (n) => n.senderId._id === recipientUser?._id && n.isRead === false
  );

  const numberOfNotification = recipientNotification.length;

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
      <div className="avatar">
        {/* <div className="me-2">
          <img src={avatar} alt="profile picture" height="35px" />
        </div> */}
        <img src={avatar} alt="profile picture" height="60px" />
        <span className={`${isOnline ? "user-online" : ""}`}></span>
      </div>

      <div className="content">
        {/* name, text msg */}
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage.text)}</span>
            )}
          </div>
        </div>

        {/* date, notification */}
        <div className="d-flex flex-column align-items-end">
          <div className="date">
            {moment(latestMessage?.createdAt)
              .calendar()
              .replace(/at /g, "at\n")}
          </div>
          <div
            className={`${
              numberOfNotification > 0 ? "this-user-notifications" : ""
            }`}
          >
            {numberOfNotification > 0 ? numberOfNotification : ""}
          </div>
        </div>
      </div>
    </Stack>
  );
};
export default UserChatV2;
