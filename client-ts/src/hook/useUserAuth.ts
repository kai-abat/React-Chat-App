import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserAuth } from "../services/userService";

const useUserAuth = () => {
  const { usersURI } = useContext(AuthContext);

  const {
    data: userAuth,
    isLoading: isFetchingUserAuth,
    error: authError,
  } = useQuery({
    queryKey: ["UserAuth"],
    queryFn: () => getUserAuth(usersURI),
    retry: false,
  });

  return {
    userAuth,
    authError,
    isFetchingUserAuth,
  };
};

export default useUserAuth;
