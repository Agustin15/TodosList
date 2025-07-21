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
  const [stateCheckbox, setStateCheckbox] = useState();

  const { formatDate } = useTasks();

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
      if (key != "filesUploaded") {
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
      } else {
        if (
          task.filesUploaded.length != values.filesUploaded.length ||
          values.filesUploaded.find((file) => !file.fromDatabase)
        )
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
    cleanErrors();
    cleanValues();
  };

  const createFiles = (filesFromDatabase) => {
    let filesUploaded = filesFromDatabase.map((file) => {
      if (file.fileTask) {
        return createFile(file);
      } else {
        return file;
      }
    });

    return Array.from(filesUploaded);
  };

  function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
  }

  const createFile = (file) => {
    let blob = base64ToBlob(file.fileTask, file.typeFile);
    const newFile = new File([blob], file.nameFile, {
      type: file.typeFile
    });

    newFile.fromDatabase = true;
    return newFile;
  };

  const setIcon = (value) => {
    if (values.icon.length == 0 || value.length == 0) return value;
    else return null;
  };

  const deleteFileOption = (indexFile) => {
    handleChange({
      target: {
        name: "filesUploaded",
        files: values.filesUploaded.filter((file, index) => index != indexFile)
      }
    });
  };

  const handleChange = (event, newFilesToAdd) => {
    let name, value, files;
    name = event.target.name;
    files = event.target.files;

    if (name == "icon") {
      value = setIcon(event.target.value);
    } else if (name == "filesUploaded") {
      if (newFilesToAdd) {
        value = [...values[name], Array.from(files)].flat();
      } else value = files;
    } else value = event.target.value;

    if (value != null) {
      setValues({
        ...values,
        [name]: value
      });

      validationInput(name, value);
    }
  };

  return (
    <FormTaskContext.Provider
      value={{
        values,
        setValues,
        setStateCheckbox,
        handleChange,
        deleteFileOption,
        stateCheckbox,
        updateEnabled,
        setUpdateEnabled,
        createFiles,
        verifiyChangedValues,
        errors,
        setErrors,
        filesSizeExceeded,
        setFilesSizeExceeded,
        validationInput,
        validationForm,
        cleanValues,
        cleanForm,
        refDatetimeTask
      }}
    >
      {children}
    </FormTaskContext.Provider>
  );
};

export const useForm = () => useContext(FormTaskContext);
