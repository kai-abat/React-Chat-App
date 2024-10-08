import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "../context/AuthContext";
import LayoutMain from "../components/common/LayoutMain";
import About from "../pages/About";
import Chat from "../pages/ChatV3";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import ProtectedRoute from "../router/ProtectedRoute";

const AuthWrapper = () => {
  return (
    <AuthContextProvider>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <LayoutMain />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate replace to="/" />} />
          <Route path="/" element={<Chat />} />
        </Route>
        <Route element={<LayoutMain />}>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContextProvider>
  );
};
export default AuthWrapper;
