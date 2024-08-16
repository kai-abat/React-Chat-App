import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  LoginFormType,
  LoginUserBodyType,
  RegisterFormType,
  RegisterUserBodyType,
  UserInfoType,
} from "../types/UserTypes";
import { baseUrl, postRequest } from "../utls/services";

// admin@gmail.com
// Admin@1234

interface AuthContextType {
  user: UserInfoType | null;
  loginForm: LoginFormType;
  registerForm: RegisterFormType;
  updateRegisterForm: (info: RegisterFormType) => void;
  updateLoginForm: (info: LoginFormType) => void;
  updateUser: (user: UserInfoType) => void;
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
  isLoginLoading: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInfoType | null>(null);
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

  useEffect(() => {
    setIsLoading(true);
    const user = localStorage.getItem("User");
    if (user) {
      setUser(JSON.parse(user));
      console.log("useeffect: user:", user);
    }
    setIsLoading(false);
  }, []);

  const updateRegisterForm = useCallback((info: RegisterFormType) => {
    setRegisterForm(info);
  }, []);

  const updateLoginForm = useCallback((info: LoginFormType) => {
    setLoginForm(info);
  }, []);

  const updateUser = useCallback((user: UserInfoType) => {
    setUser(user);
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

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(body)
      );

      setIsRegisterLoading(false);

      if (response.failure) {
        return setRegisterError(response.failure.message);
      } else {
        localStorage.setItem("User", JSON.stringify(response.success.user));
        setUser(response.success.user);
        console.log(response.success.user);
      }
    },
    [registerForm]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("User");
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

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(body)
      );

      setIsLoginLoading(false);

      if (response.failure) {
        return setLoginError(response.failure.message);
      } else {
        localStorage.setItem("User", JSON.stringify(response.success.user));
        setUser(response.success.user);
        console.log(response.success.user);
      }
    },
    [loginForm]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loginForm,
        registerForm,
        updateRegisterForm,
        updateLoginForm,
        updateUser,
        registerUser,
        registerError,
        isRegisterLoading,
        loginError,
        isLoginLoading,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
