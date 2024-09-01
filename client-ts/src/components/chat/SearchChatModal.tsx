import { useContext, useEffect } from "react";
import { Modal, Stack } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { UserInfoType } from "../../types/UserTypes";
import User from "./User";

const SearchChatModal = ({
  isShowResultsModal,
  setIsShowResultsModal,
  searchKeywords,
}: {
  isShowResultsModal: boolean;
  setIsShowResultsModal: React.Dispatch<React.SetStateAction<boolean>>;
  searchKeywords: string;
}) => {
  const { user } = useContext(AuthContext);
  const { allUsers, otherUsersChat } = useContext(ChatContext);

  const splitKeywords = searchKeywords.split(" ");

  useEffect(() => {}, []);

  if (!user || !otherUsersChat) return;

  const foundUsers: UserInfoType[] = [];

  if (isShowResultsModal) {
    // Search from all user array except the user login
    splitKeywords.forEach((keyword) => {
      if (keyword === "") return;
      const users = allUsers.filter((u) => {
        return (
          u.name.toLowerCase().match(keyword.toLowerCase()) &&
          u._id !== user._id
        );
      });

      users.forEach((user) => {
        if (user) {
          const existingUser = foundUsers.find((u) => u._id === user._id);
          if (!existingUser) {
            foundUsers.push(user);
          }
        }
      });
    });

    console.log("SearchChatModal->foundUsers:", foundUsers);
  }

  const sortedFoundUsers = foundUsers.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Modal
      contentClassName="modal-chat-box"
      show={isShowResultsModal}
      onHide={() => setIsShowResultsModal(false)}
      // fullscreen="lg-down"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Users Found</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={3}>
          {sortedFoundUsers.length > 0 &&
            sortedFoundUsers.map((user, index) => {
              return (
                <User
                  key={index}
                  recipient={user}
                  showModal={setIsShowResultsModal}
                />
              );
            })}
          {sortedFoundUsers.length <= 0 && <span>No users found</span>}
        </Stack>
      </Modal.Body>
    </Modal>
  );
};
export default SearchChatModal;
