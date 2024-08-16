import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("user:", user, isLoading);
      navigate("/login");
    }
  }, [navigate, user, isLoading]);

  return <>{children}</>;
};
export default ProtectedRoute;
