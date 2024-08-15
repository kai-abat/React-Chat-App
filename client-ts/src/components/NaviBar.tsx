import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

const NaviBar = () => {
  const user = "Kai";
  return (
    <Navbar
      bg="dark"
      className="mb-4"
      style={{
        height: "3.75rem",
      }}
    >
      <Container>
        <h2>
          <Link to="/" className="text-decoration-none link-light">
            GCHAT
          </Link>
        </h2>
        <span className="text-warning">Welcome, {user}</span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            <Link to="/login" className="text-decoration-none link-light">
              Login
            </Link>
            <Link to="/register" className="text-decoration-none link-light">
              Register
            </Link>
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default NaviBar;
