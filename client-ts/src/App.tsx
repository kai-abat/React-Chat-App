import "bootstrap/dist/css/bootstrap.min.css"; // import the bootstrap css file
import { BrowserRouter } from "react-router-dom";
import AuthWrapper from "./auth/AuthWrapper";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>
    </>
  );
}

export default App;
