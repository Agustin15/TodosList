import FormSignUp from "../signUp/FormSignUp";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { LoginProvider } from "../../context/LoginContext";

const SignUpPage = () => {
  return (
    <FormTaskProvider>
      <FormUserProvider>
        <LoginProvider>
          <FormSignUp></FormSignUp>
        </LoginProvider>
      </FormUserProvider>
    </FormTaskProvider>
  );
};

export default SignUpPage;
