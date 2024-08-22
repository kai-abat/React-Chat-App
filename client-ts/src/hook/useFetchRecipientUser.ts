import { useEffect, useState } from "react";
import { ChatInfoType } from "../types/ChatTypes";
import { UserInfoType } from "../types/UserTypes";
import { baseUrl, getUserRequest } from "../utls/services";

export const useFetchRecipientUser = (
  chat: ChatInfoType | null,
  user: UserInfoType | null
) => {
  const [recipientUser, setRecipientUser] = useState<UserInfoType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      if (!user || !chat) return null;

      const recipientId = chat?.members.find((m) => m !== user.id);

      if (!recipientId) return null;

      const response = await getUserRequest(`${baseUrl}/users/${recipientId}`);

      if (response.failure) {
        return setError(response.failure.message);
      }
      setRecipientUser(response.success.user);
    };
    getUser();
  }, [chat, user]);

  if (!user || !chat) return { recipientUser: null };

  return { recipientUser, error };
};
