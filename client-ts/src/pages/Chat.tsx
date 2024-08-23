import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import OtherUserChats from "../components/chat/OtherUserChats";

import UserChatV2 from "../components/chat/UserChatV2";
import ModalChatBox from "../components/chat/ModalChatBox";
import useWindowDimensions from "../hook/useWindowDimensions";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading } = useContext(ChatContext);
  const dimensions = useWindowDimensions();

  if (!user) return <p>No user is currently logged in!</p>;

  return (
    <Container id="chat-container">
      <OtherUserChats />
      {!userChats || userChats.length < 1 ? null : (
        <>
          <Stack direction="horizontal" gap={4} className="align-items-start">
            <Stack className="message-box flex-grow-0 pe-3" gap={3}>
              {isUserChatsLoading && <p>Loading chats...</p>}
              {userChats.map((chat, index) => {
                return (
                  <div key={index}>
                    <UserChatV2 chat={chat} user={user} />
                  </div>
                );
              })}
            </Stack>
            {dimensions.width > 991 && <ChatBox />}
          </Stack>

          {dimensions.width <= 991 && <ModalChatBox />}
        </>
      )}
    </Container>
  );
};
export default Chat;
