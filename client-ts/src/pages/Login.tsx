import { useContext, useEffect } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    user,
    isLoading,
    isLoginLoading,
    loginForm,
    updateLoginForm,
    loginError,
    login,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [navigate, user, isLoading]);

  if (isLoading) return <p>Loading Page...</p>;
  return (
    <>
      <Form onSubmit={login}>
        <Row
          style={{
            height: "100dvh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Login</h2>
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateLoginForm({ ...loginForm, email: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <Button variant="primary" type="submit">
                {isLoginLoading ? "Logging in..." : "Login"}
              </Button>
              {loginError && (
                <Alert variant="danger">
                  <p>{loginError}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default Login;
