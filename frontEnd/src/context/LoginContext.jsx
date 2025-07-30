import { createContext, useContext, useState } from "react";
import errorIcon from "../assets/img/errorIcon.ico";
import { useFormUser } from "./FormUserContext";
import { useVerificationTwoStep } from "./VerificationTwoStepContext";
const LoginContext = createContext();
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const LoginProvider = ({ children }) => {
  const { setResultForm } = useFormUser();
  const [loading, setLoading] = useState(false);
  const { setShowVerificationTwoStep, setIdUser } = useVerificationTwoStep();

  const login = async (resultLogin) => {
    if (!resultLogin.userHasVerification) {
      location.href = `${urlFront}dashboard`;
    } else {
      setIdUser(resultLogin.idUser);
      setShowVerificationTwoStep(true);
    }
  };

  const fetchLogin = async (user, url) => {
    let data = null;
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(user),
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
      if (data) login(data);
    }
  };

  return (
    <LoginContext.Provider value={{ fetchLogin, loading }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
