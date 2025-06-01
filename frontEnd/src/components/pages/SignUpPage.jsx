import FormSignUp from "../signUp/FormSignUp";
import { FormUserProvider } from "../../context/FormUserContext";
import { LoginProvider } from "../../context/LoginContext";

const SignUpPage = () => {
  return (

      <FormUserProvider>
        <LoginProvider>
          <FormSignUp></FormSignUp>
        </LoginProvider>
      </FormUserProvider>

  );
};

export default SignUpPage;
