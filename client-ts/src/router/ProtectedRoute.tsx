import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { AuthContext } from "../context/AuthContext";
import { ChatV2Context } from "../context/ChatV2Context";
import useUserAuth from "../hook/useUserAuth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { getUser } = useContext(ChatV2Context);

  const { isFetchingUserAuth, userAuth, logout } = useUserAuth();

  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("Gchat_Token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const user = getUser();
    if (user === "Not Authorized") return;
    if (!isFetchingUserAuth && !userAuth && user) {
      logout();
    }
  }, [getUser, isFetchingUserAuth, userAuth, logout]);

  if (!isFetchingUserAuth && userAuth) {
    updateUser(userAuth);
  }

  if (isFetchingUserAuth) return <Loader />;

  return <>{children}</>;
};
export default ProtectedRoute;
