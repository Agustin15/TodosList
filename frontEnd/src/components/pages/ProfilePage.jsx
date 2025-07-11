import Profile from "../profile/Profile";
import { UserDataProvider } from "../../context/userDataContext";

const ProfilePage = () => {
  return (
    <UserDataProvider>
      <Profile></Profile>
    </UserDataProvider>
  );
};

export default ProfilePage;
