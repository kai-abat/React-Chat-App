import { Offcanvas } from "react-bootstrap";
import { CanvasType } from "../../types/common";
import CreateGroupChatForm from "../chat/CreateGroupChatForm";
import SearchUser from "../chat/SearchUser";
import { useContext } from "react";
import { ChatV2Context } from "../../context/ChatV2Context";

type Props = { show: boolean; handleClose: () => void; canvasType: CanvasType };
const OffCanvasMain = ({ show, handleClose, canvasType }: Props) => {
  const { resetCreateGroupChatForm } = useContext(ChatV2Context);
  const onHide = () => {
    handleClose();
    if (canvasType === "CREATE-GC") resetCreateGroupChatForm();
  };
  return (
    <Offcanvas show={show} onHide={onHide} className="chat-off-canvas">
      <Offcanvas.Header closeButton closeVariant="white">
        <strong>
          {canvasType === "SEARCH" && "Search User"}
          {canvasType === "CREATE-GC" && "Create Group Chat"}
        </strong>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {canvasType === "CREATE-GC" && (
          <CreateGroupChatForm onCloseCanvas={onHide} />
        )}
        {canvasType === "SEARCH" && <SearchUser onCloseCanvas={onHide} />}
      </Offcanvas.Body>
    </Offcanvas>
  );
};
export default OffCanvasMain;
