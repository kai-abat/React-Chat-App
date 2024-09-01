import { createContext, ReactNode, useCallback, useState } from "react";

interface GroupChatContextType {
  isShowGroupChatModal: boolean;
  onShaowGCModal: (isShow: boolean) => void;
}

export const GroupChatContext = createContext<GroupChatContextType>(
  {} as GroupChatContextType
);

export const GroupChatContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isShowGroupChatModal, setIsShowGroupChatModal] =
    useState<boolean>(false);

  const onShaowGCModal = useCallback((isShow: boolean) => {
    setIsShowGroupChatModal(isShow);
  }, []);

  return (
    <GroupChatContext.Provider value={{ isShowGroupChatModal, onShaowGCModal }}>
      {children}
    </GroupChatContext.Provider>
  );
};
