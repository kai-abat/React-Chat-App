import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatV2Context } from "../context/ChatV2Context";
import { getChatMessage, sendTextMessage } from "../services/chatService";
import { getChatName } from "../utls/helper";
import useCheckAuthorized from "./useCheckAuthorized";

const useChatBox = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const {
    textMessage: inputTextMessageValue,
    setTextMessage,
    messageURI,
    setNewMessage,
    setCurrentMessages,
    newMessage,
    currentMessages,
    currentChat,
    isTyping,
    socketConnected,
    typing,
    setTyping,
    getCurrentChat,
    getUser,
  } = useContext(ChatV2Context);
  const messageToScrollRef = useRef<null | HTMLDivElement>(null);
  const { handleCheckAuthorization } = useCheckAuthorized();

  const {
    data: chatMessages,
    isLoading: isFetchingMessages,
    error,
  } = useQuery({
    queryKey: ["Current_Chat_Messages", currentChat?._id],
    queryFn: () => getChatMessage(currentChat?._id, messageURI),
  });

  if (!isFetchingMessages && error) {
    handleCheckAuthorization(error);
  }

  const { mutate: sendTextMessageMutate } = useMutation({
    mutationFn: sendTextMessage,
    onSuccess: (newMessage) => {
      if (currentChat) {
        setNewMessage(newMessage);
        setCurrentMessages((prev) => (prev = [...prev, newMessage]));
        queryClient.invalidateQueries({
          queryKey: ["Chats"],
        });
      }
    },
  });

  useEffect(() => {
    messageToScrollRef.current?.scrollIntoView({ behavior: "instant" });
  }, [newMessage, currentMessages, currentChat, isTyping]);

  useEffect(() => {
    if (!chatMessages) return;
    setCurrentMessages(chatMessages);
  }, [chatMessages, setCurrentMessages]);

  const chatName = getChatName(user, currentChat);

  // Chatbox functionality
  const sendingTextMessage = (text: string) => {
    const body = JSON.stringify({
      senderId: user?._id,
      text,
      chatId: currentChat?._id,
    });
    sendTextMessageMutate({ url: messageURI, body: body });
  };

  const showUserIsTyping = () => {
    if (socketConnected && !typing) {
      setTyping(true);
    }
  };

  const getChatMessages = () => {
    return currentMessages;
  };

  const getIsTyping = () => {
    return isTyping;
  };

  const handleInputTextMessage = (text: string) => {
    setTextMessage(text);
  };

  return {
    inputTextMessageValue,
    chatName,
    messageToScrollRef,
    isFetchingMessages,
    error,
    sendingTextMessage,
    showUserIsTyping,
    getCurrentChat,
    getUser,
    getChatMessages,
    getIsTyping,
    handleInputTextMessage,
  };
};

export default useChatBox;
