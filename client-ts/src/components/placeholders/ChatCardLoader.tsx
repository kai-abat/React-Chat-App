import { Stack, Placeholder } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";

const ChatCardLoader = () => {
  return (
    <Stack className="user-card" direction="horizontal" gap={3}>
      <div className="avatar">
        <img src={avatar} alt="profile picture" height="60px" />
      </div>
      <Stack direction="horizontal" gap={3} className="content">
        {/* name, text msg */}
        <div className="text-content">
          <Placeholder animation="glow">
            <Placeholder xs={12} />
            <Placeholder xs={12} />
          </Placeholder>
        </div>

        {/* date, notification */}
        <div className="text-sent">
          <Placeholder animation="glow">
            <Placeholder xs={10} />
            <Placeholder xs={10} />
          </Placeholder>
        </div>
      </Stack>
    </Stack>
  );
};
export default ChatCardLoader;
