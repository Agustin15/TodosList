import { createContext, useContext, useRef, useState } from "react";
import hiddenEye from "../assets/img/hidden.png";
import errorIcon from "../assets/img/errorIcon.png";
import eye from "../assets/img/eye.png";
import { useForm } from "./FormTaskContext";

const FormUserContext = createContext();

export const FormUserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const passwordIcon = useRef();
  const passwordInput = useRef();
  const { setResultForm, resultForm } = useForm();
  const [errorsInputsSignUp, setErrorsInputsSignUp] = useState({
    name: "",
    lastname: "",
    email: "",
    password: ""
  });

  const [errorsInputsSignIn, setErrorsInputsSignIn] = useState({
    email: "",
    password: ""
  });

  const cleanForm = () => {
    [...document.querySelectorAll("input")].forEach((input) => {
      input.value = "";
    });
    setUser();
  };

  const handlePassword = () => {
    if (passwordInput.current.type == "password") {
      passwordIcon.current.src = eye;
      passwordInput.current.type = "text";
    } else {
      passwordIcon.current.src = hiddenEye;
      passwordInput.current.type = "password";
    }
  };

  const toUpperCase = (value) => {
    let newValue = [...value].map((letter, index) => {
      if (index == 0) {
        return letter.toUpperCase();
      }
      return letter;
    });
    return newValue.join("");
  };

  const validationMsj = (key, value, option) => {
    let regexMail = /\S+@\S+\.\S+/;
    let validPassword = /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    const validationsMsjs = [
      { key: "name", msj: "Enter a valid name", validation: value.length > 0 },
      {
        key: "lastname",
        msj: "Enter a valid  lastname",
        validation: value.length > 0
      },
      {
        key: "email",
        msj: "Enter a valid email",
        validation: value.length > 0 && regexMail.test(value)
      },
      {
        key: "password",
        msj:
          option == "signIn"
            ? "Enter a valid password"
            : "Weak password (min 8 chars and should has letters, numbers)",
        validation:
          option == "signIn" ? value.length > 0 : validPassword.test(value)
      }
    ];

    return validationsMsjs.find((validation) => validation.key == key);
  };

  const iterationInputsForm = (formData, inputsError, userForm, option) => {
    let errorForm = false;
    formData.forEach((value, key) => {
      if (key == "name" || key == "lastname") {
        value = toUpperCase(value);
      }
      let validationInput = validationMsj(key, value, option);
      if (!validationInput.validation) {
        inputsError[key] = validationInput.msj;
        errorForm = true;
      }
      userForm[key] = value;
    });

    return errorForm;
  };

  const handleSubmitSignUp = (event) => {
    event.preventDefault();
    if (resultForm) {
      setResultForm();
    }

    if (setErrorsInputsSignUp) {
      setErrorsInputsSignIn({
        name: "",
        lastname: "",
        email: "",
        password: ""
      });
    }
    const formData = new FormData(event.target);
    const userSignUp = {};
    const inputsError = {
      name: "",
      lastname: "",
      email: "",
      password: ""
    };

    let errorForm = iterationInputsForm(
      formData,
      inputsError,
      userSignUp,
      "signUp"
    );
    setErrorsInputsSignUp(inputsError);

    if (errorForm) {
      setResultForm({
        icon: errorIcon,
        result: "error",
        msj: "Please, complete correctly the fields"
      });
    } else {
      setUser(userSignUp);
    }
  };

  const handleSubmitSignIn = (event) => {
    event.preventDefault();
    if (resultForm) {
      setResultForm();
    }

    if (errorsInputsSignIn) {
      setErrorsInputsSignIn({ email: "", password: "" });
    }
    const formData = new FormData(event.target);
    const userSignIn = {};
    const inputsError = {
      email: "",
      password: ""
    };

    let errorForm = iterationInputsForm(
      formData,
      inputsError,
      userSignIn,
      "signIn"
    );
    if (errorForm) {
      setErrorsInputsSignIn(inputsError);
    }

    if (errorForm) {
      setResultForm({
        icon: errorIcon,
        result: "error",
        msj: "Please, complete correctly the fields"
      });
    } else {
      setUser(userSignIn);
    }
  };

  return (
    <FormUserContext.Provider
      value={{
        user,
        setUser,
        passwordIcon,
        passwordInput,
        handlePassword,
        errorsInputsSignUp,
        handleSubmitSignUp,
        errorsInputsSignIn,
        handleSubmitSignIn,
        cleanForm
      }}
    >
      {children}
    </FormUserContext.Provider>
  );
};

export const useFormUser = () => useContext(FormUserContext);
