import Login from "../login/Login";
import { FormUserProvider } from "../../context/FormUserContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { LoginProvider } from "../../context/LoginContext";

const LoginPage = () => {
  return (
    <FormTaskProvider>
      <FormUserProvider>
        <LoginProvider>
          <Login />
        </LoginProvider>
      </FormUserProvider>
    </FormTaskProvider>
  );
};

export default LoginPage;
