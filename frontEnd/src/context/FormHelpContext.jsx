import { createContext, useContext, useState } from "react";

const FormHelpContext = createContext();

export const FormHelpProvider = ({ children }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    description: "",
    files: []
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    description: "",
    files: ""
  });

  const mimeAccept = ["image/png", "image/jpeg", "image/jpg", "image/jfif"];

  const handleChange = (event, newFilesToAdd) => {
    const { name, value, files } = event.target;
    let filesArray;

    if (name == "files") {
      filesArray = !Array.isArray(files) ? Array.from(files) : files;

      if (values.files.length > 0 && newFilesToAdd) {
        filesArray = [...values.files, filesArray].flat();
      }

      setValues({
        ...values,
        [name]: filesArray
      });
    } else
      setValues({
        ...values,
        [name]: value
      });

    let msjInputError = validationInput(
      name,
      name != "files" ? value : filesArray
    );

    if (msjInputError) setErrors({ ...errors, [name]: msjInputError });
    else setErrors({ ...errors, [name]: "" });
  };

  const validationInput = (name, value) => {
    let regexMail = /\S+@\S+\.\S+/;

    switch (name) {
      case "name":
      case "description":
        if (value.length == 0) {
          return name == "name" ? "Enter a valid name" : "Complete description";
        }
        break;

      case "email":
        if (value.length == 0 || !regexMail.test(value)) {
          return "Enter a valid email";
        }
        break;

      case "files":
        if (value.length > 3) return "Limit of 3 files exceeded";
        else if (filesSizeExceededOfLimit(value))
          return "Limit of file size exceeded";
        else if (!verifyAllowTypeFile(value)) return "Type file not allow";
        break;
    }
  };

  const filesSizeExceededOfLimit = (files) => {
    let exceeded = false;
    for (const file of files) {
      if (file.size > 1000 * 10000) {
        return true;
      }
    }
    return exceeded;
  };

  const verifyAllowTypeFile = (files) => {
    let allow = true;
    for (const file of files) {
      if (mimeAccept.indexOf(file.type.toLowerCase()) > -1) {
        return false;
      }
    }
    return allow;
  };

  const deleteFileAttachmentByIndex = (indexFile) => {
    let files = values.files.filter((file, index) => index != indexFile);

    handleChange({ target: { files: files, name: "files", value: "" } });
  };

  const closeForm = (setOpenFormHelp) => {
    setErrors({
      name: "",
      email: "",
      description: "",
      files: ""
    });

    setValues({
      name: "",
      email: "",
      description: "",
      files: []
    });

    setOpenFormHelp(false);
  };
  return (
    <FormHelpContext.Provider
      value={{
        values,
        errors,
        setErrors,
        setValues,
        handleChange,
        deleteFileAttachmentByIndex,
        closeForm,
        mimeAccept
      }}
    >
      {children}
    </FormHelpContext.Provider>
  );
};

export const useFormHelp = () => useContext(FormHelpContext);
