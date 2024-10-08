import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserAuth } from "../services/userService";
import useCheckAuthorized from "./useCheckAuthorized";

const useUserAuth = () => {
  const { usersURI, logout } = useContext(AuthContext);
  const { handleCheckAuthorization } = useCheckAuthorized();
  // const queryClient = useQueryClient();

  const {
    data: userAuth,
    isLoading: isFetchingUserAuth,
    error: authError,
  } = useQuery({
    queryKey: ["UserAuth"],
    queryFn: () => getUserAuth(usersURI),
    retry: false,
    throwOnError: true,
    // enabled: false,
  });

  if (!isFetchingUserAuth && authError) {
    console.log("useUserAuth:", authError);
    handleCheckAuthorization(authError);
  }

  const handleUserAuth = async () => {
    return await getUserAuth(usersURI);
  };

  return {
    userAuth,
    authError,
    isFetchingUserAuth,
    handleUserAuth,
    logout,
  };
};

export default useUserAuth;
