import { FormEvent, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import useCreateGroupChatForm from "../../hook/useCreateGroupChatForm";
import { ChatDetailType, UserModelType } from "../../types/dbModelTypes";
import { getAvailableUsersToChat } from "../../utls/helper";
import { SvgComponent } from "../svg/SvgComponent";
import { SEARCH_PATH_SVG } from "../svg/SvgContants";
import UserPreview from "./UserPreview";
import ErrorMessage from "../common/ErrorMessage";
import ConfirmModal from "../common/ConfirmModal";
import useConfirmModal from "../../hook/useConfirmModal";

const CreateGroupChatForm = ({
  onCloseCanvas,
}: {
  onCloseCanvas: () => void;
}) => {
  const {
    getUser,
    getUserChats,
    groupChatForm,
    handleChangeName,
    handleAddMember,
    handleRemoveMember,
    handleCreateGroupChat,
  } = useCreateGroupChatForm();
  const { isShow, isConfirm, handleShow, handleConfirm, handleCancel } =
    useConfirmModal();

  const [keyword, setKeyword] = useState<string>("");
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const searchUsers: UserModelType[] = [];

  const user = getUser();
  const userChats = getUserChats();

  if (user === "Not Authorized") return <p>{user}</p>;

  const modifiedUser: UserModelType = {
    ...user,
    name: `${user.name} (You)`,
  };

  const availableUsers = getAvailableUsersToChat(user, userChats);

  if (keyword !== "") {
    keyword.split(" ").forEach((word) => {
      if (word === "") return;
      const filtered = availableUsers.filter((u) =>
        u.name.toLowerCase().match(word.toLowerCase())
      );

      filtered.forEach((u) => {
        const found = searchUsers.find((s) => s._id === u._id);
        if (!found) {
          searchUsers.push(u);
        }
      });
    });
  }

  let displayedUsers = availableUsers.slice();
  if (searchUsers.length > 0 || keyword.trim() !== "")
    displayedUsers = searchUsers.slice();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleShow();
  };

  const handleCloseDialog = () => {
    if (!isConfirm) return;
    const data: ChatDetailType = {
      name: groupChatForm.name,
      isGroupChat: true,
      groupChatAdmin: [user],
      members: [user, ...groupChatForm.members],
    };
    console.log(data);
    handleCreateGroupChat(data);
    onCloseCanvas();
  };

  const handleCheckUserSelect = (checked: boolean, user: UserModelType) => {
    if (checked) handleAddMember(user);
    if (!checked) handleRemoveMember(user);
  };

  const handleSearchFocus = (status: boolean) => {
    setIsSearchFocus(status);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="gc-form">
        <Stack gap={3} className="gc-container">
          <Stack className="gc-inputs">
            <Stack className="gc-name">
              <Form.Control
                type="text"
                placeholder="Group Name"
                onChange={(e) => handleChangeName(e.target.value)}
                value={groupChatForm.name}
              />
            </Stack>
            <Stack className="gc-search">
              <strong>Search</strong>
              {/* Search/ Add / Remove user to members */}
              <InputGroup className="mb-1">
                <InputGroup.Text id="basic-addon1">
                  <SvgComponent path={SEARCH_PATH_SVG} color="gray" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search"
                  aria-label="Search"
                  ria-describedby="basic-addon1"
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => handleSearchFocus(true)}
                />
                {isSearchFocus && (
                  <Button
                    variant="info"
                    className=""
                    onClick={() => handleSearchFocus(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-lg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                  </Button>
                )}
              </InputGroup>
            </Stack>
            <Stack className="gc-users">
              {!isSearchFocus && (
                <>
                  <strong>Members</strong>
                  <Stack direction="horizontal">
                    <UserPreview user={modifiedUser} />
                  </Stack>
                  {groupChatForm.members.map((member) => {
                    return (
                      <Stack
                        key={member._id}
                        direction="horizontal"
                        className="gc-member"
                      >
                        <UserPreview user={member} />
                      </Stack>
                    );
                  })}
                </>
              )}

              {isSearchFocus && (
                <>
                  {/* user check box */}
                  {displayedUsers.map((user, index) => {
                    const isExist = groupChatForm.members.includes(user);
                    return (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        id={`${user.name + index}`}
                        className="checkbox-user-preview"
                      >
                        <Form.Check.Input
                          type="checkbox"
                          // isValid
                          className="this-checkbox"
                          name={user._id}
                          checked={isExist}
                          onChange={(e) =>
                            handleCheckUserSelect(e.target.checked, user)
                          }
                        />
                        <Form.Check.Label>
                          <UserPreview user={user} />
                        </Form.Check.Label>
                      </Form.Check>
                    );
                  })}
                </>
              )}
            </Stack>
          </Stack>

          <Stack className="gc-control" gap={3}>
            {groupChatForm.errors.length > 0 && (
              <>
                {groupChatForm.errors.map((error, index) => (
                  <ErrorMessage key={index} message={error} />
                ))}
              </>
            )}
            <Button type="submit">Create</Button>
          </Stack>
        </Stack>
      </Form>
      <ConfirmModal
        isShow={isShow}
        title="Create Group Chat"
        message={`New group chat name ${groupChatForm.name} will be created, do you want to proceed?`}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};
export default CreateGroupChatForm;
