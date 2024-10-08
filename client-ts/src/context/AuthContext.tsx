import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useState } from "react";
import { UserModelType } from "../types/dbModelTypes";
import { LoginFormType, RegisterFormType } from "../types/UserTypes";

// admin@gmail.com
// Admin@1234

// export const ENDPOINT = "http://localhost:5000";
// export const ENDPOINT = "https://react-chat-app-mlce.onrender.com"; // -> After deployment
export const ENDPOINT = "https://gchat-92kx.onrender.com"; // -> After deployment

interface AuthContextType {
  user: UserModelType | null;
  loginForm: LoginFormType;
  registerForm: RegisterFormType;
  updateRegisterForm: (info: RegisterFormType) => void;
  updateLoginForm: (info: LoginFormType) => void;
  updateUser: (user: UserModelType) => void;
  updateIsFetchingUser: (status: boolean) => void;
  logout: () => void;
  baseUrl: string;
  usersURI: string;
  isFetchingUser: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);
  const [user, setUser] = useState<UserModelType | null>(null);
  const [registerForm, setRegisterForm] = useState<RegisterFormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginForm, setLoginForm] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const baseUrl: string = ENDPOINT;
  const baseURI = ENDPOINT + "/api";
  const usersURI = baseURI + "/users";

  // useEffect(() => {
  //   const loadUser = async () => {
  //     setIsLoading(true);
  //     const user = localStorage.getItem("User");
  //     const token = localStorage.getItem("Gchat_Token");

  //     await timeout(5000);

  //     if (user) {
  //       setUser(JSON.parse(user));
  //       // console.log("useeffect: user:", user);
  //     }
  //     setIsLoading(false);
  //   };
  //   loadUser();
  // }, []);

  const updateRegisterForm = useCallback((info: RegisterFormType) => {
    setRegisterForm(info);
  }, []);

  const updateLoginForm = useCallback((info: LoginFormType) => {
    setLoginForm(info);
  }, []);

  const updateUser = useCallback((user: UserModelType) => {
    setUser(user);
  }, []);

  const updateIsFetchingUser = useCallback((status: boolean) => {
    setIsFetchingUser(status);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("User");
    localStorage.removeItem("Gchat_Token");
    setUser(null);

    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        baseUrl,
        usersURI,
        user,
        loginForm,
        registerForm,
        isFetchingUser,
        updateRegisterForm,
        updateLoginForm,
        updateUser,
        updateIsFetchingUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
