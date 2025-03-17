import Profile from "../profile/Profile";
import { TokenProvider } from "../../context/TokenContext";
import { TaskProvider } from "../../context/TaskContext";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormProvider } from "../../context/FormContext";

const ProfilePage = () => {
  return (
    <TaskProvider>
      <FormProvider>
        <FormUserProvider>
          <TokenProvider>
            <Profile></Profile>
          </TokenProvider>
        </FormUserProvider>
      </FormProvider>
    </TaskProvider>
  );
};

export default ProfilePage;
