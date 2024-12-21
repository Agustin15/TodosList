import { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [values, setValues] = useState({
    icon: "",
    name: "",
    description: "",
    isCompleted: false,
  });
  const [errors, setErrors] = useState({
    icon: "",
    name: "",
    description: "",
  });

  const [resultForm, setResultForm] = useState();

  const validationInput = (nameInput, value) => {
    let validIcon = /\w/;
    let validInput = value.length !== 0;
    let msj;
    switch (nameInput) {
      case "name":
        msj = "Complete name field";
        break;
      case "creator":
        msj = "Complete author field";
        break;
      case "description":
        msj = "Complete description field";
        break;
      case "icon":
        msj = "Complete icon field";
        validInput = !value.match(validIcon) && value.length !== 0;
        break;
    }

    setErrors({
      ...errors,
      [nameInput]: validInput ? "" : msj,
    });
  };

  const cleanValues = () => {
    setValues({ ...values, icon: "", name: "", description: "", creator: "" });
  };

  return (
    <FormContext.Provider
      value={{
        values,
        setValues,
        errors,
        setErrors,
        resultForm,
        setResultForm,
        validationInput,
        cleanValues,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
