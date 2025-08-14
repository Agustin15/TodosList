import Profile from "../profile/Profile";
import { UserDataProvider } from "../../context/UserDataContext";

const ProfilePage = () => {
  return (
    <UserDataProvider>
      <Profile></Profile>
    </UserDataProvider>
  );
};

export default ProfilePage;
