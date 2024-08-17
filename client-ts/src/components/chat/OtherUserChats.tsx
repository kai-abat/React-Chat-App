import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const OtherUserChats = () => {
  const { user } = useContext(AuthContext);
  const { otherUsersChat, createChat } = useContext(ChatContext);

  if (!user) return;

  return (
    <>
      <div className="all-users">
        {otherUsersChat &&
          otherUsersChat.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user.id, u.id)}
              >
                {u.name}
                <span className="user-online"></span>
              </div>
            );
          })}
      </div>
    </>
  );
};
export default OtherUserChats;
