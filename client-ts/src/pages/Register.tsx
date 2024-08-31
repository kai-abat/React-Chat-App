import { useContext, useEffect } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const {
    registerForm,
    updateRegisterForm,
    registerUser,
    registerError,
    isRegisterLoading,
    user,
    isLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [navigate, user, isLoading]);

  return (
    <Layout.Content>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: "100dvh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  updateRegisterForm({ ...registerForm, name: e.target.value })
                }
              />
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateRegisterForm({
                    ...registerForm,
                    password: e.target.value,
                  })
                }
              />
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) =>
                  updateRegisterForm({
                    ...registerForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <Button variant="primary" type="submit">
                {isRegisterLoading ? "Creating your account..." : "Register"}
              </Button>
              {registerError && (
                <Alert variant="danger">
                  <p>{registerError}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </Layout.Content>
  );
};
export default Register;
