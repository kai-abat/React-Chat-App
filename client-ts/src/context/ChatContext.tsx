import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  ChatInfoType,
  CreateChatBodyType,
  MessageInfoType,
  NotificationType,
} from "../types/ChatTypes";
import { OnlineUsersType, UserInfoType } from "../types/UserTypes";
import {
  baseUrl,
  getAllChatRequest,
  getAllMessageOfCurrentChatRequest,
  getAllUsersRequest,
  postCreateChatRequest,
  postSendTextMessageRequest,
} from "../utls/services";

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
  onlineUsers: OnlineUsersType[];
  notifications: NotificationType[];
  allUsers: UserInfoType[];
  updateNotification: (senderId: string, isRead: boolean) => void;
  markAllNotification: (isRead: boolean) => void;
  markAsReadThisNotification: (recipientUser: UserInfoType) => void;
  newMessage: MessageInfoType | null;
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
  const [socket, setSocket] = useState<Socket<any> | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsersType[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [allUsers, setAllUsers] = useState<UserInfoType[]>([]);

  // initialize socket
  useEffect(() => {
    if (!user) return;
    const newSocket = io("http://localhost:3020");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Add online user from socket
  useEffect(() => {
    if (socket === null || user === null) return;
    socket.emit("addNewUser", user.id);

    socket.on("getOnlineUsers", (res: OnlineUsersType[]) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  // send message to the server using socket
  useEffect(() => {
    if (socket === null || user === null || currentChat === null) return;

    const recipientId = currentChat.members.find((m) => m !== user.id);

    socket.emit("sendMessage", { ...newMessage, recipientId: recipientId });
  }, [newMessage, socket, user, currentChat]);

  // recieving the message
  useEffect(() => {
    if (socket === null || currentChat === null) return;
    socket.on("getMessage", (res: MessageInfoType) => {
      if (currentChat.id !== res.chatId) return;

      setMessages((prev) => {
        if (!prev) return [res];
        return [...prev, res];
      });
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

  // get notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getNotification", (res: NotificationType) => {
      const isChatOpen = currentChat?.members.find((m) => m === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // get all users
  useEffect(() => {
    const getUsers = async () => {
      const response = await getAllUsersRequest(`${baseUrl}/users`);

      if (response.failure) {
        return console.log("No users found!");
      }

      setAllUsers(response.success.users);

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

        setUserChats(response.success.chats);
      }
    };
    getUserChats();
  }, [user, notifications]);

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

  // upate the notification
  const markAsReadThisNotification = useCallback(
    (recipientUser: UserInfoType) => {
      const senderId = recipientUser.id;
      setNotifications((prev) => {
        return prev.map((n) => {
          if (n.senderId === senderId) {
            return { ...n, isRead: true };
          }
          return n;
        });
      });
    },
    []
  );

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

  const updateNotification = useCallback(
    (senderId: string, isRead: boolean) => {
      const updatedNotification = notifications.map((n) => {
        if (n.senderId === senderId) {
          return { ...n, isRead: isRead };
        }
        return n;
      });

      setNotifications(updatedNotification);
    },
    [notifications]
  );

  const markAllNotification = useCallback(
    (isRead: boolean) => {
      const markNotif = notifications.map((n) => {
        if (!n.isRead) return { ...n, isRead: isRead };
        return n;
      });
      setNotifications(markNotif);
    },
    [notifications]
  );

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
        onlineUsers,
        notifications,
        allUsers,
        updateNotification,
        markAllNotification,
        markAsReadThisNotification,
        newMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
