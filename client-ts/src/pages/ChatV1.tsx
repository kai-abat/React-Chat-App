import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import OtherUserChats from "../components/chat/OtherUserChats";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import ChatBox from "../components/chat/ChatBox";
import ModalChatBox from "../components/chat/ModalChatBox";
import SearchUser from "../components/chat/SearchUser";
import UserChatV2 from "../components/chat/UserChatV2";
import useWindowDimensions from "../hook/useWindowDimensions";

// Version 1
const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading } = useContext(ChatContext);
  const dimensions = useWindowDimensions();

  if (!user) return <p>No user is currently logged in!</p>;

  return (
    <Container id="chat-container">
      <Stack direction="horizontal" gap={4} className="align-items-start">
        <Stack className=" w-auto">
          <OtherUserChats />
          <SearchUser />
          {!userChats || userChats.length < 1 ? null : (
            <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
              {isUserChatsLoading && <p>Loading chats...</p>}
              {userChats.map((chat, index) => {
                return (
                  <div key={index}>
                    <UserChatV2 chat={chat} user={user} />
                  </div>
                );
              })}
            </Stack>
          )}
        </Stack>
        <Stack className="w-75">
          {!userChats || userChats.length < 1 ? null : (
            <>
              {dimensions.width > 991 && <ChatBox />}
              {dimensions.width <= 991 && <ModalChatBox />}
            </>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};
export default Chat;
