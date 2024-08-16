import { AuthContextProvider } from "../context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../router/ProtectedRoute";
import LayoutMain from "../components/LayoutMain";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import About from "../pages/About";
import Contact from "../pages/Contact";
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
