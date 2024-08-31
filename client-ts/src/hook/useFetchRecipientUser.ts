import { useEffect, useState } from "react";
import { ChatInfoType } from "../types/ChatTypes";
import { UserInfoType } from "../types/UserTypes";

export const useFetchRecipientUser = (
  chat: ChatInfoType | null,
  user: UserInfoType | null
) => {
  const [recipientUser, setRecipientUser] = useState<UserInfoType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      if (!user || !chat) return null;

      const recipientUser = chat?.members.find((m) => m._id !== user._id);

      if (!recipientUser) return null;

      setRecipientUser(recipientUser);
    };
    getUser();
  }, [chat, user]);

  if (!user || !chat) return { recipientUser: null };

  return { recipientUser, error };
};
