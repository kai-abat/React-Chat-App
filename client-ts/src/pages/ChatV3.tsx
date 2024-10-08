import { useContext } from "react";
import ChatBox from "../components/chat/ChatBox";
import ChatList from "../components/chat/ChatList";
import ModalChatBoxV2 from "../components/chat/ModalChatBoxV2";
import NavChat from "../components/chat/NavChat";
import Layout from "../components/common/Layout";
import OffCanvasMain from "../components/common/OffCanvasMain";
import { ChatV2Context } from "../context/ChatV2Context";
import useWindowDimensions from "../hook/useWindowDimensions";
import { useNavigate } from "react-router-dom";
import useNavChat from "../hook/useNavChat";

// Version 3
const ChatV3 = () => {
  // Custom hook of Chat
  const navigate = useNavigate();
  const { getUser, getUserChats } = useContext(ChatV2Context);
  const { showChatOffCanvas, canvasType, handleOffCanvasClose } = useNavChat();
  const dimensions = useWindowDimensions();

  const user = getUser();
  const userChats = getUserChats();

  if (user === "Not Authorized") navigate("/login");

  return (
    <>
      <Layout.Content isGrow={false}>
        <NavChat />
      </Layout.Content>
      <Layout.Content isGrow={false}>
        <ChatList />
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
      {/* <CreateGroupChatModal /> */}
      <OffCanvasMain
        show={showChatOffCanvas}
        handleClose={handleOffCanvasClose}
        canvasType={canvasType}
      />
    </>
  );
};
export default ChatV3;
