import { Button, Modal } from "react-bootstrap";

type Props = {
  title: string;
  message: string;
  handleConfirm: () => void;
  handleCancel: () => void;
  handleCloseDialog: () => void;
  isShow: boolean;
};
const ConfirmModal = ({
  title,
  message,
  handleConfirm,
  handleCancel,
  handleCloseDialog,
  isShow,
}: Props) => {
  return (
    <>
      <Modal
        show={isShow}
        onHide={handleCancel}
        contentClassName="modal-confirm-dlg"
        onExited={handleCloseDialog}
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ConfirmModal;
