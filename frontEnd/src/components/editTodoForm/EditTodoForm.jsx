import styles from "./EditTodoForm.module.css";
import ContentFormEdit from "./contentFormEdit/ContentFormEdit";
import editIcon from "../../assets/img/editIcon.png";
import { useForm } from "../../context/formTaskContext/FormTaskContext";
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";
import { useEffect } from "react";
import { AlertSwal } from "../sweetAlert/sweetAlert.js";
import {ValidationFormError} from "../../ValidationForm.js";

const EditTodoForm = ({ task, setOpenModalUpdate }) => {
  const [values, setValues] = useState({ ...task });
  const {
    validationInput,
    validationForm,
    setResultForm,
    stateCheckbox,
    verifiyChangedValues,
    setUpdateEnabled,
    cleanForm,
    filesSizeExceeded,
    filesUploadedUpdateForm,
    setFilesUploadedUpdateForm
  } = useForm();

  const { updateTask } = useTasks();

  const handleChange = (event) => {
    let name, value;
    name = event.target.name;

    if (name == "filesUploaded") {
      setFilesUploadedUpdateForm(
        [filesUploadedUpdateForm, ...event.target.files].flat()
      );
    } else {
      value = event.target.value;
    }

    setValues({
      ...values,
      [name]: value
    });

    validationInput(
      name,
      name != "filesUploaded"
        ? value
        : [filesUploadedUpdateForm, ...event.target.files].flat()
    );
  };

  useEffect(() => {
    if (values) {
      let changedValue = verifiyChangedValues(task, values);
      setUpdateEnabled(changedValue);
    }
  }, [values]);

  const handleSubmit = async (event) => {
    let title, msj, icon, validation;

    event.preventDefault();

    const formData = new FormData(event.target);

    for (const array of formData.entries()) {
      validation = validationForm(array[0], array[1]);
      if (!validation) break;
    }

    let valuesForm = values;
    valuesForm.datetimeNotification = stateCheckbox
      ? valuesForm.datetimeNotification
      : "";

    try {
      if (filesSizeExceeded || !validation) {
        throw new ValidationFormError("Complete correctly the fields please");
      } else {
        let taskUpdated = await updateTask(valuesForm, filesUploadedUpdateForm);
        if (taskUpdated) {
          title = "Succesfully!";
          msj = "Task updated succesfully!";
          icon = "success";
        } else {
          throw new Error("Failed to update task");
        }
      }
    } catch (error) {
      icon = error instanceof ValidationFormError ? "warning" : "error";
      title = error instanceof ValidationFormError ? "Warning" : "Oops";
      msj = error;
    } finally {
      AlertSwal(msj, title, icon);
    }
  };

  const handleClose = () => {
    cleanForm();
    setFilesUploadedUpdateForm([]);
    setOpenModalUpdate(false);
  };

  return (
    <div className={styles.containForm}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Complete task details</h3>
          <img src={editIcon}></img>
        </div>

        <div className={styles.btnClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ContentFormEdit values={values} handleChange={handleChange} />
      </form>
    </div>
  );
};

export default EditTodoForm;
