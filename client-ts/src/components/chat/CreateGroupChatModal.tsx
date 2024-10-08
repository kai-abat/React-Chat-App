import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { GroupChatContext } from "../../context/GroupChatContext";
import CreateGroupChatForm from "./CreateGroupChatForm";

const CreateGroupChatModal = () => {
  const { isShowGroupChatModal, onShaowGCModal } = useContext(GroupChatContext);

  const handleCreateGroupChat = () => {
    onShaowGCModal(false);
  };
  return (
    <Modal
      show={isShowGroupChatModal}
      onHide={() => onShaowGCModal(false)}
      contentClassName="modal-create-gc"
      fullscreen="lg-down"
      scrollable
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Create Group Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateGroupChatForm />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateGroupChat} disabled>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CreateGroupChatModal;
