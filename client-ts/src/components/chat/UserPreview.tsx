import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { UserModelType } from "../../types/dbModelTypes";

const UserPreview = ({ user }: { user: UserModelType }) => {
  return (
    <Stack direction="horizontal" gap={4} className="user-card p-3">
      <span className="avatar">
        <img src={avatar} alt="profile picture" height="60px" />
      </span>
      <span className=" text-capitalize text-white">{user.name}</span>
    </Stack>
  );
};

export default UserPreview;
