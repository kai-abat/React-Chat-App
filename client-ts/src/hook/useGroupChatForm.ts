import { useState } from "react";
import { CreateGroupChatFormType } from "../types/chatGroupChatTypes";
import { UserModelType } from "../types/dbModelTypes";

const defaultValue: CreateGroupChatFormType = {
  name: "",
  members: [],
  groupChatAdmin: [],
  errors: [],
};

// Manage group chat form state
const useGroupChatForm = () => {
  const [groupChatForm, setGroupChatForm] =
    useState<CreateGroupChatFormType>(defaultValue);

  const handleChangeName = (newName: string) => {
    setGroupChatForm((g) => (g = { ...g, name: newName }));
  };

  const handleAddMember = (newMember: UserModelType) => {
    setGroupChatForm((g) => {
      const otherMembers = g.members.filter((m) => m._id !== newMember._id);
      return { ...g, members: [...otherMembers, newMember] };
    });
  };

  const handleRemoveMember = (newMember: UserModelType) => {
    setGroupChatForm((g) => {
      const otherMembers = g.members.filter((m) => m._id !== newMember._id);
      return { ...g, members: [...otherMembers] };
    });
  };

  const handleAddAdmin = (newAdmin: UserModelType) => {
    setGroupChatForm((g) => {
      const otherMembers = g.groupChatAdmin.filter(
        (m) => m._id !== newAdmin._id
      );
      return { ...g, groupChatAdmin: [...otherMembers, newAdmin] };
    });
  };

  const handleError = (errors: string[]) => {
    setGroupChatForm((g) => {
      return { ...g, errors };
    });
  };

  const reset = () => {
    setGroupChatForm(defaultValue);
  };
  return {
    groupChatForm,
    handleChangeName,
    handleAddMember,
    handleRemoveMember,
    handleAddAdmin,
    handleError,
    reset,
  };
};

export default useGroupChatForm;
