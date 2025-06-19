import Profile from "../profile/Profile";
import { UserDataProvider } from "../../context/userDataContext";
import { FormEditPasswordProvider } from "../../context/FormEditPasswordContext";
import { FormEditEmailProvider } from "../../context/FormEditEmailContext";
import { WindowSizeProvider } from "../../context/WindowSizeContext";
const ProfilePage = () => {
  return (
    <UserDataProvider>
      <WindowSizeProvider>
        <FormEditPasswordProvider>
          <FormEditEmailProvider>
            <Profile></Profile>
          </FormEditEmailProvider>
        </FormEditPasswordProvider>
      </WindowSizeProvider>
    </UserDataProvider>
  );
};

export default ProfilePage;
