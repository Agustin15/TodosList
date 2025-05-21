import NewPassword from "../newPassword/NewPassword";
import { NewPasswordProvider } from "../../context/NewPasswordContext";
const NewPasswordPage = () => {
  return (
    <NewPasswordProvider>
      <NewPassword></NewPassword>
    </NewPasswordProvider>
  );
};

export default NewPasswordPage;
