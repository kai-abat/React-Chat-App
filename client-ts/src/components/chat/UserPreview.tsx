import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { UserInfoType } from "../../types/UserTypes";

const UserPreview = ({ recipient }: { recipient: UserInfoType }) => {
  return (
    <Stack direction="horizontal" gap={4} className="user-card p-3">
      <span className="avatar">
        <img src={avatar} alt="profile picture" height="60px" />
      </span>
      <span className=" text-capitalize text-white">{recipient.name}</span>
    </Stack>
  );
};

export default UserPreview;
