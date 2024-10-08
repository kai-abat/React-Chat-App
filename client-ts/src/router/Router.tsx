import { createBrowserRouter } from "react-router-dom";
import Chat from "../pages/ChatV3";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import LayoutMain from "../components/common/LayoutMain";
import Register from "../pages/Register";

export const router = createBrowserRouter([
  {
    element: <LayoutMain />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Chat />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
