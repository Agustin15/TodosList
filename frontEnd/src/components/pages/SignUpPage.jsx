import FormSignUp from "../signUp/FormSignUp";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormProvider } from "../../context/FormContext";
import { LoginProvider } from "../../context/LoginContext";

const SignUpPage = () => {
  return (
    <FormProvider>
      <FormUserProvider>
        <LoginProvider>
          <FormSignUp></FormSignUp>
        </LoginProvider>
      </FormUserProvider>
    </FormProvider>
  );
};

export default SignUpPage;
