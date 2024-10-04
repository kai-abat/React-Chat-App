import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  ChatModelType,
  ChatsWithMsgModelType,
  MessagesModelType,
  NotificationModelType,
} from "../types/MongoDBModelTypes";
import { AuthContext } from "./AuthContext";
import useChats from "../hook/useChats";
import { getUserChat } from "../services/chatService";
import { UserInfoType } from "../types/UserTypes";

export const ENDPOINT = "http://localhost:5000";
// export const ENDPOINT = "https://react-chat-app-mlce.onrender.com"; // -> After deployment
// export const ENDPOINT = "https://gchat-92kx.onrender.com"; // -> After deployment

interface ChatV2ContextType {
  baseURI: string;
  chatURI: string;
  messageURI: string;
  userChats: ChatsWithMsgModelType[];
  currentChat: ChatModelType | null;
  isShowChatBox: boolean;
  currentMessages: MessagesModelType[];
  newMessage: MessagesModelType | null;
  socket: Socket<any, any> | null;
  socketConnected: boolean;
  typing: boolean;
  isTyping: boolean;
  textMessage: string;
  notifications: NotificationModelType[];
  updateUserChats: (chats: ChatsWithMsgModelType[]) => void;
  updateCurrentChat: (chat: ChatModelType | null) => void;
  onShowChatBox: () => void;
  onCloseChatBox: () => void;
  setCurrentMessages: React.Dispatch<React.SetStateAction<MessagesModelType[]>>;
  setNewMessage: React.Dispatch<React.SetStateAction<MessagesModelType | null>>;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setTextMessage: React.Dispatch<React.SetStateAction<string>>;
  resetNotificationCounter: () => void;
  handleOnClickNotification: (notification: NotificationModelType) => void;
  sortChats: (currChat: ChatModelType[]) => ChatModelType[];
  getNotificationCounter: () => number;
  getUserChats: () => ChatsWithMsgModelType[];
  getUser: () => UserInfoType | "Not Authorized";
  getCurrentChat: () => "Not Authorized" | ChatModelType;
}

export const ChatV2Context = createContext<ChatV2ContextType>(
  {} as ChatV2ContextType
);

export const ChatV2ContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useContext(AuthContext);
  // States
  const [userChats, setUserChats] = useState<ChatsWithMsgModelType[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatModelType | null>(null);
  const [currentMessages, setCurrentMessages] = useState<MessagesModelType[]>(
    []
  );
  const [newMessage, setNewMessage] = useState<MessagesModelType | null>(null);
  const [notifications, setNotifications] = useState<NotificationModelType[]>(
    []
  );
  const notificationCounter = useRef(0);
  const currentChatRef = useRef<ChatModelType | null>(null);

  // State for chatbox open and close
  const [isShowChatBox, setIsShowChatBox] = useState<boolean>(false);
  const [textMessage, setTextMessage] = useState<string>("");
  const lastTypingTime = useRef(0);

  // State for socket.io
  const [socket, setSocket] = useState<Socket<any> | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [roomJoined, setRoomJoined] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const baseURI = ENDPOINT + "/api";
  const chatURI = baseURI + "/chats";
  const messageURI = baseURI + "/messages";
  const timerLength = 5000;

  // Reusable function in this Section --------------------------
  const parseNotification = (
    notif: NotificationModelType[],
    chat: ChatModelType,
    message: MessagesModelType,
    timeSent: Date,
    isRead: boolean
  ): NotificationModelType[] => {
    const notificationFound = notif.find(
      (n) => n.message.chatId._id === chat._id
    );

    const notificationsReduced = notif.filter(
      (n) => n.message.chatId._id !== chat._id
    );

    if (notificationFound) {
      const currentCount = notificationFound.count;
      const notification: NotificationModelType = {
        isRead,
        message,
        count: currentCount,
        timeSent,
      };
      return [notification, ...notificationsReduced];
    }
    const notification: NotificationModelType = {
      message,
      isRead,
      timeSent,
      count: 0,
    };
    return [notification, ...notificationsReduced];
  };

  // Reusable function in this Section --------------------------

  // Socket.io Start Section ------------------------------------

  // initialize socket
  useEffect(() => {
    if (!user) return;
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    newSocket.emit("setup", user);
    newSocket.on("connected", () => {
      setSocketConnected(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // socket for reciever typing from another user
  useEffect(() => {
    if (socket && socketConnected) {
      // recieve the socket to start the typing
      socket.on("typing", (chatId: string) => {
        const currentChatId = currentChatRef.current?._id;
        if (currentChatId === chatId) setIsTyping(true);
      });
      // recieve socet to stop the typing
      socket.on("stop-typing", (chatId: string) => {
        const currentChatId = currentChatRef.current?._id;
        if (currentChatId === chatId) setIsTyping(false);
      });
    }
  }, [socket, socketConnected]);

  // after setting the user chat then user should join the room of every chat
  useEffect(() => {
    const joinRoom = () => {
      if (!user || !socket || !socketConnected) return;

      console.log(
        "The userChats state has been changed, joining the room now..."
      );
      const newChatIds: string[] = [];
      userChats.forEach((chats) => {
        const chatId = chats.chat._id;

        // check if already joined
        const joined = roomJoined.includes(chatId);

        if (!joined) {
          socket.emit("join-room", {
            userName: user.name,
            room: chatId,
          });
          newChatIds.push(chatId);
        }
      });

      if (newChatIds.length > 0) {
        setRoomJoined((room) => (room = [...newChatIds, ...room]));
      }
    };

    joinRoom();
  }, [userChats, socket, socketConnected, user, roomJoined]);

  // socket.io send message to the server using socket
  useEffect(() => {
    if (!socket || !user || !currentChat || !newMessage) return;

    socket.emit("send-message", {
      newMessage,
      chat: currentChat,
    });
    setNewMessage(null);
  }, [newMessage, socket, user, currentChat]);

  // socket.io recieved message
  useEffect(() => {
    if (!socket) return;

    socket.on(
      "receive-message",
      (
        chat: ChatModelType,
        newMessage: MessagesModelType,
        isRead: boolean,
        timeSent: Date
      ) => {
        const currentChatId = currentChatRef.current?._id;

        if (currentChatId === chat._id) {
          setCurrentMessages((prev) => (prev = [...prev, newMessage]));
          setNotifications((notif) => {
            return parseNotification(notif, chat, newMessage, timeSent, true);
            // const notificationFound = notif.find(
            //   (n) => n.message.chatId._id === chat._id
            // );

            // const notificationsReduced = notif.filter(
            //   (n) => n.message.chatId._id !== chat._id
            // );

            // if (notificationFound) {
            //   const currentCount = notificationFound.count;
            //   const notification: NotificationModelType = {
            //     isRead: true,
            //     message: newMessage,
            //     count: currentCount,
            //     timeSent: timeSent,
            //   };
            //   return [notification, ...notificationsReduced];
            // }
            // const notification: NotificationModelType = {
            //   message: newMessage,
            //   isRead: true,
            //   timeSent,
            //   count: 0,
            // };
            // return [notification, ...notificationsReduced];
          });
        } else if (currentChatId) {
          setNotifications((notif) => {
            return parseNotification(notif, chat, newMessage, timeSent, isRead);
            // const notificationFound = notif.find(
            //   (n) => n.message.chatId._id === chat._id
            // );
            // const notificationsReduced = notif.filter(
            //   (n) => n.message.chatId._id !== chat._id
            // );
            // if (notificationFound) {
            //   const currentCount = notificationFound.count + 1;
            //   const notification: NotificationModelType = {
            //     isRead,
            //     message: newMessage,
            //     count: currentCount,
            //     timeSent: timeSent,
            //   };
            //   return [notification, ...notificationsReduced];
            // }
            // const notification: NotificationModelType = {
            //   message: newMessage,
            //   isRead,
            //   timeSent,
            //   count: 1,
            // };
            // return [notification, ...notificationsReduced];
          }); // end of setNotifications
          // show notification
          notificationCounter.current = notificationCounter.current + 1;
        }
      }
    );
  }, [socket]);

  // socket.io typing status message
  useEffect(() => {
    if (socket && socketConnected && typing && currentChatRef.current) {
      // const recipient = currentChat.members.find((m) => m._id !== user._id);
      const currentChatId = currentChatRef.current._id;
      const time = new Date().getTime();

      lastTypingTime.current = time;
      socket.emit("typing", currentChatId);

      setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime.current;
        if (timeDiff >= timerLength && typing) {
          socket.emit("stop-typing", currentChatId);
          setTyping(false);
        }
      }, timerLength);
    }
  }, [typing, socket, socketConnected]);

  // Socket.io End Section --------------------------------------

  // User Chat/Contact List -------------------------------------
  // Note: Go to custom hook useChat, useChatMessage
  // for data fetching and mutation handling

  const getUserChats = () => {
    return userChats;
  };

  const getUser = () => {
    if (!user) return "Not Authorized";
    return user;
  };

  const getCurrentChat = () => {
    if (!currentChat) return "Not Authorized";
    return currentChat;
  };

  // selecting chat wiil show chat box
  const updateCurrentChat = useCallback((chat: ChatModelType | null) => {
    setCurrentChat(chat);
    setIsTyping(false);
    currentChatRef.current = chat;
  }, []);

  // If currentChat is null
  useEffect(() => {
    if (userChats.length > 0 && !currentChat) {
      updateCurrentChat(userChats[0].chat);
    }
  }, [currentChat, userChats, updateCurrentChat]);

  const updateUserChats = useCallback((chats: ChatsWithMsgModelType[]) => {
    setUserChats(chats);
  }, []);

  // create group chat

  // update current chat

  // sort user chats
  const sortChats = useCallback(
    (currChat: ChatModelType[]): ChatModelType[] => {
      return currChat.sort((a, b) => {
        const aFound = notifications.findIndex(
          (n) => n.message.chatId._id === a._id
        );
        const bFound = notifications.findIndex(
          (n) => n.message.chatId._id === b._id
        );

        console.log(
          "Sort Chats of ",
          a._id,
          b._id,
          "found notif:",
          aFound,
          bFound
        );

        // if both chat found in notification
        if (aFound >= 0 && bFound >= 0) {
          if (aFound < bFound) {
            return -1;
          }
          return 1;
        }

        // if a chat only exists in notification
        if (aFound >= 0 && bFound < 0) {
          return -1;
        }
        // if b chat only exists in notification
        if (aFound < 0 && bFound >= 0) {
          return 1;
        }
        return 0;
      });
    },
    [notifications]
  );

  // User Chat/Contact List -------------------------------------

  // Chat Box State Section -------------------------------------

  const onShowChatBox = useCallback(() => {
    setIsShowChatBox(true);
  }, []);
  const onCloseChatBox = useCallback(() => {
    setIsShowChatBox(false);
  }, []);

  // Chat Box State Section -------------------------------------

  // Notification State Section ---------------------------------

  // upod recieving notifications sort the chats

  const resetNotificationCounter = useCallback(() => {
    notificationCounter.current = 0;
    setNotifications([]);
  }, []);

  const getNotificationCounter = () => {
    return notificationCounter.current;
  };

  const handleOnClickNotification = useCallback(
    (notification: NotificationModelType) => {
      setCurrentChat(notification.message.chatId);
      setIsTyping(false);
      notificationCounter.current -= notification.count;
      setNotifications((n) => {
        return n.filter(
          (o) => o.message.chatId._id !== notification.message.chatId._id
        );
      });
    },
    []
  );
  // Notification State Section ---------------------------------

  return (
    <ChatV2Context.Provider
      value={{
        userChats,
        baseURI,
        chatURI,
        messageURI,
        currentChat,
        isShowChatBox,
        currentMessages,
        newMessage,
        socket,
        socketConnected,
        typing,
        isTyping,
        textMessage,
        notifications,
        updateUserChats,
        updateCurrentChat,
        onShowChatBox,
        onCloseChatBox,
        setCurrentMessages,
        setNewMessage,
        setTyping,
        setTextMessage,
        resetNotificationCounter,
        getNotificationCounter,
        handleOnClickNotification,
        sortChats,
        getUserChats,
        getUser,
        getCurrentChat,
      }}
    >
      {children}
    </ChatV2Context.Provider>
  );
};
