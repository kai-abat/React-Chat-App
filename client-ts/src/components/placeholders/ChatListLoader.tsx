import { Stack } from "react-bootstrap";
import ChatCardLoader from "./ChatCardLoader";

const ChatListLoader = () => {
  return (
    <Stack className="messages-box" gap={3}>
      <ChatCardLoader />
      <ChatCardLoader />
      <ChatCardLoader />
      <ChatCardLoader />
      <ChatCardLoader />
    </Stack>
  );
};
export default ChatListLoader;
