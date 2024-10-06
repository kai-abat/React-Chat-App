import { ReactNode, useContext } from "react";
import { Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Typing from "../components/lottie/Typing";
import useUserAuth from "../hook/useUserAuth";
import { ToasterContext } from "../context/ToasterContext";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const { isFetchingUserAuth, userAuth } = useUserAuth();
  const { showToaster } = useContext(ToasterContext);
  const { updateUser } = useContext(AuthContext);

  if (!isFetchingUserAuth && !userAuth) {
    console.log("user:", userAuth, isFetchingUserAuth);
    showToaster(
      "Not Authorized",
      "You are not authorized to access this page, Please log in!"
    );
    navigate("/login");
  }

  if (isFetchingUserAuth) return <Loader />;
  if (userAuth) updateUser(userAuth);

  return <>{children}</>;
};
export default ProtectedRoute;
