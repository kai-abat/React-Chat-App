import { useContext } from "react";
import { ChatV2Context } from "../context/ChatV2Context";

const useNavChat = () => {
  const {
    showChatOffCanvas,
    canvasType,
    handleOffCanvasClose,
    handleOffCanvasShow,
  } = useContext(ChatV2Context);
  return {
    showChatOffCanvas,
    canvasType,
    handleOffCanvasClose,
    handleOffCanvasShow,
  };
};

export default useNavChat;
