import { createContext, useContext, useState } from "react";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [values, setValues] = useState({
    nameUser: "",
    lastname: ""
  });

  const [errors, setErrors] = useState({ nameUser: "", lastname: "" });
  const [resultForm, setResultForm] = useState();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });

    if (value.length == 0) setErrors({ ...errors, [name]: "Complete " + name });
    else setErrors({ ...errors, [name]: "" });
  };

  const getUserData = async () => {
    setLoadingUser(true);
    try {
      const response = await fetch("/api/userData/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (response.status == 401) {
        location.href = urlFront + "/login";
      }
      if (result) {
        setUser(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUser(false);
    }
  };

  const updateUser = async () => {
    setLoadingForm(true);
    try {
      const response = await fetch("/api/userData/"+user.idUser, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: values.nameUser,
          lastname: values.lastname
        })
      });

      const result = await response.json();

      if (response.status == 401) {
        location.href = urlFront + "/login";
      }
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForm(false);
    }
  };

  const logoutSession = async () => {
    try {
      const response = await fetch("/api/logout/", {
        method: "GET",
        credentials: "include"
      });

      const result = await response.json();

      if (result.logout) {
        location.href = urlFront + "login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        updateUser,
        getUserData,
        handleChange,
        values,
        errors,
        setErrors,
        setValues,
        resultForm,
        setResultForm,
        user,
        setUser,
        loadingUser,
        loadingForm,
        logoutSession
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useDataUser = () => useContext(UserDataContext);
