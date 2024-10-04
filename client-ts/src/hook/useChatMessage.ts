import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import { getChatMessage, sendTextMessage } from "../services/chatService";
import { AuthContext } from "../context/AuthContext";

const useChatBox = () => {
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

  const {
    data: chatMessages,
    isLoading: isFetchingMessages,
    error,
  } = useQuery({
    queryKey: ["Current_Chat_Messages", currentChat?._id],
    queryFn: () => getChatMessage(currentChat?._id, messageURI),
  });

  const { mutate: sendTextMessageMutate } = useMutation({
    mutationFn: sendTextMessage,
    onSuccess: (newMessage) => {
      if (currentChat) {
        setNewMessage(newMessage);
        setCurrentMessages((prev) => (prev = [...prev, newMessage]));
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

  const chatName = currentChat?.isGroupChat
    ? currentChat.name
    : currentChat?.members
        .filter((m) => m._id !== user?._id)
        .map((c) => c.name)
        .join(", ");

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
