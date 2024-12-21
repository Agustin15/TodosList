import Login from "../login/Login";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormProvider } from "../../context/FormContext";
import { LoginProvider } from "../../context/LoginContext";

const LoginPage = () => {
  return (
    <FormProvider>
      <FormUserProvider>
        <LoginProvider>
          <Login />
        </LoginProvider>
      </FormUserProvider>
    </FormProvider>
  );
};

export default LoginPage;
