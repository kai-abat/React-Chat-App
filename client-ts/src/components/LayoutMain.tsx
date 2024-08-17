import { Outlet } from "react-router-dom";
import NaviBar from "./NaviBar";
import { Container } from "react-bootstrap";

const LayoutMain = () => {
  return (
    <main className="main-container">
      <NaviBar />
      <Container id="outlet-container" className="outlet-container">
        <Outlet />
      </Container>
      <Container id="footer">This is the footer</Container>
    </main>
  );
};
export default LayoutMain;
