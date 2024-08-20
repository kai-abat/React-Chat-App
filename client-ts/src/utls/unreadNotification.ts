import { NotificationType } from "../types/ChatTypes";

export const unreadNotificationsFunc = (
  notifications: NotificationType[]
): NotificationType[] => {
  return notifications.filter((n) => n.isRead === false);
};
