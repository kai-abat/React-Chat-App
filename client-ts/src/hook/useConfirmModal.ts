import { useRef, useState } from "react";

const useConfirmModal = () => {
  const [isShow, setIsShow] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  const handleConfirm = () => {
    setIsShow(false);
    setIsConfirm(true);
  };
  const handleCancel = () => {
    setIsShow(false);
    setIsConfirm(false);
  };

  const handleShow = () => {
    setIsShow(true);
  };

  return {
    isShow,
    isConfirm,
    handleShow,
    handleConfirm,
    handleCancel,
  };
};
export default useConfirmModal;
