import { Outlet } from "react-router-dom";
import NaviBar from "./NaviBar";
import { Container } from "react-bootstrap";

const LayoutMain = () => {
  return (
    <main>
      <NaviBar />
      <Container>
        <Outlet />
      </Container>
    </main>
  );
};
export default LayoutMain;
