import { FormEvent, useContext, useEffect } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { AuthContext } from "../context/AuthContext";
import useRegisterUser from "../hook/useRegisterUser";
import { ToasterContext } from "../context/ToasterContext";

const Register = () => {
  const { registerForm, updateRegisterForm } = useContext(AuthContext);
  const { showToaster } = useContext(ToasterContext);

  const { handleRegister, registerError, registerPending } = useRegisterUser();

  const toastTitle = "Registration Error";

  const handleRegisterForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerForm.confirmPassword !== registerForm.password) {
      showToaster(toastTitle, "Password not match!");
      return;
    }

    handleRegister(
      registerForm.name,
      registerForm.email,
      registerForm.password
    );
  };

  return (
    <Layout.Content>
      <Form onSubmit={handleRegisterForm}>
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
              <Button
                variant="primary"
                type="submit"
                disabled={registerPending}
              >
                {registerPending ? "Creating your account..." : "Register"}
              </Button>
              {registerError && (
                <Alert variant="danger">
                  <p>{registerError.message}</p>
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
