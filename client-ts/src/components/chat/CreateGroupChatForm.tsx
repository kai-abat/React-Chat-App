import { FormEvent, useState } from "react";
import { Form, InputGroup, Stack } from "react-bootstrap";
import useCreateGroupChatForm from "../../hook/useCreateGroupChatForm";
import { UserModelType } from "../../types/dbModelTypes";
import { SvgComponent } from "../svg/SvgComponent";
import { SEARCH_PATH_SVG } from "../svg/SvgContants";
import UserPreview from "./UserPreview";

const CreateGroupChatForm = () => {
  const {
    getUser,
    getUserChats,
    groupChatForm,
    handleChangeName,
    handleAddMember,
    handleRemoveMember,
  } = useCreateGroupChatForm();

  const [keyword, setKeyword] = useState<string>("");
  const searchUsers: UserModelType[] = [];

  const user = getUser();
  const userChats = getUserChats();

  if (user === "Not Authorized") return <p>{user}</p>;

  const availableUsers = userChats.reduce((acc, ch) => {
    if (!ch.chat.isGroupChat) {
      const u = ch.chat.members.find((m) => m._id !== user._id);
      if (u) acc.push(u);
    }
    return acc;
  }, [] as UserModelType[]);

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
  };

  const handleCheckUserSelect = (checked: boolean, user: UserModelType) => {
    if (checked) handleAddMember(user);
    if (!checked) handleRemoveMember(user);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={3}>
        <Form.Control
          type="text"
          placeholder="Group Name"
          onChange={(e) => handleChangeName(e.target.value)}
          value={groupChatForm.name}
        />

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
          />
        </InputGroup>

        <Stack>
          {groupChatForm.members.map((member) => {
            return (
              <Stack direction="horizontal">
                <UserPreview user={member} />
              </Stack>
            );
          })}
        </Stack>

        <Stack className=" overflow-auto">
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
        </Stack>
      </Stack>
    </Form>
  );
};
export default CreateGroupChatForm;
