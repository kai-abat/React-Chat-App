import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "bootstrap/dist/css/bootstrap.min.css"; // import the bootstrap css file
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LayoutMain from "./components/LayoutMain";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatV2ContextProvider } from "./context/ChatV2Context";
import About from "./pages/About";
import ChatV3 from "./pages/ChatV3";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProtectedRoute from "./router/ProtectedRoute";
import Toaster from "./components/Toaster";
import { ToasterContextProvider } from "./context/ToasterContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 100,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <ToasterContextProvider>
        <AuthContextProvider>
          <ChatV2ContextProvider>
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
                  <Route path="/chat" element={<ChatV3 />} />
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
            <Toaster />
          </ChatV2ContextProvider>
        </AuthContextProvider>
      </ToasterContextProvider>
    </QueryClientProvider>
  );
}

export default App;
