import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  ChatInfoType,
  ChatInfoWithNewMsg,
  CreateChatBodyType,
  MessageInfoType,
  NotificationType,
} from "../types/ChatTypes";
import {
  OnlineUsersType,
  UserInfoType,
  UserPublicInfoType,
} from "../types/UserTypes";
import {
  baseUrl,
  getAllChatRequest,
  getAllMessageOfCurrentChatRequest,
  getAllUsersRequest,
  postCreateChatRequest,
  postSendTextMessageRequest,
} from "../utls/services";
import { AuthContext } from "./AuthContext";

interface ChatContextType {
  userChats: ChatInfoType[] | null;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
  otherUsersChat: null | UserInfoType[];
  createChat: (firstId: string, secondId: string) => Promise<void>;
  updateCurrentChat: (chat: ChatInfoType | null) => void;
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
  updateNotification: (senderId: UserInfoType, isRead: boolean) => void;
  markAllNotification: (isRead: boolean) => void;
  markAsReadThisNotification: (recipientUser: UserInfoType) => void;
  newMessage: MessageInfoType | null;
  sendTextMessageError: string | null;
  isShowChatBox: boolean;
  onShowChatBox: () => void;
  onCloseChatBox: () => void;
  socket: Socket<any, any> | null;
  availableUsers: UserInfoType[];
}

export const ChatContext = createContext<ChatContextType>(
  {} as ChatContextType
);

export const ENDPOINT = "http://localhost:5000";
// export const ENDPOINT = "https://react-chat-app-mlce.onrender.com"; // -> After deployment
// export const ENDPOINT = "https://gchat-92kx.onrender.com"; // -> After deployment

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);

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
  const [isShowChatBox, setIsShowChatBox] = useState<boolean>(false);
  const [availableUsers, setAvailableUsers] = useState<UserInfoType[]>([]);

  // useState Hook section --------------------------------------------

  // initialize socket
  useEffect(() => {
    if (!user) return;
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Add online user from socket
  useEffect(() => {
    if (socket === null || user === null) return;

    const userPublic: UserPublicInfoType = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    socket.emit("addNewUser", userPublic);

    socket.on("getOnlineUsers", (res: OnlineUsersType[]) => {
      console.log("getOnlineUsers", res);
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  // send message to the server using socket
  useEffect(() => {
    if (socket === null || user === null || currentChat === null) return;

    const recipient = currentChat.members.find((m) => m._id !== user._id);

    console.log("send message to the server using socket", recipient);
    socket.emit("sendMessage", {
      ...newMessage,
      recipient: recipient,
    });
  }, [newMessage, socket, user, currentChat]);

  // recieving the message
  useEffect(() => {
    if (socket === null || currentChat === null) return;
    socket.on("getMessage", (res: MessageInfoType) => {
      if (currentChat._id !== res.chatId._id) return;

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
      const isChatOpen = currentChat?.members.find(
        (m) => m._id === res.senderId._id
      );

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

      console.log("getUsers->userChats", userChats);
      const pChats = response.success.users.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;
        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return (
              chat.members[0]._id === u._id || chat.members[1]._id === u._id
            );
          });
        }

        return !isChatCreated;
      });
      console.log("getUsers->pChats", pChats);
      setOtherUsersChat(pChats);
    };

    getUsers();
  }, [user, userChats]);

  // get user chats
  useEffect(() => {
    const getUserChats = async () => {
      if (!user) {
        setUserChats(null);
        return;
      }

      console.log("getUserChats starts.....");
      setIsUserChatsLoading(true);
      setUserChatsError(null);
      const response = await getAllChatRequest(`${baseUrl}/chats/${user._id}`);

      setIsUserChatsLoading(false);

      if (response.failure) {
        return setUserChatsError(response.failure.message);
      }

      const userChatCopy = response.success.chats.slice();
      const userChatWithMsg: ChatInfoWithNewMsg[] = [];

      // Sort Chat base from db latest message
      await userChatCopy.forEach(async (chat) => {
        const response = await getAllMessageOfCurrentChatRequest(
          `${baseUrl}/messages/${chat._id}`
        );
        if (response.success) {
          const length = response.success.messages.length;
          const lastMessage = response.success.messages[length - 1];

          const chatWithMsg: ChatInfoWithNewMsg = {
            ...chat,
            text: lastMessage.text,
            dateSend: lastMessage.createdAt,
          };
          userChatWithMsg.push(chatWithMsg);
          return;
        }
        // if no message yet in the chat
        userChatWithMsg.push({ ...chat, dateSend: null, text: null });
      });

      const sortedChatByLatestMsg = userChatCopy.sort((chat1, chat2) => {
        const date1 = userChatWithMsg.find(
          (cm) => cm._id === chat1._id
        )?.dateSend;
        const date2 = userChatWithMsg.find(
          (cm) => cm._id === chat2._id
        )?.dateSend;

        if (!date1) return -1;
        if (!date2) return 1;

        const convDate1 = Date.parse(date1);
        const convDate2 = Date.parse(date2);

        if (convDate1 < convDate2) return -1;
        if (convDate1 > convDate2) return 1;

        return 0;
      });

      // to debug log the user chat
      console.log("sort user chat: userChatWithMsg:", userChatWithMsg);

      // SORTING THE USER CHAT BASE FROM LATEST MESSAGE OF RECEPIENT
      // Get the latest notification of each recipient and insert it to new aray
      const latestNotifications = notifications.reduce((acc, curr) => {
        const prev = acc.find((a) => a.senderId === curr.senderId);
        if (!prev || curr.date > prev.date) {
          acc.push(curr);
        }
        return acc;
      }, [] as NotificationType[]);

      console.log(
        "getUserChats->response.success.chats",
        response.success.chats
      );

      // loop to each user chat
      const sortedUserChat = sortedChatByLatestMsg.sort((chat1, chat2) => {
        // get the recepient from members
        const recepient1 = chat1.members.find((m) => m._id !== user._id);
        const recepient2 = chat2.members.find((m) => m._id !== user._id);

        console.log("chats sort recep1: " + recepient1?.name);
        console.log("chats sort recep2: " + recepient2?.name);

        // get the notification of each recepient
        let notification1: NotificationType | undefined;
        let notification2: NotificationType | undefined;
        if (recepient1) {
          notification1 = latestNotifications.find(
            (n) => n.senderId._id === recepient1._id
          );
        }

        if (recepient2) {
          notification2 = latestNotifications.find(
            (n) => n.senderId._id === recepient2._id
          );
        }

        if (!notification1) {
          return 1;
        }
        if (!notification2) {
          return -1;
        }

        if (notification1 && notification2) {
          if (notification1.date < notification2.date) return 1;
          if (notification1.date > notification2.date) return -1;
        }

        return 0;

        // compare the notification date
      });

      console.log("getUserChats: sortedUserChat:", sortedUserChat);

      setUserChats(sortedUserChat);
    };
    getUserChats();
  }, [user, notifications]);

  // get chat messages
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        setIsMessagesLoading(true);
        setMessagesError(null);
        console.log("getMessages start");

        const response = await getAllMessageOfCurrentChatRequest(
          `${baseUrl}/messages/${currentChat._id}`
        );

        setIsMessagesLoading(false);

        if (response.failure) {
          console.log("getMessages failure");
          return setMessagesError(response.failure.message);
        }

        const sortedMessages = response.success.messages
          .slice()
          .sort((a, b) => {
            const createdAt1 = Date.parse(a.createdAt);
            const createdAt2 = Date.parse(b.createdAt);
            return createdAt1 - createdAt2;
          });
        console.log("getMessages", sortedMessages);
        setMessages(sortedMessages);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getAvailableUsers = () => {
      if (!user) return;
      const otherUsers = allUsers.filter((u) => u._id !== user._id);
      setAvailableUsers(otherUsers);
    };
    getAvailableUsers();
  }, [allUsers, user]);

  // useState Hook section -------------------------------------------

  // useCallback Hook section ----------------------------------------

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
          senderId: sender._id,
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

      // Sort User Chats
      if (userChats) {
        const userChats2 = [...userChats];
        const index = userChats2.findIndex(
          (chat) => chat._id === currentChatId
        );
        if (index) {
          userChats2.unshift(userChats2.splice(index, 1)[0]);
          setUserChats(userChats2);
          console.log("sortedUserChats", index, userChats2);
        }
      }
    },
    [userChats]
  );

  // selecting chat wiill show chat box
  const updateCurrentChat = useCallback((chat: ChatInfoType | null) => {
    setCurrentChat(chat);
  }, []);

  // upate the notification
  const markAsReadThisNotification = useCallback(
    (recipientUser: UserInfoType) => {
      const senderId = recipientUser._id;
      setNotifications((prev) => {
        return prev.map((n) => {
          if (n.senderId._id === senderId) {
            return { ...n, isRead: true };
          }
          return n;
        });
      });
    },
    []
  );

  // create chat to other users
  const createChat = useCallback(
    async (firstId: string, secondId: string) => {
      const body: CreateChatBodyType = { userIds: [firstId, secondId] };

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
      updateCurrentChat(response.success.chat);
    },
    [updateCurrentChat]
  );

  const updateNotification = useCallback(
    (sender: UserInfoType, isRead: boolean) => {
      const updatedNotification = notifications.map((n) => {
        if (n.senderId._id === sender._id) {
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

  const onShowChatBox = useCallback(() => {
    setIsShowChatBox(true);
  }, []);
  const onCloseChatBox = useCallback(() => {
    setIsShowChatBox(false);
  }, []);

  // useCallback Hook section ----------------------------------------

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
        sendTextMessageError,
        isShowChatBox,
        onShowChatBox,
        onCloseChatBox,
        socket,
        availableUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
