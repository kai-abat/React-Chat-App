import { ReactNode, useContext } from "react";
import { Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Typing from "../components/lottie/Typing";
import useUserAuth from "../hook/useUserAuth";
import { ToasterContext } from "../context/ToasterContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { isFetchingUserAuth, userAuth } = useUserAuth();
  const { showToaster } = useContext(ToasterContext);

  if (!isFetchingUserAuth && !userAuth) {
    console.log("user:", userAuth, isFetchingUserAuth);
    showToaster(
      "Not Authorized",
      "You are not authorized to access this page, Please log in!"
    );
    navigate("/login");
  }

  if (isFetchingUserAuth) {
    return (
      <Stack className=" min-vh-100 mt-5">
        <Typing />
      </Stack>
    );
  }

  return <>{children}</>;
};
export default ProtectedRoute;
