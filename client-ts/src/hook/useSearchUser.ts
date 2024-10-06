import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import { searchUser } from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { UserModelType } from "../types/dbModelTypes";

const useSearchUser = () => {
  const { usersURI } = useContext(AuthContext);
  const { getUser, getUserChats } = useContext(ChatV2Context);
  const [usersFound, setUserFound] = useState<UserModelType[]>([]);

  const { mutate: searchUserMutate, isPending } = useMutation({
    mutationFn: searchUser,
    onSuccess: (users) => {
      setUserFound(users);
    },
  });

  const handleSearchUser = (keyword: string) => {
    searchUserMutate({ keyword, url: usersURI });
  };

  return { getUser, getUserChats, handleSearchUser, isPending, usersFound };
};
export default useSearchUser;
