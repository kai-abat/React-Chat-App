import { createContext, ReactNode, useEffect, useState } from "react";
import { UserInfoType } from "../types/UserTypes";
import { baseUrl, getChatRequest } from "../utls/services";
import { ChatInfoType } from "../types/ChatTypes";

interface ChatContextType {
  isLoading: boolean;
  userChats: ChatInfoType[] | null;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
}

export const ChatContext = createContext<ChatContextType>(
  {} as ChatContextType
);

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: UserInfoType | null;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userChats, setUserChats] = useState<ChatInfoType[] | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [userChatsError, setUserChatsError] = useState<string | null>(null);

  useEffect(() => {
    const getUserChats = async () => {
      if (!user) {
        setUserChats(null);
        return;
      }
      if (user?.id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getChatRequest(`${baseUrl}/chats/${user.id}`);

        setIsUserChatsLoading(false);

        if (response.failure) {
          return setUserChatsError(response.failure.message);
        }

        console.log("UseEffect SET Chat:", response.success.chats);
        setUserChats(response.success.chats);
      }
    };
    getUserChats();
  }, [user]);
  return (
    <ChatContext.Provider
      value={{ isLoading, userChats, isUserChatsLoading, userChatsError }}
    >
      {children}
    </ChatContext.Provider>
  );
};
