import { Stack } from "react-bootstrap";
import useChats from "../../hook/useChats";
import ChatListLoader from "../placeholders/ChatListLoader";
import UserChatV3 from "./UserChatV3";

const ChatList = () => {
  const { isFetchingChats, getUser, getUserChats, getCurrentChat } = useChats();

  const user = getUser();
  const userChats = getUserChats();
  const currentChat = getCurrentChat();
  const currentChatId =
    currentChat === "Not Authorized" ? null : currentChat._id;

  if (user === "Not Authorized") return <p>No user is currently logged in!</p>;

  if (isFetchingChats) return <ChatListLoader />;

  return (
    <>
      {!userChats || userChats.length < 1 ? null : (
        <Stack className="messages-box" gap={3}>
          {userChats.map((chat, index) => {
            return (
              <UserChatV3
                key={index}
                chatWithMsg={chat}
                user={user}
                isActive={chat.chat._id === currentChatId}
              />
            );
          })}
        </Stack>
      )}
    </>
  );
};
export default ChatList;
