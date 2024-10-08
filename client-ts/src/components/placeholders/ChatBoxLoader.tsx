import { Placeholder, Stack } from "react-bootstrap";

const ChatBoxLoader = () => {
  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <Placeholder as={Stack} animation="glow">
          <Placeholder xs={8} />
          <Placeholder xs={8} />
        </Placeholder>
      </div>
      <Stack gap={3} className="messages">
        <Stack className="dummy-text-content align-self-start flex-grow-0 ">
          <Placeholder as={Stack} animation="glow">
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
          </Placeholder>
        </Stack>
        <Stack className="dummy-text-content self align-self-end flex-grow-0 ">
          <Placeholder as={Stack} animation="glow">
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
          </Placeholder>
        </Stack>
        <Stack className="dummy-text-content align-self-start flex-grow-0 ">
          <Placeholder as={Stack} animation="glow">
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
          </Placeholder>
        </Stack>
        <Stack className="dummy-text-content self align-self-end flex-grow-0 ">
          <Placeholder as={Stack} animation="glow">
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
            <Placeholder xs={15} size="lg" />
          </Placeholder>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default ChatBoxLoader;
