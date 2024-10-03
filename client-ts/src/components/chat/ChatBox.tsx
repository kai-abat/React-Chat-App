import moment from "moment";
import { useContext, useEffect, useRef } from "react";
import { Stack } from "react-bootstrap";
import InputEmoji from "react-input-emoji";
import { AuthContext } from "../../context/AuthContext";
import { ChatV2Context } from "../../context/ChatV2Context";
import useChatMessage from "../../hook/useChatMessage";
import { useFetchRecipientUser } from "../../hook/useFetchRecipientUser";
import ChatBoxHeader from "./ChatBoxHeader";
import Typing from "../lottie/Typing";

const ChatBox = ({ showHeader = true }: { showHeader?: boolean }) => {
  const { user } = useContext(AuthContext);

  const {
    currentChat,
    updateCurrentChat,
    messageURI,
    setCurrentMessages,
    currentMessages,
    newMessage,
    setTyping,
    typing,
    isTyping,
    textMessage,
    setTextMessage,
    socketConnected,
  } = useContext(ChatV2Context);

  const { chatMessages, isFetchingMessages, sendTextMessageMutate } =
    useChatMessage(currentChat);

  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (!chatMessages) return;
    setCurrentMessages(chatMessages);
  }, [chatMessages, setCurrentMessages]);

  useEffect(() => {
    console.log("newMessage:", newMessage);
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [newMessage, currentMessages, currentChat, isTyping]);

  if (!user || !currentChat) return;

  // this message should display if
  // no selected user to chat or if we close the chatbox
  if (!recipientUser) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversion selected yet...
      </p>
    );
  }
  if (isFetchingMessages) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat...</p>
    );
  }

  const handleEnterKeyPress = (currentText: string) => {
    const body = JSON.stringify({
      senderId: user._id,
      text: currentText,
      chatId: currentChat._id,
    });

    // display new message imeddiatly to the current message screen

    sendTextMessageMutate({ url: messageURI, body: body });
    setTextMessage("");

    // if (socketConnected) {
    //   socket?.emit("stop-typing", recipientUser._id);
    //   setTyping(false);
    // }
    // sendTextMessage(currentText, user, currentChat?._id, setTextMessage);
  };

  const handleOnChangeTextMsg = (e: string) => {
    setTextMessage(e);

    if (socketConnected && !typing) {
      setTyping(true);
    }
  };

  return (
    <Stack gap={4} className="chat-box">
      {showHeader && (
        <ChatBoxHeader
          name={recipientUser.name}
          closeHandler={() => updateCurrentChat(null)}
        />
      )}
      <Stack gap={3} className="messages">
        {currentMessages &&
          currentMessages.length > 0 &&
          currentMessages.map((message, index) => {
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

        <div ref={messagesEndRef}></div>
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
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
          onClick={() => handleEnterKeyPress(textMessage)}
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
