import { FormEvent, useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import Layout from "../components/common/Layout";
import { AuthContext } from "../context/AuthContext";
import useLoginUser from "../hook/useLoginUser";
import useUserAuth from "../hook/useUserAuth";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";
// import { UserModelType } from "../types/dbModelTypes";

const Login = () => {
  const navigate = useNavigate();
  const { loginForm, updateLoginForm, updateUser } = useContext(AuthContext);
  // const [isLoading, setIsLoading] = useState(false);
  // const [user, setUser] = useState<UserModelType | null>(null);

  const {
    handleLogin,
    loginError,
    loginPending: isLoginLoading,
  } = useLoginUser();

  const { isFetchingUserAuth, userAuth } = useUserAuth();

  if (!isFetchingUserAuth && userAuth) {
    updateUser(userAuth);
    navigate("/chat");
  }

  if (isFetchingUserAuth) return <Loader />;

  const handleLoginForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(loginForm.email, loginForm.password);
  };

  const handleGuestLogin = () => {
    handleLogin("john@gmail.com", "React@1234");
  };

  if (!isLoginLoading) {
    navigate("/chat");
  }

  // if (isFetchingUserAuth) return <Loader />;

  return (
    <Layout.Content>
      <Form onSubmit={handleLoginForm}>
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
              <Button variant="primary" type="submit" disabled={isLoginLoading}>
                {isLoginLoading ? "Logging in..." : "Login"}
              </Button>
              {!isLoginLoading && (
                <Button
                  variant="danger"
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={isLoginLoading}
                >
                  Login as Guest User
                </Button>
              )}
              {loginError && (
                <Alert variant="danger">
                  <p>{loginError.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </Layout.Content>
  );
};
export default Login;
