import Login from "../login/Login";
import { FormUserProvider } from "../../context/FormUserContext";
import { LoginProvider } from "../../context/LoginContext";


const LoginPage = () => {
  return (
    <FormUserProvider>
      <LoginProvider>
        <Login />
      </LoginProvider>
    </FormUserProvider>
  );
};

export default LoginPage;
