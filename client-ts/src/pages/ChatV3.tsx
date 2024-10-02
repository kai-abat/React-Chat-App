import { useContext, useEffect } from "react";
import { Stack } from "react-bootstrap";
import ChatBox from "../components/chat/ChatBox";
import ChatControls from "../components/chat/ChatControls";
import CreateGroupChatModal from "../components/chat/CreateGroupChatModal";
import ModalChatBoxV2 from "../components/chat/ModalChatBoxV2";
import NavChat from "../components/chat/NavChat";
import UserChatV3 from "../components/chat/UserChatV3";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { ChatV2Context } from "../context/ChatV2Context";
import useChats from "../hook/useChats";
import useWindowDimensions from "../hook/useWindowDimensions";

// Version 3
const ChatV3 = () => {
  const { user } = useContext(AuthContext);
  const { userChats, setUserChats } = useContext(ChatV2Context);
  const { chats, isFetchingChats, error: errorChats } = useChats();
  const dimensions = useWindowDimensions();

  useEffect(() => {
    if (!errorChats && !isFetchingChats && chats) {
      setUserChats(chats);
    }
  }, [chats, isFetchingChats, errorChats, setUserChats]);

  if (!user) return <p>No user is currently logged in!</p>;

  return (
    <>
      <Layout.Content isGrow={false}>
        <NavChat />
      </Layout.Content>
      <Layout.Content isGrow={false}>
        <ChatControls />
        {/* <OtherUserChats /> */}

        {!userChats || userChats.length < 1 ? null : (
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isFetchingChats && <p>Loading chats...</p>}
            {userChats.map((chat, index) => {
              return (
                <div key={index}>
                  <UserChatV3 chat={chat} user={user} />
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
          {dimensions.width <= 991 && <ModalChatBoxV2 />}
        </>
      )}

      {/* Create Group Chat Modal */}
      <CreateGroupChatModal />
    </>
  );
};
export default ChatV3;
