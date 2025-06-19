import { createContext, useContext, useEffect, useState } from "react";
import { validationsCases } from "./validationsCases";
import { useRef } from "react";
import { useTasks } from "../TaskContext";
const FormTaskContext = createContext();

export const FormTaskProvider = ({ children }) => {
  const [values, setValues] = useState({
    icon: "",
    datetimeTask: "",
    datetimeNotification: "",
    descriptionTask: "",
    filesUploaded: [],
    isCompleted: false
  });
  const [errors, setErrors] = useState({
    icon: "",
    datetimeTask: "",
    datetimeNotification: "",
    descriptionTask: "",
    filesUploaded: ""
  });

  const refDatetimeTask = useRef();

  const [updateEnabled, setUpdateEnabled] = useState(false);
  const [filesSizeExceeded, setFilesSizeExceeded] = useState(false);
  const [filesUploadedUpdateForm, setFilesUploadedUpdateForm] = useState([]);
  const [stateCheckbox, setStateCheckbox] = useState();

  const { formatDate } = useTasks();

  useEffect(() => {
    validationInput("filesUploaded", filesUploadedUpdateForm);
  }, [filesUploadedUpdateForm]);

  const validationInput = (nameInput, value) => {
    let validationInput = validationsCases(
      nameInput,
      value,
      refDatetimeTask.current && refDatetimeTask.current.value,
      setFilesSizeExceeded
    );

    setErrors({
      ...errors,
      [nameInput]: validationInput.validInput ? "" : validationInput.msj
    });
  };

  const validationForm = (nameInput, value) => {
    let validation = validationsCases(
      nameInput,
      value,
      refDatetimeTask.current && refDatetimeTask.current.value,
      setFilesSizeExceeded
    );
    return validation.validInput;
  };

  const verifiyChangedValues = (task, values) => {
    let changedValue = false;

    for (const key of Object.keys(values)) {
      let valueTask = task[key],
        value = values[key];

      if (key == "datetimeTask" || key == "datetimeNotification") {
        valueTask = formatDate(task[key]);
        value = formatDate(values[key]);
      }

      if (valueTask != value) {
        changedValue = true;
        break;
      }
    }

    return changedValue;
  };
  const cleanValues = () => {
    setValues({
      icon: "",
      datetimeTask: "",
      datetimeNotification: "",
      descriptionTask: "",
      filesUploaded: [],
      isCompleted: false
    });
  };

  const cleanErrors = () => {
    setErrors({
      icon: "",
      descriptionTask: "",
      datetimeTask: "",
      datetimeNotification: "",
      filesUploaded: ""
    });
  };

  const cleanForm = () => {
    setFilesSizeExceeded(false);
    setFilesUploadedUpdateForm([]);
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
        setStateCheckbox,
        stateCheckbox,
        updateEnabled,
        setUpdateEnabled,
        verifiyChangedValues,
        errors,
        setErrors,
        filesSizeExceeded,
        setFilesSizeExceeded,
        validationInput,
        validationForm,
        cleanValues,
        cleanForm,
        refDatetimeTask,
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
