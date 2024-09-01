import { Form, InputGroup, Stack } from "react-bootstrap";
import { SvgComponent } from "../svg/SvgComponent";
import { SEARCH_PATH_SVG } from "../svg/SvgContants";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import UserPreview from "./UserPreview";
import { GroupChatContext } from "../../context/GroupChatContext";
import { UserInfoType } from "../../types/UserTypes";

const CreateGroupChatForm = () => {
  const { user } = useContext(AuthContext);
  const { availableUsers } = useContext(ChatContext);
  const {
    onShaowGCModal,
    onCheckSelectUser,
    updateCreateGCForm,
    createGCForm,
  } = useContext(GroupChatContext);

  const [keyword, setKeyword] = useState<string>("");
  const searchUsers: UserInfoType[] = [];

  if (!user) return;

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
    onShaowGCModal(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={3}>
        <Form.Control
          type="text"
          placeholder="Group Name"
          onChange={(e) =>
            updateCreateGCForm({ ...createGCForm, groupName: e.target.value })
          }
        />
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

        <Stack className=" overflow-auto">
          {/* user check box */}
          {displayedUsers.map((user, index) => {
            const isExist = createGCForm.members.includes(user);
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
                  onChange={(e) => onCheckSelectUser(e)}
                />
                <Form.Check.Label>
                  <UserPreview recipient={user} />
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
