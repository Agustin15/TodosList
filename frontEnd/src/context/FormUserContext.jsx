import { createContext, useContext, useRef, useState } from "react";
import hiddenEye from "../assets/img/hidden.png";
import errorIcon from "../assets/img/errorIcon.png";
import eye from "../assets/img/eye.png";
import { useForm } from "./FormContext";

const FormUserContext = createContext();

export const FormUserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const passwordIcon = useRef();
  const passwordInput = useRef();
  const { setResultForm, resultForm } = useForm();
  const [errorsInputsSignUp, setErrorsInputsSignUp] = useState({
    name: "",
    lastname: "",
    username: "",
    password: "",
  });

  const [errorsInputsSignIn, setErrorsInputsSignIn] = useState({
    username: "",
    password: "",
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

  const validationMsj = (key) => {
    const validationsMsjs = [
      { key: "name", msj: "Enter a name" },
      {
        key: "lastname",
        msj: "Enter a lastname",
      },
      {
        key: "username",
        msj: "Enter a username",
      },
      {
        key: "password",
        msj: "Enter a password",
      },
    ];

    return validationsMsjs.find((validation) => validation.key == key);
  };

  const iterationInputsForm = (formData, inputsError, userForm) => {
    let errorForm = false;
    formData.forEach((value, key) => {
      if (key == "name" || key == "lastname") {
        value = toUpperCase(value);
      }

      if (value.length == 0) {
        inputsError[key] = validationMsj(key).msj;
        errorForm = true;
      }
      userForm[key] = value.trim();
    });

    return errorForm;
  };

  const handleSubmitSignUp = (event) => {
    event.preventDefault();
    if (resultForm) {
      setResultForm();
    }

    const formData = new FormData(event.target);
    const userSignUp = {};
    const inputsError = {
      name: "",
      lastname: "",
      username: "",
      password: "",
    };

    let errorForm = iterationInputsForm(formData, inputsError, userSignUp);
    setErrorsInputsSignUp(inputsError);


    if (errorForm) {
      setResultForm({
        icon: errorIcon,
        result: "error",
        msj: "Please, complete correctly the fields",
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
    const formData = new FormData(event.target);
    const userSignIn = {};
    const inputsError = {
      username: "",
      password: "",
    };

    let errorForm = iterationInputsForm(formData, inputsError, userSignIn);
    if(errorForm){
    setErrorsInputsSignIn(inputsError);
    }

    if (errorForm) {
      setResultForm({
        icon: errorIcon,
        result: "error",
        msj: "Please, complete correctly the fields",
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
        cleanForm,
      }}
    >
      {children}
    </FormUserContext.Provider>
  );
};

export const useFormUser = () => useContext(FormUserContext);
