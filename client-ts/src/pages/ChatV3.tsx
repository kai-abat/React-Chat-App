import { Offcanvas, Stack } from "react-bootstrap";
import ChatBox from "../components/chat/ChatBox";
import CreateGroupChatModal from "../components/chat/CreateGroupChatModal";
import ModalChatBoxV2 from "../components/chat/ModalChatBoxV2";
import NavChat from "../components/chat/NavChat";
import UserChatV3 from "../components/chat/UserChatV3";
import Layout from "../components/Layout";
import Typing from "../components/lottie/Typing";
import useChats from "../hook/useChats";
import useWindowDimensions from "../hook/useWindowDimensions";
import OffCanvasMain from "../components/OffCanvasMain";
import useNavChat from "../hook/useNavChat";

// Version 3
const ChatV3 = () => {
  // Custom hook of Chat
  const { isFetchingChats, getUser, getUserChats, getCurrentChat } = useChats();
  const { showChatOffCanvas, canvasType, handleOffCanvasClose } = useNavChat();
  const dimensions = useWindowDimensions();

  const user = getUser();
  const userChats = getUserChats();
  const currentChat = getCurrentChat();
  const currentChatId =
    currentChat === "Not Authorized" ? null : currentChat._id;

  if (user === "Not Authorized") return <p>No user is currently logged in!</p>;

  return (
    <>
      <Layout.Content isGrow={false}>
        <NavChat />
      </Layout.Content>
      <Layout.Content isGrow={false}>
        {/* <ChatControls /> */}

        {!userChats || userChats.length < 1 ? null : (
          <Stack className="messages-box" gap={3}>
            {isFetchingChats && <Typing />}
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
      <OffCanvasMain
        show={showChatOffCanvas}
        handleClose={handleOffCanvasClose}
        canvasType={canvasType}
      />
    </>
  );
};
export default ChatV3;
