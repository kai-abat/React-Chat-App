import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/userService";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToasterContext } from "../context/ToasterContext";

const useRegisterUser = () => {
  const navigate = useNavigate();
  const { usersURI, updateUser } = useContext(AuthContext);
  const { showToaster } = useContext(ToasterContext);
  const {
    mutate: registerMutate,
    error: registerError,
    isPending: registerPending,
  } = useMutation({
    mutationFn: registerUser,
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
      showToaster("Registration Error", `${error.message}`);
    },
  });

  const handleRegister = (name: string, email: string, password: string) => {
    registerMutate({ url: usersURI, name, email, password });
  };

  return { handleRegister, registerError, registerPending };
};

export default useRegisterUser;
