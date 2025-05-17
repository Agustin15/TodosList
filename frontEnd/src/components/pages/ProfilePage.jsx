import Profile from "../profile/Profile";
import { TaskProvider } from "../../context/TaskContext";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormTaskProvider } from "../../context/FormTaskContext";

const ProfilePage = () => {
  return (
    <TaskProvider>
      <FormTaskProvider>
        <FormUserProvider>
          <Profile></Profile>
        </FormUserProvider>
      </FormTaskProvider>
    </TaskProvider>
  );
};

export default ProfilePage;
