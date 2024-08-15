import "bootstrap/dist/css/bootstrap.min.css"; // import the bootstrap css file
import { router } from "./components/Router";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
