import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import OtherUserChats from "../components/chat/OtherUserChats";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatsError } =
    useContext(ChatContext);

  if (!user) return <p>No user is currently logged in!</p>;

  console.log("USER CHATS:", userChats);
  return (
    <Container>
      <OtherUserChats />
      {!userChats || userChats.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="message-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats.map((chat, index) => {
              return (
                <div key={index}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <p>ChatBox</p>
        </Stack>
      )}
    </Container>
  );
};
export default Chat;
