import moment from "moment";
import { useContext } from "react";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { ChatV2Context } from "../../context/ChatV2Context";
import { useFetchRecipientUser } from "../../hook/useFetchRecipientUser";
import { ChatsWithMsgModelType, UserModelType } from "../../types/dbModelTypes";
import { UserInfoType } from "../../types/UserTypes";

// Component that display the user's with chat history
const UserChatV3 = ({
  chatWithMsg,
  user,
}: {
  chatWithMsg: ChatsWithMsgModelType;
  user: UserModelType;
}) => {
  // const { onlineUsers, notifications } = useContext(ChatContext);

  const { chat, latestMessage } = chatWithMsg;

  const {
    updateCurrentChat,
    notifications,
    handleOnClickNotification,
    onShowChatBox,
  } = useContext(ChatV2Context);

  // const { latestMessage } = useFetchLatestMessage(chat);

  const isOnline = false;
  const numberOfNotification = 0;

  let chatName = chat.isGroupChat
    ? chat.name
    : chat.members.find((m) => m._id !== user?._id)?.name;

  if (!chatName) chatName = "No Name Found";

  /*   const isOnline = onlineUsers.some(
    (olUser) => olUser.user._id === recipientUser?._id
  );

  const recipientNotification = notifications.filter(
    (n) => n.senderId._id === recipientUser?._id && n.isRead === false
  );

  const numberOfNotification = recipientNotification.length; */

  const handleClickChat = () => {
    // if (recipientUser) {
    //   markAsReadThisNotification(recipientUser);
    // }
    const notification = notifications.find(
      (n) => n.message.chatId._id === chat._id
    );
    if (notification) {
      handleOnClickNotification(notification);
    }
    updateCurrentChat(chat);
    onShowChatBox();
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
          <div className="name">{chatName}</div>
          <div className="text">
            {latestMessage?.messageId.text && (
              <span>{truncateText(latestMessage.messageId.text)}</span>
            )}
          </div>
        </div>

        {/* date, notification */}
        <div className="d-flex flex-column align-items-end">
          <div className="date">
            {moment(latestMessage?.messageId.createdAt)
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
export default UserChatV3;
