import Login from "../login/Login";
import { FormUserProvider } from "../../context/FormUserContext";
import { LoginProvider } from "../../context/LoginContext";
import { VerificationTwoStepProvider } from "../../context/verificationTwoStep/VerificationTwoStepContext";

const LoginPage = () => {
  return (
    <FormUserProvider>
      <VerificationTwoStepProvider>
        <LoginProvider>
          <Login />
        </LoginProvider>
      </VerificationTwoStepProvider>
    </FormUserProvider>
  );
};

export default LoginPage;
