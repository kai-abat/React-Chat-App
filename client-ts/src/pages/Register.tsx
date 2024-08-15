import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";

const Register = () => {
  const error = "Error registering";
  return (
    <>
      <Form>
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
              <Form.Control type="text" placeholder="Name" />
              <Form.Control type="email" placeholder="Email" />
              <Form.Control type="password" placeholder="Password" />
              <Form.Control type="password" placeholder="Confirm Password" />
              <Button variant="primary" type="submit">
                Register
              </Button>
              <Alert variant="danger">
                <p>{error}</p>
              </Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default Register;
