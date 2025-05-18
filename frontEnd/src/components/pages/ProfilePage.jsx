import Profile from "../profile/Profile";
import { TaskProvider } from "../../context/TaskContext";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { UserDataProvider } from "../../context/userDataContext";

const ProfilePage = () => {
  return (
    <TaskProvider>
      <FormTaskProvider>
        <FormUserProvider>
          <UserDataProvider>
            <Profile></Profile>
          </UserDataProvider>
        </FormUserProvider>
      </FormTaskProvider>
    </TaskProvider>
  );
};

export default ProfilePage;
