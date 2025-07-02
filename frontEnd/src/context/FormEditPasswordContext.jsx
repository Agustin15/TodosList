import { createContext, useContext, useState, useEffect } from "react";
import iconPasswordShow from "../assets/img/eye.png";
import iconPasswordHide from "../assets/img/hidden.png";
import { AlertFormSwal } from "../components/sweetAlert/sweetAlert";
import { useWindowSize } from "./WindowSizeContext";
const FormEditPasswordContext = createContext();

export const FormEditPasswordProvider = ({ children }) => {
  const [values, setValues] = useState();

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: ""
  });

  const { windowWidth } = useWindowSize();

  const [loading, setLoading] = useState(false);

  const handlePassword = (event) => {
    let icon = event.target;
    let input = icon.parentElement.querySelector("input");

    if (input.type == "password") {
      input.type = "text";
      icon.src = iconPasswordShow;
    } else {
      input.type = "password";
      icon.src = iconPasswordHide;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let error = false;
    let errorsInputs = {
      currentPassword: "",
      newPassword: "",
      repeatPassword: ""
    };
    const data = {};
    setErrors(errorsInputs);
 
    let validPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;
    formData.forEach((value, key) => {
      if (!validPassword.test(value)) {
        error = true;
        errorsInputs[key] =
          "Weak password (min 8 chars and must has mayus and minus letters and some number)";
      } else {
        data[key] = value;
      }
    });

    if (error) {
      setErrors(errorsInputs);
    } else if (data.newPassword != data.repeatPassword) {
      AlertFormSwal(
        "New password and repeat password not match",
        "Warning",
        "warning",
        windowWidth
      );
    } else {
      setValues(data);
    }
  };

  useEffect(() => {
    if (values) {
      const updatePassword = async () => {
        let passwordUpdated = await fetchUpdatePassword();
        if (passwordUpdated) {
          AlertSwal(
            "Password updated sucesfully!",
            "Success",
            "success",
            windowWidth
          );
        }
      };

      updatePassword();
    }
  }, [values]);

  const fetchUpdatePassword = async () => {
    let data;
    setLoading(true);
    try {
      const response = await fetch(
        "api/userData/" + JSON.stringify({ option: "updatePasswordUserById" }),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            password: values.newPassword
          })
        }
      );

      const result = await response.json();
      if (!response.ok) {
        if (response.status == 401) {
          location.href = "/login";
        }
        throw result.messageError;
      } else if (result) {
        data = response;
      }
    } catch (error) {
      console.log(error);
      AlertFormSwal(
        error == "Invalid current password" ? error : "Password not updated",
        "Oops",
        "error",
        windowWidth
      );

    } finally {
      setLoading(false);
      return data;
    }
  };

  return (
    <FormEditPasswordContext.Provider
      value={{
        values,
        setErrors,
        errors,
        handleSubmit,
        handlePassword,
        loading,
        setLoading
      }}
    >
      {children}
    </FormEditPasswordContext.Provider>
  );
};

export const useFormEditPassword = () => useContext(FormEditPasswordContext);
