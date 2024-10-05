import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/userService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToasterContext } from "../context/ToasterContext";
import { useNavigate } from "react-router-dom";

const useLoginUser = () => {
  const navigate = useNavigate();
  const { usersURI, updateUser } = useContext(AuthContext);
  const { showToaster } = useContext(ToasterContext);

  const {
    mutate: loginMutate,
    error: loginError,
    isPending: loginPending,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      // set localstorage token
      localStorage.setItem("Gchat_Token", user.token);

      // set user context
      updateUser({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      showToaster(
        "Login",
        `Welcome ${user.name}. You have successfully logged in!`
      );
      navigate("/");
    },
    onError: (error) => {
      showToaster("Login Error", `${error.message}`);
    },
  });

  const handleLogin = (email: string, password: string) => {
    loginMutate({ url: usersURI, email, password });
  };

  return { handleLogin, loginError, loginPending };
};
export default useLoginUser;
