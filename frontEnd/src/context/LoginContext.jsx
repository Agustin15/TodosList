import { createContext, useContext, useState } from "react";
import errorIcon from "../assets/img/errorIcon.ico";
import { useFormUser } from "./FormUserContext";
const LoginContext = createContext();
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const LoginProvider = ({ children }) => {
  const { setResultForm } = useFormUser();
  const [loading, setLoading] = useState(false);

  const login = async (resultLogin) => {
    if (!resultLogin.userHasVerification) {
      location.href = `${urlFront}dashboard`;
    } else {
      location.href = `${urlFront}verificationTwoStep?token=${JSON.stringify(
        resultLogin.tokenVerification
      )}`;
    }
  };

  const fetchLogin = async (user, url, option) => {
    let data = null;
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(user),
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      } else {
        data = result;
      }
    } catch (error) {
      console.log(error);
      setResultForm({
        icon: errorIcon,
        result: "error",
        msj: error
      });
    } finally {
      setLoading(false);

      if (option == "login") {
        if (data) login(data);
      } else return data;
    }
  };

  return (
    <LoginContext.Provider value={{ fetchLogin, loading }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
