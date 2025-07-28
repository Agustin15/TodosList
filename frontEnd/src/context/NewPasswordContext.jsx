import iconEye from "../assets/img/eye.png";
import { createContext, useState } from "react";
import { useContext } from "react";

const NewPasswordContext = createContext();

export const NewPasswordProvider = ({ children }) => {
  const [errorsInputs, setErrorsInputs] = useState({
    newPassword: "",
    repeatPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  const verifyTokenResetPassword = async (token) => {
    try {
      const response = await fetch("api/resetPassword/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`
        }
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status == 401) {
          throw result.messageError;
        }
      }
    } catch (error) {
      setInvalidToken(true);
      setAlert(true);
      console.log(error);
    }
  };
  const changePassword = async (token) => {
    let password = passwords.newPassword;
    let data;

    setLoading(true);
    try {
      const response = await fetch("api/resetPassword/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`
        },
        body: JSON.stringify({ newPassword: password })
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status == 401) {
          throw result.messageError;
        } else {
          throw "Failed to update password";
        }
      }

      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
      if (data) {
        cleanForm();
        setAlert(true);
      }
    }
  };

  const cleanForm = () => {
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
  };

  const validationMsj = (key, value) => {
    let validPassword = /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    const validationsMsjs = [
      {
        key: "newPassword",
        msj: "Weak password (min 8 chars and must has mayuscules and minuscules letters and some number)",
        validation: validPassword.test(value)
      },
      {
        key: "repeatPassword",
        msj: "Complete field",
        validation: value.length > 0
      }
    ];

    return validationsMsjs.find((validation) => validation.key == key);
  };

  const passwords = {};
  const handleSubmit = async (event, token) => {
    event.preventDefault();
    let error;
    let inputsErrors = { newPassword: "", repeatPassword: "" };
    setErrorsInputs(inputsErrors);
    setError("");

    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      let validationInput = validationMsj(key, value);

      if (!validationInput.validation) {
        inputsErrors[key] = validationInput.msj;

        error = true;
      } else {
        passwords[key] = value;
      }
    });

    if (!error) {
      if (passwords.newPassword != passwords.repeatPassword) {
        setError("Passwords not match");
      } else {
        changePassword(token);
      }
    }
    setErrorsInputs(inputsErrors);
  };

  const handleViewHidePassword = (event) => {
    const iconEyePassword = event.target;
    let input = iconEyePassword.parentElement.querySelector("input");
    if (input.type == "password") {
      input.type = "text";
      iconEyePassword.src = iconEye;
    } else {
      input.type = "password";
      iconEyePassword.src = iconHiddenEye;
    }
  };

  return (
    <NewPasswordContext.Provider
      value={{
        handleSubmit,
        handleViewHidePassword,
        errorsInputs,
        loading,
        error,
        alert,
        verifyTokenResetPassword,
        invalidToken
      }}
    >
      {children}
    </NewPasswordContext.Provider>
  );
};

export const useNewPassword = () => useContext(NewPasswordContext);
