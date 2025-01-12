import Profile from "../profile/Profile";
import { TokenProvider } from "../../context/TokenContext";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormProvider } from "../../context/FormContext";

const ProfilePage = () => {
  return (
    <FormProvider>
      <FormUserProvider>
        <TokenProvider>
          <Profile></Profile>
        </TokenProvider>
      </FormUserProvider>
    </FormProvider>
  );
};

export default ProfilePage;
