import { useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../../context/AuthContext";
import { ChatV2Context } from "../../context/ChatV2Context";
import ChatBox from "./ChatBox";
import ChatBoxHeader from "./ChatBoxHeader";
import { useFetchRecipientUser } from "../../hook/useFetchRecipientUser";
import { getChatName } from "../../utls/helper";

const ModalChatBoxV2 = () => {
  const { user } = useContext(AuthContext);

  const {
    currentChat,
    onCloseChatBox,
    onShowChatBox,
    isShowChatBox,
    updateCurrentChat,
  } = useContext(ChatV2Context);

  // side effect open/close chat box
  useEffect(() => {
    if (!currentChat) return onCloseChatBox();
    onShowChatBox();
  }, [currentChat, onCloseChatBox, onShowChatBox]);

  if (!user || !currentChat) return;

  const chatName = getChatName(user, currentChat);

  return (
    <Modal
      contentClassName="modal-chat-box"
      show={isShowChatBox}
      onHide={() => updateCurrentChat(null)}
      fullscreen="lg-down"
    >
      <Modal.Header>
        <ChatBoxHeader name={chatName} showCloseButton={true} />
      </Modal.Header>
      <Modal.Body>
        <ChatBox showHeader={false} />
      </Modal.Body>
    </Modal>
  );
};
export default ModalChatBoxV2;
