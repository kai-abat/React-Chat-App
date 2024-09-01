import { Form, InputGroup, Stack } from "react-bootstrap";
import { SvgComponent } from "../svg/SvgComponent";
import { SEARCH_PATH_SVG } from "../svg/SvgContants";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import UserPreview from "./UserPreview";

const CreateGroupChatForm = () => {
  const { user } = useContext(AuthContext);

  const { allUsers } = useContext(ChatContext);

  if (!user) return;

  const otherUsers = allUsers.filter((u) => u._id !== user._id);
  return (
    <Form>
      <Stack gap={3}>
        <Form.Control type="text" placeholder="Group Name" />
        <InputGroup className="mb-1">
          <InputGroup.Text id="basic-addon1">
            <SvgComponent path={SEARCH_PATH_SVG} color="gray" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            ria-describedby="basic-addon1"
          />
        </InputGroup>

        <Stack className=" overflow-auto">
          {/* user check box */}
          {otherUsers.map((user, index) => {
            return (
              <Form.Check
                key={index}
                type="checkbox"
                id={`${user.name + index}`}
                className="checkbox-user-preview"
              >
                <Form.Check.Input
                  type="checkbox"
                  isValid
                  className="this-checkbox"
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
