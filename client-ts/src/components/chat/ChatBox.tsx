import moment from "moment";
import { useRef } from "react";
import { Stack } from "react-bootstrap";
import InputEmoji from "react-input-emoji";
import useChatBox from "../../hook/useChatMessage";
import Typing from "../lottie/Typing";
import ChatBoxHeader from "./ChatBoxHeader";
import { MessagesModelType } from "../../types/dbModelTypes";
import ChatBoxLoader from "../placeholders/ChatBoxLoader";

type Props = { showHeader?: boolean; showCloseButton?: boolean };

const ChatBox = ({ showHeader = true, showCloseButton = false }: Props) => {
  // messageToScrollRef - assign this to the html element where to scroll after showing all message
  const {
    inputTextMessageValue,
    chatName,
    messageToScrollRef,
    isFetchingMessages,
    sendingTextMessage,
    showUserIsTyping,
    getCurrentChat,
    getUser,
    getChatMessages,
    getIsTyping,
    handleInputTextMessage,
  } = useChatBox();

  const inputRef = useRef<null | HTMLInputElement>(null);

  const user = getUser();
  const currentChat = getCurrentChat();
  const messages = getChatMessages();
  const isTyping = getIsTyping();

  if (user === "Not Authorized" || currentChat === "Not Authorized") return;

  if (isFetchingMessages) {
    return <ChatBoxLoader />;
  }

  const handleEnterKeyPress = (currentText: string) => {
    sendingTextMessage(currentText);
    handleInputTextMessage("");
  };

  const handleOnChangeTextMsg = (e: string) => {
    handleInputTextMessage(e);

    showUserIsTyping();
  };

  const setupMessages = (messages: MessagesModelType[]) => {
    // let newMessages = messages.slice();
    const newMessages: MessagesModelType[] = [];
    let newSender = true;
    let prevSender = "";

    messages.forEach((message) => {
      if (user._id !== message.senderId._id) {
        if (message.senderId._id !== prevSender) {
          newSender = true;
        }
        if (newSender) {
          newMessages.push({
            ...message,
            text: "show user",
            createdAt: "",
          });
          newMessages.push(message);

          prevSender = message.senderId._id;
          newSender = false;
        } else {
          newMessages.push(message);
        }
      } else {
        prevSender = user._id;
        newMessages.push(message);
      }
    });

    return newMessages;
  };

  let newMessages = messages.slice();
  if (currentChat.isGroupChat) {
    newMessages = setupMessages(messages);
  }

  return (
    <Stack gap={4} className="chat-box">
      {showHeader && (
        <ChatBoxHeader
          name={!chatName ? "No Name" : chatName}
          showCloseButton={showCloseButton}
        />
      )}
      <Stack gap={3} className="messages">
        {newMessages &&
          newMessages.length > 0 &&
          newMessages.map((message, index) => {
            // Show sender name
            if (message.text === "show user" && !message.createdAt) {
              return (
                <Stack
                  key={index}
                  className="message-user-info align-self-start flex-grow-0 "
                >
                  <p>{message.senderId.name}</p>
                </Stack>
              );
            }
            // Default message display in chatbox
            return (
              <Stack
                key={index}
                className={`${
                  message.senderId._id === user._id
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

        {isTyping && (
          <Stack direction="horizontal" className="typing-wrapper">
            <Typing />
          </Stack>
        )}

        <div ref={messageToScrollRef}></div>
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={inputTextMessageValue}
          onChange={(e) => handleOnChangeTextMsg(e)}
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
          onClick={() => handleEnterKeyPress(inputTextMessageValue)}
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
    </Stack>
  );
};
export default ChatBox;
