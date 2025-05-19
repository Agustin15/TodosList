import Profile from "../profile/Profile";
import { UserDataProvider } from "../../context/userDataContext";
import { FormEditPasswordProvider } from "../../context/FormEditPasswordContext";
import { FormEditEmailProvider } from "../../context/FormEditEmailContext";
const ProfilePage = () => {
  return (
    <UserDataProvider>
      <FormEditPasswordProvider>
        <FormEditEmailProvider>
          <Profile></Profile>
        </FormEditEmailProvider>
      </FormEditPasswordProvider>
    </UserDataProvider>
  );
};

export default ProfilePage;
