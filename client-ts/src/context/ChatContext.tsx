import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { UserInfoType } from "../types/UserTypes";
import {
  baseUrl,
  getAllUsersRequest,
  getAllChatRequest,
  postCreateChatRequest,
} from "../utls/services";
import { ChatInfoType, CreateChatBodyType } from "../types/ChatTypes";

interface ChatContextType {
  userChats: ChatInfoType[] | null;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
  otherUsersChat: null | UserInfoType[];
  createChat: (firstId: string, secondId: string) => Promise<void>;
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
  const [userChats, setUserChats] = useState<ChatInfoType[] | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [userChatsError, setUserChatsError] = useState<string | null>(null);
  const [otherUsersChat, setOtherUsersChat] = useState<null | UserInfoType[]>(
    null
  );

  // get all users
  useEffect(() => {
    const getUsers = async () => {
      const response = await getAllUsersRequest(`${baseUrl}/users`);

      if (response.failure) {
        return console.log("No users found!");
      }

      const pChats = response.success.users.filter((u) => {
        let isChatCreated = false;
        if (user?.id === u.id) return false;
        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u.id || chat.members[1] === u.id;
          });
        }

        return !isChatCreated;
      });
      setOtherUsersChat(pChats);
    };

    getUsers();
  }, [user, userChats]);

  // get chats
  useEffect(() => {
    const getUserChats = async () => {
      if (!user) {
        setUserChats(null);
        return;
      }
      if (user?.id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getAllChatRequest(`${baseUrl}/chats/${user.id}`);

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

  // create chat to other users
  const createChat = useCallback(async (firstId: string, secondId: string) => {
    const body: CreateChatBodyType = {
      firstId: firstId,
      secondId: secondId,
    };

    const response = await postCreateChatRequest(
      `${baseUrl}/chats`,
      JSON.stringify(body)
    );

    if (response.failure) {
      return setUserChatsError(response.failure.message);
    }

    setUserChats((prev) => {
      if (!prev) {
        return (prev = [response.success.chat]);
      } else {
        return [...prev, response.success.chat];
      }
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        otherUsersChat,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
