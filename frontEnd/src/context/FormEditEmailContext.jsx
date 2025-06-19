import { createContext, useContext, useState } from "react";
import { AlertSwal } from "../components/sweetAlert/sweetAlert.js";
import { useWindowSize } from "./WindowSizeContext.jsx";
const FormEditEmailContext = createContext();

export const FormEditEmailProvider = ({ children }) => {
  const [values, setValues] = useState();
  const [errors, setErrors] = useState({
    newEmail: "",
    password: ""
  });

  const { windowWidth } = useWindowSize();

  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let error = false;
    let errorsInputs = {
      newEmail: "",
      password: ""
    };
    const data = {};
    let regexMail = /\S+@\S+\.\S+/;

    setErrors(errorsInputs);

    formData.forEach((value, key) => {
      if (key == "password" && !value.length > 0) {
        error = true;
        errorsInputs[key] = "Enter password";
      }
      if ((key == "email" || key == "newEmail") && !regexMail.test(value)) {
        error = true;
        errorsInputs[key] = "Enter a valid email";
      } else {
        data[key] = value;
      }
    });

    if (error) {
      setErrors(errorsInputs);
    } else {
      setValues(data);
    }
  };

  const fetchUpdateEmail = async () => {
    let data;
    setLoading(true);
    try {
      const response = await fetch(
        "api/userData/" + JSON.stringify({ option: "updateEmailUser" }),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            newEmail: values.newEmail,
            password: values.password
          })
        }
      );

      const result = await response.json();
      if (!response.ok) {
        if (result.status == "401") {
          location.href = "/login";
        }
        throw result.messageError;
      } else if (result) {
        data = result;
      }
    } catch (error) {
      let errorUpdated =
        error.indexOf("email") > -1 || error.indexOf("password") > -1
          ? error
          : "Email not updated";

      AlertSwal(errorUpdated, "Oops", "error", windowWidth);
    } finally {
      setLoading(false);
      return data;
    }
  };

  return (
    <FormEditEmailContext.Provider
      value={{
        handleSubmit,
        errors,
        setErrors,
        loading,
        setValues,
        values,
        fetchUpdateEmail
      }}
    >
      {children}
    </FormEditEmailContext.Provider>
  );
};

export const useFormEditEmail = () => useContext(FormEditEmailContext);
