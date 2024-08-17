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
  getAllMessageOfCurrentChatRequest,
  postGenericRequest,
  postSendTextMessageRequest,
} from "../utls/services";
import {
  ChatInfoType,
  CreateChatBodyType,
  MessageInfoType,
} from "../types/ChatTypes";

interface ChatContextType {
  userChats: ChatInfoType[] | null;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
  otherUsersChat: null | UserInfoType[];
  createChat: (firstId: string, secondId: string) => Promise<void>;
  updateCurrentChat: (chat: ChatInfoType) => void;
  messages: MessageInfoType[] | null;
  isMessagesLoading: boolean;
  messagesError: string | null;
  currentChat: ChatInfoType | null;
  sendTextMessage: (
    textMessage: string,
    sender: UserInfoType,
    currentChatId: string,
    setTextMessage: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
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
  const [currentChat, setCurrentChat] = useState<ChatInfoType | null>(null);
  // message state
  const [messages, setMessages] = useState<MessageInfoType[] | null>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sendTextMessageError, setSendTextMessageError] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState<MessageInfoType | null>(null);

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

  // get chat messages
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await getAllMessageOfCurrentChatRequest(
          `${baseUrl}/messages/${currentChat.id}`
        );

        setIsMessagesLoading(false);

        if (response.failure) {
          return setMessagesError(response.failure.message);
        }

        const sortedMessages = response.success.messages
          .slice()
          .sort((a, b) => {
            const createdAt1 = Date.parse(a.createdAt);
            const createdAt2 = Date.parse(b.createdAt);
            return createdAt1 - createdAt2;
          });
        console.log("UseEffect Current Chat Messages:", sortedMessages);
        setMessages(sortedMessages);
      }
    };
    getMessages();
  }, [currentChat]);

  // send text message
  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: UserInfoType,
      currentChatId: string,
      setTextMessage: React.Dispatch<React.SetStateAction<string>>
    ) => {
      if (!textMessage) return;

      console.log("textMessage", textMessage);
      const response = await postSendTextMessageRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          senderId: sender.id,
          text: textMessage,
          chatId: currentChatId,
        })
      );

      if (response.failure) {
        return setSendTextMessageError(response.failure.message);
      }
      setNewMessage(response.success.message);
      setMessages((prev) => {
        if (!prev) {
          return (prev = [response.success.message]);
        } else {
          return [...prev, response.success.message];
        }
      });
      setTextMessage("");
    },
    []
  );

  // selecting chat wiill show chat box
  const updateCurrentChat = useCallback((chat: ChatInfoType) => {
    setCurrentChat(chat);
  }, []);

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
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
