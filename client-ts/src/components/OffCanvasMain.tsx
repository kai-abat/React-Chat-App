import { Offcanvas } from "react-bootstrap";
import { CanvasType } from "../types/common";
import CreateGroupChatForm from "./chat/CreateGroupChatForm";
import SearchUser from "./chat/SearchUser";

type Props = { show: boolean; handleClose: () => void; canvasType: CanvasType };
const OffCanvasMain = ({ show, handleClose, canvasType }: Props) => {
  return (
    <Offcanvas show={show} onHide={handleClose} className="chat-off-canvas">
      <Offcanvas.Header closeButton closeVariant="white">
        <strong>
          {canvasType === "SEARCH" && "Search User"}
          {canvasType === "CREATE-GC" && "Create Group Chat"}
        </strong>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {canvasType === "CREATE-GC" && <CreateGroupChatForm />}
        {canvasType === "SEARCH" && <SearchUser />}
      </Offcanvas.Body>
    </Offcanvas>
  );
};
export default OffCanvasMain;
