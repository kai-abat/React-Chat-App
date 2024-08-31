import { useContext } from "react";
import { Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
// import OtherUserChats from "../components/chat/OtherUserChats";

import UserChatV2 from "../components/chat/UserChatV2";
import ModalChatBox from "../components/chat/ModalChatBox";
import useWindowDimensions from "../hook/useWindowDimensions";
import ChatBox from "../components/chat/ChatBox";
import SearchUser from "../components/chat/SearchUser";
import Layout from "../components/Layout";
import NavChat from "../components/chat/NavChat";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading } = useContext(ChatContext);
  const dimensions = useWindowDimensions();

  if (!user) return <p>No user is currently logged in!</p>;

  return (
    <>
      <Layout.Content isGrow={false}>
        <NavChat />
      </Layout.Content>
      <Layout.Content isGrow={false}>
        <SearchUser />
        {/* <OtherUserChats /> */}
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
      </Layout.Content>

      {!userChats || userChats.length < 1 ? null : (
        <>
          {dimensions.width > 991 && (
            <Layout.Content>
              <ChatBox />
            </Layout.Content>
          )}
          {dimensions.width <= 991 && <ModalChatBox />}
        </>
      )}
    </>
  );
};
export default Chat;
