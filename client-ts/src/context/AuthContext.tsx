import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import {
  RegisterFormType,
  RegisterUserBodyType,
  UserInfoType,
} from "../types/UserTypes";
import { baseUrl, postRequest } from "../utls/services";

interface AuthContextType {
  user: UserInfoType;
  registerForm: RegisterFormType;
  updateRegisterForm: (info: RegisterFormType) => void;
  updateUser: (user: UserInfoType) => void;
  registerUser: (e: FormEvent<HTMLFormElement>) => Promise<void | {
    error: boolean;
    message: string;
  }>;
  registerError: string | null;
  isRegisterLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfoType>({
    name: "",
    email: "",
    id: "",
    token: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);

  const updateRegisterForm = useCallback((info: RegisterFormType) => {
    setRegisterForm(info);
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

      const response = await postRequest(`${baseUrl}`, JSON.stringify(body));

      console.log("registerUser response: " + response);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        registerForm,
        updateRegisterForm,
        updateUser,
        registerUser,
        registerError,
        isRegisterLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
