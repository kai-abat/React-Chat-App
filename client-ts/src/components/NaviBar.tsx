import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NaviBar = () => {
  const { user, logout } = useContext(AuthContext);
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
        {user && <span className="text-warning">Welcome, {user.name}</span>}
        {!user && <span className="text-warning">Please login</span>}

        <Nav>
          <Stack direction="horizontal" gap={3}>
            <Link to="/about" className="text-decoration-none link-light">
              About Us
            </Link>
            <Link to="/contact" className="text-decoration-none link-light">
              Contact Us
            </Link>
            {!user && (
              <>
                <Link to="/login" className="text-decoration-none link-light">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-decoration-none link-light"
                >
                  Register
                </Link>
              </>
            )}
            {user && (
              <Link
                onClick={() => logout()}
                to="/login"
                className="text-decoration-none link-light"
              >
                Logout
              </Link>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default NaviBar;
