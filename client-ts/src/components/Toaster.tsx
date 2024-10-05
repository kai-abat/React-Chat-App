import { useContext } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { ToasterContext } from "../context/ToasterContext";

const Toaster = () => {
  const { showToast, getMessage, getTitle, closeToaster } =
    useContext(ToasterContext);

  const message = getMessage();
  const title = getTitle();
  return (
    <ToastContainer position="top-center" style={{ zIndex: 1 }}>
      <Toast
        show={showToast}
        className="toaster"
        onClose={closeToaster}
        delay={3000}
        autohide
      >
        <Toast.Header closeVariant="white">
          <strong className="toaster-header me-auto">{title}</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
export default Toaster;
