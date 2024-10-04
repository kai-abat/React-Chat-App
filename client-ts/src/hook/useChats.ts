import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatV2Context } from "../context/ChatV2Context";
import { getUserChat } from "../services/chatService";

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

  const {
    data: chatsWithMsg,
    isLoading: isFetchingChats,
    error,
  } = useQuery({
    queryKey: ["Chats"],
    queryFn: () => getUserChat(user?._id, chatURI),
  });

  // setup user chat
  useEffect(() => {
    const getUserChatsUF = async () => {
      if (!user) {
        updateUserChats([]);
        return;
      }

      if (isFetchingChats) return;

      console.log("Getting user chats..........");
      console.log(chatsWithMsg);

      if (!chatsWithMsg) return;

      const chatsWithMsgUpdate = chatsWithMsg.map((chatWithMsg) => {
        const notifFound = notifications.find(
          (n) => n.message.chatId._id === chatWithMsg.chat._id
        );

        if (notifFound) {
          const nDate = Date.parse(notifFound.message.createdAt);
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

        return chatWithMsg;
      });

      // sort chats
      const sortedChats = chatsWithMsgUpdate.sort((a, b) => {
        const aDate = Date.parse(a.latestMessage.messageId.createdAt);
        const bDate = Date.parse(b.latestMessage.messageId.createdAt);

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
