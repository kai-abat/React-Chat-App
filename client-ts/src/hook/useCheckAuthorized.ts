import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { isNotAuthorized } from "../utls/helper";
import { ToasterContext } from "../context/ToasterContext";

const useCheckAuthorized = () => {
  const { logout } = useContext(AuthContext);
  const { showToaster } = useContext(ToasterContext);

  const handleCheckAuthorization = (error: Error | null) => {
    if (error && isNotAuthorized(error.message)) {
      console.log("useChatBox:", error.message);
      showToaster("Sesion Expired", "Please login again!");
      logout();
    }
  };

  return { handleCheckAuthorization };
};
export default useCheckAuthorized;
