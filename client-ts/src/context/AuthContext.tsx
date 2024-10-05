import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { UserModelType } from "../types/dbModelTypes";
import {
  LoginFormType,
  LoginUserBodyType,
  RegisterFormType,
  RegisterUserBodyType,
} from "../types/UserTypes";
import { postUserRequest } from "../utls/services";

// admin@gmail.com
// Admin@1234

export const ENDPOINT = "http://localhost:5000";
// export const ENDPOINT = "https://react-chat-app-mlce.onrender.com"; // -> After deployment
// export const ENDPOINT = "https://gchat-92kx.onrender.com"; // -> After deployment

interface AuthContextType {
  user: UserModelType | null;
  loginForm: LoginFormType;
  registerForm: RegisterFormType;
  updateRegisterForm: (info: RegisterFormType) => void;
  updateLoginForm: (info: LoginFormType) => void;
  updateUser: (user: UserModelType) => void;
  updateIsFetchingUser: (status: boolean) => void;
  registerUser: (e: FormEvent<HTMLFormElement>) => Promise<void | {
    error: boolean;
    message: string;
  }>;
  logout: () => void;
  login: (e: FormEvent<HTMLFormElement>) => Promise<void | {
    error: boolean;
    message: string;
  }>;
  registerError: string | null;
  isRegisterLoading: boolean;
  loginError: string | null;
  baseUrl: string;
  usersURI: string;
  isFetchingUser: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);
  const [user, setUser] = useState<UserModelType | null>(null);
  const [registerForm, setRegisterForm] = useState<RegisterFormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginFormType>({
    email: "admin@gmail.com",
    password: "Admin@1234",
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
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

  const registerUser = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setRegisterError(null);
      if (registerForm.password !== registerForm.confirmPassword) {
        return setRegisterError("Password do not match!");
      }

      setIsRegisterLoading(true);

      const body: RegisterUserBodyType = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      };

      const response = await postUserRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(body)
      );

      setIsRegisterLoading(false);

      if (response.failure) {
        return setRegisterError(response.failure.message);
      } else {
        localStorage.setItem("User", JSON.stringify(response.success.user));
        localStorage.setItem("Gchat_Token", response.success.user.token);
        // setUser(response.success.user);
        console.log(response.success.user);
      }
    },
    [registerForm, baseUrl]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("User");
    localStorage.removeItem("Gchat_Token");
    setUser(null);
  }, []);

  const login = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoginError(null);
      setIsLoginLoading(true);

      const body: LoginUserBodyType = {
        email: loginForm.email,
        password: loginForm.password,
      };
      const bodyString = JSON.stringify(body);
      console.log("Login:", bodyString);

      const response = await postUserRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(body)
      );

      setIsLoginLoading(false);

      if (response.failure) {
        return setLoginError(response.failure.message);
      } else {
        localStorage.setItem("User", JSON.stringify(response.success.user));
        localStorage.setItem("Gchat_Token", response.success.user.token);
        // setUser(response.success.user);
        console.log(response.success.user);
      }
    },
    [loginForm, baseUrl]
  );

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
        registerUser,
        registerError,
        isRegisterLoading,
        loginError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
