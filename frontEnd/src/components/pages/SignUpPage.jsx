import FormSignUp from "../signUp/FormSignUp";
import { FormUserProvider } from "../../context/FormUserContext";
import { LoginProvider } from "../../context/LoginContext";
import { VerificationTwoStepProvider } from "../../context/VerificationTwoStepContext";

const SignUpPage = () => {
  return (
    <FormUserProvider>
      <VerificationTwoStepProvider>
        <LoginProvider>
          <FormSignUp></FormSignUp>
        </LoginProvider>
      </VerificationTwoStepProvider>
    </FormUserProvider>
  );
};

export default SignUpPage;
