import { Offcanvas } from "react-bootstrap";
import { CanvasType } from "../types/common";
import CreateGroupChatForm from "./chat/CreateGroupChatForm";

type Props = { show: boolean; handleClose: () => void; canvasType: CanvasType };
const OffCanvasMain = ({ show, handleClose, canvasType }: Props) => {
  return (
    <Offcanvas show={show} onHide={handleClose} className="chat-off-canvas">
      <Offcanvas.Header closeButton>
        {canvasType === "SEARCH" && "Search User"}
        {canvasType === "CREATE-GC" && "Create Group Chat"}
      </Offcanvas.Header>
      <Offcanvas.Body>
        {canvasType === "CREATE-GC" && <CreateGroupChatForm />}
      </Offcanvas.Body>
    </Offcanvas>
  );
};
export default OffCanvasMain;
