import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user, setUser] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [values, setValues] = useState({
    name: "",
    lastname: ""
  });

  const [errors, setErrors] = useState({ name: "", lastname: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (user[name] != value) setBtnDisabled(false);
    else setBtnDisabled(true);

    setValues({ ...values, [name]: value });
    if (value.length == 0 || !verifyValidString(value)) {
      setErrors({ ...errors, [name]: "Invalid " + name });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const firstLetterToUpper = (value) => {
    return [...value]
      .map((letter, index) => {
        if (index == 0) {
          return letter.toUpperCase();
        }
        return letter;
      })
      .join("");
  };

  const verifyValidString = (value) => {
    let valid = true;
    for (let f = 0; f < value.length; f++) {
      if (!value[f].match(/[a-z]/i) || [f] == "") {
        return false;
      }
    }

    return valid;
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

      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw result.messageError;
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
      const response = await fetch("/api/userData/" + user.idUser, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: firstLetterToUpper(values.name),
          lastname: firstLetterToUpper(values.lastname)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw result.messageError;
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

  const logoutSession = async (option) => {
    try {
      const response = await fetch("/api/logout/", {
        method: "GET",
        credentials: "include"
      });

      const result = await response.json();

      if (result.logout) {
        removeCookie("loggedIn");

        if (option != "logoutInLoginPage") location.href = urlFront + "login";
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
        btnDisabled,
        errors,
        setErrors,
        setValues,
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
