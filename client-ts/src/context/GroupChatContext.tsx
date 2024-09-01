import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ChatContext } from "./ChatContext";
import { CreateGroupChatFormType } from "../types/ChatTypes";
import { AuthContext } from "./AuthContext";

interface GroupChatContextType {
  isShowGroupChatModal: boolean;
  onShaowGCModal: (isShow: boolean) => void;
  onCheckSelectUser: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateCreateGCForm: (formValues: CreateGroupChatFormType) => void;
  createGCForm: CreateGroupChatFormType;
}

export const GroupChatContext = createContext<GroupChatContextType>(
  {} as GroupChatContextType
);

export const GroupChatContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Context
  const { user } = useContext(AuthContext);
  const { availableUsers } = useContext(ChatContext);

  // useState Hook section -----------------------------------------------------

  const [isShowGroupChatModal, setIsShowGroupChatModal] =
    useState<boolean>(false);
  // create group chat states
  const [createGCForm, setCreateGCForm] = useState<CreateGroupChatFormType>({
    groupName: "",
    members: [],
  });

  // useEffect Hook section --------------------------------------------------

  useEffect(() => {
    console.log("CreateGroupChatForm: createGCForm:", createGCForm);
  }, [createGCForm]);

  useEffect(() => {
    if (!user) return;
    const initData = {
      groupName: "",
      members: [user],
    };

    setCreateGCForm(initData);
  }, [user]);

  // useEffect Hook section --------------------------------------------------
  // useCallback Hook section ------------------------------------------------

  const updateCreateGCForm = useCallback(
    (formValues: CreateGroupChatFormType) => {
      setCreateGCForm(formValues);
    },
    []
  );

  const onShaowGCModal = useCallback((isShow: boolean) => {
    setIsShowGroupChatModal(isShow);
  }, []);

  const onCheckSelectUser = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      const recepientId = e.target.name;

      const prevMembers = createGCForm.members.slice();

      if (isChecked) {
        const recepient = availableUsers.find((u) => u._id === recepientId);
        if (recepient) {
          prevMembers.push(recepient);
          updateCreateGCForm({ ...createGCForm, members: prevMembers });
        }
      } else {
        const filteredMembers = prevMembers.filter(
          (u) => u._id !== recepientId
        );
        updateCreateGCForm({ ...createGCForm, members: filteredMembers });
      }
    },
    [availableUsers, createGCForm, updateCreateGCForm]
  );

  // useCallback Hook section ------------------------------------------------

  return (
    <GroupChatContext.Provider
      value={{
        isShowGroupChatModal,
        onShaowGCModal,
        onCheckSelectUser,
        updateCreateGCForm,
        createGCForm,
      }}
    >
      {children}
    </GroupChatContext.Provider>
  );
};
