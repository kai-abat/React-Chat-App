import { createContext, ReactNode, useRef, useState } from "react";

interface ToasterContextType {
  showToast: boolean;
  showToaster(title: string, message: string): void;
  closeToaster(): void;
  getTitle(): string;
  getMessage(): string;
}

export const ToasterContext = createContext<ToasterContextType>(
  {} as ToasterContextType
);

export const ToasterContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showToast, setShowToast] = useState(false);
  const titleRef = useRef("");
  const messageRef = useRef("");

  // In this context api, I intended to use the function declaration instead of arrow function
  function showToaster(title: string, message: string) {
    setShowToast(true);
    titleRef.current = title;
    messageRef.current = message;
  }

  function closeToaster() {
    setShowToast(false);
  }

  function getTitle() {
    return titleRef.current;
  }

  function getMessage() {
    return messageRef.current;
  }

  return (
    <ToasterContext.Provider
      value={{ showToast, showToaster, closeToaster, getTitle, getMessage }}
    >
      {children}
    </ToasterContext.Provider>
  );
};
