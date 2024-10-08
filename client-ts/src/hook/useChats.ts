import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatV2Context } from "../context/ChatV2Context";
import { getUserChat } from "../services/chatService";
import useCheckAuthorized from "./useCheckAuthorized";

const useChats = () => {
  const { user } = useContext(AuthContext);
  const {
    chatURI,
    updateUserChats,
    notifications,
    getUserChats,
    getCurrentChat,
    getUser,
  } = useContext(ChatV2Context);
  const { handleCheckAuthorization } = useCheckAuthorized();

  const {
    data: chatsWithMsg,
    isLoading: isFetchingChats,
    error,
  } = useQuery({
    queryKey: ["Chats"],
    queryFn: () => getUserChat(user?._id, chatURI),
  });

  if (!isFetchingChats && error) {
    console.log("useChats:", error);
    handleCheckAuthorization(error);
  }

  // setup user chat
  useEffect(() => {
    const getUserChatsUF = async () => {
      if (!user) {
        updateUserChats([]);
        return;
      }

      if (isFetchingChats) return;

      console.log(chatsWithMsg);

      if (!chatsWithMsg) return;

      const chatsWithMsgUpdate = chatsWithMsg.map((chatWithMsg) => {
        const notifFound = notifications.find(
          (n) => n.message.chatId._id === chatWithMsg.chat._id
        );

        if (notifFound) {
          const nDate = Date.parse(notifFound.message.createdAt);

          if (chatWithMsg.latestMessage) {
            const lDate = Date.parse(
              chatWithMsg.latestMessage.messageId.createdAt
            );

            if (nDate > lDate) {
              chatWithMsg.latestMessage.messageId = {
                _id: notifFound.message._id,
                senderId: notifFound.message.senderId,
                text: notifFound.message.text,
                readBy: notifFound.message.readBy,
                createdAt: notifFound.message.createdAt,
                updatedAt: notifFound.message.updatedAt,
              };
            }
          }
        }

        return chatWithMsg;
      });

      // sort chats
      const sortedChats = chatsWithMsgUpdate.sort((a, b) => {
        const aLMsg = a.latestMessage;
        const bLMsg = b.latestMessage;

        // determines what to source if there's a new created chat
        if (!aLMsg) return -1;
        if (!bLMsg) return 1;

        const aDate = Date.parse(aLMsg.messageId.createdAt);
        const bDate = Date.parse(bLMsg.messageId.createdAt);

        console.log(aDate, bDate);

        if (aDate < bDate) return 1;
        if (aDate > bDate) return -1;
        return 0;
      });

      // sort chats by notification

      console.log("Setting User Chats");
      updateUserChats(sortedChats);
    };

    getUserChatsUF();
  }, [user, chatsWithMsg, isFetchingChats, updateUserChats, notifications]);

  // Chat Functionality

  return { isFetchingChats, error, getUserChats, getUser, getCurrentChat };
};

export default useChats;
