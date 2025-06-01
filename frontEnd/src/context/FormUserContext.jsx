import { createContext, useContext, useRef, useState } from "react";
import hiddenEye from "../assets/img/hidden.png";
import eye from "../assets/img/eye.png";
const FormUserContext = createContext();

export const FormUserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const passwordIcon = useRef();
  const passwordInput = useRef();
  const [resultForm, setResultForm] = useState();
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

  const verifyValidString = (value) => {
    let valid = true;
    for (let f = 0; f < value.length; f++) {
      if (!value[f].match(/[a-z]/i) || [f] == "") {
        return false;
      }
    }

    return valid;
  };

  const validationMsj = (key, value, option) => {
    let regexMail = /\S+@\S+\.\S+/;
    let validPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;

    const validationsMsjs = [
      {
        key: "name",
        msj: "Enter a valid name",
        validation: value.length > 0 && verifyValidString(value)
      },
      {
        key: "lastname",
        msj: "Enter a valid  lastname",
        validation: value.length > 0 && verifyValidString(value)
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
            : "Weak password (min 8 chars and must has mayus and minus letters and some number)",
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

    if (errorForm) {
      setErrorsInputsSignUp(inputsError);
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
        cleanForm,
        setResultForm,
        resultForm
      }}
    >
      {children}
    </FormUserContext.Provider>
  );
};

export const useFormUser = () => useContext(FormUserContext);
