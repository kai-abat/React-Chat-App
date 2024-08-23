import { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import Modal from "react-bootstrap/Modal";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipientUser } from "../../hook/useFetchRecipientUser";
import { Stack } from "react-bootstrap";
import InputEmojiWithRef from "react-input-emoji";
import moment from "moment";

const ModalChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isShowChatBox,
    updateCurrentChat,
    onShowChatBox,
    onCloseChatBox,
    sendTextMessage,
    notifications,
  } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentChat, notifications]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (!currentChat) return onCloseChatBox();
    onShowChatBox();
  }, [currentChat, onCloseChatBox, onShowChatBox]);

  if (!user || !currentChat) return;

  const handleEnterKeyPress = (currentText: string) => {
    sendTextMessage(currentText, user, currentChat?.id, setTextMessage);
  };

  return (
    <Modal
      contentClassName="modal-chat-box"
      show={isShowChatBox}
      onHide={() => updateCurrentChat(null)}
      fullscreen="lg-down"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{recipientUser?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={3} className="modal-body-messages">
          {messages &&
            messages.map((message, index) => {
              return (
                <Stack
                  ref={messagesEndRef}
                  key={index}
                  className={`${
                    message.senderId === user.id
                      ? "message self align-self-end flex-grow-0"
                      : "message align-self-start flex-grow-0"
                  }`}
                >
                  <span>{message.text}</span>
                  <span className="message-footer">
                    {moment(message.createdAt).calendar()}
                  </span>
                </Stack>
              );
            })}
          {/* <div ref={messagesEndRef} /> */}
        </Stack>
      </Modal.Body>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmojiWithRef
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)"
          shouldReturn
          shouldConvertEmojiToImage={false}
          onEnter={handleEnterKeyPress}
          cleanOnEnter
          ref={inputRef}
        />
        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat?.id, setTextMessage)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </Stack>
    </Modal>
  );
};
export default ModalChatBox;
