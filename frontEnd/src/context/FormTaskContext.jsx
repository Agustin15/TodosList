import { createContext, useContext, useEffect, useState } from "react";

const FormTaskContext = createContext();

export const FormTaskProvider = ({ children }) => {
  const [values, setValues] = useState({
    icon: "",
    datetimeTask: "",
    descriptionTask: "",
    filesUploaded: [],
    isCompleted: false
  });
  const [errors, setErrors] = useState({
    icon: "",
    datetimeTask: "",
    descriptionTask: "",
    filesUploaded: ""
  });

  const [filesSizeExceeded, setFilesSizeExceeded] = useState(false);
  const [filesUploadedUpdateForm, setFilesUploadedUpdateForm] = useState([]);
  const [resultForm, setResultForm] = useState();

  useEffect(() => {
    validationInput("filesUploaded", filesUploadedUpdateForm);
  }, [filesUploadedUpdateForm]);

  const validationInput = (nameInput, value) => {
    let validIcon = /\w/;
    let validInput = value.length !== 0;
    let msj;
    switch (nameInput) {
      case "datetimeTask":
        msj = "Complete date field";
        break;
      case "descriptionTask":
        msj = "Complete correctly description field";
        validInput = value.length > 0 && value.length <= 130;
        break;
      case "icon":
        msj = "Complete icon field";
        validInput = !value.match(validIcon) && value.length !== 0;
        break;
      case "filesUploaded":
        msj = "Limit size exceeded";
        let totalSizes = Array.from(value).reduce((ac, file) => {
          return (ac += file.size);
        }, 0);
        //1000*10000=>10millions of bytes=>10MB
        validInput = totalSizes <= 1000 * 10000;
        if (!validInput) setFilesSizeExceeded(true);
        else setFilesSizeExceeded(false);

        break;
    }

    setErrors({
      ...errors,
      [nameInput]: validInput ? "" : msj
    });
  };

  const cleanValues = () => {
    setValues({
      ...values,
      icon: "",
      descriptionTask: "",
      filesUploaded: "",
      datetimeTask: ""
    });
  };

  const cleanErrors = () => {
    setErrors({
      ...errors,
      icon: "",
      descriptionTask: "",
      datetimeTask: "",
      filesUploaded: ""
    });
  };
  const cleanForm = () => {
    setFilesSizeExceeded(false);
    setFilesUploadedUpdateForm([]);
    setResultForm();
    cleanErrors();
    cleanValues();
  };

  const deleteFileOption = (lastModified, nameFile) => {
    setFilesUploadedUpdateForm(
      filesUploadedUpdateForm.filter(
        (file) => file.lastModified != lastModified && file.name != nameFile
      )
    );
  };

  return (
    <FormTaskContext.Provider
      value={{
        values,
        setValues,
        errors,
        setErrors,
        filesSizeExceeded,
        setFilesSizeExceeded,
        resultForm,
        setResultForm,
        validationInput,
        cleanValues,
        cleanForm,
        filesUploadedUpdateForm,
        setFilesUploadedUpdateForm,
        deleteFileOption
      }}
    >
      {children}
    </FormTaskContext.Provider>
  );
};

export const useForm = () => useContext(FormTaskContext);
