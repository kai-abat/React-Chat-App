import "bootstrap/dist/css/bootstrap.min.css"; // import the bootstrap css file
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LayoutMain from "./components/LayoutMain";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProtectedRoute from "./router/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { SocketContextProvider } from "./context/SocketContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      <SocketContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <LayoutMain />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="/chat" />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
            <Route element={<LayoutMain />}>
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SocketContextProvider>
    </ChatContextProvider>
  );
}

export default App;
