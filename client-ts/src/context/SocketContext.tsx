import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";

interface SocketContextType {
  socketConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType
);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(ChatContext);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("setup", user.id);
    socket.on("connected", () => setSocketConnected(true));
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
