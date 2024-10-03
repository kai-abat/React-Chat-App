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
import { ChatModelType, MessagesModelType } from "../types/MongoDBModelTypes";
import { AuthContext } from "./AuthContext";

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
  currentMessages: MessagesModelType[];
  newMessage: MessagesModelType | null;
  socket: Socket<any, any> | null;
  socketConnected: boolean;
  typing: boolean;
  isTyping: boolean;
  textMessage: string;
  setUserChats: React.Dispatch<React.SetStateAction<ChatModelType[]>>;
  updateCurrentChat: (chat: ChatModelType | null) => void;
  onShowChatBox: () => void;
  onCloseChatBox: () => void;
  setCurrentMessages: React.Dispatch<React.SetStateAction<MessagesModelType[]>>;
  setNewMessage: React.Dispatch<React.SetStateAction<MessagesModelType | null>>;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setTextMessage: React.Dispatch<React.SetStateAction<string>>;
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
  const [userChats, setUserChats] = useState<ChatModelType[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatModelType | null>(null);
  const [currentMessages, setCurrentMessages] = useState<MessagesModelType[]>(
    []
  );
  const [newMessage, setNewMessage] = useState<MessagesModelType | null>(null);

  // State for chatbox open and close
  const [isShowChatBox, setIsShowChatBox] = useState<boolean>(false);
  const [textMessage, setTextMessage] = useState<string>("");
  const lastTypingTime = useRef(0);

  // State for socket.io
  const [socket, setSocket] = useState<Socket<any> | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const baseURI = ENDPOINT + "/api";
  const chatURI = baseURI + "/chats";
  const messageURI = baseURI + "/messages";
  const timerLength = 5000;

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
    newSocket.on("typing", () => {
      console.log("recipient is now typing....");
      setIsTyping(true);
    });
    newSocket.on("stop-typing", () => {
      console.log("recipient is now STOP typing....");
      setIsTyping(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Join room
  useEffect(() => {
    if (!socket || !user || !currentChat) return;

    // socket.io selected chat join room
    socket.emit("join-room", { userName: user.name, room: currentChat._id });
  }, [socket, user, currentChat]);

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
    if (!socket || !user || !currentChat) return;

    console.log("recieved message currentChat:", currentChat);

    socket.on(
      "receive-message",
      (chat: ChatModelType, newMessage: MessagesModelType) => {
        if (currentChat._id === chat._id) {
          console.log("receive message from: ", currentChat, chat, newMessage);
          setCurrentMessages([...currentMessages, newMessage]);
        } else {
          // show notification
          console.log(
            "New Message notification from:",
            currentChat,
            chat,
            newMessage
          );
        }
      }
    );
  }, [socket, user, currentChat, currentMessages]);

  // socket.io typing status message
  useEffect(() => {
    if (socketConnected && currentChat && user && typing) {
      const recipient = currentChat.members.find((m) => m._id !== user._id);
      const time = new Date().getTime();
      console.log("handleOnChangeTextMsg:", typing, time, textMessage);
      lastTypingTime.current = time;
      socket?.emit("typing", recipient?._id);

      setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime.current;
        if (timeDiff >= timerLength && typing) {
          console.log("Stopping typin now:", timeDiff);
          socket?.emit("stop-typing", recipient?._id);
          setTyping(false);
          console.log("stop-typing!!!");
        }
      }, timerLength);
    }
  }, [typing, textMessage, currentChat, socket, socketConnected, user]);

  // const broadcastNewTextMesage = useCallback(
  //   (newMessage: MessagesModelType) => {
  //     if (socket) {
  //       socket.emit("new message", newMessage);
  //     }
  //   },
  //   []
  // );

  // Socket.io End Section --------------------------------------

  // User Chat/Contact List -------------------------------------
  // Note: Go to custom hook useChat, useChatMessage
  // for data fetching and mutation handling

  // create chat

  // create group chat

  // selecting chat wiil show chat box
  const updateCurrentChat = useCallback((chat: ChatModelType | null) => {
    // if (user && socket && chat?._id !== currentChat?._id && currentChat) {
    //   // leave room
    //   socket.emit("leave-room", {
    //     userName: user.name,
    //     room: currentChat._id,
    //   });
    // }
    setCurrentChat(chat);
  }, []);

  // update current chat

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
        currentMessages,
        newMessage,
        socket,
        socketConnected,
        typing,
        isTyping,
        textMessage,
        setUserChats,
        updateCurrentChat,
        onShowChatBox,
        onCloseChatBox,
        setCurrentMessages,
        setNewMessage,
        setTyping,
        setTextMessage,
      }}
    >
      {children}
    </ChatV2Context.Provider>
  );
};
