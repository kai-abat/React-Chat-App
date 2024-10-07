import { FormEvent, useEffect, useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import useSearchUser from "../../hook/useSearchUser";
import { getAvailableUsersToChat } from "../../utls/helper";
import UserPreview from "./UserPreview";
import Loader from "../common/Loader";
import ConfirmModal from "../common/ConfirmModal";
import useConfirmModal from "../../hook/useConfirmModal";
import { UserModelType } from "../../types/dbModelTypes";

type Props = {
  onCloseCanvas: () => void;
};
const SearchUser = ({ onCloseCanvas }: Props) => {
  const {
    getUser,
    getUserChats,
    handleSearchUser,
    handleCreateChat,
    isPending,
    usersFound,
  } = useSearchUser();
  const [keywords, setKeywords] = useState<string>("");
  const user = getUser();
  const userChats = getUserChats();
  const { isShow, isConfirm, handleShow, handleConfirm, handleCancel } =
    useConfirmModal();
  const [selectedUser, setSelectedUser] = useState<UserModelType | null>(null);

  if (user === "Not Authorized") return <p>{user}</p>;

  const usersFromChat = getAvailableUsersToChat(user, userChats);

  const usersNotInChat = usersFound.filter((user) => {
    const found = usersFromChat.find((c) => c._id === user._id);
    if (found) {
      return false;
    } else return true;
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSearchUser(keywords);
  };

  const handleSelectUser = (user: UserModelType) => {
    setSelectedUser(user);
    handleShow();
  };

  const handleCloseDialog = () => {
    console.log("CONFIRM TO PROCEED?[T/F]: ", isConfirm);
    if (isConfirm && selectedUser) {
      console.log("SELECTED USER: ", selectedUser.name);
      handleCreateChat(user, selectedUser);
      onCloseCanvas();
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="search-user-form">
        <Row className="search-box">
          <Col xs="auto" className="search-text ">
            <Form.Control
              type="text"
              placeholder="Search..."
              onChange={(e) => setKeywords(e.target.value)}
              value={keywords}
            />
          </Col>
          <Col className="search-btn">
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </Col>
        </Row>
        <Row className="search-result">
          {isPending && <Loader />}
          {!isPending &&
            usersNotInChat.map((user) => {
              return (
                <Stack
                  key={user._id}
                  direction="horizontal"
                  className="user"
                  onClick={() => handleSelectUser(user)}
                >
                  <UserPreview user={user} />
                </Stack>
              );
            })}
        </Row>
      </Form>
      <ConfirmModal
        isShow={isShow}
        title="Create Chat"
        message={`Are you sure to create a chat with ${selectedUser?.name}?`}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};
export default SearchUser;
