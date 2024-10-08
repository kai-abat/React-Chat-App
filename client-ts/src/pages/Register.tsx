import { FormEvent, useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import Layout from "../components/common/Layout";
import { AuthContext } from "../context/AuthContext";
import { ToasterContext } from "../context/ToasterContext";
import useRegisterUser from "../hook/useRegisterUser";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../hook/useUserAuth";
import Loader from "../components/common/Loader";

const Register = () => {
  const navigate = useNavigate();
  const { registerForm, updateRegisterForm, updateUser } =
    useContext(AuthContext);
  const { showToaster } = useContext(ToasterContext);

  const { handleRegister, registerError, registerPending } = useRegisterUser();
  const { isFetchingUserAuth, userAuth } = useUserAuth();

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

  if (!isFetchingUserAuth && userAuth) {
    updateUser(userAuth);
    navigate("/chat");
  }

  if (isFetchingUserAuth) return <Loader />;

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
