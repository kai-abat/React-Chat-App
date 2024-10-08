import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { AuthContext } from "../context/AuthContext";
import { ToasterContext } from "../context/ToasterContext";
import useUserAuth from "../hook/useUserAuth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const { isFetchingUserAuth, userAuth } = useUserAuth();
  const { showToaster } = useContext(ToasterContext);
  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    if (userAuth) updateUser(userAuth);
  }, [userAuth, updateUser]);

  if (!isFetchingUserAuth && !userAuth) {
    console.log("user:", userAuth, isFetchingUserAuth);
    showToaster(
      "Not Authorized",
      "You are not authorized to access this page, Please log in!"
    );
    navigate("/login");
  }

  if (isFetchingUserAuth) return <Loader />;

  return <>{children}</>;
};
export default ProtectedRoute;
