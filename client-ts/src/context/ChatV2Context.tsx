import { createContext, ReactNode, useContext } from "react";
import { AuthContext } from "./AuthContext";

interface ChatV2ContextType {}

export const ChatV2Context = createContext<ChatV2ContextType>(
  {} as ChatV2ContextType
);

export const ChatV2ContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useContext(AuthContext);

  return <ChatV2Context.Provider value={{}}>{children}</ChatV2Context.Provider>;
};
