import { useRef, useState } from "react";
import { CanvasType } from "../types/common";

const useOffCanvas = () => {
  const [show, setShow] = useState(false);
  const content = useRef<CanvasType>();

  const handleClose = () => {
    content.current = undefined;
    setShow(false);
  };
  const handleShow = (c: CanvasType) => {
    content.current = c;
    setShow(true);
  };
  const type = content.current;

  return { show, handleClose, handleShow, type };
};

export default useOffCanvas;
