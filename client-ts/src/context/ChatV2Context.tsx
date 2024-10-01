import { createContext, ReactNode, useCallback, useState } from "react";
import { ChatModelType } from "../types/MongoDBModelTypes";
import useChatMessage from "../hook/useChatMessage";

export const ENDPOINT = "http://localhost:5000";
// export const ENDPOINT = "https://react-chat-app-mlce.onrender.com"; // -> After deployment
// export const ENDPOINT = "https://gchat-92kx.onrender.com"; // -> After deployment

interface ChatV2ContextType {
  baseURI: string;
  chatURI: string;
  messageURI: string;
  userChats: ChatModelType[];
  currentChat: ChatModelType | null;
  isShowChatBox: boolean;
  setUserChats: React.Dispatch<React.SetStateAction<ChatModelType[]>>;
  updateCurrentChat: (chat: ChatModelType | null) => void;
  onShowChatBox: () => void;
  onCloseChatBox: () => void;
}

export const ChatV2Context = createContext<ChatV2ContextType>(
  {} as ChatV2ContextType
);

export const ChatV2ContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // States
  const [userChats, setUserChats] = useState<ChatModelType[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatModelType | null>(null);

  // State for chatbox open and close
  const [isShowChatBox, setIsShowChatBox] = useState<boolean>(false);

  const baseURI = ENDPOINT + "/api";
  const chatURI = baseURI + "/chats";
  const messageURI = baseURI + "/messages";

  // User Chat/Contact List -------------------------------------

  // get chat

  // create chat

  // create group chat

  // selecting chat wiil show chat box
  const updateCurrentChat = useCallback((chat: ChatModelType | null) => {
    setCurrentChat(chat);
  }, []);

  // User Chat/Contact List -------------------------------------

  // Chat Box State Section -------------------------------------
  const onShowChatBox = useCallback(() => {
    setIsShowChatBox(true);
  }, []);
  const onCloseChatBox = useCallback(() => {
    setIsShowChatBox(false);
  }, []);
  // Chat Box State Section -------------------------------------

  return (
    <ChatV2Context.Provider
      value={{
        userChats,
        baseURI,
        chatURI,
        messageURI,
        currentChat,
        isShowChatBox,
        setUserChats,
        updateCurrentChat,
        onShowChatBox,
        onCloseChatBox,
      }}
    >
      {children}
    </ChatV2Context.Provider>
  );
};
