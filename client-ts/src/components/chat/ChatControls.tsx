import { useContext } from "react";
import { Button, Stack } from "react-bootstrap";
import { GroupChatContext } from "../../context/GroupChatContext";
import { SvgComponent } from "../svg/SvgComponent";
import SearchUser from "./SearchUser";
import { CREATE_GC_PATH_SVG } from "../svg/SvgContants";

const ChatControls = () => {
  const { onShaowGCModal } = useContext(GroupChatContext);
  return (
    <Stack direction="horizontal" gap={1}>
      <Stack>
        <SearchUser />
      </Stack>
      <Stack className=" flex-grow-0">
        <Button onClick={() => onShaowGCModal(true)}>
          <SvgComponent width="1.5rem" path={CREATE_GC_PATH_SVG} />
        </Button>
      </Stack>
    </Stack>
  );
};
export default ChatControls;
