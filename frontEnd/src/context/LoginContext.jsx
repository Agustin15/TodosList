import { createContext, useContext, useState } from "react";
import errorIcon from "../assets/img/errorIcon.png";
import { useForm } from "./FormContext";
const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const {setResultForm } = useForm();
  const [loading, setLoading] = useState(false);

  const fetchLogin = async (user, url) => {
    let data = null;
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-type": "application/json",
        },
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
        msj: error,
      });
    } finally {
      setLoading(false);
      return data;
    }
  };


  return (
    <LoginContext.Provider value={{ fetchLogin, loading }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
