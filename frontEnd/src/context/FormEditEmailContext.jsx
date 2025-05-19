import { createContext, useContext, useState } from "react";
import errorIcon from "../assets/img/errorIcon.png";

const FormEditEmailContext = createContext();

export const FormEditEmailProvider = ({ children }) => {
  const [resultForm, setResultForm] = useState();
  const [values, setValues] = useState();
  const [errors, setErrors] = useState({
    newEmail: "",
    password: ""
  });

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
    setResultForm();

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
      setResultForm({
        icon: errorIcon,
        state: "Error",
        msj: "Please, complete correctly the fields"
      });
      setErrors(errorsInputs);
    } else {
      setValues(data);
    }
  };

  const fetchUpdateEmail = async () => {
    let data;
    setLoading(true);
    try {
      const response = await fetch("api/userData/", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          newEmail: values.newEmail,
          password: values.password
        })
      });

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
      console.log(error);
      setResultForm({
        icon: errorIcon,
        state: "Error",
        msj:
          error.indexOf("email") > -1 || error.indexOf("password") > -1
            ? error
            : "Email not updated"
      });
    } finally {
      setLoading(false);
      return data;
    }
  };

  return (
    <FormEditEmailContext.Provider
      value={{
        handleSubmit,
        resultForm,
        setResultForm,
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
