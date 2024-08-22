import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utls/unreadNotification";
import { UserNotificationType } from "../../types/ChatTypes";
import moment from "moment";

const Notification = () => {
  const {
    notifications,
    userChats,
    allUsers,
    updateCurrentChat,
    updateNotification,
    markAllNotification,
  } = useContext(ChatContext);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleMarkAllNotificationAsRead = () => {
    markAllNotification(true);
  };

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const modifiedNotifications = notifications.reduce((acc, notif) => {
    const sender = allUsers.find((u) => u.id === notif.senderId);
    if (sender) {
      acc.push({ ...notif, user: sender });
    }
    return acc;
  }, [] as UserNotificationType[]);

  const handleShowUserChatbox = (notifUser: UserNotificationType) => {
    // Show Chat Box
    const userChat = userChats?.find((u) => {
      const found = u.members.find((m) => m === notifUser.user.id);
      if (found) return true;
    });

    if (userChat) {
      updateCurrentChat(userChat);
    }

    // Update notifications mark as read
    updateNotification(notifUser.senderId, true);

    // close the notification box
    setShowNotifications(false);
  };

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={handleShowNotifications}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-left-fill"
          viewBox="0 0 20 20"
        >
          <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        </svg>
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications.length}</span>
          </span>
        )}
      </div>
      {showNotifications && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={handleMarkAllNotificationAsRead}
            >
              Mark all as read
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span>No notifications yet...</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    n.isRead ? "notification" : "notification not-read"
                  }`}
                  onClick={() => handleShowUserChatbox(n)}
                >
                  <span>{`${n.user.name} sent you a new message`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
export default Notification;
